import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import ProximityHover from './components/ProximityHover';

export default function App() {
  return (
    <BrowserRouter>
      <ProximityHover />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:hash" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
