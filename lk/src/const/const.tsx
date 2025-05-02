export const url = "http://localhost:8080/api"
export const minio= "http://localhost:9000/images/"

export const statuses: Record<string, string> = {
    "created": "Новые",
    "accepted": "На кухне",
    "ready": "Готовы",
    "finished": "Завершены",
    "cancelled": "Отменены",
};
export const types: Record<string, string> = {
    "pickup": "Самовывоз",
    "delivery": "Доставка",
};

export const ordersTemplate = [
    { status: 'Новые', items: [] },
    { status: 'На кухне', items: [] },
    { status: 'Готовы', items: [] },
];