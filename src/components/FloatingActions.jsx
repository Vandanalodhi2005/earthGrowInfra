import React from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

const FloatingActions = () => {
  const phoneNumber = '+919264175587';
  const whatsappNumber = '919264175587';
  const whatsappMessage = 'Hello, I am interested in your services.';

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-4">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={32} />
      </a>

      {/* Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
        aria-label="Call Us"
      >
        <FaPhoneAlt size={24} />
      </a>
    </div>
  );
};

export default FloatingActions;
