import Home from './pages/Home';
import Archived from './pages/Archived';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Achievements from './pages/Achievements';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/archived" element={<Archived />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
