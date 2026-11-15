interface FloatingWhatsAppProps {
  phoneNumber: string;
  message: string;
}

export function FloatingWhatsApp({ phoneNumber, message }: FloatingWhatsAppProps) {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  const href = cleanNumber
    ? `https://wa.me/${cleanNumber}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o suporte no WhatsApp"
      title="Suporte via WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.353.615 4.65 1.783 6.674L2.667 29.333l6.813-1.787a13.28 13.28 0 0 0 6.524 1.718h.006c7.36 0 13.323-5.972 13.323-13.332 0-3.562-1.387-6.911-3.904-9.43A13.246 13.246 0 0 0 16.004 2.667zm7.771 18.885c-.329.927-1.916 1.773-2.663 1.883-.682.1-1.547.143-2.495-.158-.575-.183-1.314-.428-2.257-.835-3.972-1.714-6.565-5.714-6.764-5.978-.198-.264-1.615-2.148-1.615-4.097 0-1.95 1.021-2.907 1.383-3.303.362-.396.79-.495 1.053-.495.263 0 .527.002.757.014.243.012.568-.092.888.678.329.792 1.12 2.742 1.219 2.94.099.198.165.429.033.693-.132.264-.198.429-.396.66-.198.231-.416.516-.594.693-.198.198-.404.413-.173.809.231.396 1.026 1.694 2.203 2.743 1.514 1.35 2.79 1.768 3.186 1.966.396.198.627.165.858-.099.231-.264.99-1.155 1.254-1.551.263-.396.527-.33.889-.198.362.132 2.307 1.089 2.703 1.287.396.198.66.297.758.462.099.165.099.957-.23 1.884z" />
      </svg>
    </a>
  );
}
