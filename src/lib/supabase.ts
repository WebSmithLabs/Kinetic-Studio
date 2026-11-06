import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or browser localStorage
export const getSupabaseCredentials = () => {
  let url = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  let anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('wsl_supabase_url') || localStorage.getItem('ks_supabase_url');
    const storedKey = localStorage.getItem('wsl_supabase_anon_key') || localStorage.getItem('ks_supabase_anon_key');
    if (storedUrl && storedUrl.trim()) url = storedUrl.trim();
    if (storedKey && storedKey.trim()) anonKey = storedKey.trim();
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseCredentials();
  return (
    Boolean(url) &&
    Boolean(anonKey) &&
    url.startsWith('http') &&
    !url.includes('placeholder') &&
    !url.includes('your-project-id') &&
    !url.includes('your-supabase-url')
  );
};

let clientInstance: SupabaseClient | null = null;
let currentConfiguredUrl = '';
let currentConfiguredKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    clientInstance = null;
    currentConfiguredUrl = '';
    currentConfiguredKey = '';
    return null;
  }

  const { url, anonKey } = getSupabaseCredentials();

  // If client exists and config hasn't changed, reuse instance
  if (clientInstance && currentConfiguredUrl === url && currentConfiguredKey === anonKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentConfiguredUrl = url;
    currentConfiguredKey = anonKey;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    clientInstance = null;
  }

  return clientInstance;
};

// Set dynamic credentials (e.g. from Admin Dashboard)
export const saveSupabaseCredentials = (url: string, anonKey: string): { success: boolean; error?: string } => {
  try {
    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('http')) {
      return { success: false, error: 'URL must start with https:// or http://' };
    }
    if (!cleanKey) {
      return { success: false, error: 'Anon key is required' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('wsl_supabase_url', cleanUrl);
      localStorage.setItem('wsl_supabase_anon_key', cleanKey);
    }

    // Force re-creation of client
    clientInstance = null;
    getSupabaseClient();

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Clear dynamic credentials
export const removeSupabaseCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wsl_supabase_url');
    localStorage.removeItem('wsl_supabase_anon_key');
    localStorage.removeItem('ks_supabase_url');
    localStorage.removeItem('ks_supabase_anon_key');
  }
  clientInstance = null;
  currentConfiguredUrl = '';
  currentConfiguredKey = '';
};

// Dynamic Proxy for backward compatibility with `import { supabase } from '../lib/supabase'`
export const supabase: SupabaseClient | null = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      return undefined;
    }
    const propKey = prop as keyof SupabaseClient;
    const value = client[propKey];
    if (typeof value === 'function') {
      return (value as Function).bind(client);
    }
    return value;
  },
});
