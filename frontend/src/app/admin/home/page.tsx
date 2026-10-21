'use client';

// Admin CMS page for controlling content displayed on the public Home page (/).

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAdminAuth } from '@/context/admin-auth-context';
import { adminApi } from '@/lib/api/admin-api';
import { HomePageConfig, MediaRef } from '@/types/admin.types';
import { Loading } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MediaSelector } from '@/components/admin/media-selector';

export default function AdminHomePage() {
  const { idToken } = useAdminAuth();
  const [config, setConfig] = useState<Partial<HomePageConfig>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [portraitPickerOpen, setPortraitPickerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!idToken) return;
      try {
        setLoading(true);
        setError(null);
        const homeCfg = await adminApi.getHomePageConfig(idToken);
        setConfig(homeCfg || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Home Page configuration');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [idToken]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const updated = await adminApi.updateHomePageConfig(config, idToken);
      setConfig(updated);
      setSuccess('Home page configuration saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Home Page configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loading size="lg" label="Loading Home Page CMS..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Home Page CMS</h1>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          1:1 content for public Home (/) — headings, CTAs, dual-identity cards, and a Home-only portrait (separate from About).
        </p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              Home Page Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-[11px] text-[var(--color-text-muted)]">
              This photo appears only on Home. Changing the About photo will not replace it.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {config.hero?.profileImage?.url ? (
                <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <Image
                    src={config.hero.profileImage.url}
                    alt={config.hero.profileImage.altText || 'Home portrait'}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-28 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center text-[10px] text-[var(--color-text-muted)] text-center px-2">
                  No photo yet
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPortraitPickerOpen(true)}
                className="text-xs"
              >
                {config.hero?.profileImage ? 'Change Home Photo' : 'Select Home Photo'}
              </Button>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              After selecting a photo, click Save Home Page CMS at the bottom.
            </p>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>✨</span> Hero Banner Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Main Heading
              </label>
              <Input
                value={config.hero?.mainHeading || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, mainHeading: e.target.value },
                  })
                }
                placeholder="e.g. Engineering Digital Products"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Accent Heading Highlight
              </label>
              <Input
                value={config.hero?.accentHeading || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, accentHeading: e.target.value },
                  })
                }
                placeholder="e.g. & Expressive Artwork"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Description / Bio Summary
              </label>
              <textarea
                value={config.hero?.description || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    hero: { ...config.hero, description: e.target.value },
                  })
                }
                placeholder="Brief intro text in hero section..."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Developer CTA Label
                </label>
                <Input
                  value={config.hero?.devCtaText || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, devCtaText: e.target.value },
                    })
                  }
                  placeholder="e.g. View Engineering Projects"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Developer CTA Target Path
                </label>
                <Input
                  value={config.hero?.devCtaTarget || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, devCtaTarget: e.target.value },
                    })
                  }
                  placeholder="e.g. /work/development"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Artist CTA Label
                </label>
                <Input
                  value={config.hero?.artCtaText || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, artCtaText: e.target.value },
                    })
                  }
                  placeholder="e.g. Explore Digital Art"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Artist CTA Target Path
                </label>
                <Input
                  value={config.hero?.artCtaTarget || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, artCtaTarget: e.target.value },
                    })
                  }
                  placeholder="e.g. /work/art-crafts"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Developer Card Title
                </label>
                <Input
                  value={config.hero?.devCardTitle || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, devCardTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. Software Systems & Architecture"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Developer Card Description
                </label>
                <Input
                  value={config.hero?.devCardDescription || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, devCardDescription: e.target.value },
                    })
                  }
                  placeholder="e.g. Full-stack applications, APIs & cloud infra"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Artist Card Title
                </label>
                <Input
                  value={config.hero?.artCardTitle || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, artCardTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. Digital Art & Visual Craft"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Artist Card Description
                </label>
                <Input
                  value={config.hero?.artCardDescription || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, artCardDescription: e.target.value },
                    })
                  }
                  placeholder="e.g. Creative coding, 3D assets, UI/UX aesthetics"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Home Page CMS'}
          </Button>
        </div>
      </form>

      <MediaSelector
        isOpen={portraitPickerOpen}
        onClose={() => setPortraitPickerOpen(false)}
        category="profile"
        title="Select Home Hero Portrait"
        onSelect={(media) => {
          const profileImage: MediaRef = {
            id: media.id,
            mediaId: media.mediaId,
            url: media.url,
            storagePath: media.storagePath,
            altText: media.altText,
            fileId: media.fileId,
          };
          setConfig({
            ...config,
            hero: { ...config.hero, profileImage },
          });
          setPortraitPickerOpen(false);
        }}
      />
    </div>
  );
}
