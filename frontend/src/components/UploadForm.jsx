import { useState } from 'react';
import { uploadMod } from '../api';

export default function UploadForm({ onModsChange }) {
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    try {
      await uploadMod(file);
      setFile(null);
      e.target.reset();
      onModsChange();
    } catch (err) {
      alert('Upload failed');
    }
  }

  return (
    <div>
      <h2>Upload New Mod</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          style={styles.input}
        />
        <button type="submit" style={styles.uploadButton}>Upload</button>
      </form>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  uploadButton: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
