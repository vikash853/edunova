import React, { useState } from 'react';
import api from '../../api';
import Button from '../../components/common/Button'; // adjust path if needed

const AddCourse = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    image: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: '',
    lessons: 0,
    rating: 4.8,
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: 0,
      image: '',
      category: 'Web Development',
      level: 'Beginner',
      duration: '',
      lessons: 0,
      rating: 4.8,
      featured: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/courses', form);
      setMessage({ type: 'success', text: 'Course added successfully!' });
      resetForm();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add course',
      });
    } finally {
      setLoading(false);
    }
  };

  // Pre-defined 15 professional courses
  const demoCourses = [
    {
      title: "Complete Web Development Bootcamp 2025 – HTML, CSS, JS, React, Node.js",
      description: "Zero to full-stack hero. Build 20+ real-world projects including e-commerce, social media clone, and admin dashboards.",
      price: 2499,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      category: "Web Development",
      level: "Beginner",
      duration: "48h",
      lessons: 145,
      rating: 4.9,
      featured: true,
    },
    {
      title: "Machine Learning A-Z 2025 – Python, TensorFlow, PyTorch & Real Projects",
      description: "From regression to deep learning, NLP, computer vision. Includes Kaggle competitions and deployment.",
      price: 2999,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "AI & Machine Learning",
      level: "Intermediate",
      duration: "56h",
      lessons: 180,
      rating: 4.8,
      featured: true,
    },
    {
      title: "UI/UX Design Masterclass – Figma, Adobe XD, Prototyping & Handoff",
      description: "Learn modern design principles, user research, wireframing, high-fidelity prototypes, and developer handoff.",
      price: 1799,
      image: "https://images.unsplash.com/photo-1559028012-481c04fa06cb?w=800",
      category: "UI/UX Design",
      level: "Beginner",
      duration: "28h",
      lessons: 85,
      rating: 4.7,
    },
    {
      title: "Python Complete Course – From Zero to Data Science & Automation",
      description: "Master Python basics to advanced topics: OOP, web scraping, automation, pandas, matplotlib, Flask.",
      price: 1999,
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      category: "Python",
      level: "Beginner",
      duration: "38h",
      lessons: 110,
      rating: 4.8,
    },
    {
      title: "Data Science & Analytics Bootcamp – Pandas, SQL, Power BI, Tableau",
      description: "End-to-end data analysis: cleaning, visualization, SQL queries, dashboards, storytelling with data.",
      price: 2499,
      image: "https://images.unsplash.com/photo-1551288049-b1f7c97a89da?w=800",
      category: "Data Science",
      level: "Intermediate",
      duration: "42h",
      lessons: 95,
      rating: 4.7,
    },
    {
      title: "Flutter & Dart – Build Beautiful iOS & Android Apps 2025",
      description: "Cross-platform mobile development. Build 10+ apps including e-commerce, chat, and fitness tracker.",
      price: 2299,
      image: "https://images.unsplash.com/photo-1551650975-60cb5d9b0c83?w=800",
      category: "Mobile Development",
      level: "Beginner",
      duration: "35h",
      lessons: 90,
      rating: 4.8,
    },
    {
      title: "AWS Certified Solutions Architect – Associate 2025 (Hands-on)",
      description: "Full AWS certification prep: VPC, EC2, S3, Lambda, RDS, IAM, CloudFormation, real-world labs.",
      price: 3499,
      image: "https://images.unsplash.com/photo-1516321310764-8a2380f89148?w=800",
      category: "DevOps & Cloud",
      level: "Intermediate",
      duration: "40h",
      lessons: 120,
      rating: 4.9,
    },
    {
      title: "Complete Ethical Hacking & Cybersecurity Course 2025",
      description: "Learn penetration testing, Kali Linux, network security, web app vulnerabilities, bug bounty hunting.",
      price: 2799,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      category: "Cybersecurity",
      level: "Intermediate",
      duration: "45h",
      lessons: 130,
      rating: 4.8,
    },
    {
      title: "Blockchain & Web3 Development – Solidity, Ethereum, Smart Contracts",
      description: "Build DApps, NFTs, DeFi protocols. Includes Hardhat, Truffle, OpenZeppelin, and testnets.",
      price: 3199,
      image: "https://images.unsplash.com/photo-1639762681485-8b6c3b7d8c4e?w=800",
      category: "Blockchain",
      level: "Advanced",
      duration: "38h",
      lessons: 105,
      rating: 4.7,
    },
    {
      title: "Advanced JavaScript – Deep Dive into Modern JS (ES6+)",
      description: "Closures, prototypes, async/await, modules, performance, design patterns, and real projects.",
      price: 1499,
      image: "https://images.unsplash.com/photo-1555066931-bf19c9d1087f?w=800",
      category: "Web Development",
      level: "Intermediate",
      duration: "22h",
      lessons: 70,
      rating: 4.9,
    },
    {
      title: "Generative AI & Prompt Engineering Masterclass – ChatGPT, Midjourney",
      description: "Learn to write perfect prompts, build AI apps, automate workflows, and create content at scale.",
      price: 0,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "AI & Machine Learning",
      level: "Beginner",
      duration: "15h",
      lessons: 50,
      rating: 4.8,
      featured: true,
    },
    {
      title: "React Native Advanced – Build Real Mobile Apps 2025",
      description: "Expo, navigation, animations, offline support, push notifications, and deployment to App Store & Play Store.",
      price: 1999,
      image: "https://images.unsplash.com/photo-1551650975-60cb5d9b0c83?w=800",
      category: "Mobile Development",
      level: "Intermediate",
      duration: "30h",
      lessons: 85,
      rating: 4.7,
    },
    {
      title: "DevOps Bootcamp – Docker, Kubernetes, CI/CD, AWS, Terraform",
      description: "Automate infrastructure, deploy scalable apps, set up monitoring, and master modern DevOps tools.",
      price: 2899,
      image: "https://images.unsplash.com/photo-1516321310764-8a2380f89148?w=800",
      category: "DevOps & Cloud",
      level: "Intermediate",
      duration: "40h",
      lessons: 115,
      rating: 4.8,
    },
    {
      title: "Full-Stack MERN Project Course – Build 10 Real Apps",
      description: "E-commerce, social media, chat app, job portal, blog, dashboard – complete source code included.",
      price: 1999,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      category: "Web Development",
      level: "Intermediate",
      duration: "50h",
      lessons: 140,
      rating: 4.9,
    },
    {
      title: "Figma to Webflow – Design to Live Website Masterclass",
      description: "Convert Figma designs to responsive Webflow sites. Learn interactions, CMS, animations, and SEO.",
      price: 1599,
      image: "https://images.unsplash.com/photo-1559028012-481c04fa06cb?w=800",
      category: "UI/UX Design",
      level: "Intermediate",
      duration: "18h",
      lessons: 55,
      rating: 4.7,
    },
  ];

  // Bulk add all 15 demo courses
  const addAllDemoCourses = async () => {
    setLoading(true);
    setMessage(null);

    try {
      for (const course of demoCourses) {
        await api.post('/courses', course);
      }
      setMessage({
        type: 'success',
        text: 'All 15 demo courses added successfully!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to add some courses: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl mt-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Add New Course
      </h1>

      {/* Bulk Add Button */}
      <div className="mb-10 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={addAllDemoCourses}
          disabled={loading}
          className="text-lg px-10 py-4 shadow-lg hover:shadow-indigo-500/40"
        >
          {loading ? 'Adding 15 Courses...' : 'Add All 15 Demo Courses (Quick Setup)'}
        </Button>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Use this for testing/demo. Courses will appear instantly on the Courses page.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-8 text-center ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title *</label>
          <input
            name="title"
            placeholder="e.g. Advanced React & TypeScript 2025"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
          <textarea
            name="description"
            placeholder="Detailed course description..."
            value={form.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (0 for free)</label>
            <input
              name="price"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
            <input
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option>Web Development</option>
              <option>AI & Machine Learning</option>
              <option>UI/UX Design</option>
              <option>Python</option>
              <option>Data Science</option>
              <option>Mobile Development</option>
              <option>DevOps & Cloud</option>
              <option>Cybersecurity</option>
              <option>Blockchain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (e.g. 32h)</label>
            <input
              name="duration"
              placeholder="32h"
              value={form.duration}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lessons</label>
            <input
              name="lessons"
              type="number"
              placeholder="45"
              value={form.lessons}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating (0-5)</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="4.8"
              value={form.rating}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-5 h-5 text-indigo-600 rounded"
          />
          <span className="text-gray-700 dark:text-gray-300">Mark as Featured Course</span>
        </label>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-indigo-500/40"
          disabled={loading}
        >
          {loading ? 'Adding Course...' : 'Add Course'}
        </Button>
      </form>
    </div>
  );
};

export default AddCourse;