import React, { useState, useEffect } from 'react';
import Button, {ImgButton} from '../components/button/button'
import AddFoodModal from '../components/form/addFood';
import AddCategoryModal from '../components/form/addCategory';
import './css/menu.css'
import img1 from '../assets/57.jpg'
import img2 from '../assets/94.jpg'
import edit from '../assets/edit-button.svg'
import del from '../assets/delete-button.svg'
import axios from 'axios';
import AcceptModal from '../components/form/accept';

const mockMenuData = [
  { id: 1, name: 'Пицца', restaurant_id: 1, items: [
    {id: 1, name: 'Маргарита bbbb vvv vvvvv aaa sdfgr tasdrgg asff ffff', price: 500, weight: 400, img_url: img1, status: 'in', category_id: 1},
    {id: 2, name: 'Груша горгонзола', price: 700, weight: 400, img_url: img2, status: 'in', category_id: 1},
  ] },
  { id: 2, name: 'Паста', items: [
    {id: 1, name: 'Карбонара', price: 550, weight: 300, img_url: img1, status: 'in', category_id: 2},
    {id: 2, name: 'Арабьята', price: 400, weight: 350, img_url: img2, status: 'in', category_id: 2},
  ] },
  { id: 3, name: 'Салаты', items: [
    {id: 3, name: 'Буррата со страчателой', price: 500, weight: 400, img_url: img1, status: 'in', category_id: 3},
  ] },
];

const rest_id = 1
const url = "http://localhost:8080/api"

const MenuPage: React.FC = () => {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [menu, setMenu] = useState<any[]>(mockMenuData);
  const [selectedCategory, setSelectedCategory] = useState<any>(mockMenuData[0]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  const handleAddDish = (dish: { name: string; weight: number; price: number; category: string }) => {
    console.log('Добавлено блюдо:', dish);
    // Здесь можно добавить логику для сохранения блюда
  };

  const addCategory = async (name: string, id: number) => {
    try {
      const resp = await axios.post(`${url}/menu/category/add`, {
        name: name,
        restaurant_id: id
      });
      console.log(resp)
      console.log(resp.data)
      return resp.data
    } catch (error) {
      console.log("Ошибка в получении меню", error)
    }
  };

  const deleteFood = async (id: number) => {
    try {
      const resp = await axios.delete(`${url}/menu/food/${id}`);
      console.log(resp)
      return resp
    } catch (error) {
      console.log("Ошибка в получении меню", error)
    }
  };

  const handleAddCategory = async (name: string) => {
    console.log('Добавлено блюдо:', name);
    const data = await addCategory(name, rest_id);
    let newCategory = { id: data.id, name: data.name, items: []}
    setMenu((prevMenu) => [...prevMenu, newCategory]);
  };

  const fetchMenu = async () => {
    try {
      const resp = await axios.get(`${url}/menu`)
      console.log(resp)
      console.log(resp.data)
      setMenu(resp.data)
      setSelectedCategory(resp.data[0])
      setActiveCategoryIndex(0)
    } catch (error) {
      console.log("Ошибка в получении меню", error)
    }
  };
  
  useEffect(() => {
      fetchMenu();
  }, []);

  const handleItemClick = (id: number) => {
    setActiveCategoryIndex(id)
    const selectedItem = menu.find(item => item.id === id);
    if (selectedItem) {
      setSelectedCategory(selectedItem);
    }
    console.log(selectedCategory)
  };

  const handleReturnToMenu = (id: number) => () => {
    console.log(id)
    // вызов запроса
    // удаление блюда из массива
  }

  const handleDeleteFood = async (id: number) => {
    const response = await deleteFood(id);
    if (response?.status === 200) {
      //пофиксить
      //setMenu(menu.filter(item => item.id !== id));
    } else if (response?.status === 500) {
      console.log('Ошибка сервера при удалении элемента');
    }
  }

  return (
    <div className="menu">
      <div className="left">
        <p style={{marginLeft: '10px', fontSize: '20px', fontWeight: '500', marginBottom: '20px'}}>Меню</p>
        <Button onClick={() => setIsCategoryModalOpen(true)}>Добавить категорию</Button>
        <AddCategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onSubmit={handleAddCategory}
        />
        <div className="categories">
        {menu.map((item) => (
          <div key={item.id} onClick={() => handleItemClick(item.id)}>
            <p key={item.id} className="category" style={{
            backgroundColor: activeCategoryIndex === item.id ? '#f4f4f4' : '#fff',
            borderRadius: '0.5em',
          }}>{item.name}</p>
          </div>
        ))}
        </div>
      </div>
      <div className="right">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <p style={{fontSize: '20px', marginBottom: '20px'}}>{selectedCategory.name}</p>
          <Button style={{marginBottom: '20px'}} onClick={() => setIsFoodModalOpen(true)}>Добавить блюдо</Button>
          <AddFoodModal
            isOpen={isFoodModalOpen}
            onClose={() => setIsFoodModalOpen(false)}
            onSubmit={handleAddDish}
          />
        </div>
        <div className="table">
          <div className="header">
            <p className="th-style">Фото</p>
            <p className="th-style">Название</p>
            <p className="th-style">Вес, г</p>
            <p className="th-style">Цена, руб</p>
            <p className="th-style"> </p>
            <p className="th-style"> </p>
            <p className="th-style"> </p>
          </div>
          {selectedCategory.items.map((item:any) => (
            <div key={item.id} className="row">
              <img className="img" src={item.img_url}></img>
              <p className="row-style" style={{paddingLeft: '5px'}}>{item.name}</p>
              <p className="row-style" style={{textAlign: 'center'}}>{item.price}</p>
              <p className="row-style" style={{textAlign: 'center'}}>{item.weight}</p>
              <span className="row-style">
                <Button onClick={handleReturnToMenu(item.id)}>Вернуть в меню</Button>
              </span>
              <span className="row-style">
                <ImgButton src={edit} onClick={() => setIsFoodModalOpen(true)} imgStyle={{height: "1.2em"}}>
                </ImgButton>
              </span>
              <span className="row-style">
                <ImgButton src={del} onClick={() => setIsAcceptModalOpen(true)} imgStyle={{height: "1.2em"}}>
                </ImgButton>
              </span>
              <AcceptModal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                onSubmit={() => handleDeleteFood(item.id)}
                text='Удалить блюдо?'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;