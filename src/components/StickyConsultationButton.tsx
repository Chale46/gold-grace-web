import { useState, useEffect } from 'react';
import { Mail, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/components/SiteContentProvider';

const StickyConsultationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const { content } = useSiteContent();

  const buildMailToUrl = (value: string) => {
    const raw = value?.trim();
    const email = raw || 'info@jadtraconsulting.com';
    if (email.startsWith('mailto:')) return email;
    return `mailto:${email}`;
  };

  const buildWhatsAppUrl = (value: string) => {
    const raw = value?.trim();
    const defaultUrl = 'https://wa.me/6281234567890?text=Hi%20JADTRA%20Consulting%2C%20I%20need%20tax%20consultation';
    if (!raw) return defaultUrl;
    if (raw.startsWith('http')) return raw;
    const cleaned = raw.replace(/[^0-9]/g, '');
    if (!cleaned) return defaultUrl;
    return `https://wa.me/${cleaned}?text=Hi%20JADTRA%20Consulting%2C%20I%20need%20tax%20consultation`;
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const consultationOptions = [
    {
      icon: Mail,
      label: t('consultationPhone') || 'Call Us',
      action: buildMailToUrl(content.consultation_email || content.footer_email || content.contact_email || 'info@jadtraconsulting.com'),
      description: t('consultationPhoneDesc') || 'Direct consultation'
    },
    {
      icon: MessageCircle,
      label: t('consultationWhatsapp') || 'WhatsApp',
      action: buildWhatsAppUrl(content.consultation_whatsapp || ''),
      description: t('consultationWhatsappDesc') || 'Chat with our experts'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Options */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
          {consultationOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-background border border-border rounded-lg shadow-lg p-3 animate-in slide-in-from-right-2 fade-in duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <option.icon className="text-primary" size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <a
                href={option.action}
                target={option.action.startsWith('http') ? '_blank' : '_self'}
                rel={option.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
              >
                {t('consultationStart') || 'Start'}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group
          ${isOpen 
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-110'
          }
        `}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
        
        {/* Pulse Animation */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        )}
        
        {/* Hover Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {t('consultation.title') || 'Hubungi Kami'}
          </div>
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StickyConsultationButton;
