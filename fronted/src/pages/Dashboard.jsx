import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your role: <span className="font-semibold capitalize">{user?.role}</span>
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Quick stats / cards - customize later */}
              <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-indigo-700 truncate">Account Status</dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-900">Active</dd>
                </div>
              </div>

              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-green-700 truncate">Last Login</dt>
                  <dd className="mt-1 text-xl font-semibold text-green-900">
                    {new Date().toLocaleDateString()}
                  </dd>
                </div>
              </div>

              <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-purple-700 truncate">Role Privileges</dt>
                  <dd className="mt-1 text-lg text-purple-900">
                    {user?.role === 'admin' ? 'Full access' : user?.role === 'instructor' ? 'Create & manage courses' : 'Enroll & learn'}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;