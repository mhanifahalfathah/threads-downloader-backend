// Backend untuk Threads Downloader - Full Downloader Social Media (FIXED)
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
      },
      timeout: 15000 // 15 detik timeout
    };

    const response = await axios.request(options);
    const data = response.data;

    console.log('API Response:', JSON.stringify(data, null, 2)); // Debug log

    // Parse response dari API dengan berbagai format
    let mediaList = [];

    // Format 1: Ada array medias
    if (data.medias && Array.isArray(data.medias)) {
      mediaList = data.medias;
    }
    // Format 2: Ada array images
    else if (data.images && Array.isArray(data.images)) {
      mediaList = data.images.map(img => ({
        url: img,
        extension: 'jpg'
      }));
    }
    // Format 3: Ada single video_url
    else if (data.video_url) {
      mediaList = [{ url: data.video_url, extension: 'mp4' }];
    }
    // Format 4: Ada single image_url
    else if (data.image_url) {
      mediaList = [{ url: data.image_url, extension: 'jpg' }];
    }
    // Format 5: Ada array urls
    else if (data.urls && Array.isArray(data.urls)) {
      mediaList = data.urls.map(u => ({
        url: u,
        extension: u.includes('.mp4') ? 'mp4' : 'jpg'
      }));
    }

    if (mediaList.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tidak ada media ditemukan dalam post ini',
        debug: data // Kirim raw data untuk debugging
      });
    }

    // Format media data dengan deteksi lebih baik
    const media = mediaList.map((item, index) => {
      let mediaUrl = item.url || item;
      let fileExtension = item.extension || '';
      
      // Deteksi tipe dari URL
      const isVideo = mediaUrl.includes('.mp4') || 
                      mediaUrl.includes('video') ||
                      fileExtension === 'mp4';
      
      const isImage = mediaUrl.includes('.jpg') || 
                      mediaUrl.includes('.jpeg') || 
                      mediaUrl.includes('.png') ||
                      mediaUrl.includes('image') ||
                      ['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension);
      
      return {
        type: isVideo ? 'video' : (isImage ? 'image' : 'image'), // default ke image kalau nggak jelas
        url: mediaUrl,
        quality: item.quality || 'hd',
        thumbnail: item.thumbnail || null,
        index: index
      };
    });

    return res.json({
      success: true,
      media: media,
      count: media.length,
      caption: data.caption || data.title || '',
      author: data.author || data.username || ''
    });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific errors
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        error: 'Request timeout. Server terlalu lama merespon 😔'
      });
    }

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
      details: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threads Downloader API Running (Fixed Version)',
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
