import React, { useMemo } from 'react';
import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import styled from 'styled-components';
import { Post } from '../interfaces/post';

interface ChartData {
    date: string;
    salary: number;
    company?: string;
    title?: string;
}

interface SalaryChartProps {
    posts: Post[];
    isVisible: boolean;
}

const ChartContainer = styled.div`
    width: 100%;
    margin: 20px 0;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        width: 95% !important;
    }
`;


const SalaryChart: React.FC<SalaryChartProps> = ({ posts, isVisible }) => {
    const chartData: ChartData[] = useMemo(() => {
        return posts
            .filter(post => {
                const salary = post?.extra?.jobOfferInfo?.baseSalary;
                return salary && !isNaN(parseFloat(salary.replace(/[^0-9.]/g, '')));
            })
            .map(post => ({
                date: new Date(post.post_date || "").toLocaleDateString(),
                salary: parseFloat(post.extra.jobOfferInfo.baseSalary.replace(/[^0-9.]/g, '')),
                title: post.post_text?.split('\n')[0] || 'Untitled Post'
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [posts]);

    if (!isVisible || chartData.length === 0) {
        return null;
    }

    const formatCurrency = (value: number): string => `$${value.toLocaleString()}`;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        Date: {label}
                    </p>
                    <p style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
                        Salary: {formatCurrency(payload[0].payload.salary)}
                    </p>
                    <p style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
                        Title: {payload[0].payload.title}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ChartContainer className="w-50 mx-auto xs:w-full">
            <h3 className="text-xl font-bold mb-6">Salary Progression</h3>
            <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickFormatter={formatCurrency}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="salary"
                            fill="#8884d8"
                            radius={[4, 4, 0, 0]}
                            name="Salary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartContainer>
    );
};

export default SalaryChart;
