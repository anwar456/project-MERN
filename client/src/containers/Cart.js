import React, { useState } from "react";
import {
  PageHeader,
  Table,
  Space,
  Typography,
  Image,
  InputNumber,
  Button,
  message,
} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  SaveTwoTone,
  ReloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useCarts from "../_actions/cartActions";
import { sumBy } from "lodash";
import StripeCheckout from "react-stripe-checkout";
import useOrders from "../_actions/orderActions";
import OrderResultModal from "../components/Modals/OrderResultModal";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateCartItem, removeCartItem, clearCart } = useCarts();
  const { checkout } = useOrders();
  const cartItems = useSelector((state) => state.cart.cartItems?.cartDetails);
  const auth = useSelector((state) => state.customer.auth);
  const [editItem, setEditItem] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleEdit = (item) => {
    setEditItem(item);
    setQuantity(item.quantity);
  };

  const handleReset = () => {
    setEditItem(null);
  };

  const handleUpdateCartItem = (item) => {
    const data = {
      _productId: item?._product?._id,
      quantity,
    };
    dispatch(updateCartItem(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
        setEditItem(null);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const handleRemove = (item) => {
    dispatch(removeCartItem(item._product._id)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const handlePayout = (token, total) => {
    dispatch(checkout({ token, total })).then((res) => {
      if (res.payload.status) {
        clearCart();
        setShowResultModal(true);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  const renderCartItem = () => {
    return (
      <Table columns={columns} dataSource={cartItems} scroll={{ x: 300 }} />
    );
  };

  const columns = [
    {
      title: "Product",
      width: 80,
      dataIndex: "_product",
      key: "name",
      render: (item) => {
        return (
          <Space direction="vertical">
            <Typography.Text>{item?.name}</Typography.Text>
            <Image src={item?.image} alt="image" width={80} />
          </Space>
        );
      },
      fixed: "left",
    },

    {
      title: "Price ($)",
      width: 100,
      align: "right",
      render: (item) => {
        return <span>${item?.price}</span>;
      },
    },

    {
      title: "Quantity",
      width: 100,
      align: "right",
      render: (item) => {
        if (editItem?._product?._id === item?._product?._id) {
          return (
            <InputNumber
              size="small"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
            />
          );
        }
        return <span>{item?.quantity}</span>;
      },
    },

    {
      title: "Amount ($)",
      width: 100,
      align: "right",
      render: (item) => {
        return <span>${item?.amount}</span>;
      },
    },

    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (item) => {
        return (
          <>
            {editItem?._product?._id === item?._product?._id ? (
              <span style={{ marginRight: 4 }}>
                <SaveTwoTone
                  style={{ marginRight: 4, fontSize: 16 }}
                  onClick={() => handleUpdateCartItem(item)}
                />
                <ReloadOutlined
                  style={{ fontSize: 16, color: "green" }}
                  onClick={handleReset}
                />
              </span>
            ) : (
              <EditTwoTone
                style={{ marginRight: 4, fontSize: 16 }}
                twoToneColor="orange"
                onClick={() => handleEdit(item)}
              />
            )}
            <DeleteTwoTone
              style={{ fontSize: 16 }}
              twoToneColor="red"
              onClick={() => handleRemove(item)}
            />
          </>
        );
      },
    },
  ];

  const renderCheckout = () => {
    const total = sumBy(cartItems, (item) => item.amount);
    if (cartItems?.length > 0) {
      return (
        <center>
          <p>Total Amount: ${total}</p>
          <StripeCheckout
            name="Payment"
            email={auth?.data?.email}
            description="Payment for product"
            amount={total * 100}
            token={(token) => handlePayout(token, total)}
            stripeKey="pk_test_51N8xIwAmoq82XR6Ud4BVfbipmbLqXeDR7oKPEbPFLw5ef1QS0ItV0PTxT0R6o4rXp6AQqrWCsJbCUPV8POttyIdX00RaqU8Xd8"
          >
            <Button type="primary" icon={<DollarOutlined />}>
              Checkout
            </Button>
          </StripeCheckout>
        </center>
      );
    }
  };

  return (
    <>
      <PageHeader title="Your cart" onBack={() => navigate(-1)} />
      <div className="page-wrapper">
        {renderCartItem()}
        {renderCheckout()}
        <OrderResultModal
          visible={showResultModal}
          onCancel={() => setShowResultModal(false)}
        />
      </div>
    </>
  );
};

export default Cart;
