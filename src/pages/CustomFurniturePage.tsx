import { useState, type FormEvent } from 'react';

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  requirements: string;
}

export default function CustomFurniturePage() {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    requirements: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<InquiryFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<InquiryFormData> = {};

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

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real application, this would send data to a backend
      console.log('Custom furniture inquiry submitted:', formData);
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          requirements: '',
        });
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Custom Furniture Services
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl">
          Bring your vision to life with our bespoke furniture design and manufacturing services. 
          We create unique, handcrafted pieces tailored to your exact specifications, space, and style preferences.
        </p>
      </div>

      {/* Services Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Choose Custom Furniture?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Perfect fit for your space and dimensions</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Choose your preferred materials, finishes, and colors</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Unique designs that reflect your personal style</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Premium quality craftsmanship</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">✓</span>
              <span>Factory-direct pricing with no middlemen</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Custom Services
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span><strong>Living Room:</strong> Sofas, TV units, coffee tables, display cabinets</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span><strong>Bedroom:</strong> Beds, wardrobes, dressing tables, side tables</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span><strong>Dining:</strong> Dining tables, chairs, buffet units, bar cabinets</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span><strong>Office:</strong> Desks, bookshelves, conference tables, storage</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span><strong>Commercial:</strong> Restaurant furniture, hotel furniture, retail displays</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Our Custom Furniture Process
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-amber-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
            <p className="text-sm text-gray-600">
              Share your requirements, dimensions, and design preferences
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-amber-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Design</h3>
            <p className="text-sm text-gray-600">
              We create detailed designs and 3D renderings for your approval
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manufacturing</h3>
            <p className="text-sm text-gray-600">
              Expert craftsmen build your furniture with premium materials
            </p>
          </div>
          <div className="text-center">
            <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-amber-600">4</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
            <p className="text-sm text-gray-600">
              We deliver and install your custom furniture at your location
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Request a Custom Furniture Quote
        </h2>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Thank You for Your Inquiry!
            </h3>
            <p className="text-gray-700">
              We have received your custom furniture request. Our team will review your requirements 
              and contact you within 24-48 hours to discuss your project in detail.
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Your Requirements *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.requirements ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please describe your custom furniture requirements including:&#10;- Type of furniture needed&#10;- Dimensions and space measurements&#10;- Preferred materials and finishes&#10;- Design style and color preferences&#10;- Budget range&#10;- Timeline"
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Submit Inquiry
            </button>

            <p className="text-sm text-gray-600 text-center">
              * Required fields. We respect your privacy and will never share your information.
            </p>
          </form>
        )}
      </div>

      {/* Contact Information */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Have Questions? Contact Us Directly
        </h3>
        <div className="flex flex-wrap justify-center gap-6 text-gray-700">
          <a href="tel:+919876543210" className="flex items-center hover:text-amber-600">
            <span className="mr-2">📞</span>
            <span>+91 98765 43210</span>
          </a>
          <a href="mailto:custom@a1furniture.com" className="flex items-center hover:text-amber-600">
            <span className="mr-2">✉️</span>
            <span>custom@a1furniture.com</span>
          </a>
          <a
            href="https://wa.me/919876543210?text=I'm interested in custom furniture"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-amber-600"
          >
            <span className="mr-2">💬</span>
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
