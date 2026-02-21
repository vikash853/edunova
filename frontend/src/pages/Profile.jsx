import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'); // default
  const [preview, setPreview] = useState(profilePhoto);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePhoto(file); // for upload later
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email };
    if (password) data.password = password;

    // Photo upload (mock – later send to backend)
    if (profilePhoto !== user?.photo) {
      // In real app: use FormData and api.post('/profile/photo', formData)
      console.log('Uploading new photo...');
      // Mock save
      updateUser({ ...data, photo: preview });
    } else {
      updateUser(data);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header with Photo */}
        <div className="text-center mb-12">
          <div className="relative inline-block group">
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl transition-transform group-hover:scale-105"
            />
            <label className="absolute bottom-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {user?.name || 'Your Profile'}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{user?.email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-10">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <Button size="lg" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;