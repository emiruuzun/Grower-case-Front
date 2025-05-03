import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getUserProfile } from "../../services/profile";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaLock,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaHistory,
  FaUserCog,
  FaEye
} from "react-icons/fa";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
        
        // Simüle edilmiş veri yükleme gecikmesi
        setTimeout(() => {
          setShowProgress(true);
        }, 500);
      } catch (error) {
        console.error("Profil verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Aktivite verileri (örnek)
  const activities = [
    { id: 1, action: "Oturum açıldı", date: "Bugün, 10:25", icon: <FaUser /> },
    { id: 2, action: "Profil güncellendi", date: "Dün, 15:40", icon: <FaEdit /> },
    { id: 3, action: "Şifre değiştirildi", date: "5 Mayıs 2023", icon: <FaLock /> },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Profil Yükleniyor...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-4 pb-12 px-4 sm:px-6 lg:px-0">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-2xl">
            <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="absolute transform -translate-y-1/2 left-1/2 sm:left-6 -translate-x-1/2 sm:translate-x-0 ring-4 ring-white rounded-full overflow-hidden bg-white p-1">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                    {profile.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-14 sm:mt-0 sm:ml-36 text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {profile.name}
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                    <FaEnvelope className="mr-2 text-indigo-400" />
                    {profile.email}
                  </p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition duration-200 transform hover:scale-105 shadow-md">
                  <FaEdit />
                  <span>Düzenle</span>
                </button>
              </div>
              
              {/* Progress Bars */}
              {showProgress && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <ProgressItem 
                    label="Profil Tamamlanma" 
                    percentage={85} 
                    icon={<FaUser />} 
                    color="from-indigo-400 to-indigo-600" 
                  />
                  <ProgressItem 
                    label="Güvenlik Skoru" 
                    percentage={70} 
                    icon={<FaShieldAlt />} 
                    color="from-green-400 to-green-600" 
                  />
                  <ProgressItem 
                    label="Aktivite Seviyesi" 
                    percentage={45} 
                    icon={<FaHistory />} 
                    color="from-purple-400 to-purple-600" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
                <div className="scrollable-tabs">
                  <div className="flex border-b">
                    <TabButton 
                      active={activeTab === "profile"} 
                      onClick={() => setActiveTab("profile")}
                      icon={<FaUser />}
                      label="Profil Bilgileri"
                    />
                    <TabButton 
                      active={activeTab === "security"} 
                      onClick={() => setActiveTab("security")}
                      icon={<FaLock />}
                      label="Güvenlik"
                    />
                    <TabButton 
                      active={activeTab === "preferences"} 
                      onClick={() => setActiveTab("preferences")}
                      icon={<FaCog />}
                      label="Tercihler"
                    />
                    <TabButton 
                      active={activeTab === "notifications"} 
                      onClick={() => setActiveTab("notifications")}
                      icon={<FaBell />}
                      label="Bildirimler"
                    />
                  </div>
                </div>

                {/* Tab Contents */}
                <div className="p-6">
                  {/* Profile Info */}
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaUserCog className="mr-2 text-indigo-500" />
                        Kişisel Bilgiler
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileCard
                          icon={<FaUser className="text-indigo-600" />}
                          label="Ad Soyad"
                          value={profile.name}
                        />
                        <ProfileCard
                          icon={<FaEnvelope className="text-indigo-600" />}
                          label="E-posta"
                          value={profile.email}
                        />
                        <ProfileCard
                          icon={<FaPhone className="text-indigo-600" />}
                          label="Telefon Numarası"
                          value={profile.phoneNumber || "Belirtilmemiş"}
                        />
                        <ProfileCard
                          icon={<FaCalendarAlt className="text-indigo-600" />}
                          label="Kayıt Tarihi"
                          value={new Date(profile.creatAt).toLocaleDateString(
                            "tr-TR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaShieldAlt className="mr-2 text-indigo-500" />
                        Güvenlik Ayarları
                      </h2>
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                              <FaLock className="text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Şifre Değiştir</h3>
                              <p className="text-sm text-gray-600">En son şifre değişikliği 30 gün önce</p>
                            </div>
                          </div>
                          <button className="bg-white text-indigo-600 border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors duration-200">
                            Değiştir
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                              <FaEye className="text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">İki Faktörlü Doğrulama</h3>
                              <p className="text-sm text-gray-600">Hesabınızı güvenli tutmak için etkinleştirin</p>
                            </div>
                          </div>
                          <button className="bg-white text-indigo-600 border border-indigo-200 rounded-lg px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors duration-200">
                            Etkinleştir
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="flex items-center mb-3 sm:mb-0">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                              <FaBell className="text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Oturum Bildirimleri</h3>
                              <p className="text-sm text-gray-600">Yeni oturum açmalarında e-posta ile bilgilendiril</p>
                            </div>
                          </div>
                          <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer" defaultChecked />
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <FaCog className="text-4xl text-indigo-300 mx-auto mb-3" />
                        <p className="text-gray-500">Tercihler ayarları yakında eklenecektir.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="flex items-center justify-center h-40">
                      <div className="text-center">
                        <FaBell className="text-4xl text-indigo-300 mx-auto mb-3" />
                        <p className="text-gray-500">Bildirim ayarları yakında eklenecektir.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              {/* Activity Summary */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaHistory className="mr-2 text-indigo-500" />
                    Son Aktiviteler
                  </h2>
                  
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className="flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50"
                        >
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            {activity.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-4">
                        Tüm Aktiviteleri Görüntüle
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">Henüz aktivite bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS için ekstra stiller */}
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .scrollable-tabs {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }
        
        .scrollable-tabs::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Edge */
        }
        
        .toggle-checkbox:checked {
          right: 0;
          border-color: #4f46e5;
        }
        
        .toggle-checkbox:checked + .toggle-label {
          background-color: #4f46e5;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </DashboardLayout>
  );
}

// Tab Button Component
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 flex items-center py-4 px-4 sm:px-6 text-center font-medium transition-all duration-200 whitespace-nowrap
      ${active
        ? "text-indigo-600 border-b-2 border-indigo-600"
        : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50"
      }`}
  >
    <span className={`mr-2 ${active ? 'text-indigo-600' : 'text-gray-400'}`}>{icon}</span>
    {label}
  </button>
);

// Profile Card Component
const ProfileCard = ({ icon, label, value }) => (
  <div className="bg-white border border-indigo-100 rounded-2xl p-4 hover:shadow-md transition duration-300 group transform hover:-translate-y-1">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition duration-300">
        <div className="text-xl">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-indigo-500">{label}</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 break-words">{value}</p>
      </div>
    </div>
  </div>
);

// Progress Item Component
const ProgressItem = ({ label, percentage, icon, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color} mr-3 text-white`}>
          {icon}
        </div>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}
      ></div>
    </div>
  </div>
);

export default Profile;