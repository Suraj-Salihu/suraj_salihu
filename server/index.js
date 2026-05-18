require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN = process.env.ADMIN_DELETE_TOKEN;

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('Cloudinary credentials are not set. Please set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME in server/.env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post('/delete-asset', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ error: 'public_id required' });

    // Destroy the asset (image resource)
    const result = await cloudinary.uploader.destroy(public_id, { resource_type: 'image', invalidate: true });

    return res.json({ ok: true, result });
  } catch (err) {
    console.error('Failed to delete asset:', err);
    return res.status(500).json({ error: err.message || 'delete failed' });
  }
});

app.listen(PORT, () => {
  console.log('Cloudinary helper server listening on port', PORT);
});
