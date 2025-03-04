const fs = require("fs");
const path = require("path");

// 📌 **Upload File(s)**
exports.uploadFiles = (req, res) => {
  const isSingle = req.headers["upload-type"] === "single";
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
    fileUrl: `/uploads/${file.filename}`,
  });

  const filesData = uploadedFiles.map(processFile);
  res.json({ message: "File(s) uploaded successfully!", files: filesData });
};

// 📌 **Get Directory Tree**
const getDirectoryTree = (dirPath) => {
  const tree = [];
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    items.forEach((item) => {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        tree.push({ name: item.name, type: "directory", children: getDirectoryTree(fullPath) });
      } else {
        tree.push({ name: item.name, type: "file" });
      }
    });
  } catch (error) {
    console.error("Error reading directory:", error.message);
  }
  return tree;
};

// 📌 **List Files**
exports.listFiles = (req, res) => {
  try {
    const directoryTree = getDirectoryTree("UPLOAD_DIR");
    res.json({ directoryTree });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 **Delete Multiple Files or Directories**
exports.deleteFiles = (req, res) => {
  const { filePaths } = req.body;

  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    return res.status(400).json({ error: "filePaths should be a non-empty array!" });
  }

  const responses = [];

  filePaths.forEach((relativePath) => {
    const absolutePath = path.join(__dirname, "../UPLOAD_DIR", relativePath);

    if (!fs.existsSync(absolutePath)) {
      responses.push({ filePath: relativePath, status: "error", message: "File or directory not found!" });
      return;
    }

    try {
      const stats = fs.statSync(absolutePath);
      if (stats.isDirectory()) {
        fs.rmSync(absolutePath, { recursive: true, force: true });
        responses.push({ filePath: relativePath, status: "success", message: "Directory deleted successfully!" });
      } else {
        fs.unlinkSync(absolutePath);
        responses.push({ filePath: relativePath, status: "success", message: "File deleted successfully!" });
      }
    } catch (error) {
      responses.push({ filePath: relativePath, status: "error", message: error.message });
    }
  });

  res.json({ results: responses });
};
