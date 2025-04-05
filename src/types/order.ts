
export interface CartItem {
    id: string
    productId: string
    productName: string
    price: number
    quantity: number
    promoCode?: string 
    discountedPrice?: number
  }
  
  export interface OrderState {
    customerName: string
    customerEmail: string
    customerPhone: string
    cart: CartItem[]
    paymentMethod: PaymentMethod
    cashAmount: number
  }


  export enum PaymentMethod  {
    CASH = "cash",
    CARD = "card"
  }
  