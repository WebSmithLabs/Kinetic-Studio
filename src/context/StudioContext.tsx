import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import {
  SiteSettings,
  ServiceItem,
  ProjectItem,
  InquiryItem,
  TestimonialItem,
  FaqItem,
  AdminUser,
  StudioUser,
  UserRole,
} from '../types';
import {
  initialSiteSettings,
  initialServices,
  initialProjects,
  initialFaqs,
  initialTestimonials,
  initialInquiries,
} from '../lib/defaultData';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  removeSupabaseCredentials,
  getSupabaseCredentials,
} from '../lib/supabase';

// RFC4122 compliant UUID v4 generator for both local state and PostgreSQL UUID columns
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Designated Admin Accounts
export const ADMIN_EMAILS: string[] = [
  'websmithlaps@gmail.com',
];

interface StudioContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isConfigured: boolean;
  loading: boolean;
  configuredUrl: string;

  // Supabase Live Connection Controls
  connectSupabase: (url: string, anonKey: string) => Promise<{ success: boolean; error?: string }>;
  disconnectSupabase: () => void;
  testSupabaseConnection: () => Promise<{ success: boolean; message: string; tableCounts?: Record<string, number> }>;
  seedSupabaseDatabase: () => Promise<{ success: boolean; message: string }>;
  refreshData: () => Promise<void>;

  // Settings
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;

  // Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<boolean>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;

  // Projects
  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id'>) => Promise<boolean>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;

  // Inquiries
  inquiries: InquiryItem[];
  submitInquiry: (inquiry: Omit<InquiryItem, 'id' | 'status' | 'created_at'>) => Promise<{ success: boolean; message: string }>;
  updateInquiryStatus: (id: string, status: InquiryItem['status'], notes?: string) => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;

  // Testimonials
  testimonials: TestimonialItem[];
  addTestimonial: (test: Omit<TestimonialItem, 'id'>) => Promise<boolean>;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;

  // FAQs
  faqs: FaqItem[];
  addFaq: (faq: Omit<FaqItem, 'id'>) => Promise<boolean>;
  updateFaq: (id: string, updates: Partial<FaqItem>) => Promise<boolean>;
  deleteFaq: (id: string) => Promise<boolean>;

  // Auth
  currentUser: StudioUser | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  authLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerAdmin: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure data version is updated to flush outdated sample data and reflect Web Smith Labs
  const DATA_VERSION = 'v3_websmithlabs';
  if (typeof window !== 'undefined') {
    const currentVer = localStorage.getItem('wsl_data_version');
    if (currentVer !== DATA_VERSION) {
      localStorage.removeItem('wsl_settings');
      localStorage.removeItem('wsl_services');
      localStorage.removeItem('wsl_projects');
      localStorage.removeItem('wsl_faqs');
      localStorage.removeItem('wsl_testimonials');
      // Clean legacy keys
      localStorage.removeItem('ks_settings');
      localStorage.removeItem('ks_services');
      localStorage.removeItem('ks_projects');
      localStorage.removeItem('ks_faqs');
      localStorage.removeItem('ks_testimonials');
      localStorage.setItem('wsl_data_version', DATA_VERSION);
    }
  }

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('wsl_theme') || localStorage.getItem('ks_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const [configuredState, setConfiguredState] = useState<boolean>(() => isSupabaseConfigured());
  const [configuredUrl, setConfiguredUrl] = useState<string>(() => getSupabaseCredentials().url);

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('wsl_settings') || localStorage.getItem('ks_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('wsl_services') || localStorage.getItem('ks_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('wsl_projects') || localStorage.getItem('ks_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    const saved = localStorage.getItem('wsl_inquiries') || localStorage.getItem('ks_inquiries');
    return saved ? JSON.parse(saved) : initialInquiries;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('wsl_testimonials') || localStorage.getItem('ks_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('wsl_faqs') || localStorage.getItem('ks_faqs');
    return saved ? JSON.parse(saved) : initialFaqs;
  });

  const [currentUser, setCurrentUser] = useState<StudioUser | null>(() => {
    const saved = localStorage.getItem('wsl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('wsl_admin_user') || localStorage.getItem('ks_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Sync session user with public.profiles and evaluate admin privileges
  const syncUser = useCallback(async (sessionUser: any) => {
    if (!sessionUser) {
      setCurrentUser(null);
      setAdminUser(null);
      localStorage.removeItem('wsl_current_user');
      localStorage.removeItem('wsl_admin_user');
      return;
    }

    const email = (sessionUser.email || '').toLowerCase().trim();
    const isSpecialAdmin = ADMIN_EMAILS.some(ae => ae.toLowerCase() === email);

    let profileRole: UserRole = isSpecialAdmin ? 'admin' : 'client';
    let profileName: string =
      sessionUser.user_metadata?.full_name ||
      sessionUser.user_metadata?.name ||
      email.split('@')[0];
    let avatarUrl: string | undefined =
      sessionUser.user_metadata?.avatar_url ||
      sessionUser.user_metadata?.picture;

    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        if (profile) {
          if (profile.role) {
            profileRole = isSpecialAdmin ? 'admin' : (profile.role as UserRole);
          }
          if (profile.full_name) profileName = profile.full_name;
          if (profile.avatar_url) avatarUrl = profile.avatar_url;
        }
      } catch (e) {
        console.warn('Error fetching profile from Supabase:', e);
      }
    }

    const user: StudioUser = {
      id: sessionUser.id,
      email: sessionUser.email || email,
      role: profileRole,
      full_name: profileName,
      avatar_url: avatarUrl,
    };

    setCurrentUser(user);
    localStorage.setItem('wsl_current_user', JSON.stringify(user));

    if (profileRole === 'admin' || profileRole === 'super_admin' || isSpecialAdmin) {
      setAdminUser(user);
      localStorage.setItem('wsl_admin_user', JSON.stringify(user));
    } else {
      setAdminUser(null);
      localStorage.removeItem('wsl_admin_user');
    }
  }, []);

  // Supabase Auth listener for real-time auth state synchronization
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    client.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          syncUser(session.user).finally(() => setAuthLoading(false));
        } else {
          setAuthLoading(false);
        }
      })
      .catch(() => {
        setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUser(session.user);
      } else {
        setCurrentUser(null);
        setAdminUser(null);
        localStorage.removeItem('wsl_current_user');
        localStorage.removeItem('wsl_admin_user');
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configuredState, syncUser]);

  // Apply Theme class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('wsl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync to localStorage as offline cache
  useEffect(() => {
    localStorage.setItem('wsl_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('wsl_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('wsl_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('wsl_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('wsl_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('wsl_faqs', JSON.stringify(faqs));
  }, [faqs]);

  // Load from Supabase when configured
  const loadSupabaseData = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Settings
      const { data: settingsData, error: sErr } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .single();
      if (!sErr && settingsData) {
        startTransition(() => {
          setSettings(prev => ({ ...prev, ...settingsData }));
        });
      }

      // 2. Services
      const { data: servicesData, error: srvErr } = await client
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (!srvErr && servicesData) {
        startTransition(() => {
          setServices(servicesData);
        });
      }

      // 3. Projects
      const { data: projectsData, error: prjErr } = await client
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (!prjErr && projectsData) {
        startTransition(() => {
          setProjects(projectsData);
        });
      }

      // 4. FAQs
      const { data: faqsData, error: faqErr } = await client
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      if (!faqErr && faqsData) {
        startTransition(() => {
          setFaqs(faqsData);
        });
      }

      // 5. Testimonials
      const { data: testimonialsData, error: tstErr } = await client
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (!tstErr && testimonialsData) {
        startTransition(() => {
          setTestimonials(testimonialsData);
        });
      }

      // 6. Inquiries
      const { data: inquiriesData, error: inqErr } = await client
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!inqErr && inquiriesData) {
        startTransition(() => {
          setInquiries(inquiriesData);
        });
      }
    } catch (err) {
      console.warn('Notice: Using local cache or fallback data until Supabase is synced:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Supabase real-time sync and auth listener
  useEffect(() => {
    loadSupabaseData();

    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return;
    }

    // Auth state listener
    const { data: authListener } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user: AdminUser = {
          id: session.user.id,
          email: session.user.email || 'websmithlaps@gmail.com',
          role: 'admin',
          full_name: session.user.user_metadata?.full_name || 'Web Smith Labs Administrator',
        };
        setAdminUser(user);
        localStorage.setItem('wsl_admin_user', JSON.stringify(user));
      } else {
        setAdminUser(null);
        localStorage.removeItem('wsl_admin_user');
      }
    });

    // Supabase Realtime channel for live multi-tab & multi-admin database sync
    const channel = client
      .channel('websmithlabs-db-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, payload => {
        if (payload.new) {
          setSettings(prev => ({ ...prev, ...(payload.new as SiteSettings) }));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, payload => {
        if (payload.eventType === 'INSERT') {
          setInquiries(prev => [payload.new as InquiryItem, ...prev.filter(i => i.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setInquiries(prev => prev.map(i => (i.id === payload.new.id ? (payload.new as InquiryItem) : i)));
        } else if (payload.eventType === 'DELETE') {
          setInquiries(prev => prev.filter(i => i.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        client.from('projects').select('*').order('display_order', { ascending: true }).then(res => {
          if (res.data) setProjects(res.data);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        client.from('services').select('*').order('display_order', { ascending: true }).then(res => {
          if (res.data) setServices(res.data);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => {
        client.from('faqs').select('*').order('display_order', { ascending: true }).then(res => {
          if (res.data) setFaqs(res.data);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        client.from('testimonials').select('*').order('display_order', { ascending: true }).then(res => {
          if (res.data) setTestimonials(res.data);
        });
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      client.removeChannel(channel);
    };
  }, [loadSupabaseData]);

  // Connect Supabase dynamically
  const connectSupabase = async (url: string, anonKey: string): Promise<{ success: boolean; error?: string }> => {
    const res = saveSupabaseCredentials(url, anonKey);
    if (!res.success) {
      return res;
    }

    setConfiguredState(true);
    setConfiguredUrl(url.trim());

    // Test query and load data
    try {
      await loadSupabaseData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to query Supabase' };
    }
  };

  // Disconnect Supabase
  const disconnectSupabase = () => {
    removeSupabaseCredentials();
    setConfiguredState(false);
    setConfiguredUrl('');
  };

  // Test Supabase Connection & Table Accessibility
  const testSupabaseConnection = async (): Promise<{
    success: boolean;
    message: string;
    tableCounts?: Record<string, number>;
  }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, message: 'Supabase credentials are not configured.' };
    }

    try {
      const counts: Record<string, number> = {};

      const [sRes, srvRes, prjRes, inqRes, faqRes, tstRes] = await Promise.all([
        client.from('site_settings').select('id', { count: 'exact', head: true }),
        client.from('services').select('id', { count: 'exact', head: true }),
        client.from('projects').select('id', { count: 'exact', head: true }),
        client.from('inquiries').select('id', { count: 'exact', head: true }),
        client.from('faqs').select('id', { count: 'exact', head: true }),
        client.from('testimonials').select('id', { count: 'exact', head: true }),
      ]);

      counts.site_settings = sRes.count ?? 0;
      counts.services = srvRes.count ?? 0;
      counts.projects = prjRes.count ?? 0;
      counts.inquiries = inqRes.count ?? 0;
      counts.faqs = faqRes.count ?? 0;
      counts.testimonials = tstRes.count ?? 0;

      // Check if schema exists
      if (sRes.error && sRes.error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but database tables were not found. Please execute supabase/schema.sql in your Supabase SQL Editor.',
        };
      }

      return {
        success: true,
        message: 'Successfully connected to Supabase PostgreSQL database! All tables accessible.',
        tableCounts: counts,
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to connect to Supabase.',
      };
    }
  };

  // Seed Supabase with Web Smith Labs Default Data
  const seedSupabaseDatabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, message: 'Supabase credentials are not configured.' };
    }

    try {
      setLoading(true);

      // 1. Site Settings
      await client.from('site_settings').upsert({
        ...initialSiteSettings,
        id: 'primary',
        updated_at: new Date().toISOString(),
      });

      // 2. Services
      for (const srv of initialServices) {
        await client.from('services').upsert(srv, { onConflict: 'slug' });
      }

      // 3. Projects
      for (const prj of initialProjects) {
        await client.from('projects').upsert(prj, { onConflict: 'slug' });
      }

      // 4. FAQs
      for (const faq of initialFaqs) {
        await client.from('faqs').upsert(faq, { onConflict: 'id' });
      }

      // 5. Testimonials
      for (const tst of initialTestimonials) {
        await client.from('testimonials').upsert(tst, { onConflict: 'id' });
      }

      // Reload
      await loadSupabaseData();

      return {
        success: true,
        message: 'Successfully seeded your Supabase database with Web Smith Labs default services, portfolio projects, FAQs, and site configuration!',
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Database seeding encountered an error.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Settings update
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        const { error } = await client
          .from('site_settings')
          .upsert({ ...updated, id: 'primary', updated_at: new Date().toISOString() });
        if (error) console.error('Supabase settings update error:', error);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Services CRUD
  const addService = async (service: Omit<ServiceItem, 'id'>): Promise<boolean> => {
    const newService: ServiceItem = {
      ...service,
      id: generateUUID(),
    };
    setServices(prev => [...prev, newService]);

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { data, error } = await client.from('services').insert([newService]).select().single();
      if (!error && data) {
        setServices(prev => prev.map(s => (s.id === newService.id ? data : s)));
      } else if (error) {
        console.error('Supabase service insert error:', error);
      }
    }
    return true;
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>): Promise<boolean> => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('services').update(updates).eq('id', id);
      if (error) console.error('Supabase service update error:', error);
    }
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    setServices(prev => prev.filter(s => s.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('services').delete().eq('id', id);
      if (error) console.error('Supabase service delete error:', error);
    }
    return true;
  };

  // Projects CRUD
  const addProject = async (project: Omit<ProjectItem, 'id'>): Promise<boolean> => {
    const newProject: ProjectItem = {
      ...project,
      id: generateUUID(),
    };
    setProjects(prev => [newProject, ...prev]);

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { data, error } = await client.from('projects').insert([newProject]).select().single();
      if (!error && data) {
        setProjects(prev => prev.map(p => (p.id === newProject.id ? data : p)));
      } else if (error) {
        console.error('Supabase project insert error:', error);
      }
    }
    return true;
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>): Promise<boolean> => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('projects').update(updates).eq('id', id);
      if (error) console.error('Supabase project update error:', error);
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    setProjects(prev => prev.filter(p => p.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) console.error('Supabase project delete error:', error);
    }
    return true;
  };

  // Inquiries
  const submitInquiry = async (
    inquiryData: Omit<InquiryItem, 'id' | 'status' | 'created_at'>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const newInquiry: InquiryItem = {
        ...inquiryData,
        id: generateUUID(),
        status: 'new',
        created_at: new Date().toISOString(),
      };

      setInquiries(prev => [newInquiry, ...prev]);

      const client = getSupabaseClient();
      if (client && isSupabaseConfigured()) {
        const { error } = await client.from('inquiries').insert([newInquiry]);
        if (error) {
          console.error('Supabase inquiry insert error:', error);
        }
      }

      return {
        success: true,
        message: 'Your project inquiry has been received. A Web Smith Labs lead will respond within 24 to 48 hours.',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to submit inquiry';
      return { success: false, message: errMsg };
    }
  };

  const updateInquiryStatus = async (
    id: string,
    status: InquiryItem['status'],
    notes?: string
  ): Promise<boolean> => {
    setInquiries(prev =>
      prev.map(inq =>
        inq.id === id
          ? {
              ...inq,
              status,
              ...(notes !== undefined ? { admin_notes: notes } : {}),
              updated_at: new Date().toISOString(),
            }
          : inq
      )
    );

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updates.admin_notes = notes;
      const { error } = await client.from('inquiries').update(updates).eq('id', id);
      if (error) console.error('Supabase inquiry update error:', error);
    }
    return true;
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('inquiries').delete().eq('id', id);
      if (error) console.error('Supabase inquiry delete error:', error);
    }
    return true;
  };

  // Testimonials CRUD
  const addTestimonial = async (test: Omit<TestimonialItem, 'id'>): Promise<boolean> => {
    const item: TestimonialItem = { ...test, id: generateUUID() };
    setTestimonials(prev => [...prev, item]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('testimonials').insert([item]);
      if (error) console.error('Supabase testimonial insert error:', error);
    }
    return true;
  };

  const updateTestimonial = async (id: string, updates: Partial<TestimonialItem>): Promise<boolean> => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('testimonials').update(updates).eq('id', id);
      if (error) console.error('Supabase testimonial update error:', error);
    }
    return true;
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('testimonials').delete().eq('id', id);
      if (error) console.error('Supabase testimonial delete error:', error);
    }
    return true;
  };

  // FAQs CRUD
  const addFaq = async (faq: Omit<FaqItem, 'id'>): Promise<boolean> => {
    const item: FaqItem = { ...faq, id: generateUUID() };
    setFaqs(prev => [...prev, item]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('faqs').insert([item]);
      if (error) console.error('Supabase FAQ insert error:', error);
    }
    return true;
  };

  const updateFaq = async (id: string, updates: Partial<FaqItem>): Promise<boolean> => {
    setFaqs(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('faqs').update(updates).eq('id', id);
      if (error) console.error('Supabase FAQ update error:', error);
    }
    return true;
  };

  const deleteFaq = async (id: string): Promise<boolean> => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client.from('faqs').delete().eq('id', id);
      if (error) console.error('Supabase FAQ delete error:', error);
    }
    return true;
  };

  // Authentication Methods Connected to Supabase Auth
  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      await syncUser(data.user);
      return { success: true };
    }

    return {
      success: false,
      error: 'Authentication failed. Please verify your credentials.',
    };
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const trimmedEmail = email.trim();
    const name = fullName?.trim() || trimmedEmail.split('@')[0];

    const { data, error } = await client.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      if (data.session) {
        await syncUser(data.user);
        return { success: true };
      }

      // Auto-confirmed via trigger: sign in immediately to get active session
      const signInRes = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInRes.data?.user) {
        await syncUser(signInRes.data.user);
        return { success: true };
      }

      await syncUser(data.user);
      return { success: true };
    }

    return {
      success: true,
      error: 'Account created! Please check your email for confirmation.',
    };
  };

  const loginWithGoogle = async (
    redirectTo?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const { url } = getSupabaseCredentials();

    // Check if Google provider is active in Supabase to prevent redirecting to raw 400 error page
    try {
      const probeRes = await fetch(`${url}/auth/v1/authorize?provider=google`, { method: 'GET' });
      if (probeRes.status === 400) {
        const errJson = await probeRes.json().catch(() => ({}));
        if (errJson.msg && errJson.msg.toLowerCase().includes('not enabled')) {
          return {
            success: false,
            error:
              'Google OAuth is not activated in your Supabase project dashboard (Authentication > Providers > Google). Please use Email sign in / registration below.',
          };
        }
      }
    } catch {
      // If probe blocked by CORS, proceed with standard OAuth redirect
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const destination = redirectTo
      ? redirectTo.startsWith('/')
        ? `${origin}${redirectTo}`
        : redirectTo
      : origin;

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: destination,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      await client.auth.signOut();
    }
    setCurrentUser(null);
    setAdminUser(null);
    localStorage.removeItem('wsl_current_user');
    localStorage.removeItem('wsl_admin_user');
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/login?type=recovery`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Backwards compatibility for Admin Dashboard
  const loginAdmin = loginWithEmail;
  const registerAdmin = registerWithEmail;
  const logoutAdmin = logout;

  // Determine admin privileges: either explicit admin role or designated admin email
  const isAdmin = Boolean(
    (currentUser &&
      (currentUser.role === 'admin' ||
        currentUser.role === 'super_admin' ||
        ADMIN_EMAILS.some(e => e.toLowerCase() === currentUser.email?.toLowerCase()))) ||
    (adminUser &&
      (adminUser.role === 'admin' ||
        adminUser.role === 'super_admin' ||
        ADMIN_EMAILS.some(e => e.toLowerCase() === adminUser.email?.toLowerCase())))
  );

  return (
    <StudioContext.Provider
      value={{
        theme,
        toggleTheme,
        isConfigured: configuredState,
        loading,
        configuredUrl,
        connectSupabase,
        disconnectSupabase,
        testSupabaseConnection,
        seedSupabaseDatabase,
        refreshData: loadSupabaseData,
        settings,
        updateSettings,
        services,
        addService,
        updateService,
        deleteService,
        projects,
        addProject,
        updateProject,
        deleteProject,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        currentUser,
        adminUser,
        isAdmin,
        authLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
