import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
  title: string;
  currency?: string;
  X?: string;
}

const RevenueChart = ({ 
  data, 
  title, 
  currency,
  X
}: RevenueChartProps) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="X" 
            label={{ value: 'Дата', position: 'insideBottomRight', offset: -5 }} 
          />
          <YAxis 
            dataKey="Y" 
            label={{ 
              value: currency, 
              angle: -90, 
              position: 'insideLeft' 
            }}
            width={70}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} ${currency}`, X]} 
            labelFormatter={(date) => `Дата: ${date}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Y" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
            name={`${X}, ${currency}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;