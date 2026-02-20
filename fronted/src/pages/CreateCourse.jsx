import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user.role !== 'instructor') {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses/create', { title, description, price });
      alert('Created!');
      navigate('/my-courses');
    } catch (err) {
      alert('Create failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Create Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 h-32" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" min="0" />
        <button type="submit" className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 transition">Create</button>
      </form>
    </div>
  );
};

export default CreateCourse;