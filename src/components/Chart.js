import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Chart = ({ type = 'line', data, options = {}, className = '' }) => {
    const chartProps = {
        width: '100%',
        height: 300,
        margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            <ResponsiveContainer>
                {type === 'line' ? (
                    <LineChart data={data} {...chartProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {data.datasets.map((dataset, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey="value"
                                data={dataset.data.map((value, i) => ({
                                    name: data.labels[i],
                                    value: value
                                }))}
                                name={dataset.label}
                                stroke={dataset.borderColor}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                ) : (
                    <BarChart data={data.datasets[0].data.map((value, i) => ({
                        name: data.labels[i],
                        value: value
                    }))} {...chartProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="value"
                            name={data.datasets[0].label}
                            fill={data.datasets[0].backgroundColor}
                        />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default Chart; 