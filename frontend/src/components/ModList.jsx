import { useEffect, useState } from 'react';
import { fetchMods, deleteMod } from '../api';

export default function ModList({ onModsChange }) {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    loadMods();
  }, []);

  async function loadMods() {
    const mods = await fetchMods();
    setMods(mods);
  }

  async function handleDelete(modname) {
    if (confirm(`Delete ${modname}?`)) {
      await deleteMod(modname);
      await loadMods();
      onModsChange();
    }
  }

  if (mods.length === 0) {
    return <p>No mods installed yet.</p>;
  }

  return (
    <div>
      <h2>Installed Mods</h2>
      <ul style={styles.list}>
        {mods.map((mod) => (
          <li key={mod} style={styles.listItem}>
            {mod}
            <button style={styles.deleteButton} onClick={() => handleDelete(mod)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#ff4d4f',
    fontSize: '1.2rem',
    cursor: 'pointer'
  }
};
