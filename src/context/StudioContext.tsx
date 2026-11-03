import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  SiteSettings,
  ServiceItem,
  ProjectItem,
  InquiryItem,
  TestimonialItem,
  FaqItem,
  AdminUser,
} from '../types';
import {
  initialSiteSettings,
  initialServices,
  initialProjects,
  initialFaqs,
  initialTestimonials,
  initialInquiries,
} from '../lib/defaultData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StudioContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isConfigured: boolean;
  loading: boolean;
  
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
  adminUser: AdminUser | null;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ks_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('ks_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('ks_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('ks_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [inquiries, setInquiries] = useState<InquiryItem[]>(() => {
    const saved = localStorage.getItem('ks_inquiries');
    return saved ? JSON.parse(saved) : initialInquiries;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('ks_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('ks_faqs');
    return saved ? JSON.parse(saved) : initialFaqs;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('ks_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

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
    localStorage.setItem('ks_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync to localStorage as backup/offline cache
  useEffect(() => {
    localStorage.setItem('ks_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ks_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ks_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ks_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('ks_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('ks_faqs', JSON.stringify(faqs));
  }, [faqs]);

  // Load from Supabase if configured
  const loadSupabaseData = useCallback(async () => {
    if (!supabase || !isConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // 1. Settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .single();
      if (settingsData) {
        setSettings(prev => ({ ...prev, ...settingsData }));
      }

      // 2. Services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
      }

      // 3. Projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
      }

      // 4. FAQs
      const { data: faqsData } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      if (faqsData && faqsData.length > 0) {
        setFaqs(faqsData);
      }

      // 5. Testimonials
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
      }

      // 6. Inquiries (only if logged in)
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const { data: inquiriesData } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });
        if (inquiriesData) {
          setInquiries(inquiriesData);
        }
      }
    } catch (err) {
      console.warn('Notice: Using local cache or fallback data until Supabase is synced:', err);
    } finally {
      setLoading(false);
    }
  }, [isConfigured]);

  useEffect(() => {
    loadSupabaseData();

    // Listen for auth state change
    if (supabase && isConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const user: AdminUser = {
            id: session.user.id,
            email: session.user.email || 'admin@kineticstudio.co',
            role: 'admin',
            full_name: session.user.user_metadata?.full_name || 'Studio Administrator',
          };
          setAdminUser(user);
          localStorage.setItem('ks_admin_user', JSON.stringify(user));
        } else {
          setAdminUser(null);
          localStorage.removeItem('ks_admin_user');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [loadSupabaseData, isConfigured]);

  // Settings update
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);

      if (supabase && isConfigured) {
        const { error } = await supabase
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
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [...prev, newService]);

    if (supabase && isConfigured) {
      await supabase.from('services').insert([newService]);
    }
    return true;
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>): Promise<boolean> => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    if (supabase && isConfigured) {
      await supabase.from('services').update(updates).eq('id', id);
    }
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (supabase && isConfigured) {
      await supabase.from('services').delete().eq('id', id);
    }
    return true;
  };

  // Projects CRUD
  const addProject = async (project: Omit<ProjectItem, 'id'>): Promise<boolean> => {
    const newProject: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [newProject, ...prev]);

    if (supabase && isConfigured) {
      await supabase.from('projects').insert([newProject]);
    }
    return true;
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>): Promise<boolean> => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    if (supabase && isConfigured) {
      await supabase.from('projects').update(updates).eq('id', id);
    }
    return true;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (supabase && isConfigured) {
      await supabase.from('projects').delete().eq('id', id);
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
        id: `inq-${Date.now()}`,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      setInquiries(prev => [newInquiry, ...prev]);

      if (supabase && isConfigured) {
        const { error } = await supabase.from('inquiries').insert([newInquiry]);
        if (error) {
          console.error('Supabase inquiry insert error:', error);
        }
      }

      return {
        success: true,
        message: 'Your project inquiry has been received. A Kinetic Studio lead will respond within 24 to 48 hours.',
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

    if (supabase && isConfigured) {
      const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updates.admin_notes = notes;
      await supabase.from('inquiries').update(updates).eq('id', id);
    }
    return true;
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
    if (supabase && isConfigured) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
    return true;
  };

  // Testimonials CRUD
  const addTestimonial = async (test: Omit<TestimonialItem, 'id'>): Promise<boolean> => {
    const item: TestimonialItem = { ...test, id: `test-${Date.now()}` };
    setTestimonials(prev => [...prev, item]);
    if (supabase && isConfigured) {
      await supabase.from('testimonials').insert([item]);
    }
    return true;
  };

  const updateTestimonial = async (id: string, updates: Partial<TestimonialItem>): Promise<boolean> => {
    setTestimonials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    if (supabase && isConfigured) {
      await supabase.from('testimonials').update(updates).eq('id', id);
    }
    return true;
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (supabase && isConfigured) {
      await supabase.from('testimonials').delete().eq('id', id);
    }
    return true;
  };

  // FAQs CRUD
  const addFaq = async (faq: Omit<FaqItem, 'id'>): Promise<boolean> => {
    const item: FaqItem = { ...faq, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, item]);
    if (supabase && isConfigured) {
      await supabase.from('faqs').insert([item]);
    }
    return true;
  };

  const updateFaq = async (id: string, updates: Partial<FaqItem>): Promise<boolean> => {
    setFaqs(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    if (supabase && isConfigured) {
      await supabase.from('faqs').update(updates).eq('id', id);
    }
    return true;
  };

  const deleteFaq = async (id: string): Promise<boolean> => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    if (supabase && isConfigured) {
      await supabase.from('faqs').delete().eq('id', id);
    }
    return true;
  };

  // Auth
  const loginAdmin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (supabase && isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
          full_name: data.user.user_metadata?.full_name || 'Studio Administrator',
        };
        setAdminUser(user);
        localStorage.setItem('ks_admin_user', JSON.stringify(user));
        return { success: true };
      }
    }

    // Interactive Demo / Preview authentication mode when Supabase credentials are pending
    if (email.trim() && (password.length >= 6 || password === 'KineticStudio2026!')) {
      const demoUser: AdminUser = {
        id: 'ks-admin-demo-id',
        email: email.trim(),
        role: 'super_admin',
        full_name: 'Studio Administrator',
      };
      setAdminUser(demoUser);
      localStorage.setItem('ks_admin_user', JSON.stringify(demoUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Password must be at least 6 characters.',
    };
  };

  const logoutAdmin = async () => {
    if (supabase && isConfigured) {
      await supabase.auth.signOut();
    }
    setAdminUser(null);
    localStorage.removeItem('ks_admin_user');
  };

  return (
    <StudioContext.Provider
      value={{
        theme,
        toggleTheme,
        isConfigured,
        loading,
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
        adminUser,
        isAdmin: Boolean(adminUser),
        loginAdmin,
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
