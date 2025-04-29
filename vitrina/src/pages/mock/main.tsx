export const mockMenuData = [
    { id: 1, name: 'Пицца', restaurant_id: 1, items: [
      {id: 1, name: 'Маргарита bbbb vvv vvvvv aaa h hghii hhhbm tasdrgg asff ffff', price: 500, weight: 400, img_url: "/fjfj", status: 'stop', category_id: 1, count: 0},
      {id: 2, name: 'Груша горгонзола', price: 700, weight: 400, img_url: "/fjf", status: 'in', category_id: 1, count: 0},
    ] },
    { id: 2, name: 'Паста', items: [
      {id: 3, name: 'Карбонара', price: 550, weight: 300, img_url: "/ff", status: 'in', category_id: 2, count: 0},
      {id: 4, name: 'Арабьята', price: 400, weight: 350, img_url: "/asd", status: 'in', category_id: 2, count: 0},
    ] },
    { id: 3, name: 'Салаты', items: [
      {id: 5, name: 'Буррата со страчателой', price: 500, weight: 400, img_url: "/asd", status: 'in', category_id: 3, count: 0},
    ] },
    { id: 4, name: 'Завтраки', items: []},
    { id: 5, name: 'Десерты', items: []},
    { id: 6, name: 'Напитки', items: []},
];

export const mockInfoData = {
    id: 1,
    name: "Mates",
    address: "ул. Тверская",
    logo: "/asd",
    phone: "89009009090",
    email: "a@mail.ru",
    descripArr: ["Mátes Pizza - городской проект от команды Mátes. Классическая неаполитанская пицца, пасты и закуски, мясо, рыба, авторские коктеили и вино, спешалти кофе и свежая выпечка каждый день. За кухню отвечает шеф-повар Иван Фомин, за напитки - шеф-бармен Никита Москвин и шеф-бариста Дмитрий Удовенко", 
      "В барной карте вы можете найти как классику, так и авторские коктейли от шеф-бармена Никиты Москвина — Sorrel Spritz на Джине и клубнике, Corn Star на текиле с кукурузой и личи и др"],
    imgArr: ["restaurant/1/1.jpg", "restaurant/1/2.jpg"],
};

export const mockBasket = {
  id: 5,
  user_id: 1,  
  type: "pickup",
  status: 'draft',
  sum: 1600, 
  restaurant_id: 1,
  food: [
    {item: {id: 7, name: 'Зелёный салат', price: 600, img: "/img/1", weight: 250}, count: 1},
    {item: {id: 3, name: 'Паста Карбонара', price: 700, img: "/default", weight: 350}, count: 1},
    {item: {id: 6, name: 'Лимонад Цитрус-Мята', price: 300, img: "/img2", weight: 300}, count: 1},
  ],
}