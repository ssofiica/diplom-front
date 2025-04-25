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

const BasketPage: React.FC = () => {
    const [basket, setBasket] = useState<any>(mockBasket);
    const [comment, setComment] = useState<string>('');
    const [type, setType] = useState<string>(mockBasket.type);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const navigate = useNavigate();

    const fetchBasket = async () => {
        try {
            const response = await axios.get(`${url}/order/basket`)
            if (response.status === 200) {
                setBasket(response.data)
                setComment(response.data?.comment)
                if (response.data.type) {
                    setType(response.data.type)
                } else {
                    setType('pickup')
                }
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
                if (response.data.type) {
                    setType(response.data.type)
                } else {
                    setType('pickup')
                }
            }
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    };

    useEffect(() => {
        fetchBasket();
        console.log(type)
    }, []);

    const handlePay = async () => {
        console.log()
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

    const handleComment = async () => {
        if (comment != basket.comment) {
            console.log(comment)
            handleUpdateInfoBasket({"comment": comment})
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

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
        <div className="basket-info">
            <div className='total'>
                <p>Сумма заказа</p>
                <p>{basket.sum} ₽</p>
            </div>
            <textarea
                ref={textareaRef}
                value={comment}
                onInput={handleInput}
                onChange={(e) => setComment(e.target.value)}
                onBlur={handleComment}
                placeholder="Комменатрий к заказу"
                style={{marginTop: '10px'}}
            />
            <div className="order-type">
                {type === 'pickup' ? 
                    <div
                        className="selected">
                        Самовывоз</div> 
                    : <div onClick={(e) => handleUpdateInfoBasket({type: 'pickup'})}>
                        Самовывоз</div>}
                {type === 'delivery' ? 
                    <div 
                        onClick={(e) => handleUpdateInfoBasket({type: 'delivery'})}
                        className="selected">Доcтавка</div> 
                    : <div>Доставка</div>}
            </div>
            {basket.type === 'delivery' &&
                <input
                    type="text"
                    value={basket.address}
                    onChange={(e) => handleUpdateInfoBasket({address: e.target.value})}
                    placeholder="Адрес доставки"
                    className="input-field"
                    style={{marginTop: '14px'}}
                />
            }
            <div style={{display: 'flex', alignItems: 'center', marginTop: '14px'}}>
                <p style={{whiteSpace: 'nowrap', marginRight: '10px'}}>Итого {basket.sum} ₽</p>
                <Button onClick={handlePay} style={{width: '100%'}}>Оформить</Button>
            </div>
        </div>
        </div>
    </div>
    )
};
export default BasketPage;