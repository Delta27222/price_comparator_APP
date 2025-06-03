export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  shortestPrice?: string;
  shortestPriceStoreName?: string;
}

export interface Store {
  id: string;
  name: string;
  direction: string;
  image: string;
  active: boolean;
}

export interface Price {
  id: string;
  amount: number;
  productId: string;
  product: Product;
  storeId: string;
  store: Store;
  periodId: string;
  period: Period;
  createdAt: string;
  updatedAt: string;
}

export interface Period {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
