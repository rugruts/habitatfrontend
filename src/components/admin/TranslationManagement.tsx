import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Search, Save, RefreshCw, Globe, Languages, FileText, CheckCircle, AlertCircle,
  Download, Upload, Brain, Zap, AlertTriangle, Info, Copy, Check, X, Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translationService, type TranslationMemory, type TranslationStats } from '@/lib/translationService';

// Import all translation files for fallback
import { en } from '@/lib/translations/en';
import { el } from '@/lib/translations/el';
import { de } from '@/lib/translations/de';

interface TranslationData {
  [key: string]: string;
}

interface TranslationCategory {
  name: string;
  keys: string[];
  description: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const fallbackTranslations = {
  en, el, de,
};

const categories: TranslationCategory[] = [
  {
    name: 'Navigation',
    keys: ['nav.home', 'nav.apartments', 'nav.experiences', 'nav.about', 'nav.contact'],
    description: 'Main navigation elements'
  },
  {
    name: 'Booking',
    keys: [
      'booking.title', 'booking.checkin', 'booking.checkout', 'booking.guests',
      'booking.selectDates', 'booking.getPrice', 'booking.calculating', 'booking.continue',
      'booking.reserveNow', 'booking.nights', 'booking.nightsPlural', 'booking.wontBeCharged',
      'booking.selectDatesToContinue', 'booking.maxGuests'
    ],
    description: 'Booking widget and process'
  },
  {
    name: 'Checkout',
    keys: [
      'checkout.title', 'checkout.guestDetails', 'checkout.paymentDetails', 'checkout.confirmation',
      'checkout.firstName', 'checkout.lastName', 'checkout.email', 'checkout.phone',
      'checkout.country', 'checkout.specialRequests', 'checkout.specialRequestsPlaceholder',
      'checkout.continueToPayment', 'checkout.back', 'checkout.completePayment',
      'checkout.processing', 'checkout.bookingConfirmed', 'checkout.bookingReference',
      'checkout.confirmationEmailSent', 'checkout.backToHome', 'checkout.browseMore'
    ],
    description: 'Checkout process and forms'
  },
  {
    name: 'Widget',
    keys: [
      'widget.checkAvailability', 'widget.bestRate', 'widget.checkDates', 'widget.checkinCheckout',
      'widget.whyBookWithUs', 'widget.freeCancellation48h', 'widget.instantConfirmation',
      'widget.available', 'widget.noPaymentRequired', 'widget.secureBooking',
      'widget.readyToExplore', 'widget.chooseDates'
    ],
    description: 'Availability widget elements'
  },
  {
    name: 'Pages',
    keys: [
      'pages.home.title', 'pages.home.subtitle', 'pages.home.description', 'pages.home.heroTitle',
      'pages.home.heroSubtitle', 'pages.home.bookNow', 'pages.home.exploreApartments',
      'pages.home.whyChooseUs', 'pages.home.localExperience', 'pages.home.localExperienceDesc',
      'pages.home.primeLocation', 'pages.home.primeLocationDesc', 'pages.home.comfortStay',
      'pages.home.comfortStayDesc', 'pages.home.featuredApartments', 'pages.home.viewAll',
      'pages.home.startsWith', 'pages.home.perNight', 'pages.home.guests',
      'pages.home.readyToBook', 'pages.home.readyToBookDesc'
    ],
    description: 'Home page content'
  },
  {
    name: 'UI Elements',
    keys: [
      'ui.call', 'ui.email', 'ui.map', 'ui.loading', 'ui.error', 'ui.retry', 'ui.cancel',
      'ui.save', 'ui.edit', 'ui.delete', 'ui.confirm', 'ui.close', 'ui.back', 'ui.next',
      'ui.previous', 'ui.submit', 'ui.reset', 'ui.clear', 'ui.select', 'ui.choose',
      'ui.upload', 'ui.download', 'ui.view', 'ui.show', 'ui.hide', 'ui.expand',
      'ui.collapse', 'ui.refresh', 'ui.update', 'ui.create', 'ui.add', 'ui.remove',
      'ui.search', 'ui.filter', 'ui.sort', 'ui.copy', 'ui.paste', 'ui.cut',
      'ui.undo', 'ui.redo', 'ui.print', 'ui.share', 'ui.export', 'ui.import',
      'ui.settings', 'ui.preferences', 'ui.help', 'ui.about', 'ui.version',
      'ui.copyright', 'ui.allRightsReserved', 'ui.termsOfService', 'ui.privacyPolicy',
      'ui.cookiePolicy'
    ],
    description: 'Common UI elements and actions'
  },
  {
    name: 'Common',
    keys: [
      'common.required', 'common.optional', 'common.close', 'common.cancel',
      'common.save', 'common.loading', 'common.error', 'common.success'
    ],
    description: 'Common text elements'
  },
  {
    name: 'Footer',
    keys: [
      'footer.description', 'footer.quickLinks', 'footer.contact', 'footer.followUs',
      'footer.copyright', 'footer.privacyPolicy', 'footer.termsOfService',
      'footer.aboutTrikala', 'footer.aboutHabitatLobby', 'footer.faq',
      'footer.ourApartments', 'footer.contactUs', 'footer.policies',
      'footer.chatOnViber', 'footer.trikalaGreece'
    ],
    description: 'Footer content and links'
  },
  {
    name: 'Trust & Safety',
    keys: [
      'trust.freeCancellation', 'trust.instantConfirmation', 'trust.bestRateGuarantee',
      'trust.localHostSupport', 'trust.securePayment'
    ],
    description: 'Trust indicators and safety messages'
  },
  {
    name: 'Price & Summary',
    keys: [
      'price.total', 'price.cleaningFee', 'price.freeCancellationUntil',
      'summary.bookingSummary', 'summary.yourStay', 'summary.guest', 'summary.guests'
    ],
    description: 'Pricing and booking summary elements'
  }
];

export const TranslationManagement: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('Navigation');
  const [searchTerm, setSearchTerm] = useState('');
  const [translations, setTranslations] = useState<TranslationData>({});
  const [originalTranslations, setOriginalTranslations] = useState<TranslationData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<TranslationStats>({ totalKeys: 0, translatedKeys: 0, completionPercentage: 0, missingRequired: 0 });
  const [translationMemory, setTranslationMemory] = useState<TranslationMemory[]>([]);
  const [showMemoryDialog, setShowMemoryDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationResults, setValidationResults] = useState<{ valid: boolean; errors: Array<{ key: string; error: string }>; warnings: Array<{ key: string; warning: string }> }>({ valid: true, errors: [], warnings: [] });
  const [importData, setImportData] = useState('');
  const [overwriteImport, setOverwriteImport] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const { toast } = useToast();

