import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, RefreshCw, Armchair, Shield } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'Orders & Payment',
    icon: <ShoppingCart className="w-5 h-5" />,
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), net banking, EMI options from leading banks, and Cash on Delivery (COD) for orders under ₹50,000.',
      },
      {
        question: 'Can I pay in EMI/installments?',
        answer: 'Yes! We offer no-cost EMI on select products for 3, 6, and 9-month tenures through major banks. EMI options are displayed at checkout for eligible products.',
      },
      {
        question: 'How do I track my order?',
        answer: "Once your order is dispatched, you'll receive an SMS and email with tracking details. You can also contact our support team with your order number for real-time updates.",
      },
      {
        question: 'Can I modify my order after placing it?',
        answer: "Modifications can be made within 24 hours of placing the order, provided it hasn't entered production. Contact our support team immediately for any changes.",
      },
    ],
  },
  {
    title: 'Delivery & Shipping',
    icon: <Truck className="w-5 h-5" />,
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 7–14 business days depending on your location. Mumbai deliveries are typically within 5–7 days. Express delivery is available for select areas within 2–3 days.',
      },
      {
        question: 'Do you offer free delivery?',
        answer: 'Yes! We offer free delivery on orders above ₹9,999 within Maharashtra and above ₹14,999 for pan-India orders. Mumbai orders enjoy free delivery on all purchases.',
      },
      {
        question: 'Do you deliver and assemble the furniture?',
        answer: 'Absolutely! Free assembly and room placement is included with every furniture delivery. Our trained technicians will set up everything for you.',
      },
      {
        question: 'Do you deliver outside India?',
        answer: 'Currently, we only deliver within India. For international inquiries, please contact our sales team for a custom quote.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    icon: <RefreshCw className="w-5 h-5" />,
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day return policy for damaged, defective, or wrongly delivered products. Initiate a return by contacting our support team with photos of the issue.',
      },
      {
        question: 'Can I return custom-made furniture?',
        answer: 'Custom-made furniture cannot be returned as it is specifically made to your specifications. We recommend reviewing all specifications carefully before placing custom orders.',
      },
      {
        question: 'How long do refunds take?',
        answer: 'Refunds are processed within 5–7 business days after we verify the returned product. The amount is credited to your original payment method.',
      },
      {
        question: 'Can I exchange a product instead of returning it?',
        answer: 'Yes, exchanges are available for eligible products. The replacement will be delivered within 7–10 business days after the return pickup.',
      },
    ],
  },
  {
    title: 'Products & Quality',
    icon: <Armchair className="w-5 h-5" />,
    items: [
      {
        question: 'What materials do you use?',
        answer: 'We use premium materials including solid sheesham wood, teak, mango wood, engineered wood (plywood, MDF), and high-quality upholstery fabrics. All materials are sourced from trusted suppliers.',
      },
      {
        question: 'Are your products eco-friendly?',
        answer: 'We strive for sustainability. Our wood is responsibly sourced, we use low-VOC finishes, and our packaging uses recycled materials wherever possible.',
      },
      {
        question: 'Can I see the furniture in person before buying?',
        answer: 'Yes! You can visit our showroom in Mumbai to see and feel the furniture. Contact us to schedule a visit. We also offer detailed product photos and videos on our website.',
      },
      {
        question: 'Do you offer custom furniture?',
        answer: 'Absolutely! We specialise in custom furniture tailored to your space and style. Visit our Custom Furniture page or contact us with your requirements for a free quote.',
      },
    ],
  },
  {
    title: 'Warranty & Care',
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        question: 'What warranty do you offer?',
        answer: 'We offer up to 5 years warranty on solid wood furniture, 3 years on engineered wood, 2 years on upholstered furniture, and 6 months on repair/polish work. See our Warranty page for full details.',
      },
      {
        question: 'How do I file a warranty claim?',
        answer: "Contact our support team with your order number, invoice, and photos/videos of the issue. We'll assess and resolve within 7–14 business days.",
      },
      {
        question: 'How should I care for my furniture?',
        answer: 'Keep furniture away from direct sunlight, use coasters, clean with a soft damp cloth, maintain room humidity between 40–60%, and apply furniture polish every 3–6 months.',
      },
    ],
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-1 text-left hover:text-[#C6A75E] transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-medium text-gray-900 pr-4">{item.question}</span>
      <span className={`text-[#C6A75E] text-xl flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
        +
      </span>
    </button>
    {isOpen && (
      <div className="pb-4 px-1">
        <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
      </div>
    )}
  </div>
);

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  usePageMeta('FAQ');

  // Inject FAQ structured data for Google rich snippets
  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.flatMap((cat) =>
        cat.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        }))
      ),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(faqSchema);
    const existing = document.getElementById('faq-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('faq-schema');
      if (el) el.remove();
    };
  }, []);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">FAQ</span>
      </nav>

      {/* Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find quick answers to common questions about ordering, delivery, returns, and more.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Quick Nav */}
        <section className="bg-[#F5EFE6] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Jump to a topic</h2>
          <div className="flex flex-wrap gap-3">
            {faqData.map((cat) => (
              <a
                key={cat.title}
                href={`#faq-${cat.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-sm font-medium text-gray-700 hover:shadow-card hover:text-[#C6A75E] transition-all"
              >
                <span>{cat.icon}</span>
                {cat.title}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Categories */}
        {faqData.map((category) => (
          <section key={category.title} id={`faq-${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>{category.icon}</span>
              {category.title}
            </h2>
            <div className="bg-white rounded-xl shadow-card p-6">
              {category.items.map((item, i) => {
                const key = `${category.title}-${i}`;
                return (
                  <AccordionItem
                    key={key}
                    item={item}
                    isOpen={!!openItems[key]}
                    onToggle={() => toggleItem(key)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        {/* Still have questions */}
        <section className="text-center py-8">
          <div className="bg-[#F5EFE6] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block bg-[#4A2F24] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3A2119] transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hi%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQPage;
