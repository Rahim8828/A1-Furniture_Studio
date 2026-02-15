import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Wrench, ClipboardList, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const WarrantyPage: React.FC = () => {
  usePageMeta('WARRANTY');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Warranty Information</span>
      </nav>

      {/* Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Warranty Information</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We stand behind every piece we sell. Learn about our comprehensive warranty coverage.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Warranty Highlights */}
        <section className="bg-[#F5EFE6] rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-7 h-7 text-[#C6A75E]" />, title: '5-Year Warranty', desc: 'On all solid wood furniture' },
              { icon: <Wrench className="w-7 h-7 text-[#C6A75E]" />, title: 'Free Repairs', desc: 'Manufacturing defects covered' },
              { icon: <ClipboardList className="w-7 h-7 text-[#C6A75E]" />, title: 'Easy Claims', desc: 'Simple warranty claim process' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="flex justify-center mb-2">{item.icon}</span>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage Table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Warranty Coverage</h2>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#4A2F24] text-white">
                    <th className="text-left px-6 py-3 font-semibold">Product Category</th>
                    <th className="text-left px-6 py-3 font-semibold">Warranty Period</th>
                    <th className="text-left px-6 py-3 font-semibold">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { category: 'Solid Wood Furniture', period: '5 Years', coverage: 'Structural defects, joint failures, wood warping' },
                    { category: 'Engineered Wood', period: '3 Years', coverage: 'Structural integrity, laminate peeling, swelling' },
                    { category: 'Upholstered Furniture', period: '2 Years', coverage: 'Frame structure, spring/foam defects' },
                    { category: 'Metal Furniture', period: '3 Years', coverage: 'Structural defects, welding failures, rust' },
                    { category: 'Mattresses', period: '5 Years', coverage: 'Sagging beyond 1.5 inches, spring defects' },
                    { category: 'Custom Furniture', period: '3 Years', coverage: 'Manufacturing defects, structural issues' },
                    { category: 'Repair & Polish Work', period: '6 Months', coverage: 'Polish peeling, repair rework' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-3 font-medium text-gray-900">{row.category}</td>
                      <td className="px-6 py-3 text-[#C6A75E] font-semibold">{row.period}</td>
                      <td className="px-6 py-3 text-gray-600">{row.coverage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What's Covered vs Not */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Covered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Covered Under Warranty
              </h3>
              <ul className="space-y-2">
                {[
                  'Manufacturing defects in materials',
                  'Structural failures (joints, frames)',
                  'Wood warping under normal conditions',
                  'Hardware malfunction (hinges, slides)',
                  'Upholstery stitching defects',
                  'Finish peeling or bubbling (non-abuse)',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" /> Not Covered
              </h3>
              <ul className="space-y-2">
                {[
                  'Damage due to misuse or negligence',
                  'Normal wear and tear over time',
                  'Stains, scratches, or accidental damage',
                  'Damage from pests (termites, etc.)',
                  'Unauthorised repairs or modifications',
                  'Damage from extreme weather or flooding',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-500 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Claim Process */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Claim Warranty</h2>
          <div className="bg-white rounded-xl shadow-card p-6">
            <ol className="space-y-4">
              {[
                { title: 'Report the Issue', desc: 'Contact us via phone, email, or WhatsApp with your order number, invoice, and photos/videos of the defect.' },
                { title: 'Assessment', desc: 'Our team will assess the issue. For complex cases, a technician may visit your location for inspection.' },
                { title: 'Resolution', desc: 'Based on the assessment, we\'ll repair, replace the affected part, or provide a full replacement within 7–14 business days.' },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#C6A75E] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Furniture Care Tips</h2>
          <div className="bg-[#F5EFE6] rounded-xl p-6">
            <p className="text-gray-700 text-sm mb-4">Extend the life of your furniture with these simple care tips:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Keep away from direct sunlight to prevent fading',
                'Use coasters and placemats to avoid stains',
                'Clean with a soft, damp cloth — avoid harsh chemicals',
                'Maintain room humidity between 40–60%',
                'Tighten bolts and screws periodically',
                'Use furniture polish every 3–6 months',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Lightbulb className="w-4 h-4 text-[#C6A75E] flex-shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <p className="text-gray-600 mb-4">Need to file a warranty claim?</p>
          <Link
            to="/contact"
            className="inline-block bg-[#4A2F24] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3A2119] transition-colors"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default WarrantyPage;
