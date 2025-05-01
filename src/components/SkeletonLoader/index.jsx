import React from 'react';
import PropTypes from 'prop-types';

const SkeletonLoader = ({ type }) => {
  const baseClass = "animate-pulse bg-gray-200 rounded";

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className={`${baseClass} h-6 w-1/3 mb-4`} />
            <div className="space-y-3">
              <div className={`${baseClass} h-4 w-full`} />
              <div className={`${baseClass} h-4 w-5/6`} />
              <div className={`${baseClass} h-4 w-4/6`} />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className={`${baseClass} h-6 w-1/4 mb-4`} />
            <div className={`${baseClass} h-64 w-full`} />
          </div>
        );

      case 'table':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className={`${baseClass} h-6 w-1/4 mb-4`} />
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`${baseClass} h-8`} />
                ))}
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className={`${baseClass} h-6`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderSkeleton();
};

SkeletonLoader.propTypes = {
  type: PropTypes.oneOf(['card', 'chart', 'table']).isRequired,
};

export default SkeletonLoader; 