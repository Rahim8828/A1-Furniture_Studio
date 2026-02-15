import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CreditCard, Phone, CheckCircle, XCircle, Landmark } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const ReturnPolicyPage: React.FC = () => {
  usePageMeta('RETURN_POLICY');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#c17d3c] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Return &amp; Refund Policy</span>
      </nav>

      {/* Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return &amp; Refund Policy</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your satisfaction is our priority. Here's everything you need to know about our hassle-free return process.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Highlights */}
        <section className="bg-[#fdf8f0] rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <RefreshCw className="w-7 h-7 text-[#c17d3c]" />, title: '7-Day Returns', desc: 'Easy returns within 7 days of delivery' },
              { icon: <CreditCard className="w-7 h-7 text-[#c17d3c]" />, title: 'Full Refund', desc: 'Get 100% refund on eligible returns' },
              { icon: <Phone className="w-7 h-7 text-[#c17d3c]" />, title: 'Free Pickup', desc: 'We pick up from your doorstep' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="flex justify-center mb-2">{item.icon}</span>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Eligibility</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-gray-700 mb-4">
              Products are eligible for return under the following conditions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" /> Eligible for Return
                </h3>
                <ul className="space-y-2">
                  {[
                    'Product received is damaged or defective',
                    'Wrong product delivered',
                    'Product significantly different from description',
                    'Missing parts or accessories',
                    'Manufacturing defect found within 7 days',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Not Eligible for Return
                </h3>
                <ul className="space-y-2">
                  {[
                    'Products with signs of use or wear',
                    'Custom-made or personalized furniture',
                    'Products damaged due to misuse or negligence',
                    'Mattresses (due to hygiene reasons)',
                    'Return requested after 7-day window',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 flex-shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Initiate a Return</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <ol className="space-y-4">
              {[
                { title: 'Contact Us', desc: 'Reach out via phone, email, or WhatsApp within 7 days of delivery with your order number and photos of the issue.' },
                { title: 'Verification', desc: 'Our team will review your request and verify the issue within 24–48 hours.' },
                { title: 'Pickup Scheduled', desc: 'Once approved, we\'ll schedule a free pickup from your location at a convenient time.' },
                { title: 'Quality Inspection', desc: 'The returned product undergoes inspection at our facility.' },
                { title: 'Resolution', desc: 'You\'ll receive a replacement or full refund based on your preference within 5–7 business days.' },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#c17d3c] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Refund Details */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Information</h2>
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#c17d3c]/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-[#c17d3c]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Online Payments</h3>
                <p className="text-gray-600 text-sm">Refund will be credited to the original payment method within 5–7 business days after return approval.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#c17d3c]/10 flex items-center justify-center flex-shrink-0">
                <Landmark className="w-5 h-5 text-[#c17d3c]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                <p className="text-gray-600 text-sm">Refund will be processed via bank transfer (NEFT/IMPS). Please share your bank details when initiating the return.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#c17d3c]/10 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-[#c17d3c]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Exchanges</h3>
                <p className="text-gray-600 text-sm">Want a replacement instead? We'll deliver the new product within 7–10 business days after picking up the returned item.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Cancellation</h2>
          <div className="bg-[#fdf8f0] rounded-xl p-6 space-y-3">
            <p className="text-gray-700 text-sm">
              <strong>Before Dispatch:</strong> Orders can be cancelled free of charge before dispatch. Full refund will be processed within 3–5 business days.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>After Dispatch:</strong> Once your order has been shipped, cancellation may attract a 10% restocking fee. The remaining amount will be refunded within 5–7 business days.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Custom Orders:</strong> Custom-made furniture orders that have entered production cannot be cancelled. Please confirm all specifications before placing custom orders.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-gray-600 mb-4">Need to return a product or have questions?</p>
          <Link
            to="/contact"
            className="inline-block bg-[#2d1b0e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a1008] transition-colors"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
