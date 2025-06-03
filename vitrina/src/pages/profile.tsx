import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button/button';
import BackButton from '../components/button/back';
import './css/profile.css'
import back from '../assets/arrow-left.svg'
import MiniOrderCard from '../components/cards/mini-order/mini-order.tsx';
import {url, minio, statuses, types} from '../const/const'
import { getTokenFromStorage } from './jwt/token.tsx';

const rest_id = 1

interface Food {
    id: number,
    name: string,
    price: number,
    weight: number,
    img: string,
    count: number,
}

interface Info {
    type: string,
    address: string,
    comment: string,
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) + ' ' + date.toLocaleDateString('ru-RU');
};

const ProfilePage: React.FC = () => {
    const [orders, setOrders] = useState<[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>('');
    const [selectedOrderIndex, setSelectedOrderIndex] = useState<any>('');

    const fetchArchive = async () => {
        try {
            const tkn = getTokenFromStorage()
            const response = await axios.get(`${url}/order/archive`, {
                headers: {
                    Authorization: `Bearer ${tkn}`,
                },
            })
            if (response.status === 200) {
                setOrders(response.data)
                let id = response.data[0].id
                setSelectedOrderIndex(id)
                const resp = await getOrderByID(id)
                if (resp?.status === 200) {
                    console.log(resp.data)
                    setSelectedOrder(resp.data)
                }
            }
        } catch (error) {
            console.log("Ошибка в получении заказов", error)
        }
    };

    useEffect(() => {
        fetchArchive();
    }, []);

    const getOrderByID = async (id:number) => {
        try {
            const response = await axios.get(`${url}/order/${id}`)
            return response
        } catch (error) {
            console.log("Ошибка в получении заказа", error)
        }
    };

    const handleCurrentOrderClick = async (id: number) => {
        try {
            const response = await getOrderByID(id)
            if (response?.status === 200) {
                setSelectedOrder(response.data)
            }
        } catch (error) {
            console.log("Ошибка в получении заказа", error)
        }
    };

    return (
    <>
    <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px'}}>
        <BackButton style={{borderRadius: '50%', padding: '10px 10px 6px 10px'}}>
            <img src={back}/>
        </BackButton>
        <p style={{fontSize: '24px', fontWeight: '600'}}>Мои заказы</p>
        <p style={{width:'44px'}}> </p>
    </div>
    <div className="archive">
        <div className="archive-mini">
            {orders.map((order: any) => (
                <MiniOrderCard
                onClick={handleCurrentOrderClick}
                status={statuses[order.status]}
                number={order.id}
                sum={order.sum}
                variant={types[order.type]}
                date={order.created_at}
                style={{width: '220px'}}
                />)
            )}
        </div>
        <div className="archive-order">
            {selectedOrder ? <>
            <div>
                <div style={{display:'flex', alignItems: 'center'}}>
                    <p style={{fontSize: '20px', fontWeight: '600', marginRight: '1em'}}>
                        Заказ №{selectedOrder.id}
                    </p>
                    <p className="status">{statuses[selectedOrder.status]}</p>
                </div>
                <p style={{marginTop: '10px'}}>Создан в {formatDate(selectedOrder.created_at)}</p>
                <div className="s-row" style={{marginTop: '10px', display: 'flex'}}>
                    <p style={{color:'#7b7b7b'}}>
                        {types[selectedOrder.type]}
                    </p>   
                    {selectedOrder.address && <p style={{color: '#2e2e2e'}}>: {selectedOrder.address}</p>}
                </div>
                {selectedOrder.comment && (<>
                    <p style={{marginTop: '5px', color:'#7b7b7b'}}>Комментарий:</p>
                    <p>{selectedOrder.comment}</p>
                </>)}
            </div>
            <div style={{display:'flex', margin: '15px 0px'}}>
                <p style={{marginRight: '1em'}}>Сумма заказа</p>
                <p style={{fontWeight:600}}>{selectedOrder.sum}  ₽</p>
            </div>
            <div>
                {selectedOrder.food?.map((f:any) => (
                    <div className="o-row" style={{marginBottom: '14px'}}>
                        <img src={minio+f.item.img_url} alt={f.item.name}/>
                        <p style={{marginLeft: '10px'}}>{f.item.name}</p>
                        <p style={{marginLeft: '10px'}}>{f.count} x {f.item.price}  ₽</p>
                    </div>
                ))}
            </div> </>
            : <p>У вас пока нет заказов</p>}
        </div>
    </div>
    </>
    )
};
export default ProfilePage;