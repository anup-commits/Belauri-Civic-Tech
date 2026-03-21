import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/home/Hero';
import Stats from './components/home/Stats';
import About from './components/home/About';
import CallToAction from './components/home/CallToAction';
import ReportForm from './components/reports/ReportForm';
import ReportsList from './components/reports/ReportsList';
import NewsList from './components/news/NewsList';
import EventsList from './components/events/EventsList';
import GalleryGrid from './components/gallery/GalleryGrid';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminPanel from './components/admin/AdminPanel';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'admin'>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#dashboard') {
        setCurrentView('dashboard');
        window.scrollTo(0, 0);
      } else if (hash === '#admin') {
        setCurrentView('admin');
        window.scrollTo(0, 0);
      } else if (hash === '#login') {
        setShowLoginModal(true);
      } else if (hash === '#signup') {
        setShowSignupModal(true);
      } else {
        setCurrentView('home');
        if (hash && hash !== '#home') {
          setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    window.history.pushState('', document.title, window.location.pathname);
  };

  const handleCloseSignup = () => {
    setShowSignupModal(false);
    window.history.pushState('', document.title, window.location.pathname);
  };

  return (
    <>
      <Layout>
        {currentView === 'home' && (
          <>
            <Hero />
            <Stats />
            <About />
            <ReportForm />
            <ReportsList />
            <NewsList />
            <EventsList />
            <GalleryGrid />
            <CallToAction />
          </>
        )}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'admin' && <AdminPanel />}
      </Layout>

      {showLoginModal && (
        <LoginForm
          onClose={handleCloseLogin}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
      )}

      {showSignupModal && (
        <SignupForm
          onClose={handleCloseSignup}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
}

export default App;
