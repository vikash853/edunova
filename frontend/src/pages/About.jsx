import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';   

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50/40 to-white dark:from-gray-950 dark:via-indigo-950/30 dark:to-gray-950 overflow-hidden">
      {/* Animated Background Orb */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 tracking-tight">
            About EduNova
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light">
            A platform born from passion — to make quality education accessible, personalized, and career-focused for every learner in India and beyond.
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              EduNova was created with one simple belief: **education should not be a privilege — it should be a right**. We exist to break barriers, remove gatekeepers, and give every student — whether in a small town in Uttar Pradesh or a metro city — access to world-class learning that actually leads to real jobs and real growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              To become India's most trusted and loved learning platform — where every course is practical, every certificate has real value, and every student feels seen, supported, and empowered to build the career of their dreams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section – Yeh sabse important hai (tumhe bechna hai) */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-transparent to-indigo-50/30 dark:to-indigo-950/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meet the Founder
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              The person who dreamed, built, and is still fighting to make EduNova real.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Photo + Badges */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-4 border-white/20 dark:border-gray-800/50 shadow-2xl">
                <img
                  src="images/vikash.jpeg"
                  alt="Vikash Shukla - Founder EduNova"
                  className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
              >
                <Sparkles size={20} />
                <span className="font-bold">Founder & Builder</span>
              </motion.div>
            </motion.div>

            {/* Right: Story Paragraphs */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <p>
                Hi, I’m <span className="font-bold text-indigo-600 dark:text-indigo-400">Vikash Shukla</span> — a self-taught developer from Lucknow who refused to believe that good education is only for those who can afford expensive coaching or foreign degrees.
              </p>

              <p>
                I’ve been exactly where most of you are right now — confused, underconfident, scrolling job portals with zero calls, watching tutorials at 2 AM, and thinking “ye sab mere liye nahi hai”. But I refused to give up. I built real projects, failed a hundred times, got rejected, learned again, and finally cracked interviews at good companies.
              </p>

              <p>
                EduNova is not just another course platform for me — it’s personal. I created it so that no student from a small city, no one without money for coaching, no one who feels “main toh backward se hoon” ever has to feel that education is out of reach. Every course here is made with real job skills in mind, every certificate actually means something, and every student gets the support I wish I had.
              </p>

              <p className="font-medium text-xl text-indigo-600 dark:text-indigo-400">
                If I can go from zero to building something people use every day — so can you.
              </p>

              <div className="pt-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/40"
                  onClick={() => window.open('https://x.com/vikashshuk37814', '_blank')}
                >
                  Connect with me on X → @vikashshuk37814
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center bg-gradient-to-t from-indigo-600/10 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to change your future?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
            Join thousands of learners who are already taking control of their careers.
          </p>
          <Button
            size="xl"
            className="text-xl px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-indigo-500/50"
            onClick={() => window.location.href = '/courses'}
          >
            Explore Courses Now →
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default About;