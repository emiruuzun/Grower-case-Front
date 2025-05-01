import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const AuthCard = ({
  title,
  onSubmit,
  formFields,
  linkText,
  linkPath,
  linkLabel,
  buttonText
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'text':
        return <FaUser className="mr-2 text-indigo-500" />;
      case 'email':
        return <FaEnvelope className="mr-2 text-indigo-500" />;
      case 'password':
        return <FaLock className="mr-2 text-indigo-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700">
      <div className="form-container bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-500">{title}</h1>
        <hr className="my-4" />
        <form className="space-y-6" onSubmit={onSubmit}>
          {formFields.map((field, index) => (
            <div key={index} className="flex items-center border-b border-gray-300 py-2">
              {getIcon(field.type)}
              <input
                type={field.type}
                onChange={field.onChange}
                value={field.value}
                placeholder={field.placeholder}
                className="w-full border-none focus:outline-none"
              />
            </div>
          ))}

          <p className="text-gray-600 text-center mt-4">
            {linkText}{' '}
            <Link to={linkPath} className="text-indigo-500 hover:underline">
              {linkLabel}
            </Link>
          </p>

          <Button
            butonName={buttonText}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          />
        </form>
      </div>
    </div>
  );
};

export default AuthCard; 