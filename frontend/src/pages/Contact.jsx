import React from 'react';

const Contact = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700 dark:text-indigo-300">
        Contact Us
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
          We'd love to hear from you! Whether you have a question, feedback, or just want to say hi.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              rows="5"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="How can we help you today?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-center text-gray-600 dark:text-gray-400">
          <p>Or email us directly at: <strong>support@edunova.com</strong></p>
          <p className="mt-2">We usually reply within 24 hours.</p>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;