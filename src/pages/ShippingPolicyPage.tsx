import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, Home, MapPin, Map, Globe, Wrench } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const ShippingPolicyPage: React.FC = () => {
  usePageMeta('SHIPPING_POLICY');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Shipping Policy</span>
      </nav>

      {/* Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about how we deliver your furniture safely to your doorstep.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Delivery Highlights */}
        <section className="bg-[#F5EFE6] rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-7 h-7 text-[#C6A75E]" />, title: 'Free Delivery', desc: 'On orders above ₹9,999' },
              { icon: <Package className="w-7 h-7 text-[#C6A75E]" />, title: 'Safe Packaging', desc: 'Multi-layer protection' },
              { icon: <Clock className="w-7 h-7 text-[#C6A75E]" />, title: '7–14 Days', desc: 'Standard delivery time' },
              { icon: <Home className="w-7 h-7 text-[#C6A75E]" />, title: 'Room Placement', desc: 'We set it up for you' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="flex justify-center mb-2">{item.icon}</span>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Zones */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Coverage</h2>
          <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#C6A75E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mumbai Metropolitan Region</h3>
                <p className="text-gray-600 text-sm">Free delivery on all orders. Standard delivery within 5–7 business days. Express delivery available within 2–3 business days for an additional charge.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
                <Map className="w-5 h-5 text-[#C6A75E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Maharashtra (Rest of State)</h3>
                <p className="text-gray-600 text-sm">Free delivery on orders above ₹9,999. Delivery within 7–10 business days. Flat ₹499 shipping for orders below ₹9,999.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-[#C6A75E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pan-India Delivery</h3>
                <p className="text-gray-600 text-sm">Free delivery on orders above ₹14,999. Delivery within 10–14 business days. Shipping charges calculated at checkout for smaller orders.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-5 h-5 text-[#C6A75E]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Assembly & Installation</h3>
                <p className="text-gray-600 text-sm">Free assembly is included with all furniture deliveries. Our trained technicians will set up your furniture in the designated room.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-gray-700 mb-4">
              Once your order is dispatched, you will receive an SMS and email with your tracking details. You can track your order at any stage:
            </p>
            <ol className="space-y-3">
              {[
                'Order Confirmed — Your order has been placed successfully.',
                'In Production — Your furniture is being crafted or prepared.',
                'Quality Check — Every piece goes through a thorough inspection.',
                'Dispatched — Your order is on its way!',
                'Out for Delivery — The delivery team will contact you to schedule.',
                'Delivered — Furniture placed and assembled in your room.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#C6A75E] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Packaging */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Packaging Standards</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <p className="text-gray-700 mb-4">
              We take utmost care to ensure your furniture arrives in perfect condition:
            </p>
            <ul className="space-y-2">
              {[
                'Multi-layer corrugated cardboard packaging',
                'Foam corner protectors on all edges',
                'Stretch wrap for scratch-proof surfaces',
                'Moisture-resistant outer layer for transit protection',
                'Fragile items packed with additional bubble wrap',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C6A75E]">✓</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Important Notes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <div className="bg-[#F5EFE6] rounded-xl p-6 space-y-3">
            <p className="text-gray-700 text-sm">
              <strong>Delivery Attempts:</strong> Our delivery team will make up to 2 attempts. If both attempts fail due to unavailability, re-delivery charges may apply.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Large Items:</strong> Ensure adequate doorway/stairway access for large furniture. Please measure entry points before ordering. Our team can advise during consultation.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Custom Orders:</strong> Custom-made furniture may take 3–4 weeks for production before dispatch. You'll receive updates throughout the process.
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Inspection:</strong> Please inspect your furniture upon delivery. Report any damage within 24 hours to our customer support for immediate resolution.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-gray-600 mb-4">Have questions about delivery?</p>
          <Link
            to="/contact"
            className="inline-block bg-[#4A2F24] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3A2119] transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
