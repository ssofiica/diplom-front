import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './css/analytics.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import {url, types } from '../const/const'
import { Chart, registerables } from 'chart.js';
import RevenueChart from '../components/charts/line';
import BarChartComponent from '../components/charts/bar';
Chart.register(...registerables);


interface OrdersArr {
    status: string,
}

const revenueData = [
    { date: '10-01-2023', revenue: 150000 },
    { date: '10-02-2023', revenue: 180000 },
    // ...
];

const avgCheckData = [
    { date: '2023-10-01', avgCheck: 1200 },
    { date: '2023-10-02', avgCheck: 1350 },
    // ...
  ];

const AnalyticsPage: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState<any>(avgCheckData)
  const [revenue, setRevenue] = useState<any>('')
  const [avgCheck, setAvgCheck] = useState<any>('')
  const [conversion, setConversion] = useState<any>('')
  const [avgPrepTime, setAvgPrepTime] = useState<any>('')
  const [topFood, setTopFood] = useState<any>([])

  const chartData = {
    labels: topFood.Name,
    datasets: [
      {
        label: topFood.title,
        data: topFood.Count,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Руб',
        },
      },
    },
  };

  const fetchAnalytics = async () => {
    try {
        const resp = await axios.get(`${url}/analytics`, {
            params:{
                "start": format(startDate, 'yyyy-MM-dd'),
                "end": format(endDate, 'yyyy-MM-dd'),
            },
        });
        if (resp.status === 200) {
            console.log(resp.data.revenue.data)
            setRevenue(resp.data.revenue)
            setAvgCheck(resp.data.avg_check)
            setConversion(resp.data.conversion)
            setAvgPrepTime(resp.data.avg_prep_time)
            const chartData = resp.data.top_food.Name.map((name: string, index: any) => ({
                name,
                value: resp.data.top_food.Count[index]
            }));
            setTopFood(chartData)
        }
    } catch (error) {
        console.log("Ошибка в получении аналитики", error)
    }
  };
  
  useEffect(() => {
    fetchAnalytics()
  }, [startDate, endDate]);

  const getByID = async (id: number) => {
    try {
        const resp = await axios.get(`${url}/order/${id}`);
        return resp
    } catch (error) {
        console.log("Ошибка в добавлении категории", error)
    }
  }

  const takeTime = (date: string) => {
    const createdAt = new Date(date);
    const time = createdAt.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return time
  }
  
  return (
    <div className="analytics">
        <p style={{fontSize: '18px', fontWeight: '500', textAlign: 'left'}}>Аналитика</p>
        <div className="s-row" style={{marginTop: '20px'}}>
            <div className="s-row" style={{marginRight: '20px'}}>
                <p style={{marginRight: '10px'}}>Начало</p>
                <DatePicker
                    selected={startDate}
                    onChange={(date: any) => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="data-picker"
                />
            </div>
            <div className="s-row">
                <p style={{marginRight: '10px'}}>Конец</p>
                <DatePicker
                    selected={endDate}
                    onChange={(date: any) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="data-picker"
                />
            </div>
        </div>
        <div className="s-row" style={{gap: '10px'}}>
            <RevenueChart 
                data={revenue.data}
                title={revenue.title}
                currency="руб"
                X={revenue.x}
            />
            <RevenueChart 
                data={avgCheck.data}
                title={avgCheck.title}
                currency="руб"
                X={revenue.x}
            />
        </div>
        <div className="s-row" style={{gap: '20px', marginTop: '60px'}}>
            <RevenueChart 
                data={conversion.data}
                title={conversion.title}
                currency="%"
                X={conversion.x}
            />
            <RevenueChart 
                data={avgPrepTime.data}
                title={avgPrepTime.title}
                currency="сек"
                X={avgPrepTime.x}
            />
        </div>
        <div style={{marginTop: '60px'}}>
            <BarChartComponent 
                data={topFood}
                title="Популярные блюда"
                xAxisLabel="Количество заказов"
            />
        </div>
    </div>
  )
}

export default AnalyticsPage;

//    Графики
// Выручка	SUM(sum)	Общая/дневная/по ресторану
// Средний чек	SUM(sum)/COUNT(order_id)	Тренды по дням/ресторанам
// Конверсия	(finished orders)/(all orders)*100%	Эффективность работы
// Время приготовления	AVG(ready_at - accepted_at)	Оптимизация кухни
// 
//    Показатели
// Топ-5 блюд
//  
// 
