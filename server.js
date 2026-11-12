
const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Penyimpanan sementara untuk simulasi.
// Nanti akan kita ganti dengan database.
const orders = {};

// Daftar produk vending machine
const products = {
  chitato: {
    name: "Chitato",
    price: 5000
  },
  oreo: {
    name: "Oreo",
    price: 2000
  },
  aqua: {
    name: "Aqua",
    price: 4000
  }
};

// Halaman utama untuk mengecek server
app.get("/", (req, res) => {
  res.send("Smart Vending Machine Backend aktif!");
});

// 1. Membuat pesanan
app.post("/api/orders", (req, res) => {
  const { productId } = req.body;

  const product = products[productId];

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Produk tidak ditemukan"
    });
  }

  const orderId = crypto.randomUUID();

  orders[orderId] = {
    orderId,
    productId,
    productName: product.name,
    amount: product.price,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: "Pesanan berhasil dibuat",
    order: orders[orderId]
  });
});

// 2. Mengecek status pesanan
app.get("/api/orders/:id", (req, res) => {
  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Pesanan tidak ditemukan"
    });
  }

  res.json({
    success: true,
    order
  });
});

// 3. Simulasi pembayaran berhasil
app.post("/api/orders/:id/pay-simulate", (req, res) => {
  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Pesanan tidak ditemukan"
    });
  }

  if (order.status !== "PENDING") {
    return res.status(409).json({
      success: false,
      message: "Pesanan sudah diproses",
      status: order.status
    });
  }

  order.status = "PAID";
  order.paidAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Simulasi pembayaran berhasil",
    order
  });
});

// Menjalankan server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Smart Vending Backend berjalan di port ${PORT}`);
});
