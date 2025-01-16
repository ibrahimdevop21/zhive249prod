// Google Analytics IDs
export const GA4_ID = 'G-WCTR5L70NZ';
export const GTM_ID = 'GT-TX9NCMDC';

// Custom event tracking helper
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Page view tracking
export const trackPageView = (url: string, title: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA4_ID, {
      page_path: url,
      page_title: title
    });
  }
};

// Outbound link tracking
export const trackOutboundLink = (url: string, domain: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'outbound_link', {
      link_url: url,
      link_domain: domain
    });
  }
};

// Error tracking
export const trackError = (error: string, fatal: boolean = false) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'exception', {
      description: error,
      fatal: fatal
    });
  }
};
