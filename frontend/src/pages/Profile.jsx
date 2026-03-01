import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Camera, Loader2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // npm install react-hot-toast

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null); // File object for upload
  const [preview, setPreview] = useState(user?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
      setPreview(user.photo || preview);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Photo size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only images allowed');
        return;
      }

      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      if (profilePhoto) data.append('photo', profilePhoto);

      await updateUser(data); // Assuming updateUser handles FormData

      toast.success('Profile updated successfully!');
      setProfilePhoto(null); // Reset file input
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/20 dark:to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block group mx-auto">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl transition-all group-hover:scale-105 group-hover:shadow-indigo-500/30">
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Camera icon overlay */}
            <label className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <Camera size={20} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {formData.name || user?.name || 'Your Profile'}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{formData.email || user?.email}</p>
        </div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 md:p-12 space-y-8"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-5 py-4 rounded-2xl border ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all`}
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-5 py-4 rounded-2xl border ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all`}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className={`w-full px-5 py-4 rounded-2xl border ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all`}
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className={`w-full text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-wait' : 'hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </Button>

          {/* Success/Error Toast Placeholder */}
          {/* react-hot-toast will show toasts automatically */}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Profile;