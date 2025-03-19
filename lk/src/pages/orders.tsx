//import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './css/orders.css'
import MiniOrderCard from '../components/cards/mini-order';
import Button from '../components/button/button';
import { mockNewOrders, mockKitchenOrders, mockReadyOrders } from './mock/orders';

const mockOrders = [
    { status: 'Новые', items: [
        {id: 5, sum: 1600, type: 'Доставка', time: '12:04'},
        {id: 6, sum: 480, type: 'Самовывоз', time: '12:06'},
    ] },
    { status: 'На кухне', items: [
        {id: 2, sum: 980, type: 'Самовывоз', time: '11:50'},
        {id: 3, sum: 720, type: 'Самовывоз', time: '11:55'},
    ] },
    { status: 'Готовы', items: [
        {id: 1, sum: 1295, type: 'Доставка', time: '11:30'},
    ] },
];

const buttonTextMap: Record<string, string> = {
    'created': 'Принять заказ',
    'accepted': 'Заказ готов',
    'ready': 'Заказ завершен',
};

const OrderPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [orders, setOrders] = useState<any[]>([])

  const fetchOrders = async () => {
    setOrders(mockOrders)
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

  const handleItemClick = (id: number, status: string) => {
    console.log(id)
    //запрос
    if (status === 'Новые'){
        const i = mockNewOrders.find((item: any) => item.id === id)
        console.log(i)
        setSelectedOrder(i)
    } else if (status === 'На кухне'){
        const i = mockKitchenOrders.find((item: any) => item.id === id)
        console.log(i)
        setSelectedOrder(i)
    } else if (status === 'Готовы'){
        const i = mockReadyOrders.find((item: any) => item.id === id)
        console.log(i)
        setSelectedOrder(i)
    }
  }

  const handleAcceptOrder = (id: number) => {
    console.log(id)
    //запрос
    // убрать заказ из новых добавить в на кухне
    setSelectedOrder('')
  }

  const handleCancelOrder = (id: number) => {
    console.log(id)
    //запрос
    // убрать заказ из новых добавить в на кухне
    setSelectedOrder('')
  }
  
  return (
    <div className="orders">
        <div className="desk">
        {orders.map((item) => (
            <div className="column">
                <p style={{textAlign: 'left', fontWeight: 500}}>{item.status}</p>
                {item.items.map((or: any) => (
                    <MiniOrderCard 
                        type={item.status}
                        onClick={() => handleItemClick(or.id, item.status)}
                        number={or.id} 
                        time={or.time}
                        sum={or.sum} 
                        variant={or.type}
                    />
                ))}
            </div>
        ))}
        </div>
        {selectedOrder ? (
        <div className="order">
            <div>
                <div className="s-row">
                    <p style={{fontSize: '18px', fontWeight: '500', marginRight: '1em'}}>
                        Заказ №{selectedOrder.id}
                    </p>
                    <p>Создан в {selectedOrder.created_at}</p>
                </div>
                {selectedOrder.status === 'accepted' && <p>Принят в {selectedOrder.accepted_at}</p>}
                {selectedOrder.status === 'ready' &&  <>
                    <p style={{fontSize: '14px'}}>Принят в {selectedOrder.accepted_at}</p>
                    <p style={{fontSize: '14px'}}>Приготовлен в {selectedOrder.ready_at}</p>
                </>}
                <div className="s-row" style={{fontSize: '14px', marginTop: '10px'}}>
                    <p style={{fontWeight: '500', marginRight: '1em'}}>
                        {selectedOrder.type}
                        {selectedOrder.address && <>:</>}
                    </p>
                    {selectedOrder.address && 
                        <p style={{color: '#2e2e2e'}}>{selectedOrder.address}</p>
                    }
                </div>
                <div className="s-row" style={{fontSize: '14px', marginTop: '5px'}}>
                    <p style={{fontWeight: '500', marginRight: '1em'}}>
                        Клиент:
                    </p>
                    <p>{selectedOrder.user.name} {selectedOrder.user.phone}</p>
                </div>
                {selectedOrder.comment && (<>
                    <p style={{fontSize: '14px', fontWeight: '500', marginTop: '5px'}}>Комментарий:</p>
                    <p style={{fontSize: '14px'}}>{selectedOrder.comment}</p>
                </>)}
            </div>
            <div style={{marginTop: '15px'}}>
                {selectedOrder.food.map((f:any) => (
                    <div className="o-row" style={{borderBottom: '1px solid #a6a6a6', padding: '5px 0px'}}>
                        <p>{f.name}</p>
                        <p>{f.count} x {f.price}  ₽</p>
                    </div>
                ))}
            </div>
            <div className="m-row" style={{fontWeight: 500, margin: '15px 0px'}}>
                <p>Итого</p>
                <p>{selectedOrder.sum}  ₽</p>
            </div>
            <Button 
                onClick={() => handleAcceptOrder(selectedOrder.id)} 
                variant='action' 
                style={{padding: '10px 30px'}}
            >{buttonTextMap[selectedOrder.status]}</Button>
            <Button 
                onClick={() => handleCancelOrder(selectedOrder.id)} 
                style={{backgroundColor: 'transparent'}}
            >Отменить</Button>
        </div>
        ): (<></>)
        } 
    </div>
  )
}

export default OrderPage;