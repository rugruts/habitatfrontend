-- ============================================
-- Force properties.images to be jsonb array with default []
-- ============================================

DO $$
DECLARE
  col_exists boolean;
  dtype text;
  udt   text;
BEGIN
  -- Check if column exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'images'
  )
  INTO col_exists;

  -- If missing, add as jsonb
  IF NOT col_exists THEN
    EXECUTE 'ALTER TABLE properties ADD COLUMN images jsonb NOT NULL DEFAULT ''[]''::jsonb';
    RETURN;
  END IF;

  -- Get type info
  SELECT data_type, udt_name
    INTO dtype, udt
  FROM information_schema.columns
  WHERE table_name = 'properties' AND column_name = 'images';

  -- Drop default before altering type
  EXECUTE 'ALTER TABLE properties ALTER COLUMN images DROP DEFAULT';

  -- Convert if needed
  IF dtype = 'ARRAY' AND udt = '_text' THEN
    EXECUTE 'ALTER TABLE properties
             ALTER COLUMN images TYPE jsonb
             USING COALESCE(to_jsonb(images), ''[]''::jsonb)';
  ELSIF dtype <> 'jsonb' THEN
    EXECUTE 'ALTER TABLE properties
             ALTER COLUMN images TYPE jsonb
             USING COALESCE(NULLIF(trim(images), '''')::jsonb, ''[]''::jsonb)';
  END IF;

  -- Restore default
  EXECUTE 'ALTER TABLE properties ALTER COLUMN images SET DEFAULT ''[]''::jsonb';
END$$;

-- Normalize invalid rows
UPDATE properties
SET images = '[]'::jsonb
WHERE images IS NULL
   OR jsonb_typeof(images) IS DISTINCT FROM 'array';

-- Add constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'properties_images_is_array'
  ) THEN
    EXECUTE 'ALTER TABLE properties
             ADD CONSTRAINT properties_images_is_array
             CHECK (jsonb_typeof(images) = ''array'')';
  END IF;
END$$;

-- Optional: Add GIN index for searching
CREATE INDEX IF NOT EXISTS idx_properties_images_gin
ON properties
USING GIN (images);

-- ============================================
-- Verification
-- ============================================

SELECT
  COUNT(*) AS total_properties,
  COUNT(*) FILTER (
    WHERE jsonb_typeof(images) = 'array' AND jsonb_array_length(images) > 0
  ) AS properties_with_images
FROM properties;

SELECT
  id,
  name,
  CASE
    WHEN jsonb_typeof(images) = 'array' AND jsonb_array_length(images) > 0
      THEN 'Has Images ✅'
    ELSE 'No Images ❌'
  END AS status,
  LEFT(images::text, 50) || '...' AS images_preview
FROM properties
ORDER BY name;
