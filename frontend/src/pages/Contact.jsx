// src/pages/Contact.jsx
import React, { useState } from 'react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submit - replace with api.post('/contact')
    console.log({ name, email, message });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Reset after 3s
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700 dark:text-indigo-300">
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
        Have questions or feedback? Reach out — we're here to help!
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <textarea
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="How can we assist you?"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
        >
          Send Message
        </button>
      </form>
      {submitted && <p className="mt-4 text-center text-green-500">Message sent successfully! (Mock)</p>}
      <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
        <p>Email: support@edunova.com</p>
        <p className="mt-2">Location: Lucknow, Uttar Pradesh, India</p>
        <p className="mt-2">We respond within 24-48 hours.</p>
      </div>
    </div>
  );
};

export default Contact;