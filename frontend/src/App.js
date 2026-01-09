import Home from './pages/Home';
import Archived from './pages/Archived';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Achievements from './pages/Achievements';
import RankTest from './components/RankTest';

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
      <div className="App">
        <h1>Rank XP Test</h1>
        <RankTest />
      </div>
    </BrowserRouter>
  );
}

export default App;
