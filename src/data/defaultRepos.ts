import { SoftwareSetup } from '../types';

export const INITIAL_REPOS: Array<{
  owner: string;
  repo: string;
  displayName: string;
  category: string;
  description: string;
}> = [];

// Fallback sample data cleared as user requested no default apps
export const FALLBACK_SETUPS: SoftwareSetup[] = [];

