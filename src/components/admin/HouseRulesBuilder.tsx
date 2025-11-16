import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Volume2, 
  Cigarette, 
  Users, 
  Clock, 
  Sparkles, 
  Home,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

interface HouseRule {
  id: string;
  title: string;
  description: string;
  type: 'safety' | 'noise' | 'smoking' | 'parties' | 'checkin' | 'checkout' | 'cleaning' | 'custom';
  severity: 'info' | 'warning' | 'strict';
  required: boolean;
  timeRestriction?: string;
}

interface HouseRulesBuilderProps {
  rules: HouseRule[];
  onRulesChange: (rules: HouseRule[]) => void;
}

const RULE_TYPES = {
  safety: { icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', label: 'Safety' },
  noise: { icon: Volume2, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', label: 'Noise' },
  smoking: { icon: Cigarette, color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', label: 'No Smoking' },
  parties: { icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', label: 'No Parties' },
  checkin: { icon: Clock, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', label: 'Check-in' },
  checkout: { icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', label: 'Check-out' },
  cleaning: { icon: Sparkles, color: 'text-cyan-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', label: 'Cleaning' },
  custom: { icon: Home, color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', label: 'Custom' }
};

const SEVERITY_STYLES = {
  info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-50', label: 'Information' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-50', label: 'Warning' },
  strict: { icon: X, color: 'text-red-500', bgColor: 'bg-red-50', label: 'Strict Rule' }
};

const PRESET_RULES = [
  {
    type: 'smoking' as const,
    title: 'No smoking',
    description: 'Smoking is not allowed anywhere in the property',
    severity: 'strict' as const
  },
  {
    type: 'parties' as const,
    title: 'No parties or events',
    description: 'Parties, events, and gatherings are not permitted',
    severity: 'strict' as const
  },
  {
    type: 'noise' as const,
    title: 'Quiet hours',
    description: 'Please keep noise to a minimum between 22:00 and 08:00',
    severity: 'warning' as const,
    timeRestriction: '22:00 - 08:00'
  },
  {
    type: 'checkin' as const,
    title: 'Check-in after 15:00',
    description: 'Check-in is available from 15:00 onwards',
    severity: 'info' as const
  },
  {
    type: 'checkout' as const,
    title: 'Check-out before 11:00',
    description: 'Please check out by 11:00 AM',
    severity: 'info' as const
  },
  {
    type: 'cleaning' as const,
    title: 'Keep the space clean',
    description: 'Please maintain cleanliness during your stay',
    severity: 'warning' as const
  }
];

export const HouseRulesBuilder: React.FC<HouseRulesBuilderProps> = ({
  rules,
  onRulesChange
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newRule, setNewRule] = useState<Partial<HouseRule>>({
    title: '',
    description: '',
    type: 'custom',
    severity: 'info',
    required: true
  });

  const addPresetRule = (preset: typeof PRESET_RULES[0]) => {
    const rule: HouseRule = {
      id: Date.now().toString(),
      title: preset.title,
      description: preset.description,
      type: preset.type,
      severity: preset.severity,
      required: true,
      timeRestriction: preset.timeRestriction
    };

    onRulesChange([...rules, rule]);
  };

  const addCustomRule = () => {
    if (newRule.title) {
      const rule: HouseRule = {
        id: Date.now().toString(),
        title: newRule.title!,
        description: newRule.description || '',
        type: newRule.type as 'custom' | 'noise' | 'smoking' | 'pets' | 'parking' | 'checkout',
        severity: newRule.severity as 'info' | 'warning' | 'critical',
        required: newRule.required!,
        timeRestriction: newRule.timeRestriction
      };

      onRulesChange([...rules, rule]);
      setNewRule({
        title: '',
        description: '',
        type: 'custom',
        severity: 'info',
        required: true
      });
      setIsAddingCustom(false);
    }
  };

  const removeRule = (id: string) => {
    onRulesChange(rules.filter(rule => rule.id !== id));
  };

  const toggleRuleRequired = (id: string) => {
    onRulesChange(rules.map(rule => 
      rule.id === id ? { ...rule, required: !rule.required } : rule
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rules Builder */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>House Rules Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preset Rules */}
            <div>
              <Label className="text-base font-medium">Quick Add Rules</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {PRESET_RULES.map((preset, index) => {
                  const isAdded = rules.some(rule => rule.title === preset.title);
                  const IconComponent = RULE_TYPES[preset.type].icon;
                  
                  return (
                    <Button
                      key={index}
                      variant={isAdded ? "default" : "outline"}
                      size="sm"
                      onClick={() => !isAdded && addPresetRule(preset)}
                      disabled={isAdded}
                      className="justify-start h-auto p-3"
                    >
                      <IconComponent className={`h-4 w-4 mr-3 ${RULE_TYPES[preset.type].color}`} />
                      <div className="text-left">
                        <div className="font-medium">{preset.title}</div>
                        <div className="text-xs opacity-70">{preset.description}</div>
                      </div>
                      {isAdded && <Check className="h-4 w-4 ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Custom Rule */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Custom Rules</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingCustom(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom
                </Button>
              </div>

              {isAddingCustom && (
                <Card className="mt-3">
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label htmlFor="rule-title">Rule Title</Label>
                      <Input
                        id="rule-title"
                        value={newRule.title}
                        onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., No pets allowed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rule-description">Description</Label>
                      <Textarea
                        id="rule-description"
                        value={newRule.description}
                        onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide additional details..."
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Type</Label>
                        <Select 
                          value={newRule.type} 
                          onValueChange={(value) => setNewRule(prev => ({ ...prev, type: value as 'custom' | 'noise' | 'smoking' | 'pets' | 'parking' | 'checkout' }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(RULE_TYPES).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Severity</Label>
                        <Select 
                          value={newRule.severity} 
                          onValueChange={(value) => setNewRule(prev => ({ ...prev, severity: value as 'info' | 'warning' | 'critical' }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(SEVERITY_STYLES).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsAddingCustom(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={addCustomRule}>
                        Add Rule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Current Rules List */}
            <div>
              <Label className="text-base font-medium">Current Rules ({rules.length})</Label>
              <div className="space-y-2 mt-2">
                {rules.map((rule) => {
                  const IconComponent = RULE_TYPES[rule.type].icon;
                  const SeverityIcon = SEVERITY_STYLES[rule.severity].icon;
                  
                  return (
                    <div
                      key={rule.id}
                      className={`p-3 border rounded-lg ${RULE_TYPES[rule.type].bgColor} ${RULE_TYPES[rule.type].borderColor}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <IconComponent className={`h-5 w-5 mt-0.5 ${RULE_TYPES[rule.type].color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{rule.title}</p>
                              <SeverityIcon className={`h-4 w-4 ${SEVERITY_STYLES[rule.severity].color}`} />
                            </div>
                            {rule.description && (
                              <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                            )}
                            {rule.timeRestriction && (
                              <Badge variant="outline" className="text-xs mt-2">
                                {rule.timeRestriction}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Switch
                              checked={rule.required}
                              onCheckedChange={() => toggleRuleRequired(rule.id)}
                              size="sm"
                            />
                            <span className="text-xs text-gray-500">Required</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {rules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No rules added yet</p>
                    <p className="text-xs">Add some rules to help guests understand expectations</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">House Rules</h3>

              {rules.length > 0 ? (
                <div className="space-y-3">
                  {rules.map((rule) => {
                    const IconComponent = RULE_TYPES[rule.type].icon;
                    const SeverityIcon = SEVERITY_STYLES[rule.severity].icon;

                    return (
                      <div
                        key={rule.id}
                        className={`p-4 border-l-4 rounded-r-lg ${
                          rule.severity === 'strict'
                            ? 'border-red-500 bg-red-50'
                            : rule.severity === 'warning'
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            rule.severity === 'strict'
                              ? 'bg-red-100'
                              : rule.severity === 'warning'
                              ? 'bg-yellow-100'
                              : 'bg-blue-100'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${RULE_TYPES[rule.type].color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{rule.title}</h4>
                              {rule.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                              <SeverityIcon className={`h-4 w-4 ${SEVERITY_STYLES[rule.severity].color}`} />
                            </div>
                            {rule.description && (
                              <p className="text-gray-700 mt-1">{rule.description}</p>
                            )}
                            {rule.timeRestriction && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {rule.timeRestriction}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Home className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No house rules yet</p>
                  <p className="text-sm">Add some rules to see how they'll appear to guests</p>
                </div>
              )}

              {/* Rules Summary */}
              {rules.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Rules Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {rules.filter(r => r.severity === 'info').length}
                      </div>
                      <div className="text-gray-600">Info</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {rules.filter(r => r.severity === 'warning').length}
                      </div>
                      <div className="text-gray-600">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {rules.filter(r => r.severity === 'strict').length}
                      </div>
                      <div className="text-gray-600">Strict</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
