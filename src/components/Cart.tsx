import { Button, Form, FormInstance, Select } from "antd";
import React, { useState } from "react";
import {
  HiMiniPlus,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { Product, products } from "../utils/mockData";
import { StoreValue } from "antd/es/form/interface";
import { CartItem as CartItemModel, OrderState } from "../types/order";
import CartItem from "./CartItem";


type CartProps = {
  form: FormInstance<OrderState>;
};

const Cart: React.FC<CartProps> = (props) => {
  const { form: orderForm } = props;
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const handleAddToCart = (
    add: (defaultValue?: StoreValue, insertIndex?: number) => void
  ) => {
    if (!selectedProduct) return;
    const carts:CartItemModel[] = orderForm.getFieldValue("cart")
    const productExisted = carts?.findIndex((c)=> c.productId === selectedProduct.id)
    
    if (productExisted !== -1) {
        orderForm.setFieldValue(["cart", productExisted, 'quantity'],carts?.[productExisted].quantity + 1 )
    }else{
        const newCartItem: CartItemModel = {
            id: `cart-item-${Date.now()}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
          };
          add(newCartItem);
    }
   
    setSelectedProduct(undefined);
  };

  return (
    <Form.List name="cart">
      {(fields, { add, remove }) => (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thêm sản phẩm vào giỏ hàng
            </h2>
            <div className="flex gap-2">
              <Select
                className="grow"
                value={selectedProduct?.id}
                placeholder="-- Chọn sản phẩm --"
                onChange={(_, option) => {
                  if (!option || Array.isArray(option)) return;
                  const { label, ...rest } = option;
                  setSelectedProduct(rest);
                }}
                fieldNames={{ value: "id" }}
                options={products.map((product) => ({
                  ...product,
                  label: `${product.name} - ${product.price.toLocaleString()}đ`,
                }))}
              />

              <Button
              disabled={!selectedProduct}
                type="primary"
                icon={<HiMiniPlus size={16} />}
                onClick={() => handleAddToCart(add)}
              >
                Thêm
              </Button>
            </div>
          </div>
          {/* Giỏ hàng */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineShoppingCart size={20} />
              Giỏ hàng
              {fields.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {fields.length}
                </span>
              )}
            </h2>
            <div className="divide-y divide-gray-200 divide-dashed space-y-2">
              {fields.map(({ key, name }) => {
                const productName = orderForm
                  .getFieldValue("cart")
                  .at(name)?.productName;

                return (
                  <CartItem
                    onRemoveItem={remove}
                    key={key}
                    form={orderForm}
                    name={name}
                    productName={productName}
                  />
                );
              })}
            </div>

            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có sản phẩm nào trong giỏ hàng
              </div>
            )}
          </div>
        </>
      )}
    </Form.List>
  );
};

export default Cart;
