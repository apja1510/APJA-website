export type OSPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'other';

export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  created_at: string;
  updated_at: string;
  contentType?: string;
  platform: OSPlatform;
  fileExtension: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
  totalDownloads: number;
}

export interface SoftwareSetup {
  id: string; // owner/repo
  owner: string;
  repo: string;
  displayName: string;
  description: string;
  category: string;
  iconUrl?: string;
  websiteUrl?: string;
  githubUrl: string;
  starsCount?: number;
  forksCount?: number;
  releases: GitHubRelease[];
  latestRelease?: GitHubRelease;
  totalDownloads: number;
  primaryOs?: OSPlatform;
  lastUpdated: string;
  isCustom?: boolean;
}

export interface OSStats {
  platform: OSPlatform;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SoftwareAnalytics {
  totalSoftware: number;
  totalReleases: number;
  totalDownloads: number;
  avgDownloadsPerSoftware: number;
  topSoftware: SoftwareSetup | null;
  osStats: OSStats[];
  softwareStats: {
    name: string;
    downloads: number;
    releasesCount: number;
  }[];
}
