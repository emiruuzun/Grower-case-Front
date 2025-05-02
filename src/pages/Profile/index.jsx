import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getUserProfile } from "../../services/profile";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Profil verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-indigo-600">
              Profil Yükleniyor...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="relative px-6 pb-8">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="absolute -top-16 ring-8 ring-white rounded-full overflow-hidden bg-white p-2">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-20 sm:mt-0 sm:ml-40 text-center sm:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <p className="text-indigo-600">{profile.email}</p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl transition duration-200">
                  <FaEdit />
                  <span>Düzenle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "profile"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
              >
                Profil Bilgileri
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "security"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
              >
                Güvenlik
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === "preferences"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
              >
                Tercihler
              </button>
            </div>

            {/* Profile Info */}
            {activeTab === "profile" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  Güvenlik ayarları burada görüntülenecektir.
                </p>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">
                  Tercihler burada görüntülenecektir.
                </p>
              </div>
            )}
          </div>

          {/* Activity Summary */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Son Aktiviteler
              </h2>
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Henüz aktivite bulunmuyor.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const ProfileCard = ({ icon, label, value }) => (
  <div className="bg-white border border-indigo-100 rounded-2xl p-5 hover:shadow-md transition duration-300 group">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition duration-300">
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-indigo-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default Profile;
