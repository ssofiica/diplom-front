import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {mockBasket} from './mock/main';
import Button from '../components/button/button';
import BackButton from '../components/button/back';
import './css/basket.css'
import back from '../assets/arrow-left.svg'
import BasketFoodCard from '../components/cards/food-basket/food-basket.tsx';

const url = "http://82.202.138.105:8081/api"
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

const ProfilePage: React.FC = () => {
    const [basket, setBasket] = useState<any>(mockBasket);

    const fetchBasket = async () => {
        try {
            const response = await axios.get(`${url}/order/basket`)
            if (response.status === 200) {
                setBasket(response.data)
            } 
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    };

    const handleUpdateInfoBasket = async (body: {}) => {
        try {
            const response = await axios.post(`${url}/order/basket`, body)
            if (response.status === 200) {
                setBasket(response.data)
            }
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    };

    useEffect(() => {
        fetchBasket();
    }, []);

    return (
    <div className="basket">
        <div className="basket-header">
            <BackButton style={{borderRadius: '50%', padding: '10px 10px 6px 10px'}}>
                <img src={back}/>
            </BackButton>
            <p>Корзина</p>
        </div>
        <div className="basket-main">
        <div className="basket-food">
            {basket.food.map((f: any) =>
            <div className="" key={f.id}>
                <BasketFoodCard
                    id={f.id}
                    name={f.name}
                    img={f.img}
                    price={f.price}
                    weight={f.weight}
                    count={f.count}
                    onAdd={fetchBasket}
                    onRemove={fetchBasket}
                />
            </div>
            )}
        </div>
        </div>
    </div>
    )
};
export default ProfilePage;