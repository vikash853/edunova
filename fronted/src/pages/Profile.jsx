import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, email };
    if (password) data.password = password;
    updateUser(data);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        <input type="password" placeholder="New Password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Update</button>
      </form>
    </div>
  );
};

export default Profile;