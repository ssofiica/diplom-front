import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface BarChartProps {
  data: {
    name: string;
    value: number;
  }[];
  width?: number | string;
  height?: number | string;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
  customColors?: string[];
}

const BarChartComponent: React.FC<BarChartProps> = ({
  data=[],
  width = '100%',
  height = 400,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  barColor = '#8884d8',
  customColors = []
}) => {
  // Если переданы кастомные цвета, используем их, иначе - один цвет для всех
  const colors = customColors.length > 0 ? customColors : [barColor];
  return (
    <div style={{ width, height: 'auto' }}>
      {title && <h3 style={{ textAlign: 'center', marginBottom: 20 }}>{title}</h3>}
      
      <div style={{ width, height }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
            layout="vertical" // Горизонтальные столбцы
          >
            <CartesianGrid strokeDasharray="3 3" />
            
            <XAxis 
              type="number" 
              label={{ 
                value: xAxisLabel, 
                position: 'bottom', 
                offset: 10 
              }} 
            />
            
            <YAxis 
              type="category" 
              dataKey="name"
              width={120}
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'left', 
                offset: -10 
              }}
              tick={{ fontSize: 12 }}
            />
            
            <Tooltip 
              formatter={(value: number) => [`${value}`, 'Количество']}
              labelFormatter={(name) => name}
            />
            
            <Legend />
            
            <Bar 
              dataKey="value" 
              name="Количество"
              barSize={30}
            >
              {data.map((entry:any, index:any) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;