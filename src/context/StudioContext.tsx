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
  PaymentRecord,
  SubscriptionPlan,
  ClientSubscription,
  StoreProduct,
  CollaborationItem,
} from '../types';
import {
  initialSiteSettings,
  initialServices,
  initialProjects,
  initialFaqs,
  initialTestimonials,
  initialInquiries,
  initialSubscriptionPlans,
  initialStoreProducts,
  initialPayments,
  initialSubscriptions,
  initialCollaborations,
} from '../lib/defaultData';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  removeSupabaseCredentials,
  getSupabaseCredentials,
} from '../lib/supabase';
import { sanitizeInquiryData, sanitizeText } from '../lib/sanitize';

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
  updateInquiry: (id: string, updates: Partial<InquiryItem>) => Promise<boolean>;
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

  // Payments & Invoices (Razorpay & Cashfree)
  payments: PaymentRecord[];
  recordPayment: (payment: PaymentRecord) => Promise<boolean>;

  // Subscriptions & Maintenance Retainers
  subscriptionPlans: SubscriptionPlan[];
  clientSubscriptions: ClientSubscription[];
  addSubscription: (sub: Omit<ClientSubscription, 'id' | 'created_at'>) => Promise<boolean>;
  cancelSubscription: (id: string) => Promise<boolean>;

  // Store Products (Templates & Turnkey Websites)
  storeProducts: StoreProduct[];
  addStoreProduct: (prod: Omit<StoreProduct, 'id'>) => Promise<boolean>;
  updateStoreProduct: (id: string, updates: Partial<StoreProduct>) => Promise<boolean>;
  deleteStoreProduct: (id: string) => Promise<boolean>;

  // Client Collaboration & Team Discussion
  collaborations: CollaborationItem[];
  addCollaborationMessage: (msg: Omit<CollaborationItem, 'id' | 'created_at'>) => Promise<boolean>;

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
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: { full_name?: string; phone?: string; avatar_url?: string }) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
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
    const saved = localStorage.getItem('wsl_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialServices.length) {
          return parsed;
        }
      } catch (e) {
        // fallback to initial
      }
    }
    return initialServices;
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
    const saved = localStorage.getItem('wsl_faqs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialFaqs.length) {
          return parsed;
        }
      } catch (e) {
        // fallback to initial
      }
    }
    return initialFaqs;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('wsl_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('wsl_subscription_plans');
    return saved ? JSON.parse(saved) : initialSubscriptionPlans;
  });

  const [clientSubscriptions, setClientSubscriptions] = useState<ClientSubscription[]>(() => {
    const saved = localStorage.getItem('wsl_subscriptions');
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(() => {
    const saved = localStorage.getItem('wsl_store_products');
    return saved ? JSON.parse(saved) : initialStoreProducts;
  });

  const [collaborations, setCollaborations] = useState<CollaborationItem[]>(() => {
    const saved = localStorage.getItem('wsl_collaborations');
    return saved ? JSON.parse(saved) : initialCollaborations;
  });

  const [currentUser, setCurrentUser] = useState<StudioUser | null>(() => {
    const saved = localStorage.getItem('wsl_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('wsl_admin_user');
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

    const emailVerified = Boolean(
      sessionUser.email_confirmed_at ||
      sessionUser.confirmed_at ||
      sessionUser.user_metadata?.email_verified === true
    );

    const providers: string[] =
      sessionUser.app_metadata?.providers ||
      (sessionUser.app_metadata?.provider ? [sessionUser.app_metadata.provider] : ['email']);

    let userPhone: string | undefined = sessionUser.phone || sessionUser.user_metadata?.phone;

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
          if (profile.phone) userPhone = profile.phone;
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
      phone: userPhone,
      email_verified: emailVerified,
      providers: providers,
      created_at: sessionUser.created_at,
      last_sign_in_at: sessionUser.last_sign_in_at,
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

  useEffect(() => {
    localStorage.setItem('wsl_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('wsl_subscriptions', JSON.stringify(clientSubscriptions));
  }, [clientSubscriptions]);

  useEffect(() => {
    localStorage.setItem('wsl_store_products', JSON.stringify(storeProducts));
  }, [storeProducts]);

  useEffect(() => {
    localStorage.setItem('wsl_collaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  useEffect(() => {
    localStorage.setItem('wsl_subscription_plans', JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

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

      // 7. Payments
      const { data: paymentsData, error: payErr } = await client
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!payErr && paymentsData && paymentsData.length > 0) {
        startTransition(() => {
          setPayments(paymentsData);
        });
      }

      // 8. Client Subscriptions
      const { data: subsData, error: subErr } = await client
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!subErr && subsData && subsData.length > 0) {
        startTransition(() => {
          setClientSubscriptions(subsData);
        });
      }

      // 9. Subscription Plans
      const { data: plansData, error: planErr } = await client
        .from('subscription_plans')
        .select('*')
        .order('monthly_price_inr', { ascending: true });
      if (!planErr && plansData && plansData.length > 0) {
        startTransition(() => {
          setSubscriptionPlans(plansData);
        });
      }

      // 10. Store Products
      const { data: storeData, error: storeErr } = await client
        .from('store_products')
        .select('*')
        .order('created_at', { ascending: false });
      if (!storeErr && storeData && storeData.length > 0) {
        startTransition(() => {
          setStoreProducts(storeData);
        });
      }

      // 11. Collaboration Messages
      const { data: collabData, error: colErr } = await client
        .from('collaboration_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (!colErr && collabData && collabData.length > 0) {
        startTransition(() => {
          setCollaborations(collabData);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, payload => {
        if (payload.eventType === 'INSERT') {
          setPayments(prev => [payload.new as PaymentRecord, ...prev.filter(p => p.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setPayments(prev => prev.map(p => (p.id === payload.new.id ? (payload.new as PaymentRecord) : p)));
        } else if (payload.eventType === 'DELETE') {
          setPayments(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, payload => {
        if (payload.eventType === 'INSERT') {
          setClientSubscriptions(prev => [payload.new as ClientSubscription, ...prev.filter(s => s.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setClientSubscriptions(prev => prev.map(s => (s.id === payload.new.id ? (payload.new as ClientSubscription) : s)));
        } else if (payload.eventType === 'DELETE') {
          setClientSubscriptions(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collaboration_messages' }, payload => {
        if (payload.eventType === 'INSERT') {
          setCollaborations(prev => [...prev.filter(c => c.id !== payload.new.id), payload.new as CollaborationItem]);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscription_plans' }, () => {
        client.from('subscription_plans').select('*').order('monthly_price_inr', { ascending: true }).then(res => {
          if (res.data && res.data.length > 0) setSubscriptionPlans(res.data);
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'store_products' }, () => {
        client.from('store_products').select('*').order('created_at', { ascending: false }).then(res => {
          if (res.data) setStoreProducts(res.data);
        });
      })
      .subscribe();

    return () => {
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

      const [
        sRes, srvRes, prjRes, inqRes, faqRes, tstRes,
        payRes, subRes, planRes, storeRes, colRes
      ] = await Promise.all([
        client.from('site_settings').select('id', { count: 'exact', head: true }),
        client.from('services').select('id', { count: 'exact', head: true }),
        client.from('projects').select('id', { count: 'exact', head: true }),
        client.from('inquiries').select('id', { count: 'exact', head: true }),
        client.from('faqs').select('id', { count: 'exact', head: true }),
        client.from('testimonials').select('id', { count: 'exact', head: true }),
        client.from('payments').select('id', { count: 'exact', head: true }),
        client.from('subscriptions').select('id', { count: 'exact', head: true }),
        client.from('subscription_plans').select('id', { count: 'exact', head: true }),
        client.from('store_products').select('id', { count: 'exact', head: true }),
        client.from('collaboration_messages').select('id', { count: 'exact', head: true }),
      ]);

      counts.site_settings = sRes.count ?? 0;
      counts.services = srvRes.count ?? 0;
      counts.projects = prjRes.count ?? 0;
      counts.inquiries = inqRes.count ?? 0;
      counts.faqs = faqRes.count ?? 0;
      counts.testimonials = tstRes.count ?? 0;
      counts.payments = payRes.count ?? 0;
      counts.subscriptions = subRes.count ?? 0;
      counts.subscription_plans = planRes.count ?? 0;
      counts.store_products = storeRes.count ?? 0;
      counts.collaboration_messages = colRes.count ?? 0;

      // Check if schema exists
      if (sRes.error && sRes.error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but database tables were not found. Please execute supabase/schema.sql in your Supabase SQL Editor.',
        };
      }

      return {
        success: true,
        message: 'Successfully connected to Supabase PostgreSQL database! All 11 tables accessible.',
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

      // 6. Subscription Plans
      for (const plan of initialSubscriptionPlans) {
        await client.from('subscription_plans').upsert(plan, { onConflict: 'id' });
      }

      // 7. Store Products
      for (const prod of initialStoreProducts) {
        await client.from('store_products').upsert(prod, { onConflict: 'id' });
      }

      // Reload
      await loadSupabaseData();

      return {
        success: true,
        message: 'Successfully seeded your Supabase database with Web Smith Labs default services, portfolio projects, FAQs, plans, and site configuration!',
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
      const sanitized = sanitizeInquiryData(inquiryData as unknown as Record<string, unknown>) as unknown as Omit<InquiryItem, 'id' | 'status' | 'created_at'>;
      const newInquiry: InquiryItem = {
        ...sanitized,
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

  const updateInquiry = async (
    id: string,
    updates: Partial<InquiryItem>
  ): Promise<boolean> => {
    setInquiries(prev =>
      prev.map(inq =>
        inq.id === id
          ? {
              ...inq,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : inq
      )
    );

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      const { error } = await client
        .from('inquiries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
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

  // Payment Recording & Gateway Transaction Log
  const recordPayment = async (payment: PaymentRecord): Promise<boolean> => {
    setPayments(prev => [payment, ...prev]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('payments').insert([payment]);
        if (error) console.warn('Supabase payment insert notice:', error);
      } catch (err) {
        console.warn('Supabase payment insert caught error:', err);
      }
    }

    // Automatically synchronize client inquiry quote & payment state if linked
    if (payment.inquiry_id && payment.status === 'success') {
      const targetInq = inquiries.find(i => i.id === payment.inquiry_id);
      if (targetInq) {
        const updatedPaid = (targetInq.paid_amount || 0) + Number(payment.amount);
        let nextStatus: InquiryItem['status'] = targetInq.status;
        if (targetInq.total_amount && updatedPaid >= targetInq.total_amount) {
          nextStatus = 'payment_completed';
        } else if (targetInq.advance_amount && updatedPaid >= targetInq.advance_amount) {
          nextStatus = 'advance_payment_completed';
        }
        await updateInquiry(targetInq.id, {
          paid_amount: updatedPaid,
          status: nextStatus,
        });
      }
    }
    return true;
  };

  // Subscriptions & Retainers
  const addSubscription = async (
    sub: Omit<ClientSubscription, 'id' | 'created_at'>
  ): Promise<boolean> => {
    const item: ClientSubscription = {
      ...sub,
      id: `sub_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setClientSubscriptions(prev => [item, ...prev]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('subscriptions').insert([item]);
        if (error) console.warn('Supabase subscription insert notice:', error);
      } catch (err) {
        console.warn('Supabase subscription caught error:', err);
      }
    }
    return true;
  };

  const cancelSubscription = async (id: string): Promise<boolean> => {
    setClientSubscriptions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'cancelled' } : s))
    );
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', id);
        if (error) console.warn('Supabase subscription cancel error:', error);
      } catch (err) {
        console.warn('Supabase subscription cancel caught error:', err);
      }
    }
    return true;
  };

  // Store Products (Templates & Turnkey Websites)
  const addStoreProduct = async (prod: Omit<StoreProduct, 'id'>): Promise<boolean> => {
    const item: StoreProduct = {
      ...prod,
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    setStoreProducts(prev => [item, ...prev]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('store_products').insert([item]);
        if (error) console.warn('Supabase store product insert error:', error);
      } catch (err) {
        console.warn('Supabase store product insert caught error:', err);
      }
    }
    return true;
  };

  const updateStoreProduct = async (
    id: string,
    updates: Partial<StoreProduct>
  ): Promise<boolean> => {
    setStoreProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('store_products').update(updates).eq('id', id);
        if (error) console.warn('Supabase store product update error:', error);
      } catch (err) {
        console.warn('Supabase store product update caught error:', err);
      }
    }
    return true;
  };

  const deleteStoreProduct = async (id: string): Promise<boolean> => {
    setStoreProducts(prev => prev.filter(p => p.id !== id));
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('store_products').delete().eq('id', id);
        if (error) console.warn('Supabase store product delete error:', error);
      } catch (err) {
        console.warn('Supabase store product delete caught error:', err);
      }
    }
    return true;
  };

  // Client Collaboration & Team Messaging
  const addCollaborationMessage = async (
    msg: Omit<CollaborationItem, 'id' | 'created_at'>
  ): Promise<boolean> => {
    const item: CollaborationItem = {
      ...msg,
      message: sanitizeText(msg.message, 3000),
      sender_name: sanitizeText(msg.sender_name, 100),
      id: generateUUID(),
      created_at: new Date().toISOString(),
    };
    setCollaborations(prev => [...prev, item]);
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        const { error } = await client.from('collaboration_messages').insert([item]);
        if (error) console.warn('Supabase collaboration message insert error:', error);
      } catch (err) {
        console.warn('Supabase collaboration caught error:', err);
      }
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

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return { 
          success: false, 
          error: 'Please check your email and confirm your account before signing in, or use Google Sign In.' 
        };
      }
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Invalid email or password. If you originally signed in with Google, please continue with Google or set a password in your Profile.',
        };
      }
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

    const trimmedEmail = email.trim().toLowerCase();
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

    // Check if user already exists
    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in with your password or use Google Sign In.',
      };
    }

    if (data.user) {
      if (data.session) {
        await syncUser(data.user);
        return { success: true };
      }

      // Try signing in immediately (in case user was auto-confirmed by database trigger)
      try {
        const signInRes = await client.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInRes.data?.user) {
          await syncUser(signInRes.data.user);
          return { success: true };
        }
      } catch {
        // Fall through to confirmation requirement
      }

      // Email confirmation required
      return {
        success: true,
        error: 'Account created! Please check your email for confirmation before signing in.',
      };
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

    // For local development, ensure we're using the correct port
    let finalRedirectTo = destination;
    if (origin.includes('localhost') && !origin.includes(':5173')) {
      // If on localhost but not on port 5173, replace with correct port
      finalRedirectTo = destination.replace(/localhost:\d+/, 'localhost:5173');
    }

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: finalRedirectTo,
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

  const updatePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: { user } } = await client.auth.getUser();
    if (user) {
      await syncUser(user);
    }

    return { success: true };
  };

  const updateUserProfile = async (updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    if (!currentUser) {
      return { success: false, error: 'User is not authenticated.' };
    }

    // Update Supabase auth user metadata
    const { error: authError } = await client.auth.updateUser({
      data: {
        full_name: updates.full_name ?? currentUser.full_name,
        name: updates.full_name ?? currentUser.full_name,
        phone: updates.phone ?? currentUser.phone,
        avatar_url: updates.avatar_url ?? currentUser.avatar_url,
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    // Update public.profiles table
    const profileUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name;
    if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
    if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url;

    const { error: profileError } = await client
      .from('profiles')
      .update(profileUpdates)
      .eq('id', currentUser.id);

    if (profileError) {
      console.warn('Profile table update error:', profileError);
    }

    const { data: { user } } = await client.auth.getUser();
    if (user) {
      await syncUser(user);
    }

    return { success: true };
  };

  const verifyEmail = async (): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const { error } = await client.rpc('verify_user_email');
    if (error) {
      return { success: false, error: error.message };
    }

    const { data: { user } } = await client.auth.getUser();
    if (user) {
      await syncUser(user);
    }

    return { success: true };
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    if (!currentUser?.email) {
      return { success: false, error: 'No email found.' };
    }

    const { error } = await client.auth.resend({
      type: 'signup',
      email: currentUser.email,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return { success: false, error: 'Database is not connected.' };
    }

    const { error } = await client.rpc('delete_user_account');
    if (error) {
      return { success: false, error: error.message };
    }

    await logout();
    return { success: true };
  };

  // Backwards compatibility for Admin Dashboard
  const loginAdmin = loginWithEmail;
  const registerAdmin = registerWithEmail;
  const logoutAdmin = logout;

  // Determine admin privileges: user must be authenticated, and either have explicit admin role or designated admin email
  const isAdmin = Boolean(
    currentUser &&
      (currentUser.role === 'admin' ||
        currentUser.role === 'super_admin' ||
        ADMIN_EMAILS.some(e => e.toLowerCase() === currentUser.email?.toLowerCase()))
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
        updateInquiry,
        deleteInquiry,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        payments,
        recordPayment,
        subscriptionPlans,
        clientSubscriptions,
        addSubscription,
        cancelSubscription,
        storeProducts,
        addStoreProduct,
        updateStoreProduct,
        deleteStoreProduct,
        collaborations,
        addCollaborationMessage,
        currentUser,
        adminUser,
        isAdmin,
        authLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        updatePassword,
        updateUserProfile,
        verifyEmail,
        resendVerificationEmail,
        deleteAccount,
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
