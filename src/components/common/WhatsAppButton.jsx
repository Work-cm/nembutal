import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { SITE_WHATSAPP, SITE_TELEGRAM } from '@/lib/constants/site';

export default function WhatsAppButton() {
  const whatsappUrl = SITE_WHATSAPP;
  const telegramUrl = SITE_TELEGRAM;

  return (
    <>
      {/* Telegram Button — bottom right */}
      <div className="group fixed right-6 bottom-6 z-40">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-bone-light text-ink border border-ink/15 rounded-full p-5 shadow-editorial transition-all duration-500 ease-editorial hover:bg-ink hover:text-bone-light"
          aria-label="Chat with us on Telegram"
        >
          <FaTelegram className="text-3xl" aria-hidden="true" />
        </a>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-ink text-bone-light px-3.5 py-2 text-[10px] uppercase tracking-editorial whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on Telegram
        </span>
      </div>

      {/* WhatsApp Button — bottom left */}
      <div className="group fixed left-6 bottom-6 z-40">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-ink text-bone-light rounded-full p-5 shadow-editorial transition-all duration-500 ease-editorial hover:bg-amber-dark relative"
          aria-label="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-3xl" aria-hidden="true" />
        </a>
        
        {/* Tooltip - only appears on this button's hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-ink text-bone-light px-3.5 py-2 text-[10px] uppercase tracking-editorial whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </div>
    </>
  );
}
