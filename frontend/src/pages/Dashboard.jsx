import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const studentWidgets = [
    { title: "Active Courses", value: "4", subtitle: "In progress" },
    { title: "Completion Rate", value: "78%", subtitle: "This month" },
    { title: "Certificates Earned", value: "2", subtitle: "Lifetime" },
  ];

  return (
    <div className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {studentWidgets.map((widget, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {widget.title}
            </h3>
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {widget.value}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{widget.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Button size="lg" onClick={() => window.location.href = '/courses'}>
          Browse More Courses
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;