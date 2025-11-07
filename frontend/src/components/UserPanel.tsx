import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './UserPanel.css';

export default function UserPanel() {
  const { state, createUser, updateUser, deleteUser, unlinkUsers } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    hobbies: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseInt(formData.age);
    const hobbies = formData.hobbies
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    if (!formData.username || !age || age < 1 || age > 150) {
      alert('Please provide valid username and age (1-150)');
      return;
    }

    try {
      if (editingUser) {
        await updateUser(editingUser, formData.username, age, hobbies);
        setEditingUser(null);
      } else {
        await createUser(formData.username, age, hobbies);
      }
      setFormData({ username: '', age: '', hobbies: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      age: user.age.toString(),
      hobbies: user.hobbies.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUnlink = async (userId: string, friendId: string) => {
    try {
      await unlinkUsers(userId, friendId);
    } catch (error) {
      console.error('Error unlinking users:', error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: '', age: '', hobbies: '' });
  };

  return (
    <div className="user-panel">
      <div className="panel-header">
        <h2>👥 Users</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="user-form">
          <h3>{editingUser ? 'Edit User' : 'Create User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min={1}
                max={150}
              />
            </div>

            <div className="form-group">
              <label>Hobbies (comma-separated)</label>
              <input
                type="text"
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                placeholder="Reading, Gaming, Cooking"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        {state.loading && <div className="loading">Loading...</div>}
        
        {!state.loading && state.users.length === 0 && (
          <div className="empty-state">No users yet. Create one to get started!</div>
        )}

        {!state.loading &&
          state.users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h4>{user.username}</h4>
                <p className="user-age">{user.age} years old</p>
                <p className="user-score">⭐ Score: {user.popularityScore.toFixed(1)}</p>
                
                <div className="user-hobbies">
                  {user.hobbies.map((hobby, idx) => (
                    <span key={idx} className="hobby-badge">
                      {hobby}
                    </span>
                  ))}
                </div>

                {user.friends.length > 0 && (
                  <div className="user-friends">
                    <strong>Friends ({user.friends.length}):</strong>
                    {user.friends.map((friendId) => {
                      const friend = state.users.find((u) => u.id === friendId);
                      return friend ? (
                        <div key={friendId} className="friend-item">
                          <span>{friend.username}</span>
                          <button
                            className="btn-unlink"
                            onClick={() => handleUnlink(user.id, friendId)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="user-actions">
                <button className="btn-edit" onClick={() => handleEdit(user)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
