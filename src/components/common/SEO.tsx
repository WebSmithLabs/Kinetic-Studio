import { useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
}

const BASE_URL = 'https://websmithlabs.pages.dev';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  type = 'website',
  image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
}) => {
  const { settings } = useStudio();

  useEffect(() => {
    const finalTitle = title
      ? `${title} | ${settings.company_name}`
      : `${settings.company_name} | Modern Websites, Web Applications & Digital Platforms`;
    const finalDesc = description || settings.meta_description;

    document.title = finalTitle;

    const setMetaTag = (selector: string, attr: string, value: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[\[\]]/g, '').split('=');
        tag.setAttribute(attrName, attrVal.replace(/['"]/g, ''));
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', finalDesc);
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', finalDesc);
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:image"]', 'content', image);
    setMetaTag('meta[property="og:url"]', 'content', canonical || `${BASE_URL}${window.location.pathname}`);
    setMetaTag('meta[name="robots"]', 'content', 'index, follow');
    setMetaTag('meta[property="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[property="twitter:description"]', 'content', finalDesc);
    setMetaTag('meta[property="twitter:image"]', 'content', image);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `${BASE_URL}${canonical}`);
    }
  }, [title, description, canonical, type, image, settings]);

  return null;
};
