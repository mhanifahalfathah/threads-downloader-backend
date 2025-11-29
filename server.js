// Backend untuk Threads Downloader - Pakai RapidAPI
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Key dari RapidAPI
const RAPIDAPI_KEY = '7d6950fa14msh4773e7b1465af96p1e4f71jsn1bd5d9b42395';
const RAPIDAPI_HOST = 'full-downloader-social-media.p.rapidapi.com';

// Endpoint untuk ambil data Threads
app.post('/api/threads', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || (!url.includes('threads.net') && !url.includes('threads.com'))) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL Threads tidak valid' 
      });
    }

    // Call RapidAPI
    const options = {
      method: 'GET',
      url: 'https://full-downloader-social-media.p.rapidapi.com/',
      params: { url: url },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const data = response.data;

    // Parse response dari API
    if (!data || !data.medias || data.medias.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tidak ada media ditemukan dalam post ini'
      });
    }

    // Format media data
    const media = data.medias.map(item => {
      return {
        type: item.extension === 'mp4' ? 'video' : 'image',
        url: item.url,
        quality: item.quality || 'hd'
      };
    });

    return res.json({
      success: true,
      media: media,
      count: media.length,
      caption: data.caption || '',
      author: data.author || ''
    });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit tercapai. Tunggu beberapa saat lagi ya 😔'
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Post tidak ditemukan. Pastikan link-nya benar 🥺'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data dari Threads',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threads Downloader API Running with RapidAPI',
    endpoints: {
      'POST /api/threads': 'Ambil data media dari URL Threads'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
