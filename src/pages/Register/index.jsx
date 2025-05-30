import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function KayıtOl() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      name: userName,
      email,
      password,
      phoneNumber: `+${phone.replace(/\s/g, "")}`, // boşlukları temizle
    };
    console.log("Gönderilen kullanıcı verisi:", user);

    try {
      const data = await registerUser(user, navigate);
      console.log(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700">
      <div className="form-container bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-500">
          Kayıt Ol
        </h1>
        <hr className="my-4" />
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Kullanıcı Adı */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="mr-2 text-indigo-500" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Kullanıcı Adı"
              className="w-full border-none focus:outline-none"
            />
          </div>

          {/* E-Posta */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="mr-2 text-indigo-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className="w-full border-none focus:outline-none"
            />
          </div>

          {/* Şifre */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="mr-2 text-indigo-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full border-none focus:outline-none"
            />
          </div>

          {/* Telefon */}
          <div className="py-2">
            <PhoneInput
              country={"tr"}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputClass="!w-full !py-2 !pl-12 !text-sm !border-gray-300 !rounded"
              buttonClass="!border-gray-300"
              inputStyle={{ width: "100%" }}
              placeholder="Telefon Numarası"
            />
          </div>

          <p className="text-gray-600 text-center mt-4">
            Hesabın var mı?{" "}
            <Link to="/" className="text-indigo-500 hover:underline">
              Giriş Yap
            </Link>
          </p>

          <Button
            butonName="Kayıt Ol"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          />
        </form>
      </div>
    </div>
  );
}

export default KayıtOl;
