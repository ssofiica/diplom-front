export const url = "http://82.202.138.105:8081/api"
export const minio= "http://82.202.138.105:9000/images/"

export const statuses: Record<string, string> = {
    "created": "Создан",
    "accepted": "Принят",
    "ready": "Готов",
    "finished": "Завершен",
    "cancelled": "Отменен",
};
export const types: Record<string, string> = {
    "pickup": "Самовывоз",
    "delivery": "Доставка",
};