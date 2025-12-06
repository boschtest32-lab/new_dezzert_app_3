import { Category, MenuItem } from './types';

export const WHATSAPP_NUMBER = "918600135430"; // Country code + Number

/* 
  IMPORTANT:
  Ensure your image files in the 'images' folder match these names exactly:
  - thick-shake.jpg
  - waffel.jpg
  - milk-shake.jpg
  - ice-cream.jpg
  - brownie.jpg
  - hot-brew.jpg
  - cold-brew.jpg
  - jamun-shot.jpg
  - hot-chocolate.jpg
*/

export const MENU_ITEMS: MenuItem[] = [
  // Thick Shakes
  // { id: '1', name: 'Belgian Dark Chocolate', description: 'Rich and creamy dark chocolate blend', price: 220, category: Category.THICK_SHAKES, image: '/images/thickshake1.jpg' },
  // { id: '2', name: 'Strawberry Cheesecake', description: 'Real strawberries with cheesecake bits', price: 240, category: Category.THICK_SHAKES, image: '/images/thickshake1.jpg' },
  
  // Waffles
  { id: '3', name: 'Nutella Overload', description: 'Crispy waffle topped with Nutella', price: 180, category: Category.WAFFLES, image: '/images/waffel.jpg' },
  { id: '4', name: 'Red Velvet', description: 'Red velvet base with white chocolate', price: 190, category: Category.WAFFLES, image: '/images/waffel.jpg' },

    // Thick Shakes
  { id: '1', name: 'Belgian Dark Chocolate', description: 'Rich and creamy dark chocolate blend', price: 220, category: Category.THICK_SHAKES, image: '/images/thickshake1' },
  { id: '2', name: 'Strawberry Cheesecake', description: 'Real strawberries with cheesecake bits', price: 240, category: Category.THICK_SHAKES, image: '/images/thickshake1' },

  // Milk Shakes
  { id: '5', name: 'Classic Vanilla', description: 'Smooth vanilla bean shake', price: 150, category: Category.MILK_SHAKES, image: '/images/milkshake.jpg' },
  { id: '6', name: 'Oreo Crunch', description: 'Crunchy Oreos blended to perfection', price: 170, category: Category.MILK_SHAKES, image: '/images/milkshake.jpg' },

  // Ice Creams
  { id: '7', name: 'French Vanilla Scoop', description: 'Classic creamy vanilla', price: 90, category: Category.ICE_CREAMS, image: '/images/Ice-Cream.jpg' },
  { id: '8', name: 'Butterscotch', description: 'Crunchy praline butterscotch', price: 100, category: Category.ICE_CREAMS, image: '/images/Ice-Cream.jpg' },

  // Brownies
  { id: '9', name: 'Walnut Fudge Brownie', description: 'Warm gooey fudge with walnuts', price: 120, category: Category.BROWNIES, image: '/images/hot-sizzling-brownie.jpg' },
  { id: '10', name: 'Sizzling Brownie', description: 'Served with vanilla ice cream', price: 180, category: Category.BROWNIES, image: '/images/hot-sizzling-brownie.jpg' },

  // Hot Brew
  { id: '11', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 140, category: Category.HOT_BREW, image: '/images/hot-brew.jpg' },
  { id: '12', name: 'Americano', description: 'Double shot espresso with hot water', price: 110, category: Category.HOT_BREW, image: '/images/hot-brew.jpg' },

  // Cold Brew
  { id: '13', name: 'Classic Cold Brew', description: 'Steeped for 18 hours', price: 160, category: Category.COLD_BREW, image: '/images/Cold-Coffee.jpg' },
  { id: '14', name: 'Vietnam Cold Coffee', description: 'Cold brew with condensed milk', price: 180, category: Category.COLD_BREW, image: '/images/Cold-Coffee.jpg' },

  // Jamun Shots
  { id: '15', name: 'Classic Jamun Shot', description: 'Pure jamun pulp with spice mix', price: 80, category: Category.JAMMUN_SHOTS, image: '/images/jamunshots.jpg' },

  // Hot Chocolate
  { id: '16', name: 'Classic Hot Cocoa', description: 'Rich cocoa with marshmallows', price: 190, category: Category.HOT_CHOCOLATE, image: '/images/hotChocolate.jpg' },
  { id: '17', name: 'Spiced Hot Chocolate', description: 'Cocoa with a hint of cinnamon', price: 210, category: Category.HOT_CHOCOLATE, image: '/images/hotChocolate.jpg' },
];

export const CATEGORIES = Object.values(Category);
