import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';
import { useUser } from "../../context/UserContext";
import AuthCard from '../../components/AuthCard';

function Giris() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await loginUser(user, navigate);
      setUser(response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const formFields = [
    {
      type: 'email',
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: 'E-posta'
    },
    {
      type: 'password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
      placeholder: 'Şifre'
    }
  ];

  return (
    <AuthCard
      title="Giriş Yap"
      onSubmit={handleLogin}
      formFields={formFields}
      linkText="Hesabın yok mu?"
      linkPath="/kayıt-ol"
      linkLabel="Buradan Kayıt ol"
      buttonText="Giriş Yap"
    />
  );
}

export default Giris;
