import React from 'react';

const Card = ({ title, value, subtitle, icon, trend, className = '' }) => {
    const formatValue = (val) => {
        if (typeof val === 'number') {
            return val.toLocaleString('tr-TR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });
        }
        return val;
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
                        {trend && (
                            <span className={`ml-2 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 bg-blue-50 rounded-full ml-4">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card; 