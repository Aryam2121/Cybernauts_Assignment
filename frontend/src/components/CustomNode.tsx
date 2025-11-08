import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useApp } from '../context/AppContext';
import './CustomNode.css';

interface NodeData {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

export const HighScoreNode = memo(({ data, id }: NodeProps<NodeData>) => {
  const { addHobbyToUser } = useApp();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    const hobby = event.dataTransfer.getData('hobby');
    if (hobby && id) {
      await addHobbyToUser(id, hobby);
    }
  };

  return (
    <div 
      className={`custom-node high-score-node ${isDraggingOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header">
        <h3>{data.username}</h3>
        <span className="age-badge">{data.age} yrs</span>
      </div>
      <div className="node-body">
        <div className="score">
          ⭐ Score: {data.popularityScore.toFixed(1)}
        </div>
        <div className="hobbies">
          {data.hobbies.slice(0, 3).map((hobby, idx) => (
            <span key={idx} className="hobby-tag">
              {hobby}
            </span>
          ))}
          {data.hobbies.length > 3 && (
            <span className="hobby-tag more">+{data.hobbies.length - 3}</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export const LowScoreNode = memo(({ data, id }: NodeProps<NodeData>) => {
  const { addHobbyToUser } = useApp();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    
    const hobby = event.dataTransfer.getData('hobby');
    if (hobby && id) {
      await addHobbyToUser(id, hobby);
    }
  };

  return (
    <div 
      className={`custom-node low-score-node ${isDraggingOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-header">
        <h3>{data.username}</h3>
        <span className="age-badge">{data.age} yrs</span>
      </div>
      <div className="node-body">
        <div className="score">
          ⭐ Score: {data.popularityScore.toFixed(1)}
        </div>
        <div className="hobbies">
          {data.hobbies.slice(0, 3).map((hobby, idx) => (
            <span key={idx} className="hobby-tag">
              {hobby}
            </span>
          ))}
          {data.hobbies.length > 3 && (
            <span className="hobby-tag more">+{data.hobbies.length - 3}</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

HighScoreNode.displayName = 'HighScoreNode';
LowScoreNode.displayName = 'LowScoreNode';
