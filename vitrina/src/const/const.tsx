export const url = "http://localhost:8081/api"
export const minio= "http://localhost:9000/images/"

export const statuses: Record<string, string> = {
    "created": "Создан",
    "accepted": "Принят",
    "ready": "Готов",
    "finished": "Завершен",
    "canceled": "Отменен",
};
export const types: Record<string, string> = {
    "pickup": "Самовывоз",
    "delivery": "Доставка",
};