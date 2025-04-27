const API_BASE = '/';

export async function fetchMods() {
  const res = await fetch(`${API_BASE}mods`);
  return res.json();
}

export async function uploadMod(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}mods`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Failed to upload mod');
}

export async function deleteMod(modname) {
  const res = await fetch(`${API_BASE}mods/${modname}`, {
    method: 'DELETE'
  });

  if (!res.ok) throw new Error('Failed to delete mod');
}

export async function fetchUsers() {
    const res = await fetch(`/users`);
    return res.json();
  }
  
  export async function addUser(steamID, isAdmin) {
    const res = await fetch(`/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steam_id: steamID, admin: isAdmin })
    });
  
    if (!res.ok) throw new Error('Failed to add user');
  }
  
  export async function deleteUser(steamID) {
    const res = await fetch(`/users/${steamID}`, {
      method: 'DELETE'
    });
  
    if (!res.ok) throw new Error('Failed to delete user');
  }

  export async function updateUsers(permitted, admins) {
    const res = await fetch(`/users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permitted, admins })
    });
  
    if (!res.ok) throw new Error('Failed to update users');
  }
  