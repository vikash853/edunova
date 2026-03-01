import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from '../components/common/Button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      navigate('/dashboard'); // or wherever after register
    } catch (err) {
      console.error('Register error:', err);
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-indigo-50/40 to-white dark:from-gray-950 dark:via-indigo-950/30 dark:to-gray-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden"
      >
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Join EduNova and start your learning journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-100/80 dark:bg-red-900/30 border border-red-400/50 rounded-xl text-red-700 dark:text-red-300 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder=" "
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 text-sm transition-all peer-focus:text-xs peer-focus:top-2 peer-focus:text-indigo-500 peer-placeholder-shown:text-base peer-placeholder-shown:top-4"
              >
                Full name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 text-sm transition-all peer-focus:text-xs peer-focus:top-2 peer-focus:text-indigo-500 peer-placeholder-shown:text-base peer-placeholder-shown:top-4"
              >
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all pr-12"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 text-sm transition-all peer-focus:text-xs peer-focus:top-2 peer-focus:text-indigo-500 peer-placeholder-shown:text-base peer-placeholder-shown:top-4"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Role Selector */}
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-transparent focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
              <label
                htmlFor="role"
                className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 text-sm transition-all peer-focus:text-xs peer-focus:top-2 peer-focus:text-indigo-500 peer-placeholder-shown:text-base peer-placeholder-shown:top-4"
              >
                Role
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? 'opacity-70 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
              >
                Sign in now
              </Link>
            </div>

            {/* Social register (optional) */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => alert('Google register coming soon!')}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;