import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {mockMenuData, mockInfoData, mockBasket} from './mock/main';
import Button from '../components/button/button';
import MainFoodCard from '../components/cards/food-main/food-main';
import { Link } from 'react-router-dom';
import "./css/main.css"
import basketBlack from '../assets/basket-black.svg'

const url = "http://82.202.138.105:8081/api"
const rest_id = 1
const name = "София"

interface Info {
    id: number,
    name: string;
    address: string;
    logo: string;
    phone: string;
    email: string;
    descripArr: string[];
    imgArr: string[];
    //schedule
}

interface Food {
    id: number,
    name: string,
    price: number,
    weight: number,
    img: string,
    count: number,
}

const MainPage: React.FC = () => {
    const [info, setInfo] = useState<Info>(mockInfoData);
    const [menu, setMenu] = useState<any[]>(mockMenuData);
    const [current, setCurrent] = useState<any[]>([]);
    const [basket, setBasket] = useState<any>(mockBasket);
    const [selectedCategory, setSelectedCategory] = useState<any>(mockMenuData[1]);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(mockMenuData[1].id);

    const fetchInfo = async () => {
        try {
          const response = await axios.get(`${url}/info`)
          if (response.status === 200) {
             setInfo({
                id: response.data.id,
                name: response.data.name,
                address: response.data.address,
                logo: response.data.logo_url,
                phone: response.data.phone,
                email: response.data.email,
                descripArr: response.data.description,
                imgArr: response.data.img_urls,
             })
          }
        } catch (error) {
            console.log("Ошибка в получении инфы", error)
        }
    };

    const fetchBasket = async () => {
        try {
            //TODO: проверить url
            const response = await axios.get(`${url}/order/basket`)
            if (response.status === 200) {
                setBasket(response.data)
            }
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    };
    
    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${url}/menu`)
            if (response.status === 200) {
                setBasket(response.data)
            }
        } catch (error) {
            console.log("Ошибка в получении меню", error)
        }
    };

    const fetchCurrent = async () => {
        try {
            const response = await axios.get(`${url}/order/current`)
            if (response.status === 200) {
                setCurrent(response.data)
            }
        } catch (error) {
            console.log("Ошибка в получении заказов", error)
        }
    };
    
    useEffect(() => {
        fetchInfo();
        fetchMenu();
        fetchBasket();
        fetchCurrent();
    }, []);
    
    const getCountInBasket = (foodId:  number) => {
        const item = basket.food.find((food: any) => food.id === foodId);
        return item ? item.count : 0;
    };

    const handleItemClick = (id: number) => {
        setActiveCategoryIndex(id)
        const selectedItem = menu.find(item => item.id === id);
        if (selectedItem) {
            selectedItem.items.forEach((food:any) => {
                const basketItem = mockBasket.food.find(b => b.id === food.id);
                if (basketItem) {
                    food.count = basketItem.count;
                } else {
                    food.count = 0
                }
            });
            setSelectedCategory(selectedItem);
        }
    };

    const ChangeFoodCountInBasket = async (id: number, count:any) => {
        try {
            const body = {
                food_id: id,
                count: count,
            }
            const response = await axios.post(`${url}/order/food`, body)
            return response
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    }
    
    const handleAddToBasket = async (id: number, food:any) => {
        console.log(`Добавить блюдо ${id} в корзину`);
        const response = await ChangeFoodCountInBasket(food.id, food.count+1)
        if (response?.status === 200) {
            //setBasket(response.data)
        }
        //TODO: мб надо убрать кусок ниже
        const exist = basket.food.find((food:any) => food.id === id)
        const c = food.count
        if (exist) {
            setBasket((prev: any) => ({
                ...prev,
                food: prev.food.map((item: any) => 
                  item.id === id
                    ? { ...item, count: c + 1 }
                    : item
                ),
                sum: prev.sum + food.price,
            }));
        } else {
            console.log(food)
            setBasket((prev:any) => ({
                ...prev,
                food: [...prev.food, { id: id, name: food.name, price: food.price, weight: food.weight, img_url: food.img,  count: 1 }],
                sum: prev.sum + food.price
            }));
        }
        setSelectedCategory((cat: any) => ({
            ...cat,
            items: cat.items.map((item: any) => {
                return item.id === id 
                ? { ...item, count: item.count + 1 } 
                : item
            })
        }));
        console.log(selectedCategory)
    };
    
    const handleRemoveFromBasket = async (id: number, food:any) => {
        console.log(`Удалить блюдо ${id} из корзины`);
        const exist = basket.food.find((f:any) => f.id === id);
        if (!exist) return;

        const response = await ChangeFoodCountInBasket(food.id, food.count-1)
        if (response?.status === 200) {
            //setBasket(response.data)
        }
        //TODO мб и не надо менять баскет, ведь с бэка приходит инфа

        if (exist.count > 1) {
            // Уменьшаем количество, если больше 1
            setBasket((prev:any) => ({
              ...prev,
              food: prev.food.map((f:any) =>
                f.id === id 
                  ? { ...f, count: food.count - 1 } 
                  : f
              ),
              sum: prev.sum - food.price
            }));
        } else {
            // Удаляем блюдо, если количество 1
            setBasket((prev:any) => ({
              ...prev,
              food: prev.food.filter((f: any) => f.id !== id),
              sum: prev.sum - food.price
            }));
        }
        setSelectedCategory((cat: any) => ({
            ...cat,
            items: cat.items.map((item: any) => {
                return item.id === id 
                ? { ...item, count: item.count - 1 } 
                : item
            })
        }));
    };

    return (<>
        <div className="main-header">
            <p style={{fontSize: "28px", margin: '12px 0'}}>{info?.name} </p>
            <div style={{display: 'flex'}}>
            <Link to="/basket">
                <Button 
                    style={{
                        background: '#f4f4f4',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0em 1.8em',
                        borderRadius: '1.8em',
                    }}>
                    <img src={basketBlack} style={{marginRight: '15px', color: '#141414'}}/>
                    <p style={{color: '#141414', fontWeight: 700, fontSize: '18px', margin: '0.6em 0em'}}>
                        {basket.sum} ₽
                    </p>
                </Button>
            </Link>
            <Link to="/profile">{name}</Link>
            </div>
        </div>
        <div className="main-info">
            <p>{info?.address} {info?.phone}</p>
            {info?.descripArr.map((item: any) => (
                <p>{item}</p>
            ))}
        </div>
        <div>
            <p style={{fontSize: '24px', fontWeight: 500, margin: '10px 0'}}>Меню</p>
            <div className="category-container">
            {menu.map((item: any) => (
                <div key={item.id} onClick={() => handleItemClick(item.id)}>
                    <p style={{
                        color: activeCategoryIndex === item.id ? '#000' : '#adadad',
                        fontWeight: activeCategoryIndex === item.id ? '500' : '400',
                        marginTop: '0',
                    }}>{item.name}</p>
                </div>
            ))}
            </div>
            <div className="food-container">
            {selectedCategory.items.map((food: any) => (<>
                <MainFoodCard
                    key={food.id}
                    id={food.id}
                    name={food.name}
                    price={food.price}
                    weight={food.weight}
                    img={food.img_url}
                    count={getCountInBasket(food.id)}
                    onAdd={handleAddToBasket}
                    onRemove={handleRemoveFromBasket}
                />
            </>))}
            </div>
        </div>
    </>);
};

export default MainPage;