'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Template, TemplateCategory, UpdateTemplateInput, TemplateSettings, TemplatePreview } from '@/lib/admin/types';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

const categories: TemplateCategory[] = ['minimal', 'vibrant', 'professional', 'creative', 'wave', 'text'];
const backgroundTypes = ['solid', 'gradient', 'mesh'];

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);

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
  const [meshGradientCSS, setMeshGradientCSS] = useState('');
  const [padding, setPadding] = useState(64);
  const [shadowBlur, setShadowBlur] = useState(40);
  const [shadowOpacity, setShadowOpacity] = useState(50); // Stored as 0-100
  const [borderRadius, setBorderRadius] = useState(24);
  const [imageScale, setImageScale] = useState(0.75); // Stored as decimal (0.5-1.5)

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/templates/${id}`);
      const data = await response.json();

      if (data.success && data.data) {
        const t = data.data as Template;
        setTemplate(t);

        // Populate form fields
        setName(t.name);
        setDescription(t.description);
        setCategory(t.category);
        setIsFree(t.is_free);
        setIsActive(t.is_active);
        setSortOrder(t.sort_order);

        // Populate settings
        setBackgroundType(t.settings.backgroundType);
        setBackgroundColor(t.settings.backgroundColor || '#1a1a2e');
        if (t.settings.gradientColors) {
          setGradientColor1(t.settings.gradientColors[0]);
          setGradientColor2(t.settings.gradientColors[1]);
        }
        setGradientAngle(t.settings.gradientAngle || 135);
        setMeshGradientCSS(t.settings.meshGradientCSS || t.preview.meshGradientCSS || '');
        setPadding(t.settings.padding);
        setShadowBlur(t.settings.shadowBlur);
        setShadowOpacity(t.settings.shadowOpacity); // Already 0-100
        setBorderRadius(t.settings.borderRadius);
        setImageScale(t.settings.imageScale); // Already decimal (0.5-1.5)
      } else {
        setError('Template not found');
      }
    } catch {
      setError('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      // Build settings object
      const settings: TemplateSettings = {
        backgroundType,
        backgroundColor: backgroundType === 'solid' ? backgroundColor : undefined,
        gradientColors: backgroundType === 'gradient' ? [gradientColor1, gradientColor2] : undefined,
        gradientAngle: backgroundType === 'gradient' ? gradientAngle : undefined,
        meshGradientCSS: backgroundType === 'mesh' ? meshGradientCSS : undefined,
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
        meshGradientCSS: backgroundType === 'mesh' ? meshGradientCSS : undefined,
      };

      const updateData: UpdateTemplateInput = {
        name,
        description,
        category,
        preview,
        settings,
        is_free: isFree,
        is_active: isActive,
        sort_order: sortOrder,
      };

      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update template');
        return;
      }

      router.push('/admin/templates');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/templates');
      } else {
        setError('Failed to delete template');
      }
    } catch {
      setError('An error occurred while deleting');
    }
  };

  // Get preview background style
  const getPreviewStyle = (): React.CSSProperties => {
    if (backgroundType === 'solid') {
      return { backgroundColor };
    }
    if (backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`,
      };
    }
    if (backgroundType === 'mesh' && meshGradientCSS) {
      return {
        background: meshGradientCSS,
        backgroundColor: '#0f172a',
      };
    }
    return { backgroundColor: '#1a1a2e' };
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Edit Template" description="Loading..." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-black dark:text-white" />
        </div>
      </>
    );
  }

  if (!template) {
    return (
      <>
        <AdminHeader title="Template Not Found" />
        <div className="p-6">
          <p className="text-zinc-500 dark:text-zinc-400">The template you're looking for doesn't exist.</p>
          <Link href="/admin/templates">
            <Button className="mt-4 bg-black dark:bg-white text-white dark:text-black">Back to Templates</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Edit Template"
        description={`Editing: ${template.name}`}
      />

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          {/* Back Button & Delete */}
          <div className="flex items-center justify-between">
            <Link href="/admin/templates">
              <Button variant="ghost" type="button" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
            </Link>
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Template
            </Button>
          </div>

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
                  <Label htmlFor="id" className="text-zinc-500 dark:text-zinc-400">ID (Read-only)</Label>
                  <Input
                    id="id"
                    value={template.id}
                    disabled
                    className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                  />
                </div>

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

                {backgroundType === 'mesh' && (
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Mesh Gradient CSS</Label>
                    <textarea
                      value={meshGradientCSS}
                      onChange={(e) => setMeshGradientCSS(e.target.value)}
                      placeholder="e.g., radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%)..."
                      className="w-full h-32 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-sm font-mono resize-none"
                    />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Enter CSS background property value for mesh gradients. Supports radial-gradient, linear-gradient, etc.
                    </p>
                  </div>
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
                  <Label className="text-zinc-700 dark:text-zinc-300">Shadow Opacity: {shadowOpacity}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowOpacity}
                    onChange={(e) => setShadowOpacity(parseInt(e.target.value))}
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
                  <Label className="text-zinc-700 dark:text-zinc-300">Image Scale: {Math.round(imageScale * 100)}%</Label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={Math.round(imageScale * 100)}
                    onChange={(e) => setImageScale(parseInt(e.target.value) / 100)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Live Preview</h3>

                {/* Preview Container - simulates the actual canvas output */}
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  {/* Background Layer */}
                  <div
                    className="w-full"
                    style={{
                      ...getPreviewStyle(),
                      aspectRatio: '16/10',
                      padding: `${Math.max(padding / 4, 12)}px`, // Scale padding for preview
                    }}
                  >
                    {/* Mock Screenshot Container */}
                    <div
                      className="relative w-full h-full flex items-center justify-center"
                      style={{
                        transform: `scale(${imageScale})`,
                        transformOrigin: 'center center',
                      }}
                    >
                      {/* Shadow Layer */}
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          borderRadius: `${borderRadius}px`,
                          boxShadow: shadowBlur > 0
                            ? `0 ${shadowBlur * 0.3}px ${shadowBlur * 2}px rgba(0,0,0,${shadowOpacity / 100})`
                            : 'none',
                        }}
                      />

                      {/* Mock Screenshot */}
                      <div
                        className="relative w-full h-full overflow-hidden"
                        style={{
                          borderRadius: `${borderRadius}px`,
                          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                        }}
                      >
                        {/* Mock Browser Chrome */}
                        <div className="h-6 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center px-2 gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <div className="flex-1 mx-2">
                            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                          </div>
                        </div>

                        {/* Mock Content */}
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-zinc-300 dark:bg-zinc-600 rounded w-3/4" />
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
                            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Info */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 dark:text-zinc-400">Padding</div>
                    <div className="font-medium text-black dark:text-white">{padding}px</div>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 dark:text-zinc-400">Shadow</div>
                    <div className="font-medium text-black dark:text-white">{shadowBlur}px / {shadowOpacity}%</div>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-center">
                    <div className="text-zinc-500 dark:text-zinc-400">Radius</div>
                    <div className="font-medium text-black dark:text-white">{borderRadius}px</div>
                  </div>
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
              disabled={isSaving}
              className="bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
