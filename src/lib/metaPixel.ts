declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const ADDITIONAL_PIXEL_ID = '1940835167079209';
let initializedPixelIds: string[] = [];

export function initMetaPixel(pixelId: string) {
  const configuredId = pixelId.trim().replace(/\D/g, '');
  const pixelIdsToInitialize = [...new Set([configuredId, ADDITIONAL_PIXEL_ID].filter(Boolean))];
  if (pixelIdsToInitialize.length === 0 || typeof window === 'undefined') return;

  const newPixelIds = pixelIdsToInitialize.filter((id) => !initializedPixelIds.includes(id));
  if (newPixelIds.length === 0) return;

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

  for (const id of newPixelIds) {
    window.fbq('init', id);
    window.fbq('trackSingle', id, 'PageView');
  }

  initializedPixelIds = [...initializedPixelIds, ...newPixelIds];
}

export function trackViewContent(courseName: string, priceNumeric: number, currencyCode: string) {
  if (!window.fbq || initializedPixelIds.length === 0) return;
  const key = 'um_pixel_view_content';
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  for (const id of initializedPixelIds) {
    window.fbq('trackSingle', id, 'ViewContent', {
      content_name: courseName,
      content_type: 'product',
      value: priceNumeric,
      currency: currencyCode || 'AOA',
    });
  }
}

export function trackInitiateCheckout(
  courseName: string,
  priceNumeric: number,
  currencyCode: string,
) {
  if (!window.fbq || initializedPixelIds.length === 0) return;
  for (const id of initializedPixelIds) {
    window.fbq('trackSingle', id, 'InitiateCheckout', {
      content_name: courseName,
      content_type: 'product',
      num_items: 1,
      value: priceNumeric,
      currency: currencyCode || 'AOA',
    });
  }
}

export function trackConfirmedPurchase(
  orderId: string,
  courseName: string,
  priceNumeric: number,
  currencyCode: string,
) {
  if (!window.fbq || initializedPixelIds.length === 0) return;
  const dedupKey = `um_pixel_purchase_${orderId}`;
  if (sessionStorage.getItem(dedupKey)) return;
  sessionStorage.setItem(dedupKey, '1');
  for (const id of initializedPixelIds) {
    window.fbq('trackSingle', id, 'Purchase', {
      content_name: courseName,
      content_type: 'product',
      num_items: 1,
      value: priceNumeric,
      currency: currencyCode || 'AOA',
      order_id: orderId,
    });
  }
}
