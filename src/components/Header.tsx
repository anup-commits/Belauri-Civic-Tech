import { useState } from 'react';
import { Menu, X, CircleUser as UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Reports', href: '#reports' },
    { name: 'News', href: '#news' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="text-red-600">BELAURI</span> FIRST
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm">{profile?.full_name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <a
                      href="#dashboard"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </a>
                    {profile?.is_admin && (
                      <a
                        href="#admin"
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin Panel
                      </a>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-700 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <a
                  href="#login"
                  className="px-4 py-2 text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="#signup"
                  className="px-4 py-2 text-sm font-medium bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Join Us
                </a>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {user ? (
                <>
                  <a
                    href="#dashboard"
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                  {profile?.is_admin && (
                    <a
                      href="#admin"
                      className="px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors text-red-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </a>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="#login"
                    className="px-3 py-2 rounded-md text-base font-medium hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="#signup"
                    className="px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Us
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
