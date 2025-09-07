'use client';
import { useEffect, useState } from 'react';

export default function UserManagementPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/user');
    const data = await res.json();
    if (data.success) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateRole = async (email, newRole) => {
    await fetch('/api/admin/users/update-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: newRole })
    });
    setToast(`Role updated to ${newRole} for ${email}`);
    fetchUsers();
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter(u => !roleFilter || u.role === roleFilter);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>User Management</h3>

      <select onChange={(e) => setRoleFilter(e.target.value)} value={roleFilter} style={{ marginBottom: '1rem' }}>
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>

      {toast && <p style={{ color: '#0078d4', marginBottom: '1rem' }}>{toast}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : filtered.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.email} style={{ borderBottom: '1px solid #eee' }}>
                <td>{u.email}</td>
                <td>{u.name || '—'}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  {['user', 'moderator', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => updateRole(u.email, role)}
                      disabled={u.role === role}
                      style={{
                        marginRight: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: u.role === role ? '#ccc' : '#0078d4',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: u.role === role ? 'default' : 'pointer'
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
