import { useState } from 'react';
import ModList from './components/ModList';
import UploadForm from './components/UploadForm';
import UsersManager from './components/UsersManager'; // 👈 New!

function App() {
  const [activeTab, setActiveTab] = useState('mods');

  function handleModsChange() {
    // placeholder if you want refresh hooks
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Valheim Server Manager</h1>

      <div style={styles.tabs}>
        <button 
          onClick={() => setActiveTab('mods')} 
          style={activeTab === 'mods' ? styles.activeTab : styles.tab}
        >
          📦 Mods
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={activeTab === 'users' ? styles.activeTab : styles.tab}
        >
          👥 Users
        </button>
      </div>

      <div style={styles.tabContent}>
        {activeTab === 'mods' && (
          <>
            <UploadForm onModsChange={handleModsChange} />
            <ModList onModsChange={handleModsChange} />
          </>
        )}
        {activeTab === 'users' && (
          <UsersManager />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f0f4f8',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    gap: '1rem'
  },
  tab: {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer'
  },
  activeTab: {
    padding: '0.5rem 1rem',
    border: '2px solid #1890ff',
    borderRadius: '6px',
    background: '#e6f7ff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  tabContent: {
    marginTop: '1rem'
  }
};

export default App;
