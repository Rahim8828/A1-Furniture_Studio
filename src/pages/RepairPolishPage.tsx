import { useState, type FormEvent } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  furnitureDetails: string;
}

export default function RepairPolishPage() {
  usePageMeta('REPAIR_POLISH');
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    furnitureDetails: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<QuoteFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<QuoteFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (!formData.furnitureDetails.trim()) {
      newErrors.furnitureDetails = 'Furniture details are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real application, this would send data to a backend
      console.log('Service quote request submitted:', formData);
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          furnitureDetails: '',
        });
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof QuoteFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#fdf8f0] to-[#f5ebe0] rounded-xl p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Furniture Repair & Polish Services
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Restore the beauty and extend the life of your furniture with our professional repair and polish services. 
          Expert craftsmanship, premium materials, and attention to detail guaranteed.
        </p>
      </div>

      {/* Services Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Repair Services</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Structural repairs and reinforcement</li>
            <li>• Joint tightening and fixing</li>
            <li>• Broken part replacement</li>
            <li>• Drawer and door alignment</li>
            <li>• Hardware replacement</li>
            <li>• Upholstery repair</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Polish Services</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Complete refinishing</li>
            <li>• Scratch and dent removal</li>
            <li>• Color restoration</li>
            <li>• Premium polish application</li>
            <li>• Protective coating</li>
            <li>• Stain removal</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Restoration</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Antique furniture restoration</li>
            <li>• Wood treatment and care</li>
            <li>• Color matching</li>
            <li>• Veneer repair</li>
            <li>• Surface leveling</li>
            <li>• Complete makeovers</li>
          </ul>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Service Pricing Guide
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-900">Service Type</th>
                <th className="text-left py-3 px-4 text-gray-900">Description</th>
                <th className="text-right py-3 px-4 text-gray-900">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Basic Polish</td>
                <td className="py-3 px-4 text-gray-700">Surface cleaning and polish application</td>
                <td className="py-3 px-4 text-right">₹1,500</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Deep Polish</td>
                <td className="py-3 px-4 text-gray-700">Complete refinishing with scratch removal</td>
                <td className="py-3 px-4 text-right">₹3,500</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Minor Repairs</td>
                <td className="py-3 px-4 text-gray-700">Joint fixing, hardware replacement</td>
                <td className="py-3 px-4 text-right">₹2,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Major Repairs</td>
                <td className="py-3 px-4 text-gray-700">Structural repairs, part replacement</td>
                <td className="py-3 px-4 text-right">₹5,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Upholstery Repair</td>
                <td className="py-3 px-4 text-gray-700">Fabric/leather repair or replacement</td>
                <td className="py-3 px-4 text-right">₹4,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Complete Restoration</td>
                <td className="py-3 px-4 text-gray-700">Full furniture makeover</td>
                <td className="py-3 px-4 text-right">₹8,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          * Prices vary based on furniture size, condition, and materials. Final quote provided after inspection.
        </p>
      </div>

      {/* Before/After Gallery */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Our Work: Before & After
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Before
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Worn Dining Table</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  After
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Restored Dining Table</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Dining Table Restoration</h3>
              <p className="text-sm text-gray-600">
                Complete refinishing with scratch removal, color restoration, and premium polish application.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Before
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Damaged Sofa</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  After
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Repaired Sofa</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sofa Upholstery Repair</h3>
              <p className="text-sm text-gray-600">
                Fabric replacement, cushion refilling, and structural reinforcement for like-new comfort.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Before
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Old Wardrobe</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  After
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Polished Wardrobe</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Wardrobe Deep Polish</h3>
              <p className="text-sm text-gray-600">
                Deep cleaning, scratch removal, and premium polish for a stunning finish.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Before
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Broken Chair</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  After
                </div>
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Fixed Chair</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Chair Structural Repair</h3>
              <p className="text-sm text-gray-600">
                Joint reinforcement, leg replacement, and complete refinishing for durability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Request a Service Quote
        </h2>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Quote Request Received!
            </h3>
            <p className="text-gray-700">
              Thank you for your service request. Our team will review your requirements and 
              contact you within 24 hours with a detailed quote and next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-transparent ${
                  errors.serviceType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a service</option>
                <option value="basic-polish">Basic Polish</option>
                <option value="deep-polish">Deep Polish</option>
                <option value="minor-repairs">Minor Repairs</option>
                <option value="major-repairs">Major Repairs</option>
                <option value="upholstery-repair">Upholstery Repair</option>
                <option value="complete-restoration">Complete Restoration</option>
              </select>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
              )}
            </div>

            <div>
              <label htmlFor="furnitureDetails" className="block text-sm font-medium text-gray-700 mb-2">
                Furniture Details *
              </label>
              <textarea
                id="furnitureDetails"
                name="furnitureDetails"
                value={formData.furnitureDetails}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c17d3c]/30 focus:border-transparent ${
                  errors.furnitureDetails ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please describe:&#10;- Type of furniture (sofa, table, chair, etc.)&#10;- Current condition and issues&#10;- Approximate age&#10;- Material (wood, fabric, leather, etc.)&#10;- Any specific concerns or requirements"
              />
              {errors.furnitureDetails && (
                <p className="text-red-500 text-sm mt-1">{errors.furnitureDetails}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#c17d3c] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#a86830] transition-colors"
            >
              Request Quote
            </button>

            <p className="text-sm text-gray-600 text-center">
              * Required fields. We'll contact you to schedule a free inspection.
            </p>
          </form>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Why Choose A1 Furniture Studio?
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">👨‍🔧</div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Craftsmen</h3>
            <p className="text-sm text-gray-600">
              20+ years of experience in furniture repair and restoration
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              Only the finest materials and finishes for lasting results
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Pickup & Delivery</h3>
            <p className="text-sm text-gray-600">
              Free pickup and delivery within Mumbai for your convenience
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
            <p className="text-sm text-gray-600">
              6-month warranty on all repair and polish work
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Need Immediate Assistance?
        </h3>
        <div className="flex flex-wrap justify-center gap-6 text-gray-700">
          <a href="tel:+919876543210" className="flex items-center hover:text-[#c17d3c]">
            <span className="mr-2">📞</span>
            <span>+91 98765 43210</span>
          </a>
          <a href="mailto:service@a1furniture.com" className="flex items-center hover:text-[#c17d3c]">
            <span className="mr-2">✉️</span>
            <span>service@a1furniture.com</span>
          </a>
          <a
            href="https://wa.me/919876543210?text=I need furniture repair/polish service"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-[#c17d3c]"
          >
            <span className="mr-2">💬</span>
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
