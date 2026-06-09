/*import chatbotRouter from "../src/api/routes/chatbot.js";
const express = require("express");
const cors = require("cors");

app.use("/api/chatbot", chatbotRouter);
const app = express();

app.use(cors());
app.use(express.json());

module.exports = app;*/
/*require("dotenv").config();

const express = require("express");
const cors = require("cors");

const chatbotRouter = require("./routes/chatbot"); // ← غيّر المسار لهذا

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chatbot", chatbotRouter);

module.exports = app;*/
//import chatbotRoutes from "./routes/chatbot";
// backend/src/app.js
const express = require("express");
const cors = require("cors");

const chatbotRouter = require("./routes/chatbot");

const app = express();

// ══════════════════════════════════════════════
// CORS - السماح بالطلبات من الـ frontend
// ══════════════════════════════════════════════
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server
      "http://localhost:3000",
      "http://localhost:5174",
      // أضف هنا domain الـ production إن وُجد
      /\.replit\.dev$/, // يسمح لأي subdomain على replit
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ══════════════════════════════════════════════
// Body Parsers
// ══════════════════════════════════════════════
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ══════════════════════════════════════════════
// Request Logger (للتطوير)
// ══════════════════════════════════════════════
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ══════════════════════════════════════════════
// Routes
// ══════════════════════════════════════════════
app.get("/api/test", (req, res) =>
  res.json({ ok: true, message: "الخادم يعمل بشكل صحيح ✅" })
);

app.use("/api/chatbot", chatbotRouter);

// ══════════════════════════════════════════════
// 404 Handler
// ══════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({ error: `المسار ${req.path} غير موجود` });
});

// ══════════════════════════════════════════════
// Global Error Handler
// ══════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.message);
  res.status(500).json({ error: "خطأ داخلي في الخادم" });
});

module.exports = app;