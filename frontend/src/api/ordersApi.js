// src/api/ordersApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const getOrders = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createOrder = async (items, token) => {
  const res = await axios.post(API_URL, { items }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateOrderStatus = async (orderId, status, token) => {
  const res = await axios.put(`${API_URL}/${orderId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
