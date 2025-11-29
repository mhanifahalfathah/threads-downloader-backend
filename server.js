// Backend untuk Threads Downloader - With Image Proxy
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
      timeout: 15000
    };

    const response = await axios.request(options);
    const data = response.data;

    console.log('API Response:', JSON.stringify(data, null, 2));

    // Parse response
    let mediaList = [];

    if (data.medias && Array.isArray(data.medias)) {
      mediaList = data.medias;
    } else if (data.images && Array.isArray(data.images)) {
      mediaList = data.images.map(img => ({
        url: img,
        extension: 'jpg'
      }));
    } else if (data.video_url) {
      mediaList = [{ url: data.video_url, extension: 'mp4' }];
    } else if (data.image_url) {
      mediaList = [{ url: data.image_url, extension: 'jpg' }];
    } else if (data.urls && Array.isArray(data.urls)) {
      mediaList = data.urls.map(u => ({
        url: u,
        extension: u.includes('.mp4') ? 'mp4' : 'jpg'
      }));
    }

    if (mediaList.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tidak ada media ditemukan dalam post ini'
      });
    }

    // Format media data - GUNAKAN PROXY URL untuk semua media
    const baseUrl = req.protocol + '://' + req.get('host');
    const media = mediaList.map((item, index) => {
      let mediaUrl = item.url || item;
      let fileExtension = item.extension || '';
      
      const isVideo = mediaUrl.includes('.mp4') || 
                      mediaUrl.includes('video') ||
                      fileExtension === 'mp4';
      
      const isImage = mediaUrl.includes('.jpg') || 
                      mediaUrl.includes('.jpeg') || 
                      mediaUrl.includes('.png') ||
                      mediaUrl.includes('image') ||
                      ['jpg', 'jpeg', 'png', 'webp'].includes(fileExtension);
      
      // PENTING: Encode URL asli ke base64 biar aman
      const encodedUrl = Buffer.from(mediaUrl).toString('base64');
      
      return {
        type: isVideo ? 'video' : 'image',
        url: `${baseUrl}/api/proxy?url=${encodedUrl}`, // URL proxy
        originalUrl: mediaUrl, // URL asli untuk fallback
        quality: item.quality || 'hd',
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

    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data dari Threads',
      details: error.message
    });
  }
});

// ENDPOINT BARU: Proxy untuk download media
app.get('/api/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    // Decode URL dari base64
    const decodedUrl = Buffer.from(url, 'base64').toString('utf-8');
    
    console.log('Proxying URL:', decodedUrl);

    // Download media dengan headers yang proper
    const response = await axios({
      method: 'GET',
      url: decodedUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.threads.net/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      },
      timeout: 30000
    });

    // Deteksi content type
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    // Set headers untuk response
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache 24 jam
    res.set('Access-Control-Allow-Origin', '*');
    
    // Kirim file
    res.send(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ 
      error: 'Gagal mengambil media',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threads Downloader API Running (With Proxy)',
    endpoints: {
      'POST /api/threads': 'Ambil data media dari URL Threads',
      'GET /api/proxy': 'Proxy untuk download media'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
