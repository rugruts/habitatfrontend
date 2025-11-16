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
  
  -- Ensure unique combinations of language and key
  UNIQUE(language_code, translation_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_language_code ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(translation_key);
CREATE INDEX IF NOT EXISTS idx_translations_required ON translations(is_required);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_translations_updated_at 
  BEFORE UPDATE ON translations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to translations" ON translations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow insert/update/delete for authenticated users
CREATE POLICY "Allow full access to translations" ON translations
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to initialize translations from JSON
CREATE OR REPLACE FUNCTION initialize_translations_from_json(
  p_language_code VARCHAR(10),
  p_translations JSONB
)
RETURNS INTEGER AS $$
DECLARE
  translation_count INTEGER := 0;
  translation_record RECORD;
BEGIN
  FOR translation_record IN 
    SELECT * FROM jsonb_each_text(p_translations)
  LOOP
    INSERT INTO translations (language_code, translation_key, translation_value, category, is_required)
    VALUES (
      p_language_code,
      translation_record.key,
      translation_record.value,
      CASE 
        WHEN translation_record.key LIKE 'nav.%' THEN 'navigation'
        WHEN translation_record.key LIKE 'booking.%' THEN 'booking'
        WHEN translation_record.key LIKE 'checkout.%' THEN 'checkout'
        WHEN translation_record.key LIKE 'widget.%' THEN 'widget'
        WHEN translation_record.key LIKE 'pages.%' THEN 'pages'
        WHEN translation_record.key LIKE 'ui.%' THEN 'ui'
        WHEN translation_record.key LIKE 'common.%' THEN 'common'
        WHEN translation_record.key LIKE 'footer.%' THEN 'footer'
        WHEN translation_record.key LIKE 'trust.%' THEN 'trust'
        WHEN translation_record.key LIKE 'price.%' THEN 'price'
        WHEN translation_record.key LIKE 'summary.%' THEN 'summary'
        ELSE 'general'
      END,
      CASE 
        WHEN translation_record.key IN (
          'nav.home', 'nav.apartments', 'booking.title', 'booking.checkin', 
          'booking.checkout', 'checkout.title', 'checkout.firstName', 
          'checkout.lastName', 'checkout.email', 'common.required', 
          'common.error', 'common.loading'
        ) THEN true
        ELSE false
      END
    )
    ON CONFLICT (language_code, translation_key) 
    DO UPDATE SET 
      translation_value = EXCLUDED.translation_value,
      updated_at = NOW();
    
    translation_count := translation_count + 1;
  END LOOP;
  
  RETURN translation_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get translation statistics
CREATE OR REPLACE FUNCTION get_translation_stats(p_language_code VARCHAR(10))
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
    COUNT(CASE WHEN translation_value != '' THEN 1 END)::BIGINT as translated_keys,
    ROUND(
      (COUNT(CASE WHEN translation_value != '' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
      2
    ) as completion_percentage,
    COUNT(CASE WHEN is_required = true AND (translation_value = '' OR translation_value IS NULL) THEN 1 END)::BIGINT as missing_required
  FROM translations 
  WHERE language_code = p_language_code;
END;
$$ LANGUAGE plpgsql;



