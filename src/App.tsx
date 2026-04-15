import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/Layout';
import FloatingSubmitForm from './components/FloatingSubmitForm';

import Home from './pages/Home';
import About from './pages/About';
import Initiatives from './pages/Initiatives';
import AdminPanel from './pages/AdminPanel';
import Impact from './pages/Impact';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/secret-admin-belauri" element={<AdminPanel />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="initiatives" element={<Initiatives />} />
              <Route path="impact" element={<Impact />} />
            </Route>
          </Routes>
          <FloatingSubmitForm />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
