declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const META_PIXEL_ID = '1865139711590522';

export function initMetaPixel(_pixelId?: string) {
  // The single approved pixel is initialized once in index.html.
}

export function trackViewContent(courseName: string, priceNumeric: number, currencyCode: string) {
  if (!window.fbq) return;
  const key = 'um_pixel_view_content';
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  window.fbq('trackSingle', META_PIXEL_ID, 'ViewContent', {
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
  if (!window.fbq) return;
  window.fbq('trackSingle', META_PIXEL_ID, 'InitiateCheckout', {
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
  if (!window.fbq) return;
  const dedupKey = `um_pixel_purchase_${orderId}`;
  if (sessionStorage.getItem(dedupKey)) return;
  sessionStorage.setItem(dedupKey, '1');
  window.fbq('trackSingle', META_PIXEL_ID, 'Purchase', {
    content_name: courseName,
    content_type: 'product',
    num_items: 1,
    value: priceNumeric,
    currency: currencyCode || 'AOA',
    order_id: orderId,
  });
}
