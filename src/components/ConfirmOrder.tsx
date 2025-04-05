import React from "react";
import { OrderState, PaymentMethod } from "../types/order";
import { Modal } from "antd";
import { promoCodes } from "../utils/mockData";

interface ConfirmOrderProps {
  order: OrderState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
const ConfirmOrder: React.FC<ConfirmOrderProps> = ({
  order,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const getTotalAmount = () => {
    return (
      order?.cart?.reduce((total, item) => {
        return total + (item?.discountedPrice || 0);
      }, 0) || 0
    );
  };

  const getChangeAmount = () => {
    if (
      order?.paymentMethod === PaymentMethod.CASH &&
      order.cashAmount > getTotalAmount()
    ) {
      return order?.cashAmount - getTotalAmount();
    }
    return 0;
  };
  return (
    <>
      <Modal
        open={open}
        onCancel={() => onOpenChange(false)}
        onClose={() => onOpenChange(false)}
        onOk={() => {
          onOpenChange(false);
          onConfirm();
        }}
        title={<span className="text-lg">Xác nhận đơn hàng</span>}
        centered
        cancelText="Huỷ"
        okText="Xác nhận thanh toán"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Thông tin khách hàng */}
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <span className="font-medium">Tên khách hàng:</span>{" "}
                {order?.customerName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order?.customerEmail}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order?.customerPhone}
              </p>
            </div>
          </div>
          {/* Giỏ hàng */}
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              Sản phẩm đã chọn
            </h3>
            <div className="space-y-3">
              {order?.cart.map((item) => {
                const promoCode = promoCodes.find(
                  (p) => p.id === item.promoCode
                );

                return (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {item.price?.toLocaleString()}đ ={" "}
                          {(item.price * item.quantity)?.toLocaleString()}đ
                        </p>
                        {promoCode && (
                          <p className="text-sm text-green-600">
                            Khuyến mãi: {promoCode.code}(
                            {promoCode.type === "fixed"
                              ? `${promoCode.value.toLocaleString()}đ`
                              : `${promoCode.value}%`}
                            )
                          </p>
                        )}
                      </div>
                      <div className="font-medium">
                        {item.discountedPrice?.toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Thông tin thanh toán */}
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-3">
              Thông tin thanh toán
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>
                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                {order?.paymentMethod === PaymentMethod.CASH
                  ? "Tiền mặt"
                  : "Thẻ"}
              </p>
              {order?.paymentMethod === PaymentMethod.CASH && (
                <>
                  <p>
                    <span className="font-medium">Tiền khách đưa:</span>{" "}
                    {order?.cashAmount?.toLocaleString()}đ
                  </p>
                  {getChangeAmount() > 0 && (
                    <p>
                      <span className="font-medium">Tiền thừa trả khách:</span>{" "}
                      {getChangeAmount().toLocaleString()}đ
                    </p>
                  )}
                </>
              )}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm font-bold flex justify-between">
                  <span>Tổng thanh toán:</span>
                  <span>{getTotalAmount().toLocaleString()}đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ConfirmOrder;
