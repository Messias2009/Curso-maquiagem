declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let initializedPixelId = '';

export function initMetaPixel(pixelId: string) {
  const cleanId = pixelId.trim().replace(/\D/g, '');
  if (!cleanId || typeof window === 'undefined') return;
  if (initializedPixelId === cleanId) return;

  if (!window.fbq) {
    const fbqStub = function (...args: unknown[]) {
      const q = (fbqStub as unknown as { queue: unknown[][] }).queue;
      const callMethod = (fbqStub as unknown as { callMethod?: (...a: unknown[]) => void })
        .callMethod;
      if (callMethod) {
        callMethod(...args);
      } else {
        q.push(args);
      }
    } as unknown as ((...args: unknown[]) => void) & {
      queue: unknown[][];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };

    fbqStub.queue = [];
    fbqStub.loaded = true;
    fbqStub.version = '2.0';
    fbqStub.push = fbqStub;
    window.fbq = fbqStub;
    window._fbq = fbqStub;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  initializedPixelId = cleanId;
  window.fbq('init', cleanId);
  window.fbq('track', 'PageView');
}

export function trackViewContent(courseName: string, priceNumeric: number, currencyCode: string) {
  if (!window.fbq || !initializedPixelId) return;
  const key = 'um_pixel_view_content';
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  window.fbq('track', 'ViewContent', {
    content_name: courseName,
    content_type: 'product',
    value: priceNumeric,
    currency: currencyCode || 'AOA',
  });
}

export function trackInitiateCheckout(
  courseName: string,
  priceNumeric: number,
  currencyCode: string,
) {
  if (!window.fbq || !initializedPixelId) return;
  window.fbq('track', 'InitiateCheckout', {
    content_name: courseName,
    content_type: 'product',
    num_items: 1,
    value: priceNumeric,
    currency: currencyCode || 'AOA',
  });
}

export function trackConfirmedPurchase(
  orderId: string,
  courseName: string,
  priceNumeric: number,
  currencyCode: string,
) {
  if (!window.fbq || !initializedPixelId) return;
  const dedupKey = `um_pixel_purchase_${orderId}`;
  if (sessionStorage.getItem(dedupKey)) return;
  sessionStorage.setItem(dedupKey, '1');
  window.fbq('track', 'Purchase', {
    content_name: courseName,
    content_type: 'product',
    num_items: 1,
    value: priceNumeric,
    currency: currencyCode || 'AOA',
    order_id: orderId,
  });
}
