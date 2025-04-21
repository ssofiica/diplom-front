export interface Food {
    id: number;
    name: string;
    price: number;
    weight: number;
    img: string;
    count: number;
    category_id?: number;
}