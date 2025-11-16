-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code VARCHAR(10) NOT NULL,
  translation_key VARCHAR(255) NOT NULL,
  translation_value TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language_code, translation_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(translation_key);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);
CREATE INDEX IF NOT EXISTS idx_translations_required ON translations(is_required);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow read access for all authenticated users
CREATE POLICY "Allow read access for authenticated users" ON translations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert/update/delete for authenticated users (you might want to restrict this further)
CREATE POLICY "Allow full access for authenticated users" ON translations
    FOR ALL USING (auth.role() = 'authenticated');

-- Helper function to initialize translations from JSON
CREATE OR REPLACE FUNCTION initialize_translations_from_json(
  lang_code TEXT,
  translations_json JSONB,
  category_name TEXT DEFAULT 'general'
)
RETURNS INTEGER AS $$
DECLARE
  translation_key TEXT;
  translation_value TEXT;
  inserted_count INTEGER := 0;
BEGIN
  FOR translation_key, translation_value IN
    SELECT * FROM jsonb_each_text(translations_json)
  LOOP
    INSERT INTO translations (
      language_code,
      translation_key,
      translation_value,
      category,
      is_required
    ) VALUES (
      lang_code,
      translation_key,
      translation_value,
      category_name,
      CASE 
        -- Mark common required keys
        WHEN translation_key LIKE '%.title' OR 
             translation_key LIKE '%.name' OR 
             translation_key LIKE '%.label' THEN true
        ELSE false
      END
    )
    ON CONFLICT (language_code, translation_key)
    DO UPDATE SET
      translation_value = EXCLUDED.translation_value,
      category = EXCLUDED.category,
      updated_at = NOW();
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- Helper function to get translation statistics
CREATE OR REPLACE FUNCTION get_translation_stats(lang_code TEXT)
RETURNS TABLE (
  total_keys BIGINT,
  translated_keys BIGINT,
  completion_percentage NUMERIC,
  missing_required BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_keys,
    COUNT(CASE WHEN translation_value IS NOT NULL AND translation_value != '' THEN 1 END)::BIGINT as translated_keys,
    ROUND(
      (COUNT(CASE WHEN translation_value IS NOT NULL AND translation_value != '' THEN 1 END)::NUMERIC / 
       NULLIF(COUNT(*)::NUMERIC, 0)) * 100, 2
    ) as completion_percentage,
    COUNT(CASE WHEN is_required = true AND (translation_value IS NULL OR translation_value = '') THEN 1 END)::BIGINT as missing_required
  FROM translations 
  WHERE language_code = lang_code;
END;
$$ LANGUAGE plpgsql;



