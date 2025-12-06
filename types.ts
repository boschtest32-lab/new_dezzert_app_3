export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum Category {
  THICK_SHAKES = "Thick Shakes",
  WAFFLES = "Waffles",
  MILK_SHAKES = "Milk Shakes",
  ICE_CREAMS = "Ice Creams",
  BROWNIES = "Brownies",
  HOT_BREW = "Hot Brew",
  COLD_BREW = "Cold Brew",
  JAMMUN_SHOTS = "Jamun Shots",
  HOT_CHOCOLATE = "Hot Chocolate"
}

export interface OrderDetails {
  items: CartItem[];
  total: number;
  tableNumber?: string;
}
