const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Configure multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Replace with your actual RChilli credentials/API URL
const RCHILLI_URL = "https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary";
const USERKEY = "YOUR_RCHILLI_USER_KEY";
const VERSION = "YOUR_VERSION_CODE";
const SUBUSERID = ""; // Often empty string

// POST /api/resume/parse
router.post("/parse", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);
    formData.append("userkey", USERKEY);
    formData.append("version", VERSION);
    formData.append("subuserid", SUBUSERID);

    const rchilliRes = await axios.post(RCHILLI_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.json(rchilliRes.data);
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          error?.response?.data?.error || "Failed to parse resume with RChilli.",
      });
  }
});

module.exports = router;
