import { supabase } from '@/lib/supabase';

export interface TranslationRecord {
  id?: string;
  language_code: string;
  translation_key: string;
  translation_value: string;
  category: string;
  is_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationStats {
  totalKeys: number;
  translatedKeys: number;
  completionPercentage: number;
  missingRequired: number;
}

export interface TranslationMemory {
  sourceKey: string;
  sourceLanguage: string;
  targetLanguage: string;
  suggestedTranslation: string;
  confidence: number;
}

class TranslationService {
  private tableName = 'translations';

  // Initialize database table if it doesn't exist
  async initializeTable() {
    try {
      // Check if table exists by trying to select from it
      const { error } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        console.warn('Translations table might not exist yet. Please run the SQL migration first:', error);
      }
    } catch (error) {
      console.warn('Table initialization check failed:', error);
    }
  }

  // Initialize database with fallback translations
  async initializeWithFallbackTranslations() {
    try {
      // Import all translation files
      const { en } = await import('@/lib/translations/en');
      const { el } = await import('@/lib/translations/el');
      const { de } = await import('@/lib/translations/de');

      const fallbackTranslations = { en, el, de };
      
      let totalImported = 0;
      
      // Import translations for each language
      for (const [languageCode, translations] of Object.entries(fallbackTranslations)) {
        const records: TranslationRecord[] = Object.entries(translations).map(([key, value]) => ({
          language_code: languageCode,
          translation_key: key,
          translation_value: value,
          category: this.getCategoryFromKey(key),
          is_required: this.isRequiredKey(key)
        }));

        // Use upsert to handle both insert and update
        const { error } = await supabase
          .from(this.tableName)
          .upsert(records, { 
            onConflict: 'language_code,translation_key',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error(`Error importing ${languageCode} translations:`, error);
        } else {
          totalImported += records.length;
          console.log(`Imported ${records.length} translations for ${languageCode}`);
        }
      }

      console.log(`Total translations imported: ${totalImported}`);
      return totalImported;
    } catch (error) {
      console.error('Error initializing with fallback translations:', error);
      return 0;
    }
  }

  // Load all translations for a language
  async loadTranslations(languageCode: string): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('translation_key, translation_value')
        .eq('language_code', languageCode);

      if (error) throw error;

      const translations: Record<string, string> = {};
      data?.forEach(record => {
        translations[record.translation_key] = record.translation_value;
      });

      return translations;
    } catch (error) {
      console.error('Error loading translations:', error);
      return {};
    }
  }

  // Save translations for a language
  async saveTranslations(
    languageCode: string, 
    translations: Record<string, string>,
    category?: string
  ): Promise<boolean> {
    try {
      const records: TranslationRecord[] = Object.entries(translations).map(([key, value]) => ({
        language_code: languageCode,
        translation_key: key,
        translation_value: value,
        category: category || this.getCategoryFromKey(key),
        is_required: this.isRequiredKey(key)
      }));

      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from(this.tableName)
        .upsert(records, { 
          onConflict: 'language_code,translation_key',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving translations:', error);
      return false;
    }
  }

  // Get translation statistics
  async getTranslationStats(languageCode: string): Promise<TranslationStats> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('translation_value, is_required')
        .eq('language_code', languageCode);

      if (error) throw error;

      const totalKeys = data?.length || 0;
      const translatedKeys = data?.filter(record => 
        record.translation_value && record.translation_value.trim() !== ''
      ).length || 0;
      const missingRequired = data?.filter(record => 
        record.is_required && (!record.translation_value || record.translation_value.trim() === '')
      ).length || 0;

      return {
        totalKeys,
        translatedKeys,
        completionPercentage: totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0,
        missingRequired
      };
    } catch (error) {
      console.error('Error getting translation stats:', error);
      return { totalKeys: 0, translatedKeys: 0, completionPercentage: 0, missingRequired: 0 };
    }
  }

  // Get translation memory suggestions
  async getTranslationMemory(
    sourceKey: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationMemory[]> {
    try {
      // Get similar keys from the same category
      const category = this.getCategoryFromKey(sourceKey);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('translation_key, translation_value')
        .eq('language_code', sourceLanguage)
        .eq('category', category)
        .ilike('translation_key', `%${sourceKey.split('.').pop()}%`);

      if (error) throw error;

      const suggestions: TranslationMemory[] = [];
      
      // Get target language translations for similar keys
      for (const record of data || []) {
        const { data: targetData } = await supabase
          .from(this.tableName)
          .select('translation_value')
          .eq('language_code', targetLanguage)
          .eq('translation_key', record.translation_key)
          .single();

        if (targetData?.translation_value) {
          suggestions.push({
            sourceKey: record.translation_key,
            sourceLanguage,
            targetLanguage,
            suggestedTranslation: targetData.translation_value,
            confidence: this.calculateSimilarity(sourceKey, record.translation_key)
          });
        }
      }

      return suggestions.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error getting translation memory:', error);
      return [];
    }
  }

  // Export translations to JSON
  async exportTranslations(languageCode: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('language_code', languageCode)
        .order('translation_key');

      if (error) throw error;

      const translations: Record<string, string> = {};
      data?.forEach(record => {
        translations[record.translation_key] = record.translation_value;
      });

      return JSON.stringify(translations, null, 2);
    } catch (error) {
      console.error('Error exporting translations:', error);
      return '{}';
    }
  }

  // Import translations from JSON
  async importTranslations(
    languageCode: string, 
    jsonData: string,
    overwrite: boolean = false
  ): Promise<{ success: boolean; imported: number; errors: string[] }> {
    try {
      const translations = JSON.parse(jsonData);
      const errors: string[] = [];
      let imported = 0;

      for (const [key, value] of Object.entries(translations)) {
        try {
          if (overwrite) {
            // Upsert the translation
            const { error } = await supabase
              .from(this.tableName)
              .upsert({
                language_code: languageCode,
                translation_key: key,
                translation_value: value as string,
                category: this.getCategoryFromKey(key),
                is_required: this.isRequiredKey(key)
              }, { onConflict: 'language_code,translation_key' });

            if (error) throw error;
          } else {
            // Check if translation exists
            const { data: existing } = await supabase
              .from(this.tableName)
              .select('id')
              .eq('language_code', languageCode)
              .eq('translation_key', key)
              .single();

            if (!existing) {
              const { error } = await supabase
                .from(this.tableName)
                .insert({
                  language_code: languageCode,
                  translation_key: key,
                  translation_value: value as string,
                  category: this.getCategoryFromKey(key),
                  is_required: this.isRequiredKey(key)
                });

              if (error) throw error;
            }
          }
          imported++;
        } catch (error) {
          errors.push(`Failed to import ${key}: ${error}`);
        }
      }

      return { success: errors.length === 0, imported, errors };
    } catch (error) {
      console.error('Error importing translations:', error);
      return { success: false, imported: 0, errors: [error as string] };
    }
  }

  // Validate translations
  async validateTranslations(languageCode: string): Promise<{
    valid: boolean;
    errors: Array<{ key: string; error: string }>;
    warnings: Array<{ key: string; warning: string }>;
  }> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('language_code', languageCode);

      if (error) throw error;

      const errors: Array<{ key: string; error: string }> = [];
      const warnings: Array<{ key: string; warning: string }> = [];

      for (const record of data || []) {
        // Check required translations
        if (record.is_required && (!record.translation_value || record.translation_value.trim() === '')) {
          errors.push({
            key: record.translation_key,
            error: 'Required translation is missing'
          });
        }

        // Check for placeholder values
        if (record.translation_value && record.translation_value.includes('{{') && record.translation_value.includes('}}')) {
          warnings.push({
            key: record.translation_key,
            warning: 'Contains placeholder variables that may need translation'
          });
        }

        // Check for very short translations (potential issues)
        if (record.translation_value && record.translation_value.length < 2) {
          warnings.push({
            key: record.translation_key,
            warning: 'Translation is very short, may be incomplete'
          });
        }

        // Check for duplicate translations (potential copy-paste errors)
        const duplicates = data?.filter(d => 
          d.translation_value === record.translation_value && 
          d.translation_key !== record.translation_key
        );
        if (duplicates && duplicates.length > 0) {
          warnings.push({
            key: record.translation_key,
            warning: `Same translation used for ${duplicates.length} other keys`
          });
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      console.error('Error validating translations:', error);
      return { valid: false, errors: [], warnings: [] };
    }
  }

  // Auto-translate using external API (placeholder for now)
  async autoTranslate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    try {
      // This is a placeholder - you would integrate with Google Translate, DeepL, etc.
      // For now, we'll return a simple transformation
      if (targetLanguage === 'el') {
        // Simple Greek transliteration for demo
        return text.replace(/[aeiou]/gi, (match) => {
          const greekVowels: Record<string, string> = {
            'a': 'α', 'e': 'ε', 'i': 'ι', 'o': 'ο', 'u': 'υ',
            'A': 'Α', 'E': 'Ε', 'I': 'Ι', 'O': 'Ο', 'U': 'Υ'
          };
          return greekVowels[match] || match;
        });
      }
      
      return text; // Return original if no translation available
    } catch (error) {
      console.error('Error auto-translating:', error);
      return text;
    }
  }

  // Helper methods
  private getCategoryFromKey(key: string): string {
    const parts = key.split('.');
    if (parts.length >= 2) {
      return parts[0];
    }
    return 'general';
  }

  private isRequiredKey(key: string): boolean {
    const requiredKeys = [
      'nav.home', 'nav.apartments', 'booking.title', 'booking.checkin', 'booking.checkout',
      'checkout.title', 'checkout.firstName', 'checkout.lastName', 'checkout.email',
      'common.required', 'common.error', 'common.loading'
    ];
    return requiredKeys.includes(key);
  }

  private calculateSimilarity(key1: string, key2: string): number {
    const words1 = key1.split('.');
    const words2 = key2.split('.');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }
}

export const translationService = new TranslationService();
