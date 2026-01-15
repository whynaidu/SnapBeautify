'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppSetting, FreeTierLimits, PricingConfig, MaintenanceMode } from '@/lib/admin/types';
import {
  Settings,
  Save,
  Loader2,
  IndianRupee,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Shield,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSetting[]>([]);

  // Parsed settings
  const [freeTierLimits, setFreeTierLimits] = useState<FreeTierLimits | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);

        // Parse settings
        const freeTier = data.data.find((s: AppSetting) => s.key === 'free_tier_limits');
        const pricingData = data.data.find((s: AppSetting) => s.key === 'pricing_inr');
        const maintenance = data.data.find((s: AppSetting) => s.key === 'maintenance_mode');

        if (freeTier) setFreeTierLimits(freeTier.value as FreeTierLimits);
        if (pricingData) setPricing(pricingData.value as PricingConfig);
        if (maintenance) setMaintenanceMode(maintenance.value as MaintenanceMode);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: unknown) => {
    setIsSaving(key);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to save setting');
      }
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setIsSaving(null);
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Settings" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Settings"
        action={
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">
        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle>Maintenance Mode</CardTitle>
                  <CardDescription>Enable to show maintenance page to users</CardDescription>
                </div>
              </div>
              {maintenanceMode && (
                <Badge
                  variant="secondary"
                  className={maintenanceMode.enabled ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}
                >
                  {maintenanceMode.enabled ? (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3 mr-1" />
                      Disabled
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {maintenanceMode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Maintenance Mode</Label>
                  <Switch
                    checked={maintenanceMode.enabled}
                    onCheckedChange={(checked) => {
                      const updated = { ...maintenanceMode, enabled: checked };
                      setMaintenanceMode(updated);
                      saveSetting('maintenance_mode', updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Message</Label>
                  <Input
                    value={maintenanceMode.message}
                    onChange={(e) => setMaintenanceMode({ ...maintenanceMode, message: e.target.value })}
                  />
                </div>
                <Button
                  onClick={() => saveSetting('maintenance_mode', maintenanceMode)}
                  disabled={isSaving === 'maintenance_mode'}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isSaving === 'maintenance_mode' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Message
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle>Pricing Configuration</CardTitle>
                <CardDescription>Set subscription prices (INR)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pricing && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Price (₹)</Label>
                    <Input
                      type="number"
                      value={pricing.monthly}
                      onChange={(e) => setPricing({ ...pricing, monthly: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Price (₹)</Label>
                    <Input
                      type="number"
                      value={pricing.annual}
                      onChange={(e) => setPricing({ ...pricing, annual: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lifetime Price (₹)</Label>
                    <Input
                      type="number"
                      value={pricing.lifetime}
                      onChange={(e) => setPricing({ ...pricing, lifetime: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => saveSetting('pricing_inr', pricing)}
                  disabled={isSaving === 'pricing_inr'}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {isSaving === 'pricing_inr' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Pricing
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Free Tier Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Free Tier Limits</CardTitle>
                <CardDescription>Configure feature limits for free users</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {freeTierLimits && (
              <div className="space-y-6">
                {/* Usage Limits */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Usage Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Exports Per Day</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.exportsPerDay}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, exportsPerDay: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Max Text Overlays</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.maxTextOverlays}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, maxTextOverlays: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Background Limits */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Background Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Solid Colors</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.solidColorCount}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, solidColorCount: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Gradient Presets</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.gradientPresetCount}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, gradientPresetCount: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Mesh Gradients</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.meshGradientCount}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, meshGradientCount: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Font Limits */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Font Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Free Font Count</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.freeFontCount}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, freeFontCount: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Free Text Colors</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.freeTextColors}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, freeTextColors: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Shadow Settings */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Shadow Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fixed Shadow Blur</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.fixedShadowBlur}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, fixedShadowBlur: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Fixed Shadow Opacity</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={freeTierLimits.fixedShadowOpacity}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, fixedShadowOpacity: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* Image Scale */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Image Scale Range</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Minimum (%)</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.imageScaleMin}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, imageScaleMin: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Maximum (%)</Label>
                      <Input
                        type="number"
                        value={freeTierLimits.imageScaleMax}
                        onChange={(e) => setFreeTierLimits({ ...freeTierLimits, imageScaleMax: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveSetting('free_tier_limits', freeTierLimits)}
                  disabled={isSaving === 'free_tier_limits'}
                >
                  {isSaving === 'free_tier_limits' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Free Tier Limits
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
