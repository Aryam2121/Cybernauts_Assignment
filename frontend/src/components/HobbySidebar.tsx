import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './HobbySidebar.css';

export default function HobbySidebar() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedHobby, setDraggedHobby] = useState<string | null>(null);

  const filteredHobbies = state.allHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (event: React.DragEvent, hobby: string) => {
    setDraggedHobby(hobby);
    event.dataTransfer.setData('hobby', hobby);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedHobby(null);
  };

  return (
    <div className="hobby-sidebar">
      <div className="sidebar-header">
        <h2>🎯 Hobbies</h2>
        <p>Drag hobbies onto users</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search hobbies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="hobbies-list">
        {filteredHobbies.map((hobby) => (
          <div
            key={hobby}
            className={`hobby-item ${draggedHobby === hobby ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, hobby)}
            onDragEnd={handleDragEnd}
          >
            {hobby}
          </div>
        ))}
      </div>

      {filteredHobbies.length === 0 && (
        <div className="no-results">No hobbies found</div>
      )}
    </div>
  );
}
