import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    { id: 1, name: 'Stock Insights', icon: LayoutGrid, path: '/Insights' },
    { id: 2, name: 'Sentiment Analysis', icon: Activity, path: '/dashboard/sentiment-analysis' },
    { id: 3, name: 'Predictions', icon: LineChart, path: '/dashboard/predictions' },
    { id: 6, name: 'Portfolio Analytics', icon: PieChart, path: '/dashboard/portfolio-analytics' },
    { id: 7, name: 'Social Insights', icon: Users, path: '/dashboard/social-insights' },
    { id: 8, name: 'Support', icon: HelpCircle, path: '/dashboard/support' },
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
        second: '2-digit',
        hour12: true,
      })
    );
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`h-screen border-r border-gray-700 bg-gray-800/95 backdrop-blur-md fixed top-0 left-0 z-50 transition-all duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        } md:w-72 w-[280px] flex flex-col`}
      >
        <div className="p-5 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-white font-bold text-2xl tracking-tight">
                  IntelVestor <span className="text-blue-400">AI</span>
                </span>
                <p className="text-xs text-gray-400 mt-1">Last Updated: {currentTime || 'Loading...'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors md:hidden text-gray-400 hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1.5">
            {menuList.map((menu) => (
              <Link to={menu.path} key={menu.id} onClick={() => setIsOpen(false)}>
                <div
                  className={`flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 group ${
                    pathname === menu.path
                      ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-400 border-l-4 border-blue-500'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
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
                    <span className={`font-medium ${pathname === menu.path ? 'font-semibold' : ''}`}>
                      {menu.name}
                    </span>
                  </div>
                  {pathname === menu.path && <ChevronRight size={16} className="text-blue-400" />}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-700 p-4 mt-auto">
          <div className="flex items-center gap-3 p-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm"></div>
              <div className="relative z-10">
                <UserButton />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Your Profile</p>
              <p className="text-xs text-gray-400">Manage your account</p>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors duration-200">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;