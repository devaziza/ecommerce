export interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface Order {
  id: number;
  user_id?: number;
  total_price: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at?: string;
  total_items?: number;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total?: number;
  product_name?: string;
  product_image?: string;
  created_at?: string;
}
 
export interface OrderDetail extends Order {
  items: OrderItem[];
}

export type UserRole = "user" | "admin";
 
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}