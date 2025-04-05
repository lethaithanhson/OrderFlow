export interface Product {
    id: string;
    name: string;
    price: number;
  }
  export interface PromoCode {
    id: string;
    code: string;
    type: 'fixed' | 'percentage';
    value: number;
  }
  export const products: Product[] = [
    { id: 'p1', name: 'Điện thoại iPhone 13', price: 24990000 },
    { id: 'p2', name: 'Laptop Dell XPS 13', price: 32000000 },
    { id: 'p3', name: 'Tai nghe AirPods Pro', price: 4990000 },
    { id: 'p4', name: 'Samsung Galaxy S22', price: 21990000 },
    { id: 'p5', name: 'iPad Air', price: 16990000 },
    { id: 'p6', name: 'Apple Watch Series 7', price: 9990000 },
    { id: 'p7', name: 'Máy ảnh Sony Alpha A7 III', price: 45990000 },
    { id: 'p8', name: 'Bàn phím cơ Logitech G Pro', price: 2990000 },
  ];
  export const promoCodes: PromoCode[] = [
    { id: 'promo1', code: 'GIAMGIA10', type: 'percentage', value: 10 },
    { id: 'promo2', code: 'GIAMGIA20', type: 'percentage', value: 20 },
    { id: 'promo3', code: 'GIAM500K', type: 'fixed', value: 500000 },
    { id: 'promo4', code: 'GIAM1TR', type: 'fixed', value: 1000000 },
    { id: 'promo5', code: 'KHONGGIAMGIA', type: 'fixed', value: 0 },
  ];