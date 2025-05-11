import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {mockMenuData, mockInfoData, mockBasket} from './mock/main';
import Button from '../components/button/button';
import MainFoodCard from '../components/cards/food-main/food-main';
import { Link } from 'react-router-dom';
import "./css/main.css"
import basketBlack from '../assets/basket-black.svg'
import MiniOrderCard from '../components/cards/mini-order/mini-order';
import {url, minio, statuses, types} from '../const/const'
import TextImageDisplay from '../components/part/infobar/infobar';

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
    const [info, setInfo] = useState<any>('');
    //const [menu, setMenu] = useState<any[]>(mockMenuData);
    const [menu, setMenu] = useState<any[]>([]);
    const [current, setCurrent] = useState<any[]>([]);
    const [basket, setBasket] = useState<any>('');
    const [selectedCategory, setSelectedCategory] = useState<any>('');
    const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

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
            const response = await axios.get(`${url}/order/basket`)
            if (response.status === 200) {
                if (response.data === "У вас нет корзины") {
                    setBasket('')
                    return
                }
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
                setMenu(response.data)
                setSelectedCategory(response.data[0])
                setActiveCategoryIndex(response.data[0].id)
            }
        } catch (error) {
            console.log("Ошибка в получении меню", error)
        }
    };

    const fetchCurrent = async () => {
        try {
            const response = await axios.get(`${url}/order/current`)
            if (response.status === 200) {
                console.log(response.data)
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
        const item = basket && basket.food && basket.food.find((food: any) => food.item.id === foodId);
        return item ? item.count : 0;
    };

    const handleItemClick = (id: number) => {
        setActiveCategoryIndex(id)
        const selectedItem = menu.find(item => item.id === id);
        if (selectedItem) {
            selectedItem.items.forEach((food:any) => {
                const basketItem = mockBasket.food.find(b => b.item.id === food.id);
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
            console.log(body)
            const response = await axios.post(`${url}/order/food`, body)
            console.log(response)
            return response
        } catch (error) {
            console.log("Ошибка в получении корзины", error)
        }
    }
    
    const handleAddToBasket = async (id: number, food:any) => {
        console.log(`Добавить блюдо ${id} в корзину`);
        const response = await ChangeFoodCountInBasket(food.id, food.count+1)
        if (response?.status === 200) {
            setBasket(response.data)
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
        const exist = basket.food.find((f:any) => f.item.id === id);
        if (!exist) return;

        const response = await ChangeFoodCountInBasket(food.id, food.count-1)
        if (response?.status === 200) {
            console.log()
            setBasket(response.data)
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

    const handleCurrentOrderClick = (id: number) => {
        
    };

    return (<>
        <div className="main-header">
            <img src={minio+info?.logo} style={{height: '28px'}}/>
            <div style={{display: 'flex', alignItems: 'center'}}>
            {basket && <Link to="/basket">
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
                </Link>}
                <div style={{ position: 'relative', marginLeft: '10px' }}>
                    <p onClick={toggleMenu}>{name}</p>
                </div>
                {isMenuOpen && (
                <div className="menu">
                    <Link to="/profile" style={{color: '#141414'}}>Мои заказы</Link>
                    <div onClick={handleMenuItemClick} style={{marginTop: '10px', cursor: 'pointer' }}>
                        Выйти
                    </div>
                </div>
                )}
            </div>
        </div>
        {current && <p></p>}
        <div className="main-current">
            {current.map((order: any) => (
                <MiniOrderCard
                    onClick={handleCurrentOrderClick}
                    status={statuses[order.status]}
                    number={order.id}
                    sum={order.sum}
                    date={order.created_at}
                    variant={types[order.type]}
                />
            ))}
        </div>
        <div className="main-info">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <p style={{fontSize: '28px', fontWeight:600, textAlign: 'left'}}>{info?.name}</p>
                <div>
                    <p style={{marginTop: '8px', color:'#7b7b7b'}}>{info?.address}</p>
                    <p style={{color:'#7b7b7b'}}>{info?.phone}</p>
                </div>
            </div>
            <TextImageDisplay descrip={info?.descripArr} img={info?.imgArr}/>
        </div>
        <div className="main-menu">
            <p style={{fontSize: '24px', fontWeight: 600, margin: '20px 0 10px'}}>Меню</p>
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
            {selectedCategory && selectedCategory.items.map((food: any) => (<>
                <MainFoodCard
                    key={food.id}
                    id={food.id}
                    name={food.name}
                    price={food.price}
                    weight={food.weight}
                    img={minio+food.img_url}
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