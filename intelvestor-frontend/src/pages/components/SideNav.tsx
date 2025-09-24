import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  LayoutGrid,
  X,
  LogOut,
  ChevronRight,
  Home,
  Activity,
  LineChart,
  PieChart,
  Users,
  HelpCircle,
} from 'lucide-react';

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNav: React.FC<SideNavProps> = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();
  const [currentTime, setCurrentTime] = useState('');

  const menuList = [
    { id: 0, name: 'Home', icon: Home, path: '/' },
    { id: 1, name: 'Insights', icon: LayoutGrid, path: '/insights' },
    { id: 2, name: 'Sentiment Analysis', icon: Activity, path: '/sentiment' },
    { id: 3, name: 'Predictions', icon: LineChart, path: '/predictions' },
    { id: 4, name: 'Portfolio Analytics', icon: PieChart, path: '/portfolio' },
    { id: 5, name: 'Social Insights', icon: Users, path: '/social' },
    { id: 6, name: 'Support', icon: HelpCircle, path: '/support' },
  ];

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-0 left-0 h-screen border-r border-gray-700 bg-gray-800/95 text-white z-50 transition-all duration-300 ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:w-16 md:translate-x-0'
        } flex flex-col md:w-64`}
      >
        <div className="p-5 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {isOpen && (
                <div>
                  <span className="text-white font-bold text-xl tracking-tight">
                    IntelVestor <span className="text-blue-400">AI</span>
                  </span>
                  <p className="text-xs text-gray-400 mt-1">Updated: {currentTime || 'Loading...'}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-1.5">
            {menuList.map((menu) => (
              <NavLink
                key={menu.id}
                to={menu.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl p-3 transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-400 border-l-4 border-blue-500'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`
                }
                aria-current={pathname === menu.path ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      pathname === menu.path
                        ? 'bg-gray-700 text-blue-400 shadow-sm'
                        : 'text-gray-400 group-hover:text-gray-200 group-hover:bg-gray-700/80'
                    }`}
                  >
                    <menu.icon size={18} className={pathname === menu.path ? 'animate-pulse' : ''} />
                  </div>
                  {isOpen && (
                    <span className={`font-medium ${pathname === menu.path ? 'font-semibold' : ''}`}>
                      {menu.name}
                    </span>
                  )}
                </div>
                {pathname === menu.path && isOpen && <ChevronRight size={16} className="text-blue-400" />}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-700 p-4 mt-auto">
          <div className="flex items-center gap-3 p-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
              <div className="relative z-10">
                <UserButton />
              </div>
            </div>
            {isOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Your Profile</p>
                <p className="text-xs text-gray-400">Manage your account</p>
              </div>
            )}
            <button
              className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;