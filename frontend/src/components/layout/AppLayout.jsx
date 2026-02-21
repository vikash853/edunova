import React from 'react';
import Navbar from "../Navbar";  // ← Go up one level with ..

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
        <footer className="mt-24 py-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
  <p>&copy; 2026 EduNova. All rights reserved. Made with ❤️ by Vikash Shukla</p>
  <div className="mt-4 space-x-6">
    <Link to="/about" className="hover:text-indigo-600">About</Link>
    <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
    <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
  </div>
</footer>
    </>
  );
};

export default AppLayout;