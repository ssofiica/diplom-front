export const mockNewOrders = [
    {
        id: 5,
        user: { id: 1, name: 'София', phone: '89009009090'}, 
        created_at: '12:04', 
        type: 'Доставка',
        status: 'created',
        address: 'ул. Тверская, д.20, кв.1',
        sum: 1600, 
        restaurant_id: 1,
        comment: 'Не добавляйте орехи пожалуйста',
        food: [
            {id: 1, name: 'Зелёный салат', price: 600, count: 1},
            {id: 2, name: 'Паста Карбонара', price: 700, count: 1},
            {id: 3, name: 'Лимонад Цитрус-Мята', price: 300, count: 1},
        ],
    },
    {
        id: 6, 
        user: { id: 1, name: 'София', phone: '89009009090'}, 
        created_at: '12:06', 
        type: 'Самовывоз',
        status: 'created',
        sum: 480, 
        restaurant_id: 1,
        food: [
            {id: 4, name: 'Сэндвич с пастрами', price: 480, count: 1},
        ],
    },
]

export const mockKitchenOrders = [
    {
        id: 2, 
        user: { id: 1, name: 'София', phone: '89009009090'}, 
        created_at: '11:50',
        accepted_at: '11:52',  
        type: 'Самовывоз',
        status: 'accepted',
        sum: 980, 
        restaurant_id: 1,
        food: [
            {id: 4, name: 'Сэндвич с пастрами', price: 480, count: 1},
            {id: 10, name: 'Пицца Маргарита', price: 500, count: 1},
        ],
    },
]

export const mockReadyOrders = [
    {
        id: 1, 
        user: { id: 1, name: 'София', phone: '89009009090'}, 
        created_at: '11:30',
        accepted_at: '11:32',
        ready_at: '11:42', 
        type: 'Самовывоз',
        status: 'ready',
        sum: 980, 
        restaurant_id: 1,
        food: [
            {id: 4, name: 'Сэндвич с пастрами', price: 480, count: 1},
            {id: 10, name: 'Пицца Маргарита', price: 500, count: 1},
        ],
    },
]