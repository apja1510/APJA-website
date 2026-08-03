import { GitHubAsset, GitHubRelease, OSPlatform, SoftwareSetup } from '../types';

export function detectPlatform(filename: string): OSPlatform {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.exe') || lower.endsWith('.msi') || lower.endsWith('.appx') || lower.includes('win') || lower.includes('setup')) {
    return 'windows';
  }
  if (lower.endsWith('.dmg') || lower.endsWith('.pkg') || lower.includes('mac') || lower.includes('darwin')) {
    return 'macos';
  }
  if (lower.endsWith('.appimage') || lower.endsWith('.deb') || lower.endsWith('.rpm') || lower.endsWith('.tar.gz') || lower.includes('linux')) {
    return 'linux';
  }
  if (lower.endsWith('.apk') || lower.endsWith('.aab')) {
    return 'android';
  }
  if (lower.endsWith('.ipa')) {
    return 'ios';
  }
  return 'other';
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    if (parts.slice(-2).join('.').toLowerCase() === 'tar.gz') {
      return 'tar.gz';
    }
    return parts[parts.length - 1].toLowerCase();
  }
  return 'bin';
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Fetch GitHub repository info and all its releases
 */
export async function fetchGitHubRepoSetup(
  owner: string,
  repo: string,
  token?: string,
  category = 'Utilities'
): Promise<SoftwareSetup> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }

  // 1. Fetch Repository Details
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error(`GitHub repository "${owner}/${repo}" was not found or is private.`);
    } else if (repoRes.status === 403) {
      throw new Error(`GitHub API rate limit reached. Add a Personal Access Token in Settings to continue.`);
    }
    throw new Error(`Failed to fetch repo (${repoRes.statusText})`);
  }
  const repoData = await repoRes.json();

  // 2. Fetch Releases
  const releasesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=30`, { headers });
  if (!releasesRes.ok) {
    throw new Error(`Failed to fetch releases for ${owner}/${repo}`);
  }
  const releasesData = await releasesRes.json();

  let totalRepoDownloads = 0;
  const parsedReleases: GitHubRelease[] = (releasesData || []).map((rel: any) => {
    let releaseDownloads = 0;
    const assets: GitHubAsset[] = (rel.assets || []).map((ast: any) => {
      const downloadCount = ast.download_count || 0;
      releaseDownloads += downloadCount;
      const platform = detectPlatform(ast.name);
      return {
        id: ast.id,
        name: ast.name,
        size: ast.size || 0,
        download_count: downloadCount,
        browser_download_url: ast.browser_download_url,
        created_at: ast.created_at,
        updated_at: ast.updated_at,
        contentType: ast.content_type,
        platform,
        fileExtension: getFileExtension(ast.name),
      };
    });

    totalRepoDownloads += releaseDownloads;

    return {
      id: rel.id,
      tag_name: rel.tag_name,
      name: rel.name || rel.tag_name,
      body: rel.body || '',
      draft: rel.draft,
      prerelease: rel.prerelease,
      created_at: rel.created_at,
      published_at: rel.published_at || rel.created_at,
      html_url: rel.html_url,
      assets,
      totalDownloads: releaseDownloads,
    };
  });

  const latestRelease = parsedReleases.find((r) => !r.draft && !r.prerelease) || parsedReleases[0];

  // Determine primary OS based on available assets
  let primaryOs: OSPlatform = 'windows';
  if (latestRelease && latestRelease.assets.length > 0) {
    const platforms = latestRelease.assets.map((a) => a.platform);
    if (platforms.includes('windows')) primaryOs = 'windows';
    else if (platforms.includes('macos')) primaryOs = 'macos';
    else if (platforms.includes('linux')) primaryOs = 'linux';
    else primaryOs = platforms[0] || 'windows';
  }

  return {
    id: `${owner}/${repo}`.toLowerCase(),
    owner,
    repo,
    displayName: repoData.name ? repoData.name.replace(/[-_]/g, ' ') : repo,
    description: repoData.description || 'Software release repository',
    category,
    iconUrl: repoData.owner?.avatar_url,
    websiteUrl: repoData.homepage || repoData.html_url,
    githubUrl: repoData.html_url,
    starsCount: repoData.stargazers_count,
    forksCount: repoData.forks_count,
    releases: parsedReleases,
    latestRelease,
    totalDownloads: totalRepoDownloads,
    primaryOs,
    lastUpdated: repoData.updated_at || new Date().toISOString(),
    isCustom: true,
  };
}

/**
 * Parse owner/repo from various input formats (full URL or owner/repo string)
 */
export function parseGitHubRepoInput(input: string): { owner: string; repo: string } | null {
  const clean = input.trim();
  if (!clean) return null;

  // Handle full URL: https://github.com/owner/repo or github.com/owner/repo
  const urlMatch = clean.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2].replace(/\.git$/i, '').replace(/[\/#].*$/, ''),
    };
  }

  // Handle owner/repo format
  const simpleMatch = clean.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      repo: simpleMatch[2].replace(/\.git$/i, ''),
    };
  }

  return null;
}
