import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import GraphVisualization from './components/GraphVisualization';
import HobbySidebar from './components/HobbySidebar';
import UserPanel from './components/UserPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppContent() {
  const { fetchGraphData, fetchUsers } = useApp();

  useEffect(() => {
    fetchGraphData();
    fetchUsers();
  }, [fetchGraphData, fetchUsers]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌐 User Relationship & Hobby Network</h1>
        <p>Interactive Graph Visualization</p>
      </header>

      <div className="app-container">
        <HobbySidebar />
        <div className="main-content">
          <GraphVisualization />
        </div>
        <UserPanel />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
