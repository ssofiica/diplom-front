import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

const BasketPage: React.FC = () => {
    const [basket, setBasket] = useState<any>(mockBasket);
    const navigate = useNavigate();

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
        console.log(basket.type)
        fetchBasket();
    }, []);

    const handlePay = async () => {
        try {
            const response = await axios.post(`${url}/order/pay`)
            if (response.status === 200) {
                setBasket({})
                navigate("/");
            }
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    };

    return(
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
        <div className="basket-info">
            <textarea
                /*ref={(el) =>{ textareaRefs.current[index] = el!}}*/
                value={basket.comment}
                /*onInput={(e) => handleInput(e, index)}*/
                placeholder="Комменатрий к заказу"
            />
            <input
                type="text"
                value={basket.comment}
                onChange={(e) => handleUpdateInfoBasket({comment: e.target.value})}
                placeholder="Комментарий к заказу"
                className="input-field"
            />
            <div className="order-type">
                {basket.type === 'pickup' ? 
                    <div onChange={(e) => handleUpdateInfoBasket({type: 'pickup'})}>Самовывоз</div> 
                    : <p style={{margin: '0 12px 0 0'}} className="selected" onChange={(e) => handleUpdateInfoBasket({type: 'pickup'})}>Самовывоз</p>}
                {basket.type === 'delivery' ? 
                    <div 
                        onChange={(e) => handleUpdateInfoBasket({type: 'delivery'})}
                        className="selected">Доcтавка</div> 
                    : <p>Доставка</p>}
            </div>
            {basket.type === 'delivery' &&
                <input
                    type="text"
                    value={basket.address}
                    onChange={(e) => handleUpdateInfoBasket({address: e.target.value})}
                    placeholder="Адрес доставки"
                    className="input-field"
                />
            }
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span>Итого {basket.sum} ₽</span>
                <Button onClick={handlePay}>Оформить</Button>
            </div>
        </div>
        </div>
    </div>
    )
};
export default BasketPage;