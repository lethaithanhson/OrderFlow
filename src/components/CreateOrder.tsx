import { Button, Form, Input, InputNumber, Modal, Radio } from "antd";
import { HiOutlineBanknotes, HiOutlineCreditCard } from "react-icons/hi2";
import { CartItem, OrderState, PaymentMethod } from "../types/order";
import Cart from "./Cart";
import ConfirmOrder from "./ConfirmOrder";
import { useEffect, useState } from "react";
import { formatNumber } from "../utils/formatHelper";
import { validatePhone } from "../utils/validateHelper";
import Lottie from "lottie-react";
import paymentSuccessIcon from "../assets/paymentSuccess.json";

const { Item } = Form;

const CreateOrder = () => {
  const [orderForm] = Form.useForm<OrderState>();

  const paymentMethod = Form.useWatch("paymentMethod", orderForm);
  const cartItems = Form.useWatch("cart", orderForm) as CartItem[];
  const cashAmount = Form.useWatch("cashAmount", orderForm);
  const order = Form.useWatch([], orderForm);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    orderForm.setFieldValue("paymentMethod", method);
  };

  const getTotalAmount = () => {
    return (
      cartItems?.reduce((total, item) => {
        return total + (item?.discountedPrice || 0);
      }, 0) || 0
    );
  };

  const getChangeAmount = () => {
    if (paymentMethod === PaymentMethod.CASH && cashAmount > getTotalAmount()) {
      return cashAmount - getTotalAmount();
    }
    return 0;
  };

  // Handle payment
  const handlePayment = () => {
    setShowConfirmModal(true);
  };

  const handleResetCashAmount = () => {
    orderForm.setFieldValue("cashAmount", 0);
  };

  useEffect(() => {
    if (!paymentSuccess) return
    const timeout = setTimeout(() => {
      setPaymentSuccess(false)
    }, 3000);
  return ()=> clearTimeout(timeout)
  }, [paymentSuccess, setPaymentSuccess])
  

  const initialValues = {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    cart: [],
    paymentMethod: PaymentMethod.CASH,
    cashAmount: 0,
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Form<OrderState>
        initialValues={initialValues}
        form={orderForm}
        layout="vertical"
        size="large"
        onFinish={handlePayment}
        autoComplete="off"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tạo đơn hàng mới
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin khách hàng */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin khách hàng
              </h2>
              <div className="space-y-4">
                {/* Tên khách hàng */}
                <Item<OrderState>
                  rules={[
                    {
                      required: true,
                      message: "Tên khách hàng không được bỏ trống!",
                    },
                  ]}
                  validateTrigger="onChange"
                  label={<span className="font-medium">Tên khách hàng</span>}
                  name="customerName"
                >
                  <Input placeholder="Nhập tên khách hàng" />
                </Item>
                {/* Email */}
                <Item<OrderState>
                  rules={[
                    { required: true, message: "Email không được bỏ trống!" },
                    { type: "email", message: "Email không đúng định dạng" },
                  ]}
                  label={<span className="font-medium">Email</span>}
                  name="customerEmail"
                >
                  <Input placeholder="Nhập email khách hàng" />
                </Item>
                {/* Số điện thoại */}
                <Item
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được bỏ trống!",
                    },
                    {
                      validator: validatePhone,
                    },
                  ]}
                  label={<span className="font-medium">Số điện thoại</span>}
                  name="customerPhone"
                >
                  <Input placeholder="Nhập số điện thoại khách hàng" />
                </Item>
              </div>
            </div>
            {/* Chọn sản phẩm */}
            <Cart form={orderForm} />
          </div>
          {/* Thanh toán */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin thanh toán
              </h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tổng tiền:</span>
                  <span className="text-xl font-bold text-blue-700">
                    {getTotalAmount().toLocaleString()}đ
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <Item name="paymentMethod" label="Phương thức thanh toán">
                  <Radio.Group className="w-full" onChange={() => {}}>
                    <div className="space-y-2">
                      <div
                        className={`p-3 border rounded-lg cursor-pointer ${
                          paymentMethod === "cash"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => handlePaymentMethodChange(PaymentMethod.CASH)}
                      >
                        <Radio value="cash">
                          <div className="gap-2 flex items-center ml-3">
                            <HiOutlineBanknotes
                              size={20}
                              className="text-gray-600"
                            />
                            <span className="block">Tiền mặt</span>
                          </div>
                        </Radio>
                      </div>
                      <div
                        className={`p-3 border rounded-lg cursor-pointer ${
                          paymentMethod === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          handlePaymentMethodChange(PaymentMethod.CARD)
                          handleResetCashAmount()
                        }}
                      >
                        <Radio onChange={handleResetCashAmount} value="card">
                          <div className="flex gap-2 ml-3 items-center">
                            <HiOutlineCreditCard
                              size={20}
                              className="text-gray-600"
                            />
                            <span>Thẻ</span>
                          </div>
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </Item>
              </div>
              {paymentMethod === PaymentMethod.CASH && (
                <div className="mb-6">
                  <Item<OrderState> name="cashAmount" label="Tiền khách đưa">
                    <InputNumber
                      min={0}
                      className="!w-full"
                      placeholder="Nhập số tiền khách đưa"
                      formatter={(value) => formatNumber(Number(value)) || "0"}
                    />
                  </Item>
                  {getChangeAmount() > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md text-green-700">
                      Tiền thừa trả khách: {getChangeAmount().toLocaleString()}đ
                    </div>
                  )}
                </div>
              )}
              <Button
                htmlType="submit"
                disabled={
                  !cartItems ||
                  cartItems.length === 0 ||
                  (paymentMethod === PaymentMethod.CASH && cashAmount < getTotalAmount())
                }
                type="primary"
                className="w-full"
                size="large"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </Form>
      <ConfirmOrder
        onConfirm={() => {
          setPaymentSuccess(true)
          orderForm.resetFields()
        }}
        order={order}
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
      />
      <Modal centered footer={null} open={paymentSuccess} onClose={() => setPaymentSuccess(false)}>
       <div className="flex flex-col items-center justify-center">
       <Lottie className="w-36" animationData={paymentSuccessIcon} loop={false} />
        <h2 className="text-lg text-center font-bold text-green-600 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600">Đơn hàng đã được xử lý.</p>
       </div>
      </Modal>
    </div>
  )
};

export default CreateOrder;
