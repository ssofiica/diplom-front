//import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './css/orders.css'
import MiniOrderCard from '../components/cards/mini-order';
import Button from '../components/button/button';
import { mockNewOrders, mockKitchenOrders, mockReadyOrders } from './mock/orders';
import axios from 'axios';
import {url, types } from '../const/const'

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

interface MiniOrder {
    id: number,
    sum: number,
    type: string,
    created_at: string,
}

interface OrdersArr {
    status: string,
    items: MiniOrder[],
}

const buttonTextMap: Record<string, string> = {
    'created': 'Принять заказ',
    'accepted': 'Заказ готов',
    'ready': 'Заказ завершен',
};

const OrderPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [orders, setOrders] = useState<OrdersArr[]>([])
  const [newOrders, setNewOrders] = useState<MiniOrder[]>([])
  const [acceptedOrders, setAcceptedOrders] = useState<MiniOrder[]>([])
  const [readyOrders, setReadyOrders] = useState<MiniOrder[]>([])

  const fetchOrders = async (status: string) => {
    try {
        const resp = await axios.get(`${url}/order/mini-list`, {
            params: {
              status: status,
            },
        });
        if (resp.status === 200) {
            if (status === 'created') {
                setNewOrders(resp.data)
            } else if (status === 'accepted') {
                setAcceptedOrders(resp.data)
            } else if (status === 'ready') {
                setReadyOrders(resp.data)
            }
        }
    } catch (error) {
        console.log("Ошибка в получении orders", error)
    }
  };
  
  useEffect(() => {
    fetchOrders('created');
    fetchOrders('accepted');
    fetchOrders('ready');
  }, []);

  const handleItemClick = async (id: number, status: string) => {
    console.log(id)
    const resp = await getByID(id)
    if (resp?.status === 200){
        setSelectedOrder(resp.data)
    }
  }

  const getByID = async (id: number) => {
    try {
        const resp = await axios.get(`${url}/order/${id}`);
        return resp
    } catch (error) {
        console.log("Ошибка в добавлении категории", error)
    }
  }

  const handleAcceptOrder = async (id: number) => {
    console.log(selectedOrder.status);
    let status = '';
    let date = new Date();
    date.toISOString();
    if (selectedOrder.status === 'created') {
        status = 'accepted'
    } else if (selectedOrder.status === 'accepted') {
        status = 'ready'
    } else if (selectedOrder.status === 'ready') {
        status = 'finished'
    }
    try {
        const resp = await axios.put(`${url}/order/${id}`, null, {
            params: {
                status: status,
            },
        });
        if (resp.status === 200) {
            if (selectedOrder.status === 'created') {
                fetchOrders('created');
                fetchOrders('accepted');
            } else if (selectedOrder.status === 'accepted') {
                fetchOrders('ready');
                fetchOrders('accepted');
            } else if (selectedOrder.status === 'accepted') {
                fetchOrders('ready');
            }
            setSelectedOrder('')
        }
    } catch (error) {
        console.log("Ошибка в смене статуса заказа", error)
    }
  }

  const handleCancelOrder = async (id: number, status: string) => {
    try {
        const resp = await axios.put(`${url}/order/${id}`, null, {
            params: {
                status: 'canceled',
            },
        });
        if (resp.status === 200) {
            fetchOrders(status)
        }
    } catch (error) {
        console.log("Ошибка в добавлении категории", error)
    }
    setSelectedOrder('')
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
    <div className="orders">
        <div className="desk">
            <div className="column">
                <p style={{textAlign: 'left', fontWeight: 500}}>Новые</p>
                {newOrders.map((or: any) => (
                    <MiniOrderCard 
                        type='Новые'
                        onClick={() => handleItemClick(or.id, 'Новые')}
                        number={or.id} 
                        time={takeTime(or.created_at)}
                        sum={or.sum} 
                        variant={or.type}
                    />
                ))}
            </div>
            <div className="column">
                <p style={{textAlign: 'left', fontWeight: 500}}>На кухне</p>
                {acceptedOrders.map((or: any) => (
                    <MiniOrderCard 
                        type='На кухне'
                        onClick={() => handleItemClick(or.id, 'На кухне')}
                        number={or.id} 
                        time={takeTime(or.created_at)}
                        sum={or.sum} 
                        variant={or.type}
                    />
                ))}
            </div>
            <div className="column">
                <p style={{textAlign: 'left', fontWeight: 500}}>Готовы</p>
                {readyOrders.map((or: any) => (
                    <MiniOrderCard 
                        type='Готовы'
                        onClick={() => handleItemClick(or.id, 'Готовы')}
                        number={or.id} 
                        time={takeTime(or.created_at)}
                        sum={or.sum} 
                        variant={or.type}
                    />
                ))}
            </div>
        </div>
        {selectedOrder ? (
        <div className="order">
            <div>
                <div className="s-row">
                    <p style={{fontSize: '18px', fontWeight: '500', marginRight: '1em'}}>
                        Заказ №{selectedOrder.id}
                    </p>
                    <p>Создан в {takeTime(selectedOrder.created_at)}</p>
                </div>
                {selectedOrder.status === 'accepted' && 
                    <p style={{fontSize: '14px'}}>Принят в {takeTime(selectedOrder.accepted_at)}</p>
                }
                {selectedOrder.status === 'ready' &&  <>
                    <p style={{fontSize: '14px'}}>Принят в {takeTime(selectedOrder.accepted_at)}</p>
                    <p style={{fontSize: '14px'}}>Приготовлен в {takeTime(selectedOrder.ready_at)}</p>
                </>}
                <div className="s-row" style={{fontSize: '14px', marginTop: '10px'}}>
                    <p style={{fontWeight: '500', marginRight: '1em'}}>
                        {types[selectedOrder.type]}
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
                        <p>{f.item.name}</p>
                        <p>{f.count} x {f.item.price}  ₽</p>
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
                onClick={() => handleCancelOrder(selectedOrder.id, selectedOrder.status)} 
                style={{backgroundColor: 'transparent'}}
            >Отменить</Button>
        </div>
        ): (<></>)
        } 
    </div>
  )
}

export default OrderPage;