import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {mockBasket} from './mock/main';
import Button from '../components/button/button';
import BackButton from '../components/button/back';
import './css/basket.css'
import back from '../assets/arrow-left.svg'
import BasketFoodCard from '../components/cards/food-basket/food-basket.tsx';
import {url, minio} from '../const/const'
import { getTokenFromStorage, isTokenValid } from './jwt/token.tsx';

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
    //const [basket, setBasket] = useState<any>(mockBasket);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [user, setUser] = useState<any>()
    const [basket, setBasket] = useState<any>('');
    const [comment, setComment] = useState<string>('');
    const [type, setType] = useState<string>(mockBasket.type);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const navigate = useNavigate();

    const fetchBasket = async () => {
        try {
            const tkn = getTokenFromStorage()
            const response = await axios.get(`${url}/order/basket`, {
                headers: {
                    Authorization: `Bearer ${tkn}`,
                },
            });
            if (response.status === 200) {
                setBasket(response.data)
                console.log(response.data)
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
            const tkn = getTokenFromStorage()
            const response = await axios.post(`${url}/order/info`, body, {
                headers: {
                    Authorization: `Bearer ${tkn}`,
                },
            })
            if (response.status === 200) {
                console.log(response.data)
                //setBasket(response.data)
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
    }, []);

    const handlePay = async () => {
        console.log()
        try {
            const tkn = getTokenFromStorage()
            console.log(tkn)
            const response = await axios.post(`${url}/order/pay`, null, {
                headers: {
                    Authorization: `Bearer ${tkn}`,
                },
            })
            if (response.status === 200) {
                setBasket('')
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

    const ChangeFoodCountInBasket = async (id: number, count:any) => {
        try {
            const body = {
                food_id: id,
                count: count,
            }
            console.log(body)
            const tkn = getTokenFromStorage()
            const response = await axios.post(`${url}/order/food`, body, {
                headers: {
                    Authorization: `Bearer ${tkn}`,
                },
            });
            console.log(response)
            return response
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    }

    const handleAddToBasket = async (id: number, food:any) => {
        const tkn = getTokenFromStorage()
        console.log(tkn)
        if (tkn === null) {
            navigate("/login")
            return
        }
        if (!isTokenValid(tkn)) {
            navigate("/login")
            return
        }

        console.log(`Добавить блюдо ${id} в корзину`);
        const response = await ChangeFoodCountInBasket(food.id, food.count+1)
        if (response?.status === 200) {
            setBasket(response.data)
        }
    };
    
    const handleRemoveFromBasket = async (id: number, food:any) => {
        console.log(`Удалить блюдо ${id} из корзины`);
        const exist = basket.food.find((f:any) => f.item.id === id);
        if (!exist) return;

        const response = await ChangeFoodCountInBasket(food.id, food.count-1)
        if (response?.status === 200) {
            console.log()
            setBasket(response.data)
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
            {basket.sum === 0 ? <div>Корзина пуста</div>: 
            basket.food?.map((f: any) => 
            f.item ? (
                <div className="" key={f.item.id}>
                    <BasketFoodCard
                        id={f.item.id}
                        name={f.item.name}
                        img={minio+f.item.img_url}
                        price={f.item.price}
                        weight={f.item.weight}
                        count={f.count}
                        onAdd={handleAddToBasket}
                        onRemove={handleRemoveFromBasket}
                    />
                </div>
            ) : null
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
                    : <div onClick={() => handleUpdateInfoBasket({type: 'pickup'})}>
                        Самовывоз</div>}
                {type === 'delivery' ? 
                    <div 
                        className="selected">Доcтавка</div> 
                    : <div onClick={() => {
                            handleUpdateInfoBasket({type: 'delivery'})
                        }}>
                        Доставка</div>}
            </div>
            {type === 'delivery' &&
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