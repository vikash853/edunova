// src/components/layout/AppLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Fixed: Added this
import Navbar from "../Navbar"; // Assuming path is correct

const AppLayout = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Premium Footer - Bigger, Better Look */}
      <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white py-16 shadow-lg">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">EduNova</h3>
              <p className="text-indigo-200 text-base max-w-xs">
                Empowering learners with world-class courses. Join the future of education.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><Link to="/courses" className="hover:text-white transition duration-300">Browse Courses</Link></li>
                <li><Link to="/faculty" className="hover:text-white transition duration-300">Our Faculty</Link></li>
                <li><Link to="/about" className="hover:text-white transition duration-300">About Us</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><Link to="/contact" className="hover:text-white transition duration-300">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white transition duration-300">FAQ</Link></li> {/* Add FAQ page if needed */}
                <li><Link to="/community" className="hover:text-white transition duration-300">Community</Link></li> {/* Optional */}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><Link to="/privacy" className="hover:text-white transition duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition duration-300">Terms of Service</Link></li>
              </ul>
              <p className="mt-8 text-sm text-indigo-300">
                © {new Date().getFullYear()} EduNova. All rights reserved.<br />
                Made with ❤️ by Vikash Shukla
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-indigo-700/50 mt-12 pt-8 text-center text-sm text-indigo-200">
            Built in Lucknow, Uttar Pradesh — Powering education globally since 2026.
          </div>
        </div>
      </footer>
    </>
  );
};

export default AppLayout;