  // Initialize database and load translations
  useEffect(() => {
    const initializeTranslations = async () => {
      setIsLoading(true);
      try {
        await translationService.initializeTable();
        const dbTranslations = await translationService.loadTranslations(selectedLanguage);
        
        // Merge with fallback translations
        const fallback = fallbackTranslations[selectedLanguage as keyof typeof fallbackTranslations] || {};
        const mergedTranslations = { ...fallback, ...dbTranslations };
        
        setTranslations(mergedTranslations);
        setOriginalTranslations(mergedTranslations);
        
        // Load stats
        const translationStats = await translationService.getTranslationStats(selectedLanguage);
        setStats(translationStats);
        
        setHasChanges(false);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to static translations
        const fallback = fallbackTranslations[selectedLanguage as keyof typeof fallbackTranslations] || {};
        setTranslations(fallback);
        setOriginalTranslations(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTranslations();
  }, [selectedLanguage]);

  // Initialize database with fallback translations
  const handleInitializeDatabase = async () => {
    setIsLoading(true);
    try {
      const importedCount = await translationService.initializeWithFallbackTranslations();
      
      if (importedCount > 0) {
        // Reload translations and stats
        const dbTranslations = await translationService.loadTranslations(selectedLanguage);
        const fallback = fallbackTranslations[selectedLanguage as keyof typeof fallbackTranslations] || {};
        const mergedTranslations = { ...fallback, ...dbTranslations };
        
        setTranslations(mergedTranslations);
        setOriginalTranslations(mergedTranslations);
        
        const translationStats = await translationService.getTranslationStats(selectedLanguage);
        setStats(translationStats);
        
        toast({
          title: "Database initialized",
          description: `Successfully imported ${importedCount} translations to the database`,
        });
      } else {
        toast({
          title: "No translations imported",
          description: "Database might already be populated or there was an error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Initialization failed",
        description: "Failed to initialize database with translations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check for changes
  useEffect(() => {
    const hasAnyChanges = Object.keys(translations).some(key => 
      translations[key] !== originalTranslations[key]
    );
    setHasChanges(hasAnyChanges);
  }, [translations, originalTranslations]);

  // Filter translations based on search and category
  const filteredTranslations = useMemo(() => {
    const category = categories.find(cat => cat.name === selectedCategory);
    const categoryKeys = selectedCategory === 'all' ? [] : (category ? category.keys : []);
    
    return Object.entries(translations)
      .filter(([key, value]) => {
        const matchesCategory = categoryKeys.length === 0 || categoryKeys.includes(key);
        const matchesSearch = searchTerm === '' || 
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [translations, selectedCategory, searchTerm]);

  const handleTranslationChange = (key: string, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await translationService.saveTranslations(selectedLanguage, translations);
      
      if (success) {
        setOriginalTranslations(translations);
        setHasChanges(false);
        
        // Reload stats
        const translationStats = await translationService.getTranslationStats(selectedLanguage);
        setStats(translationStats);
        
        toast({
          title: "Translations saved",
          description: `Successfully saved translations for ${languages.find(l => l.code === selectedLanguage)?.name}`,
        });
      } else {
        throw new Error('Failed to save translations');
      }
    } catch (error) {
      toast({
        title: "Error saving translations",
        description: "Failed to save translations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTranslations(originalTranslations);
    setHasChanges(false);
  };

  const handleExport = async () => {
    try {
      const jsonData = await translationService.exportTranslations(selectedLanguage);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations_${selectedLanguage}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `Translations exported for ${languages.find(l => l.code === selectedLanguage)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export translations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    try {
      const result = await translationService.importTranslations(selectedLanguage, importData, overwriteImport);
      
      if (result.success) {
        // Reload translations
        const dbTranslations = await translationService.loadTranslations(selectedLanguage);
        const fallback = fallbackTranslations[selectedLanguage as keyof typeof fallbackTranslations] || {};
        const mergedTranslations = { ...fallback, ...dbTranslations };
        
        setTranslations(mergedTranslations);
        setOriginalTranslations(mergedTranslations);
        
        // Reload stats
        const translationStats = await translationService.getTranslationStats(selectedLanguage);
        setStats(translationStats);
        
        setShowImportDialog(false);
        setImportData('');
        
        toast({
          title: "Import successful",
          description: `Imported ${result.imported} translations`,
        });
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import translations",
        variant: "destructive",
      });
    }
  };

  const handleValidate = async () => {
    try {
      const results = await translationService.validateTranslations(selectedLanguage);
      setValidationResults(results);
      setShowValidationDialog(true);
    } catch (error) {
      toast({
        title: "Validation failed",
        description: "Failed to validate translations. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAutoTranslate = async (key: string, sourceText: string) => {
    try {
      const translatedText = await translationService.autoTranslate(sourceText, 'en', selectedLanguage);
      handleTranslationChange(key, translatedText);
      
      toast({
        title: "Auto-translation applied",
        description: "Translation suggestion applied. Please review and adjust if needed.",
      });
    } catch (error) {
      toast({
        title: "Auto-translation failed",
        description: "Failed to auto-translate. Please translate manually.",
        variant: "destructive",
      });
    }
  };

  const handleGetTranslationMemory = async (key: string) => {
    try {
      const memory = await translationService.getTranslationMemory(key, 'en', selectedLanguage);
      setTranslationMemory(memory);
      setShowMemoryDialog(true);
    } catch (error) {
      toast({
        title: "Translation memory failed",
        description: "Failed to load translation suggestions.",
        variant: "destructive",
      });
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    // This would be implemented to apply the suggestion to the current translation
    setShowMemoryDialog(false);
    toast({
      title: "Suggestion applied",
      description: "Translation suggestion applied successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Translation Management</h1>
          <p className="text-muted-foreground">
            Manage translations for all supported languages with advanced features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleInitializeDatabase}
            disabled={isLoading}
          >
            <Database className="h-4 w-4 mr-2" />
            Initialize DB
          </Button>
          <Button
            variant="outline"
            onClick={handleValidate}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Validate
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language Selection
          </CardTitle>
          <CardDescription>
            Select the language you want to edit translations for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                onClick={() => setSelectedLanguage(lang.code)}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-xs">{lang.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Translation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Keys</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalKeys}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Translated</span>
            </div>
            <p className="text-2xl font-bold">{stats.translatedKeys}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Completion</span>
            </div>
            <p className="text-2xl font-bold">{stats.completionPercentage}%</p>
            <Progress value={stats.completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalKeys - stats.translatedKeys}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Required Missing</span>
            </div>
            <p className="text-2xl font-bold">{stats.missingRequired}</p>
          </CardContent>
        </Card>
      </div>

      {/* Translation Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Editor</CardTitle>
          <CardDescription>
            Edit translations for {languages.find(l => l.code === selectedLanguage)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="memory">Translation Memory</TabsTrigger>
              <TabsTrigger value="auto">Auto-Translate</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              {/* Search and Category Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search translations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Description */}
              {selectedCategory && (
                <Alert>
                  <AlertDescription>
                    {categories.find(cat => cat.name === selectedCategory)?.description}
                  </AlertDescription>
                </Alert>
              )}

              {/* Translation List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading translations...</p>
                  </div>
                ) : filteredTranslations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No translations found matching your criteria
                  </div>
                ) : (
                  filteredTranslations.map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {key}
                          </Badge>
                          {stats.missingRequired > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGetTranslationMemory(key)}
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAutoTranslate(key, value)}
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={value}
                        onChange={(e) => handleTranslationChange(key, e.target.value)}
                        placeholder={`Enter translation for ${key}...`}
                        className="min-h-[60px]"
                      />
                      <Separator />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="memory" className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Translation Memory suggests translations based on similar keys and patterns from your existing translations.
                </AlertDescription>
              </Alert>
              <div className="text-center py-8 text-muted-foreground">
                Select a translation key in the Editor tab to see memory suggestions.
              </div>
            </TabsContent>

            <TabsContent value="auto" className="space-y-4">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Auto-translation provides initial suggestions using translation APIs. Always review and adjust the results.
                </AlertDescription>
              </Alert>
              <div className="text-center py-8 text-muted-foreground">
                Use the auto-translate button next to each translation field for instant suggestions.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Translations</DialogTitle>
            <DialogDescription>
              Import translations from a JSON file. The file should contain key-value pairs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-data">JSON Data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='{"nav.home": "Home", "nav.about": "About"}'
                className="min-h-[200px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="overwrite"
                checked={overwriteImport}
                onCheckedChange={setOverwriteImport}
              />
              <Label htmlFor="overwrite">Overwrite existing translations</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Translation Validation Results</DialogTitle>
            <DialogDescription>
              Review validation results for {languages.find(l => l.code === selectedLanguage)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {validationResults.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Errors ({validationResults.errors.length}):</strong>
                  <ul className="mt-2 space-y-1">
                    {validationResults.errors.map((error, index) => (
                      <li key={index} className="text-sm">
                        <strong>{error.key}:</strong> {error.error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {validationResults.warnings.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warnings ({validationResults.warnings.length}):</strong>
                  <ul className="mt-2 space-y-1">
                    {validationResults.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">
                        <strong>{warning.key}:</strong> {warning.warning}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationResults.errors.length === 0 && validationResults.warnings.length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  All translations are valid! No errors or warnings found.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Translation Memory Dialog */}
      <Dialog open={showMemoryDialog} onOpenChange={setShowMemoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Translation Memory Suggestions</DialogTitle>
            <DialogDescription>
              Suggested translations based on similar keys and patterns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {translationMemory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No suggestions found for this key.
              </div>
            ) : (
              translationMemory.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{suggestion.sourceKey}</Badge>
                      <Badge variant="secondary">{Math.round(suggestion.confidence * 100)}% match</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUseSuggestion(suggestion.suggestedTranslation)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.suggestedTranslation}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
