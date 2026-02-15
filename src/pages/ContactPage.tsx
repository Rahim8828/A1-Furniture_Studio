import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const ContactPage: React.FC = () => {
  usePageMeta('CONTACT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Contact</span>
      </nav>

      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're here to help! Reach out to us for any inquiries, custom orders, or support
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#c17d3c]/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <a href="tel:+919876543210" className="text-[#c17d3c] hover:underline">
                  +91 98765 43210
                </a>
                <br />
                <a href="tel:+912212345678" className="text-[#c17d3c] hover:underline">
                  +91 22 1234 5678
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#c17d3c]/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a href="mailto:info@a1furniture.com" className="text-[#c17d3c] hover:underline">
                  info@a1furniture.com
                </a>
                <br />
                <a href="mailto:sales@a1furniture.com" className="text-[#c17d3c] hover:underline">
                  sales@a1furniture.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#c17d3c]/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-700">
                  A1 Furniture Studio<br />
                  123 Furniture Lane, Andheri West<br />
                  Mumbai, Maharashtra 400053<br />
                  India
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#c17d3c]/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                <a
                  href="https://wa.me/919876543210?text=Hello%20A1%20Furniture%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c17d3c] hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-[#c17d3c]/10 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🕐</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                <div className="text-gray-700 space-y-1">
                  <p><span className="font-medium">Monday - Saturday:</span> 10:00 AM - 8:00 PM</p>
                  <p><span className="font-medium">Sunday:</span> 11:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600 mt-2">
                    * Showroom visits by appointment recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-700">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="custom">Custom Furniture</option>
                  <option value="repair">Repair & Polish Services</option>
                  <option value="order">Order Status</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-[#c17d3c] transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c17d3c] text-white py-3 rounded-lg font-semibold hover:bg-[#a86830] transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Visit Our Showroom</h2>
        <div className="bg-gray-100 rounded-xl overflow-hidden" style={{ height: '400px' }}>
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fdf8f0] to-[#f5ebe0]">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-700 font-medium">A1 Furniture Studio</p>
              <p className="text-gray-600">123 Furniture Lane, Andheri West, Mumbai</p>
              <a
                href="https://maps.google.com/?q=Andheri+West+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#c17d3c] hover:underline font-medium"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-[#fdf8f0] rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Need Immediate Assistance?</h3>
        <p className="text-gray-700 mb-4">
          For urgent inquiries or immediate support, please call us or reach out via WhatsApp
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+919876543210"
            className="bg-[#2d1b0e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a0e08] transition-colors"
          >
            📞 Call Now
          </a>
          <a
            href="https://wa.me/919876543210?text=Hello%20A1%20Furniture%20Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            💬 WhatsApp Chat
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
