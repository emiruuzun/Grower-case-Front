import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { menuItem } from "../utils/MenuItem";
import { logoutUser } from "../services/auth";
import {
  FaSignOutAlt,
  FaBars,
  FaAngleRight,
  FaHome,
  FaTimes,
  FaUser,
  FaBell,
  FaSearch,
  FaChartLine,
  FaStar,
  FaCog,
  FaRegLightbulb
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Kategori ikonlarını tanımlayalım
const categoryIcons = {
  "Ana Menü": FaHome,
  // Diğer kategoriler için ikonlar eklenebilir
};

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Yeni güncelleme mevcut", read: false },
    { id: 2, message: "Rapor hazırlandı", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      setIsSidebarOpen(!smallScreen);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(navigate);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Ana bileşen
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Toggle Button for Small Screens */}
      {isSmallScreen && !isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isSidebarOpen ? (isSmallScreen ? "100%" : "18rem") : "0rem",
          x: isSidebarOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-indigo-700 via-indigo-800 to-purple-900 text-white shadow-2xl overflow-hidden ${
          isSmallScreen ? "w-full" : "md:relative"
        }`}
      >
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              <div className="p-6 border-b border-indigo-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-inner">
                      <FaHome size={20} className="text-indigo-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 hidden md:block">
                      SEO Panel
                    </h1>
                  </div>
                  {isSmallScreen && (
                    <button 
                      onClick={toggleSidebar} 
                      className="text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-indigo-600/30"
                    >
                      <FaTimes size={20} />
                    </button>
                  )}
                </div>
                
                {/* Kullanıcı bilgisi */}
                <div className="flex items-center space-x-3 mt-5 p-3 bg-indigo-600/20 rounded-xl backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-indigo-700 flex items-center justify-center">
                      <FaUser className="text-indigo-200" size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Kullanıcı Adı</h3>
                    <p className="text-xs text-indigo-200">Admin • Premium</p>
                  </div>
                </div>
              </div>
              
              {/* Search bar */}
              <div className="relative px-6 pt-6 pb-3">
                <input
                  type="text"
                  placeholder="Menüde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-indigo-600/20 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 backdrop-blur-sm"
                />
                <FaSearch className="absolute top-9 left-9 text-indigo-300" />
              </div>
              
              <nav className="flex-grow space-y-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                {menuItem.map((section) => (
                  <div key={section.name} className="mb-3">
                    <button
                      onClick={() => toggleSection(section.name)}
                      className={`flex items-center justify-between w-full text-left font-medium rounded-xl transition-all duration-200 p-3 ${
                        expandedSections[section.name] 
                          ? 'bg-white/10 text-white backdrop-blur-sm' 
                          : 'text-indigo-200 hover:bg-indigo-600/30 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center">
                        {categoryIcons[section.name] ? (
                          React.createElement(categoryIcons[section.name], {
                            className: "mr-3 text-indigo-300",
                            size: 18,
                          })
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center mr-3">
                            <FaRegLightbulb size={12} className="text-indigo-900" />
                          </div>
                        )}
                        {section.name}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedSections[section.name] ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaAngleRight className="text-indigo-300" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedSections[section.name] && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 space-y-1 ml-4"
                        >
                          {section.items.map((item, index) => (
                            <motion.li 
                              key={item.slug}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <NavLink
                                to={`/${item.slug}`}
                                className={({ isActive }) =>
                                  `flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                    isActive
                                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                      : 'text-indigo-200 hover:bg-indigo-600/20 hover:text-white'
                                  }`
                                }
                              >
                                {item.icon ? (
                                  <item.icon className="mr-3 text-indigo-300" size={16} />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-indigo-500/40 mr-3 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                                  </div>
                                )}
                                {item.name}
                              </NavLink>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
              
              <div className="p-4 mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-indigo-500/30">
                      <FaChartLine className="text-indigo-200" size={18} />
                    </div>
                    <h3 className="font-medium text-white">SEO Puanınız</h3>
                  </div>
                  <div className="w-full bg-indigo-800/50 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: "70%" }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-indigo-200">
                    <span>Bu hafta iyileşme: +12%</span>
                    <span>70/100</span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full px-4 py-3 mt-4 text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-white"
                >
                  <FaSignOutAlt className="mr-2" />
                  Çıkış Yap
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="py-3 px-6 bg-white shadow-md z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSmallScreen && (
                <button 
                  onClick={toggleSidebar} 
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 hover:shadow-md"
                >
                  <FaBars size={18} />
                </button>
              )}
              <h2 className="text-lg font-medium text-gray-800">Hoş Geldiniz, <span className="font-semibold text-indigo-600">Panel</span></h2>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center bg-indigo-50 px-3 py-2 rounded-lg">
                  <div className="mr-2 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaStar className="text-indigo-600" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sıralama</p>
                    <p className="text-sm font-medium text-indigo-700">#42</p>
                  </div>
                </div>
                <div className="flex items-center bg-purple-50 px-3 py-2 rounded-lg">
                  <div className="mr-2 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <FaChartLine className="text-purple-600" size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Artış</p>
                    <p className="text-sm font-medium text-purple-700">+24%</p>
                  </div>
                </div>
              </div>
              
              {/* Ayarlar */}
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200">
                <FaCog size={20} />
              </button>
              
              {/* Bildirimler */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors duration-200 relative"
                >
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center rounded-full shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Bildirim Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h3 className="font-medium text-gray-800">Bildirimler</h3>
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Tümünü Okundu İşaretle
                      </button>
                    </div>
                    <div className={`max-h-64 overflow-y-auto ${notifications.length === 0 ? 'p-4 text-center text-gray-500' : ''}`}>
                      {notifications.length === 0 ? (
                        "Bildirim bulunmuyor"
                      ) : (
                        notifications.map((notification, index) => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150 ${notification.read ? '' : 'bg-indigo-50'}`}
                          >
                            <div className="flex items-start">
                              <div className={`mt-1 mr-3 w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-indigo-100' : 'bg-purple-100'}`}>
                                <FaBell size={14} className={index % 2 === 0 ? 'text-indigo-600' : 'text-purple-600'} />
                              </div>
                              <div>
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">5 dakika önce</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-gray-50 border-t">
                      <button className="w-full py-2 text-sm text-center text-indigo-600 hover:text-indigo-800 font-medium">
                        Tüm Bildirimleri Görüntüle
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Kullanıcı Profil */}
              <div className="flex items-center ml-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <FaUser className="text-indigo-600" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Keyframe animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

export default DashboardLayout;