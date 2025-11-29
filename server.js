const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/threads', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || (!url.includes('threads.net') && !url.includes('threads.com'))) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL Threads tidak valid' 
      });
    }

    const postIdMatch = url.match(/\/post\/([A-Za-z0-9_-]+)/);
    if (!postIdMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Tidak bisa mengekstrak post ID' 
      });
    }

    const oembedUrl = `https://www.threads.net/oembed?url=${encodeURIComponent(url)}`;
    
    const oembedResponse = await axios.get(oembedUrl, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000 
    });

    const html = oembedResponse.data.html;
    const videoMatch = html.match(/https:\/\/[^"]+\.mp4/);
    const imageMatches = html.match(/https:\/\/[^"]+\.(jpg|jpeg|png)/g) || [];

    const media = [];

    if (videoMatch) {
      media.push({
        type: 'video',
        url: videoMatch[0]
      });
    }

    imageMatches.slice(0, 10).forEach(imgUrl => {
      media.push({
        type: 'image',
        url: imgUrl
      });
    });

    if (media.length === 0) {
      const pageResponse = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const pageHtml = pageResponse.data;
      const videoUrls = pageHtml.match(/https:\/\/[^"]+\.mp4[^"]*/g) || [];
      const imageUrls = pageHtml.match(/https:\/\/scontent[^"]+\.(jpg|jpeg|png)[^"]*/g) || [];

      videoUrls.forEach(videoUrl => {
        media.push({
          type: 'video',
          url: videoUrl.split('"')[0]
        });
      });

      imageUrls.slice(0, 10).forEach(imageUrl => {
        media.push({
          type: 'image',
          url: imageUrl.split('"')[0]
        });
      });
    }

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tidak ada media ditemukan'
      });
    }

    const uniqueMedia = media.filter((item, index, self) =>
      index === self.findIndex((t) => t.url === item.url)
    );

    return res.json({
      success: true,
      media: uniqueMedia,
      count: uniqueMedia.length
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data dari Threads',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Threads Downloader API Running'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
