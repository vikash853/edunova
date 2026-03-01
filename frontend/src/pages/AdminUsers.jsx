import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminUsers = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/users');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  if (authLoading || loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (error) return <p className="text-red-600 text-center py-10 text-xl">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-12">
          Manage All Users
        </h1>

        {users.length === 0 ? (
          <div className="text-center py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              No users found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The system is empty or there was an issue loading users.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {u.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {u.name || 'Unnamed User'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{u.email}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Role:</span>{' '}
                    <span className={`capitalize font-semibold ${u.role === 'admin' ? 'text-purple-600' : u.role === 'instructor' ? 'text-blue-600' : 'text-green-600'}`}>
                      {u.role}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Joined:</span>{' '}
                    {new Date(u.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {u.role === 'student' && (
                    <p>
                      <span className="font-medium">Enrolled Courses:</span> Coming soon...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;