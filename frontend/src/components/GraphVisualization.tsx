import { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeDragHandler,
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useApp } from '../context/AppContext';
import { HighScoreNode, LowScoreNode } from './CustomNode';
import './GraphVisualization.css';

const nodeTypes = {
  highScore: HighScoreNode,
  lowScore: LowScoreNode,
};

export default function GraphVisualization() {
  const { state, fetchGraphData, linkUsers } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  useEffect(() => {
    setNodes(state.nodes.map(node => ({
      ...node,
      position: node.position || { x: 0, y: 0 }
    })));
    setEdges(state.edges);
  }, [state.nodes, state.edges, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    async (connection: Connection) => {
      if (connection.source && connection.target) {
        try {
          await linkUsers(connection.source, connection.target);
          setEdges((eds) => addEdge(connection, eds));
        } catch (error) {
          console.error('Failed to link users:', error);
        }
      }
    },
    [linkUsers, setEdges]
  );

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_event, node) => {
      console.log('Node dragged:', node.id, 'to position:', node.position);
    },
    []
  );

  return (
    <div className="graph-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'highScore') return '#10b981';
            return '#6b7280';
          }}
        />
      </ReactFlow>
    </div>
  );
}
