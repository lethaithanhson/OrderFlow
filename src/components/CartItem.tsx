import React, { useCallback, useEffect, useMemo } from "react";
import { promoCodes } from "../utils/mockData";
import { HiOutlineTrash } from "react-icons/hi2";
import { Button, Form, FormInstance, InputNumber, Select } from "antd";
import { OrderState } from "../types/order";
import { formatNumber } from "../utils/formatHelper";

const { Item } = Form;
interface CartItemProps {
  name: number;
  form: FormInstance<OrderState>;
  productName: string;
  onRemoveItem: (index: number | number[]) => void;
}
const CartItem: React.FC<CartItemProps> = (props) => {
  const { form, name, productName, onRemoveItem } = props;

  const promoCode = Form.useWatch(["cart", name, "promoCode"], form);
  const price = Form.useWatch(["cart", name, "price"], form) || 0;
  const quantity = Form.useWatch(["cart", name, "quantity"], form) || 0;

  const getDiscountedPrice = useCallback(() => {
    if (!promoCode) {
      const total = price * quantity;
      form.setFieldValue(["cart", name, "discountedPrice"], total);
      return total;
    }
    const promoCodeSelectedObject = promoCodes.find((p) => p.id === promoCode);
    if (!promoCodeSelectedObject) {
      form.setFieldValue(["cart", name, "discountedPrice"], 0);
      return 0;
    }
    if (promoCodeSelectedObject.type === "fixed") {
      const discounted = Math.max(0, price * quantity - promoCodeSelectedObject.value);
      form.setFieldValue(["cart", name, "discountedPrice"], discounted);
      return discounted;
    } else {
      const discounted = price * quantity * (1 - promoCodeSelectedObject.value / 100);
      form.setFieldValue(["cart", name, "discountedPrice"], discounted);
      return discounted;
    }
  }, [promoCode, price, quantity, promoCodes, form, name]);

  useEffect(() => {
    getDiscountedPrice();
  }, [promoCode, quantity, getDiscountedPrice]);

  const discountAmount = useMemo(() => {
    const discounted = getDiscountedPrice();
    return price * quantity - discounted;
  }, [price, quantity, getDiscountedPrice]);
  
  return (
    <div className="flex flex-col items-star gap-2">
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{productName}</h3>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {/* Đơn giá */}
        <Item
          name={[name, "price"]}
          label={<span className="text-xs">Đơn giá</span>}
        >
          <InputNumber
            className="!w-full"
            formatter={(value) => formatNumber(Number(value)) || "0"}
            readOnly
            suffix="đ"
          />
        </Item>
        {/* Số lượng */}
        <Item
          name={[name, "quantity"]}
          label={<span className="text-xs">Số lượng</span>}
        >
          <InputNumber
            className="!w-full"
            min={1}
            formatter={(value) => formatNumber(Number(value)) || "0"}
          />
        </Item>
        {/* Thành tiền */}
        <Item
          name={[name, "discountedPrice"]}
          label={<span className="text-xs">Thành tiền</span>}
        >
          <InputNumber
            className="!w-full"
            readOnly
            formatter={(value) => formatNumber(Number(value)) || "0"}
            suffix="đ"
          />
        </Item>

        <Button
          htmlType="button"
          variant="filled"
          color="danger"
          className="mt-7 shrink-0"
          onClick={() => onRemoveItem(name)}
          icon={<HiOutlineTrash />}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <Item
          label={<span className="text-xs">Khuyến mãi</span>}
          name={[name, "promoCode"]}
          className="!w-1/2"
        >
          <Select placeholder="Áp mã khuyến mãi">
            {promoCodes.map((code) => (
              <Select.Option key={code.id} value={code.id}>
                {code.code} (
                {code.type === "fixed"
                  ? `${code.value.toLocaleString()}đ`
                  : `${code.value}%`}
                )
              </Select.Option>
            ))}
          </Select>
        </Item>
        {promoCode && discountAmount > 0 && (
          <div className="mt-2 text-sm text-green-600">
            Giảm giá: {discountAmount.toLocaleString()}đ
          </div>
        )}
      </div>
    </div>
  );
};
export default CartItem;
