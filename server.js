const http = require('http');
const fs = require("fs");
const path = require('path');
const express = require("express");
const cors = require('cors');
const moment = require('moment');
const Middleware = require('./src/Api/Middlewares/index.middleware.js');
const routes = require('./src/Api/Routes/index.js');
const sendMail = require('./src/Config/Setting/nodemailer.config.js');
const { InitializeDatabase } = require('./src/Api/Models/InitializeDatabase');
const { TestSequelizeConnection, TestMySQLConnection, } = require('./src/Config/Database/db.config.js');
const axios = require('axios');
const uploadMiddleware = require('./src/Api/Middlewares/uploadMiddleware.js');
const authMiddleware = require('./src/Api/Middlewares/authorizationMiddleware.js');
require('dotenv').config();
require('./src/sockets/server.socket.js');

const app = Middleware();
app.use(cors());
const server = http.createServer(app);

const DefineRoutes = () => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.post("/upload", authMiddleware, uploadMiddleware, (req, res) => {
    const isSingle = req.headers['upload-type'] === 'single';
    const uploadedFiles = isSingle ? (req.file ? [req.file] : []) : req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: "No file uploaded!" });
    }
    const processFile = (file) => ({
      fieldname: file.fieldname,
      originalName: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
      fileUrl: `/uploads/${file.filename}`
    });
    const filesData = uploadedFiles.map(processFile);
    res.json({
      message: "File(s) uploaded successfully!",
      files: filesData
    });
  });

  // 📌 **Serve Uploaded Files**
  app.use("/uploads", express.static('UPLOAD_DIR'));

  const getDirectoryTree = (dirPath) => {
    const tree = [];
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      items.forEach((item) => {
        const fullPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
          tree.push({
            name: item.name,
            type: "directory",
            children: getDirectoryTree(fullPath),
          });
        } else {
          tree.push({ name: item.name, type: "file" });
        }
      });
    } catch (error) {
      console.error("Error reading directory:", error.message);
    }
    return tree;
  };

  // 📌 **List Uploaded Files**
  app.get("/files", (req, res) => {
    try {
      const directoryTree = getDirectoryTree('UPLOAD_DIR');
      res.json({ directoryTree });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/send-email', async (req, res) => {
    try {
      const { to, subject, text } = req.body;
      await sendMail(to, subject, text);
      res.status(200).send('Email sent successfully.');
    } catch (error) {
      throw new Error('Failed to send email.');
    }
  });

  app.use('/Api', routes);
};

const StartServer = async () => {
  try {
    await Promise.all([
      TestMySQLConnection(),
      TestSequelizeConnection(),
    ]);
    InitializeDatabase();
    DefineRoutes();

    const PORT = process.env.MAIN_SERVER_PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Main server running on port ${PORT} at ${new Date().toLocaleString()}.`);
    });
  } catch (error) {
    throw new Error(`❌ Error during server startup: ${error.message}`);
  }
};

StartServer();
