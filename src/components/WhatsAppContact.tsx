export function WhatsAppContact() {
  const phone = '244952018903';
  const message = encodeURIComponent(
    'Olá! Tenho interesse no curso Universo Maquiagem e gostaria de esclarecer algumas dúvidas antes de efetuar o pagamento.',
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir conversa com o suporte no WhatsApp"
      title="Falar connosco pelo WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/90 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E]"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 fill-current">
        <path d="M16.02 3C8.85 3 3.02 8.82 3.02 15.98c0 2.29.6 4.53 1.75 6.51L3 29l6.68-1.75a13 13 0 0 0 6.33 1.63h.01C23.18 28.88 29 23.05 29 15.89A12.9 12.9 0 0 0 16.02 3Zm0 23.68h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.24-3.97 1.04 1.06-3.87-.26-.4a10.75 10.75 0 1 1 9.08 4.97Zm5.9-8.06c-.32-.16-1.87-.92-2.16-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.02-.99 1.23-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.18-.31-.02-.48.14-.64.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.25-.61-.51-.53-.7-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61s1.13 3.03 1.29 3.24c.16.21 2.22 3.39 5.38 4.75.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.87-.76 2.13-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
      </svg>
    </a>
  );
}
