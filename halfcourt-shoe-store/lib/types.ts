export type Product = {
  id: string;
  model: string;
  name: string;
  colorway: string;
  price: number;
  stock: number;
  sold: number;
  badge: string | null;
  imageUrl: string | null;
};

export type RecentOrder = {
  orderNo: string;
  customer: string;
  placedAt: string;
  total: number;
  status: string;
};

export type Customer = {
  name: string;
  email: string;
  orders: number;
  spent: number;
};

export type AdminOverview = {
  mode: 'live';
  generatedAt: string;
  totalOrders: number;
  ordersDelta: number | null;
  signIns30d: number | null;
  signInsTrackedSince: string | null;
  customers: number;
  revenue30d: number;
  products: Product[];
  recentOrders: RecentOrder[];
  topCustomers: Customer[];
};
