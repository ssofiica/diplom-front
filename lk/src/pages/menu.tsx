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
import SelectBox from '../components/dropdown/dropdown';
import {minio, url} from '../const/const'

const mockMenuData = [
  { id: 1, name: 'Пицца', restaurant_id: 1, items: [
    {id: 1, name: 'Маргарита bbbb vvv vvvvv aaa sdfgr tasdrgg asff ffff', price: 500, weight: 400, img_url: img1, status: 'stop', category_id: 1},
    {id: 2, name: 'Груша горгонзола', price: 700, weight: 400, img_url: img2, status: 'in', category_id: 1},
  ] },
  { id: 2, name: 'Паста', items: [
    {id: 3, name: 'Карбонара', price: 550, weight: 300, img_url: img1, status: 'in', category_id: 2},
    {id: 4, name: 'Арабьята', price: 400, weight: 350, img_url: img2, status: 'in', category_id: 2},
  ] },
  { id: 3, name: 'Салаты', items: [
    {id: 5, name: 'Буррата со страчателой', price: 500, weight: 400, img_url: img1, status: 'in', category_id: 3},
  ] },
];

const rest_id = 1
const statusArr = [{ value: 'in', label: 'Активные' }, { value: 'stop', label: 'Стоп-лист' }]

const MenuPage: React.FC = () => {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [menu, setMenu] = useState<any[]>(mockMenuData);
  const [selectedCategory, setSelectedCategory] = useState<any>(mockMenuData[0]);
  const [selectedFood, setSelectedFood] = useState<any>('');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(mockMenuData[0].id);
  const [status, setStatus] = useState<string>('in');

  const AddFood = async (dish: { name: string; weight: number; price: number; category: number; status: string, img: File | null }) => {
    try {
      const resp = await axios.post(`${url}/menu/food/add`, {
	      name: dish.name,
	      restaurant_id: rest_id,
	      category_id: activeCategoryIndex,
        weight: dish.weight,
	      price: dish.price,
	      status: dish.status,
      });
      if (resp.status === 200) {
        const formData = new FormData();
        if (dish.img) {
          formData.append('img', dish.img);
        }
        const response= await axios.put(`${url}/menu/food/${resp.data.id}/img`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          resp.data.img_url = response.data
        }
      }
      return resp
    } catch (error) {
      console.log("Ошибка в добавлении блюда", error)
    }
  };

  const handleAddDish = async (dish: { name: string; weight: number; price: number; category: number; status: string, img: File | null}) => {
    try {
      console.log("ok")
      const response = await AddFood(dish);
      console.log(response)
      if (response?.status === 200) {
        let newFood = {
          id: response.data.id,
          name: response.data.name,
          price: response.data.price,
          weight: response.data.weight,
          img_url: response.data.img_url,
          status: response.data.status,
          category_id: response.data.category_id,
        }
        setSelectedCategory((ctgInfo: any) => ({
          ...ctgInfo,
          items: [...ctgInfo.items, newFood]
        }));
      } else {
        //TODO: notify
      }
    } catch(error) {
      console.log("Ошибка в добавлении блюда", error)
    }
  };

  const editFood = async (id: number, dish: { name: string; weight: number; price: number; category: number; status: string }) => {
    try {
      const body: Record<string, any> = { id: id};
      if (dish.name != selectedFood.name) body.name = dish.name;
      if (dish.price != selectedFood.price) body.price = dish.price;
      if (dish.weight != selectedFood.weight) body.weight = dish.weight;
      if (dish.status != selectedFood.status) body.status = dish.status;
      if (dish.category != selectedFood.category) body.category_id = dish.category; 
      console.log(body)
      const resp = await axios.put(`${url}/menu/food/${id}/change`, body);
      return resp
    } catch (error) {
      console.log("Ошибка в добавлении блюда", error)
    }
  };

  const handleEditFood = async (dish: { name: string; weight: number; price: number; category: number; status: string }) => {
    console.log('Редактирование блюда:', dish);
    const response = await editFood(selectedFood.id, dish);
    if (response?.status === 200){
      if (response.data.category_id === activeCategoryIndex) {
        const updatedItems = selectedCategory.items.map((item:any) => {
          if (item.id === response.data.id) {
            return { ...response.data };
          }
          return item; // Возвращаем неизменённый элемент
        });
    
        setSelectedCategory({ ...selectedCategory, items: updatedItems });
      }
    }
  };

  const addCategory = async (name: string, id: number) => {
    try {
      const resp = await axios.post(`${url}/menu/category/add`, {
        name: name,
        restaurant_id: id
      });
      return resp
    } catch (error) {
      console.log("Ошибка в добавлении категории", error)
    }
  };

  const deleteFood = async (id: number) => {
    try {
      const resp = await axios.delete(`${url}/menu/food/${id}`);
      return resp
    } catch (error) {
      console.log("Ошибка в удалении блюда", error)
    }
  };

  const handleAddCategory = async (name: string) => {
    const response = await addCategory(name, rest_id);
    if (response?.status === 200) {
      // TODO: когда на бэке сделается dto, то тут надо уменьшить регистр
      let newCategory = { id: response.data.Id, name: response.data.Name, items: []}
      setMenu((prevMenu) => [...prevMenu, newCategory]);
    }
  };

  const getByStatus = async (status: string) => {
    try {
      const resp = await axios.get(`${url}/menu/${activeCategoryIndex}`, {
        params: {
          status: status
        }
      });
      return resp
    } catch (error) {
      console.log("Ошибка в получении блюд по статусу", error)
    }
  };

  const handleGetByStatus = async (status: string) => {
    const response = await getByStatus(status);
    if (response?.status === 200) {
      console.log(response?.data, response?.status)
      setStatus(status)
      setSelectedCategory((ctg: any) => ({
        ...ctg,
        items: [...response.data],
      }));
    }
  };

  const fetchMenu = async () => {
    try {
      const resp = await axios.get(`${url}/menu/category-list`)
      if (resp?.status === 200){
        setMenu(resp.data)
        setSelectedCategory(resp.data[0])
        setActiveCategoryIndex(resp.data[0].id)
        const response = await getFoodByCategory(resp.data[0].id)
        console.log(response?.data)
        if (response?.status === 200){
          setSelectedCategory((prev: any) => ({...prev, items: response.data}));
        }
      }
    } catch (error) {
      console.log("Ошибка в получении меню", error)
    }
  };
  
  useEffect(() => {
      fetchMenu();
  }, []);

  const handleItemClick = async (id: number) => {
    setActiveCategoryIndex(id)
    const resp = await getFoodByCategory(id)
    if (resp?.status === 200){
      setSelectedCategory((prev: any) => ({...prev, items: resp.data}));
      setStatus(status)
    }
  };

  const getFoodByCategory = async (id: number) => {
    try {
      const resp = await axios.get(`${url}/menu/${id}`);
      return resp
    } catch (error) {
      console.log("Ошибка в получении блюд категории", error)
    }
  };

  const changeFoodStatus = async (id: number, status: string) => {
    try {
      const resp = await axios.put(`${url}/menu/food/${id}/status`, {
          status: status
      });
      return resp
    } catch (error) {
      console.log("Ошибка в получении блюд по статусу", error)
    }
  };

  const handleChangeFoodStatus = async (id: number, status: string) => {
    console.log(id, status)
    const response = await changeFoodStatus(id, status);
    console.log(response)
    if (response?.status === 200){
      setSelectedCategory((ctg: any) => ({
        ...ctg,
        items: ctg.items.filter((ctg: any) => ctg.id !== id),
      }));
    }
  }

  const handleDeleteFood = async (id: number) => {
    console.log(id)
    const response = await deleteFood(id);
    if (response?.status === 200) {
      setSelectedCategory((ctg: any) => ({
        ...ctg,
        items: ctg.items.filter((ctg: any) => ctg.id !== id),
      }));
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
        {menu.map((item: any) => (
          <div key={item.id} onClick={() => handleItemClick(item.id)}>
            <p className="category" style={{
            backgroundColor: activeCategoryIndex === item.id ? '#f4f4f4' : '#fff',
            width: activeCategoryIndex === item.id ? '10em' : '100%',
            borderRadius: '0.5em',
          }}>{item.name}</p>
          </div>
        ))}
        </div>
      </div>
      <div className="right">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <p style={{fontSize: '20px', marginBottom: '20px'}}>{selectedCategory.name}</p>
          <div>
            <SelectBox
              options={statusArr}
              onChange={handleGetByStatus}
              value={status}
            />
            <Button style={{marginBottom: '20px', marginLeft: '20px'}} onClick={() => setIsFoodModalOpen(true)}>Добавить блюдо</Button>
          </div>
          <AddFoodModal
            isOpen={isFoodModalOpen}
            onClose={() => setIsFoodModalOpen(false)}
            onSubmit={handleAddDish}
            title='Новое блюдо'
            id={activeCategoryIndex}
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
          {selectedCategory.items?.map((item:any) => (
            <div key={item.id} className="row">
              <img className="img" src={minio+item.img_url} alt='Фотка'></img>
              <p className="row-style" style={{paddingLeft: '5px'}}>{item.name}</p>
              <p className="row-style" style={{textAlign: 'center'}}>{item.weight}</p>
              <p className="row-style" style={{textAlign: 'center'}}>{item.price}</p>
              <span className="row-style">
                {status === 'in' && 
                  <Button onClick={()=>{
                    setSelectedFood(item)
                    handleChangeFoodStatus(item.id, 'stop')
                  }}>В стоп-лист</Button>
                }
                {status === 'stop' && 
                  <Button onClick={()=>{
                    setSelectedFood(item)
                    handleChangeFoodStatus(item.id, 'in')
                  }}>Вернуть в меню</Button>
                }
              </span>
              <span className="row-style">
                <ImgButton src={edit} imgStyle={{height: "1.2em"}} onClick={() => {
                  setIsEditFoodModalOpen(true);
                  setSelectedFood(item)
                }}/>
              </span>
              <span className="row-style">
                <ImgButton src={del} imgStyle={{height: "1.2em"}} onClick={() =>{ 
                  setIsAcceptModalOpen(true)
                  setSelectedFood(item)
                }}>
                </ImgButton>
              </span>
              <AddFoodModal
                isOpen={isEditFoodModalOpen}
                onClose={() => setIsEditFoodModalOpen(false)}
                onSubmit={handleEditFood}
                title='Редактирование блюда'
                food={selectedFood}
                id={activeCategoryIndex}
              />
              <AcceptModal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                onSubmit={() => handleDeleteFood(selectedFood.id)}
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