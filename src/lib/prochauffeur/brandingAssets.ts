import {
  EMPTY_FLEET_BRANDING,
  type AppFleetBrandingSettings,
} from "@/lib/prochauffeur/types";

export type BrandingAssetKey = keyof AppFleetBrandingSettings;

export type BrandingAssetPreview = "compact" | "wide";

export type BrandingAssetDefinition = {
  key: BrandingAssetKey;
  label: string;
  usage: string;
  preview: BrandingAssetPreview;
};

export type BrandingSectionDefinition = {
  id: string;
  title: string;
  description?: string;
  showAssetLabel?: boolean;
  assets: BrandingAssetDefinition[];
};

export const BRANDING_ASSET_KEYS: BrandingAssetKey[] = [
  "favicon",
  "logo",
  "logoDark",
  "logoIcon",
  "authLogo",
];

/** Bundled paths under public/branding or public/images/logo (removed from the app). */
export function isLegacyStaticBrandingPath(value: string): boolean {
  const path = value.trim();
  if (!path || path.startsWith("data:") || /^https?:\/\//i.test(path)) {
    return false;
  }

  const normalized = path.replace(/^\.\//, "").replace(/^\//, "");
  return (
    normalized.startsWith("branding/") || normalized.startsWith("images/logo/")
  );
}

export const BRANDING_SECTIONS: BrandingSectionDefinition[] = [
  {
    id: "favicon",
    title: "Favicon",
    description: "Browser tab and bookmarks",
    showAssetLabel: false,
    assets: [
      {
        key: "favicon",
        label: "Favicon",
        usage: "Browser tab and bookmarks",
        preview: "compact",
      },
    ],
  },
  {
    id: "logos",
    title: "Logos",
    showAssetLabel: false,
    assets: [
      {
        key: "logo",
        label: "Primary logo (light)",
        usage: "Sidebar and header in light mode",
        preview: "wide",
      },
      {
        key: "logoDark",
        label: "Primary logo (dark)",
        usage: "Sidebar and header in dark mode",
        preview: "wide",
      },
      {
        key: "logoIcon",
        label: "Compact icon",
        usage: "Collapsed sidebar",
        preview: "compact",
      },
      {
        key: "authLogo",
        label: "Sign-in logo",
        usage: "Authentication pages",
        preview: "wide",
      },
    ],
  },
];

export function mergeFleetBrandingSettings(
  stored: Partial<AppFleetBrandingSettings> | null | undefined
): AppFleetBrandingSettings {
  const merged: AppFleetBrandingSettings = { ...EMPTY_FLEET_BRANDING };
  if (!stored) return merged;

  for (const key of BRANDING_ASSET_KEYS) {
    const value = stored[key]?.trim();
    if (!value || isLegacyStaticBrandingPath(value)) continue;
    merged[key] = value;
  }

  return merged;
}
