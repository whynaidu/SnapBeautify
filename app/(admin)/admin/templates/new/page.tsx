'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TemplateCategory, CreateTemplateInput, TemplateSettings, TemplatePreview } from '@/lib/admin/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const categories: TemplateCategory[] = ['minimal', 'vibrant', 'professional', 'creative', 'wave', 'text'];
const backgroundTypes = ['solid', 'gradient', 'mesh'];

const defaultSettings: TemplateSettings = {
  backgroundType: 'solid',
  backgroundColor: '#1a1a2e',
  padding: 64,
  shadowBlur: 40,
  shadowOpacity: 0.5,
  borderRadius: 24,
  imageScale: 100,
};

const defaultPreview: TemplatePreview = {
  backgroundType: 'solid',
  backgroundColor: '#1a1a2e',
};

export default function NewTemplatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('minimal');
  const [isFree, setIsFree] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Settings state
  const [backgroundType, setBackgroundType] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [gradientColor1, setGradientColor1] = useState('#667eea');
  const [gradientColor2, setGradientColor2] = useState('#764ba2');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [padding, setPadding] = useState(64);
  const [shadowBlur, setShadowBlur] = useState(40);
  const [shadowOpacity, setShadowOpacity] = useState(0.5);
  const [borderRadius, setBorderRadius] = useState(24);
  const [imageScale, setImageScale] = useState(100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Build settings object
      const settings: TemplateSettings = {
        backgroundType,
        backgroundColor: backgroundType === 'solid' ? backgroundColor : undefined,
        gradientColors: backgroundType === 'gradient' ? [gradientColor1, gradientColor2] : undefined,
        gradientAngle: backgroundType === 'gradient' ? gradientAngle : undefined,
        padding,
        shadowBlur,
        shadowOpacity,
        borderRadius,
        imageScale,
      };

      // Build preview object
      const preview: TemplatePreview = {
        backgroundType,
        backgroundColor: backgroundType === 'solid' ? backgroundColor : undefined,
        gradientColors: backgroundType === 'gradient' ? [gradientColor1, gradientColor2] : undefined,
        gradientAngle: backgroundType === 'gradient' ? gradientAngle : undefined,
      };

      // Generate ID from name
      const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const templateData: CreateTemplateInput = {
        id,
        name,
        description,
        category,
        preview,
        settings,
        is_free: isFree,
        is_active: isActive,
        sort_order: sortOrder,
      };

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create template');
        return;
      }

      router.push('/admin/templates');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get preview background style
  const getPreviewStyle = () => {
    if (backgroundType === 'solid') {
      return { backgroundColor };
    }
    if (backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`,
      };
    }
    return { backgroundColor: '#1a1a2e' };
  };

  return (
    <>
      <AdminHeader
        title="Create Template"
        description="Add a new template preset"
      />

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Back Button */}
          <Link href="/admin/templates">
            <Button variant="ghost" type="button" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Template name"
                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-zinc-700 dark:text-zinc-300">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description"
                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-zinc-700 dark:text-zinc-300">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TemplateCategory)}
                    className="w-full h-9 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Label htmlFor="is_free" className="text-zinc-700 dark:text-zinc-300">Free Template</Label>
                  <Switch
                    id="is_free"
                    checked={isFree}
                    onCheckedChange={setIsFree}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active" className="text-zinc-700 dark:text-zinc-300">Active</Label>
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order" className="text-zinc-700 dark:text-zinc-300">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value))}
                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                  />
                </div>
              </div>

              {/* Background Settings */}
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">Background</h3>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Type</Label>
                  <select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                  >
                    {backgroundTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {backgroundType === 'solid' && (
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {backgroundType === 'gradient' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-700 dark:text-zinc-300">Color 1</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="w-12 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                          />
                          <Input
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-700 dark:text-zinc-300">Color 2</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="w-12 h-9 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                          />
                          <Input
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-black dark:text-white flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-700 dark:text-zinc-300">Angle: {gradientAngle}°</Label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Style Settings & Preview */}
            <div className="space-y-6">
              {/* Style Settings */}
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">Style Settings</h3>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Padding: {padding}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={padding}
                    onChange={(e) => setPadding(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Shadow Blur: {shadowBlur}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowBlur}
                    onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Shadow Opacity: {(shadowOpacity * 100).toFixed(0)}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowOpacity * 100}
                    onChange={(e) => setShadowOpacity(parseInt(e.target.value) / 100)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Border Radius: {borderRadius}px</Label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Image Scale: {imageScale}%</Label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Preview</h3>
                <div
                  className="aspect-video rounded-xl overflow-hidden flex items-center justify-center"
                  style={getPreviewStyle()}
                >
                  <div
                    className="w-3/4 aspect-video bg-white/10 backdrop-blur-sm"
                    style={{
                      borderRadius: `${borderRadius}px`,
                      boxShadow: `0 0 ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`,
                      transform: `scale(${imageScale / 100})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/templates">
              <Button type="button" variant="ghost" className="text-zinc-500 dark:text-zinc-400">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
