import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <h2>Manage Users</h2>
      {users.map(u => (
        <div key={u._id}>
          {u.name} - {u.email}
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
