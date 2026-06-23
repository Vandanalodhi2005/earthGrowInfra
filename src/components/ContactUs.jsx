'use client';
import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser'; // switched to modern package
import { API_URL } from '../apiConfig';
import toast from 'react-hot-toast';
import { HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';

export default function Contact() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fullName = `${formData.first_name} ${formData.last_name}`;
    const finalMessage = `Subject: ${formData.subject}\n\n${formData.message}`;

    try {
      const backendRes = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          message: finalMessage,
        }),
      });

      const emailParams = {
        from_name: fullName,
        from_email: formData.email,
        phone: formData.phone,
        subject: `Website Inquiry: ${formData.subject}`,
        message: finalMessage,
        to_name: 'The Realty Xperts Team',
      };

      const emailPromise = emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      await Promise.all([backendRes, emailPromise]);

      if (backendRes.ok) {
        toast.success('Thank you! Your message has been received.');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Backend submission failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please contact us directly via phone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-20 bg-gray-50 min-h-screen">
      <section className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <span className="subtitle text-primary">Get In Touch</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800">
            Contact The Realty Xperts
          </h2>
          <div className="divider mx-auto my-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are always ready to help you find your dream address or answer any
            questions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <InfoCard
              icon={<HiOutlinePhone className="text-primary" size={24} />}
              title="Call Us Directly"
              link="tel:9264175587"
              linkText="926-417-5587"
              sub="Sameer Tiwari"
            />
            <InfoCard
              icon={<HiOutlineMail className="text-primary" size={24} />}
              title="Email Us"
              link="mailto:Emailtotrx@gmail.com"
              linkText="Emailtotrx@gmail.com"
            />
            <InfoCard
              icon={<HiOutlineClock className="text-primary" size={24} />}
              title="Business Legacy"
              text="Delivering excellence since 2016."
            />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-primary">Send Us A Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                name="message"
                placeholder="How can we help you today?"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white rounded-full px-8 py-3 font-semibold hover:bg-gold transition"
              >
                {submitting ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, link, linkText, sub, text }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-primary mb-1">{title}</h4>
        {link ? (
          <>
            <a href={link} className="text-gray-700 hover:text-primary block">
              {linkText}
            </a>
            {sub && <p className="text-sm text-gray-500">{sub}</p>}
          </>
        ) : (
          <p className="text-gray-700">{text}</p>
        )}
      </div>
    </div>
  );
}
