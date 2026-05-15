import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../Navbar";

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

      <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white py-16 shadow-lg">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">EduNova</h3>
              <p className="text-indigo-200 text-base max-w-xs">
                Empowering learners with world-class courses. Join the future of education.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Platform</h4>
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><Link to="/courses" className="hover:text-white transition duration-300">Browse Courses</Link></li>
                <li><Link to="/faculty" className="hover:text-white transition duration-300">Our Faculty</Link></li>
                <li><Link to="/about" className="hover:text-white transition duration-300">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Support</h4>
              {/* FIX: pages that don't exist yet are marked — add real routes before launch */}
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><Link to="/contact" className="hover:text-white transition duration-300">Contact Us</Link></li>
                <li><span className="text-indigo-300 cursor-default">FAQ (coming soon)</span></li>
                <li><span className="text-indigo-300 cursor-default">Community (coming soon)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-indigo-100 text-base">
                <li><span className="text-indigo-300 cursor-default">Privacy Policy (coming soon)</span></li>
                <li><span className="text-indigo-300 cursor-default">Terms of Service (coming soon)</span></li>
              </ul>
              <p className="mt-8 text-sm text-indigo-300">
                © {new Date().getFullYear()} EduNova. All rights reserved.<br />
                Made with ❤️ by Vikash Shukla
              </p>
            </div>
          </div>

          <div className="border-t border-indigo-700/50 mt-12 pt-8 text-center text-sm text-indigo-200">
            Built in Lucknow, Uttar Pradesh — Powering education globally since 2026.
          </div>
        </div>
      </footer>
    </>
  );
};

export default AppLayout;