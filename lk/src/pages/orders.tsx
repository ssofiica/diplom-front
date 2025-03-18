//import axios from 'axios';
import React, { useState, useEffect, use } from 'react';
import './css/orders.css'

const mockOrders = [
    { status: 'Новые', items: [
        {id: 5, sum: 1600, type: 'Доставка', time: '12:04'},
    ] },
    { status: 'На кухне', items: [
        {id: 2, sum: 980, type: 'Самовывоз', time: '11:50'},
        {id: 3, sum: 720, type: 'Самовывоз', time: '11:55'},
    ] },
    { status: 'Готовы', items: [
        {id: 1, sum: 1295, type: 'Доставка', time: '11:30'},
    ] },
  ];

const OrderPage: React.FC = () => {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>(mockOrders)

  const fetchOrders = async () => {
    // try {
    //   const resp = await axios.get(`${url}/menu`)
    //   console.log(resp)
    //   console.log(resp.data)
    //   setMenu(resp.data)
    //   setSelectedCategory(resp.data[0])
    //   setActiveCategoryIndex(0)
    // } catch (error) {
    //   console.log("Ошибка в получении меню", error)
    // }
  };
  
  useEffect(() => {
      fetchOrders();
  }, []);
  
  return (
    <div className="orders">
        <div className="desk">
        {orders.map((item) => (
            <div className="column">
                <p>{item.status}</p>
                {item.items.map((or:any) => (
                    <div>
                        {or.id}
                        {or.sum}
                    </div>
                ))}
            </div>
        ))}
        </div>
        <div className="order">
        </div>
    </div>
  )
}

export default OrderPage;