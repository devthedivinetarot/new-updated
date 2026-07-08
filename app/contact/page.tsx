'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Clock, User, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/button';
import FloatingInput, { FloatingTextarea } from '@/components/ui/FloatingInput';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:thedivinetarot111@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] py-16 md:py-20">
      <div className="mx-auto max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl md:text-4xl text-[rgb(var(--foreground))] mb-4">
            {t('contact.heading')}
          </h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-2xl bg-[rgb(var(--surface))/50] border border-[rgb(var(--gold))/20]"
            >
              <div className="text-4xl mb-4">✨</div>
               <h3 className="font-heading text-xl text-[rgb(var(--foreground))] mb-2">
                  {t('contact.success.title')}
                </h3>
                <p className="text-[rgb(var(--foreground-secondary))]">
                  {t('contact.success.message')}
                </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FloatingInput
                label={t('contact.name')}
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                placeholder={t('contact.namePlaceholder')}
                type="text"
                icon={<User className="h-5 w-5" />}
                helperText={t('contact.nameHelper')}
                required
              />
              <FloatingInput
                label={t('contact.email')}
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                placeholder={t('contact.emailPlaceholder')}
                type="email"
                icon={<Mail className="h-5 w-5" />}
                helperText={t('contact.emailHelper')}
                required
              />
              <FloatingTextarea
                label={t('contact.message')}
                value={formData.message}
                onChange={(v) => setFormData({ ...formData, message: v })}
                placeholder={t('contact.messagePlaceholder')}
                rows={5}
                icon={<MessageSquare className="h-5 w-5" />}
                helperText={t('contact.messageHelper')}
                required
              />
              <div className="text-center">
                 <Button type="submit" size="lg">
                   {t('contact.submit')}
                 </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
