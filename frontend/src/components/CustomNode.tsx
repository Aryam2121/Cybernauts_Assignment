import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import './CustomNode.css';

interface NodeData {
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

export const HighScoreNode = memo(({ data }: NodeProps<NodeData>) => {
  return (
    <div className="custom-node high-score-node">
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

export const LowScoreNode = memo(({ data }: NodeProps<NodeData>) => {
  return (
    <div className="custom-node low-score-node">
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
