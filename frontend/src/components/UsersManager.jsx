import { useEffect, useState } from 'react';
import { fetchUsers, updateUsers } from '../api';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [newSteamID, setNewSteamID] = useState('');
  const [savingRow, setSavingRow] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await fetchUsers();
    const combined = [
      ...new Set([...data.permitted, ...data.admins])
    ].map((id) => ({
      steamID: id,
      isAdmin: data.admins.includes(id)
    }));

    setUsers(combined);
  }

  async function saveImmediately(updatedUsers, rowSteamID = null) {
    const permitted = updatedUsers.map(u => u.steamID);
    const admins = updatedUsers.filter(u => u.isAdmin).map(u => u.steamID);

    try {
      if (rowSteamID) setSavingRow(rowSteamID);
      await updateUsers(permitted, admins);
      setUsers(updatedUsers); // update local state
      setMessage('✅ Changes saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ Failed to save.');
      await loadUsers(); // fallback to reload if save fails
    } finally {
      setSavingRow(null);
    }
  }

  async function handlePromoteDemote(steamID) {
    const updated = users.map((user) => {
      if (user.steamID === steamID) {
        return { ...user, isAdmin: !user.isAdmin };
      }
      return user;
    });

    setUsers(updated);
    await saveImmediately(updated, steamID);
  }

  async function handleAddUser(e) {
    e.preventDefault();
    if (!newSteamID.trim()) return;

    const updated = [...users, { steamID: newSteamID.trim(), isAdmin: false }];
    setUsers(updated);
    setNewSteamID('');
    await saveImmediately(updated);
  }

  async function handleDelete(steamID) {
    if (confirm(`Really remove ${steamID}?`)) {
      const updated = users.filter((user) => user.steamID !== steamID);
      setUsers(updated);
      try {
        await saveImmediately(updated);
      } catch (err) {
        await loadUsers();
      }
    }
  }

  return (
    <div>
      <h2>Manage Users</h2>

      {message && <div style={styles.message}>{message}</div>}

      <form onSubmit={handleAddUser} style={styles.form}>
        <input 
          type="text"
          value={newSteamID}
          onChange={(e) => setNewSteamID(e.target.value)}
          placeholder="New SteamID"
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Add User</button>
      </form>

      {users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No users yet. Add one!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.colSteamID}>SteamID</th>
              <th style={styles.colAdmin}>Admin</th>
              <th style={styles.colActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(user => user.steamID).map((user) => (
              <tr key={user.steamID}>
                <td style={styles.colSteamID}>{user.steamID}</td>
                <td style={styles.colAdmin}>
                  {user.isAdmin ? '✅' : ''}
                </td>
                <td style={styles.colActions}>
                  <button 
                    onClick={() => handlePromoteDemote(user.steamID)} 
                    style={styles.actionButton}
                    disabled={savingRow === user.steamID}
                  >
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => handleDelete(user.steamID)} 
                    style={styles.deleteButton}
                    disabled={savingRow === user.steamID}
                  >
                    🗑️
                  </button>
                  {savingRow === user.steamID && (
                    <span style={styles.spinner}>⏳</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  message: {
    marginBottom: '1rem',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: '#e6f7ff',
    color: '#0050b3',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  addButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#52c41a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '2rem'
  },
  colSteamID: {
    textAlign: 'left',
    width: '50%',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee'
  },
  colAdmin: {
    textAlign: 'center',
    width: '15%',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee'
  },
  colActions: {
    textAlign: 'center',
    width: '35%',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee'
  },
  actionButton: {
    padding: '0.25rem 0.5rem',
    marginRight: '0.5rem',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#ff4d4f',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  spinner: {
    marginLeft: '0.5rem'
  }
};
