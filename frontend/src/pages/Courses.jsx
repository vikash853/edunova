import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';

const dummyCourses = [
  { id: 1, title: "Advanced React & TypeScript Masterclass", instructor: "Sarah Chen", price: 89, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" },
  { id: 2, title: "UI/UX Design System in Figma", instructor: "Alex Rivera", price: 99, image: "https://images.unsplash.com/photo-1559028012-481c04fa06cb?w=800" },
  { id: 3, title: "Python for Data Science & AI", instructor: "Dr. James Lee", price: 79, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800" },
  { id: 4, title: "Full-Stack JavaScript Bootcamp", instructor: "Michael Brown", price: 119, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" },
  { id: 5, title: "Machine Learning A-Z", instructor: "Emily Wong", price: 129, image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800" },
  { id: 6, title: "Digital Marketing Mastery", instructor: "Priya Sharma", price: 69, image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=800" },
  { id: 7, title: "3D Animation in Blender", instructor: "Rahul Verma", price: 89, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800" },
  { id: 8, title: "Cybersecurity Fundamentals", instructor: "Ankit Singh", price: 95, image: "https://images.unsplash.com/photo-1555949963-aa79d0ebc8fb?w=800" },
  { id: 9, title: "Graphic Design for Beginners", instructor: "Neha Kapoor", price: 59, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800" },
  { id: 10, title: "Blockchain & Web3 Development", instructor: "Rohan Patel", price: 149, image: "https://images.unsplash.com/photo-1639762681485-8b3f2b5d0e3e?w=800" },
  { id: 11, title: "Mobile App Development with Flutter", instructor: "Aisha Khan", price: 109, image: "https://images.unsplash.com/photo-1512941675423-6b1e6a25f269?w=800" },
  { id: 12, title: "Cloud Computing with AWS", instructor: "Vikram Malhotra", price: 129, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800" },
];

const Courses = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // Simulate API
  }, []);

  return (
    <div className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="text-center mb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
        >
          Explore Our Courses
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Premium learning experiences crafted by industry experts
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[480px] rounded-3xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
        >
          {dummyCourses.map((course) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.04, y: -12 }}
              className="group bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-glow hover:border-indigo-500/50"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-sm font-medium">by {course.instructor}</p>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ${course.price}
                  </span>
                  <Button size="md">Enroll Now</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Courses;