'use client';
import { useEffect, useState } from 'react';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.users);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const updateRole = async (email, role) => {
    const res = await fetch('/api/admin/users/update-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });

    const data = await res.json();
    if (data.success) {
      setUsers(users.map(u => u.email === email ? { ...u, role } : u));
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading users...</p>;

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Admin Dashboard: User Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '0.5rem' }}>Email</th>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Role</th>
            <th style={{ padding: '0.5rem' }}>Created</th>
            <th style={{ padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{u.email}</td>
              <td style={{ padding: '0.5rem' }}>{u.name || '—'}</td>
              <td style={{ padding: '0.5rem' }}>{u.role}</td>
              <td style={{ padding: '0.5rem' }}>{u.created_at}</td>
              <td style={{ padding: '0.5rem' }}>
                <select
                  value={u.role}
                  onChange={e => updateRole(u.email, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="moderator">moderator</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}