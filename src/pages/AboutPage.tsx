import React from 'react';
import { Link } from 'react-router-dom';
import { Target, IndianRupee, Sparkles, Truck, Wrench, Handshake } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const AboutPage: React.FC = () => {
  usePageMeta('ABOUT');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">About Us</span>
      </nav>

      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About A1 Furniture Studio</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Crafting premium furniture for modern living spaces since our inception
        </p>
      </section>

      {/* Brand Story */}
      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-700 space-y-4">
            <p>
              A1 Furniture Studio was born from a passion for creating beautiful, functional furniture 
              that transforms houses into homes. We believe that every piece of furniture tells a story 
              and plays a vital role in shaping the spaces where life happens.
            </p>
            <p>
              Based in Mumbai, we've built our reputation on delivering factory-direct pricing without 
              compromising on quality. Our commitment to excellence has made us a trusted name among 
              homeowners, interior designers, and commercial buyers across urban India.
            </p>
            <p>
              From our humble beginnings as a small workshop, we've grown into a comprehensive furniture 
              solution provider, offering everything from ready-made pieces to custom-designed furniture 
              tailored to your exact specifications.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-12 bg-[#F5EFE6] py-12 -mx-4 px-4 rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We use only premium materials and employ skilled craftsmen to ensure every piece 
                meets our exacting standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <IndianRupee className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Factory Direct Pricing</h3>
              <p className="text-gray-600">
                By eliminating middlemen, we pass the savings directly to you, offering premium 
                furniture at competitive prices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Solutions</h3>
              <p className="text-gray-600">
                Every space is unique. We offer custom-made furniture designed to fit your specific 
                requirements and style preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reliable Delivery</h3>
              <p className="text-gray-600">
                Free delivery across Mumbai and reliable shipping to other locations, ensuring your 
                furniture arrives safely and on time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Care</h3>
              <p className="text-gray-600">
                Beyond sales, we offer repair, polish, and maintenance services to keep your 
                furniture looking beautiful for years.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#C6A75E]/10 flex items-center justify-center mb-4">
                <Handshake className="w-6 h-6 text-[#C6A75E]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Trust</h3>
              <p className="text-gray-600">
                We've built lasting relationships with our customers through transparency, 
                reliability, and exceptional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="mb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-[#C6A75E] pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Furniture Collection</h3>
              <p className="text-gray-700">
                Browse our extensive catalog featuring sofas, beds, dining tables, wardrobes, and 
                office furniture crafted from the finest materials.
              </p>
            </div>

            <div className="border-l-4 border-[#C6A75E] pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Manufacturing</h3>
              <p className="text-gray-700">
                Work with our design team to create bespoke furniture pieces that perfectly match 
                your vision and space requirements.
              </p>
            </div>

            <div className="border-l-4 border-[#C6A75E] pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Repair & Polish Services</h3>
              <p className="text-gray-700">
                Restore and rejuvenate your existing furniture with our professional repair and 
                polishing services.
              </p>
            </div>

            <div className="border-l-4 border-[#C6A75E] pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Office Solutions</h3>
              <p className="text-gray-700">
                Complete office furniture solutions for businesses of all sizes, from startups to 
                established enterprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-[#4A2F24] text-white py-12 -mx-4 px-4 rounded-2xl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 text-white/80">
            Explore our collection or get in touch to discuss your custom furniture needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-[#C6A75E] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#B0914A] transition-colors"
            >
              Browse Collection
            </a>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white/50 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#4A2F24] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
