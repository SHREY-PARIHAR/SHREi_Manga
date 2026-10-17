const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const animeRoutes = require("./routes/animeRoutes");
const mangaRoutes = require("./routes/mangaRoutes");
const AnimeCatalogPage = require("./models/animeCatalogPage");
const Manga = require("./models/manga");
const MangaChapter = require("./models/mangaChapter");
const MangaCatalogPage = require("./models/mangaCatalogPage");

const app = express();
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const localOrigin = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;

app.use(cors({
  origin(origin, callback) {
    const developmentOrigin = process.env.NODE_ENV !== "production" && origin && localOrigin.test(origin);
    const localFileOrigin = process.env.NODE_ENV !== "production" && origin === "null";
    callback(null, !origin || allowedOrigins.has(origin) || developmentOrigin || localFileOrigin);
  },
  maxAge: 600,
}));
app.use(express.json({ limit: "32kb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SHREI backend is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "unavailable",
  });
});

// Anime API
app.use("/api/anime", animeRoutes);
app.use("/api/manga", mangaRoutes);

const webRoot = path.resolve(__dirname, "..");
app.get("/", (req, res) => res.sendFile(path.join(webRoot, "index.html")));
app.get("/index.html", (req, res) => res.sendFile(path.join(webRoot, "index.html")));
app.get("/ads.js", (req, res) => res.sendFile(path.join(webRoot, "ads.js")));
app.get("/ads-config.js", (req, res) => res.sendFile(path.join(webRoot, "ads-config.js")));

const PORT = process.env.PORT || 5000;

async function startServer() {
  await new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`SHREI backend running on http://localhost:${PORT}`);
      resolve();
    });
    server.once("error", reject);
  });
  connectDB().then(async (connected) => {
    if (!connected) return;
    try {
      await AnimeCatalogPage.syncIndexes();
      await Manga.syncIndexes();
      await MangaChapter.syncIndexes();
      await MangaCatalogPage.syncIndexes();
    } catch (error) {
      console.error("Catalogue index synchronization failed:", error.name || "database error");
    }
  }).catch((error) => {
    console.error("Optional catalogue database connection failed:", error.code || error.name || "database error");
  });
}

startServer().catch((error) => {
  console.error("Backend startup failed:", error.message || error.name || "startup error");
  process.exitCode = 1;
});