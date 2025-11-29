<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
  <title>Threads Downloader ✨</title>
  <style>
    :root {
      --bg: #fff7f9;
      --card: #ffffff;
      --accent: #f4b8c6;
      --accent-dark: #e08ba2;
      --text-main: #3b2f33;
      --text-soft: #7b656d;
      --shadow-soft: 0 6px 20px rgba(0,0,0,0.08);
      --radius-xl: 20px;
    }

    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff5f8;
      padding: 14px;
      color: var(--text-main);
    }

    .card {
      width: 100%;
      max-width: 360px;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 20px 18px 24px;
      box-shadow: var(--shadow-soft);
      position: relative;
      overflow: hidden;
    }

    .bubble {
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(244, 184, 198, 0.20);
      top: -50px;
      left: -40px;
      filter: blur(2px);
      z-index: -1;
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      margin: 4px 0 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .title span.icon {
      font-size: 18px;
    }

    .subtitle {
      font-size: 13px;
      color: var(--text-soft);
      margin-bottom: 14px;
      line-height: 1.4;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }

    label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-soft);
    }

    input[type="text"] {
      width: 100%;
      padding: 10px 13px;
      border-radius: 999px;
      border: 1px solid #f0d7df;
      font-size: 13px;
      outline: none;
      transition: all 0.2s ease;
      background: #fffafa;
    }

    input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(244, 184, 198, 0.35);
    }

    .btn-main {
      width: 100%;
      border: none;
      border-radius: 999px;
      padding: 11px 14px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 10px;
      box-shadow: 0 6px 14px rgba(224, 139, 162, 0.32);
      transition: transform 0.08s ease;
    }

    .btn-main:active {
      transform: translateY(1px);
    }

    .btn-main:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .status {
      font-size: 11px;
      text-align: left;
      margin-top: 2px;
      min-height: 14px;
      color: var(--text-soft);
    }

    .status.error {
      color: #b3261e;
    }

    .status.success {
      color: #2e7d32;
    }

    .steps {
      font-size: 11px;
      color: var(--text-soft);
      margin-top: 8px;
      line-height: 1.5;
      text-align: left;
    }

    .steps ol {
      margin: 4px 0 0;
      padding-left: 18px;
    }

    .steps li {
      margin-bottom: 2px;
    }

    .steps strong {
      font-weight: 600;
    }

    .note {
      margin-top: 14px;
      font-size: 11px;
      color: var(--text-soft);
      line-height: 1.45;
      text-align: left;
      font-weight: 500;
    }

    .note b {
      color: var(--accent-dark);
      font-weight: 600;
    }

    .loading {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 16px;
    }

    .media-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: #f5f5f5;
      aspect-ratio: 1;
      cursor: pointer;
    }

    .media-item img,
    .media-item video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-item .download-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(244, 184, 198, 0.95);
      border: none;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
      z-index: 10;
    }

    .media-item .download-btn:hover {
      background: var(--accent-dark);
      transform: scale(1.05);
    }

    .media-type-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0,0,0,0.6);
      color: #fff;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
      z-index: 10;
    }
  </style>
</head>
<body>

  <div class="card">
    <div class="bubble"></div>

    <div class="title">
      <span class="icon">📥</span>
      <span>Threads Downloader</span>
    </div>

    <div class="subtitle">
      Simpan foto / video Threads favoritmu disini ✨
    </div>

    <div class="input-group">
      <label for="threadsURL">silakan masukkan link foto/video threads dibawah</label>
      <input id="threadsURL" type="text" placeholder="https://www.threads.net/..." />
    </div>

    <button class="btn-main" id="downloadBtn" onclick="handleDownloadClick()">
      <span class="icon">✨</span>
      <span>Download Sekarang</span>
    </button>

    <div id="status" class="status"></div>

    <div id="mediaContainer"></div>

    <div class="steps">
      Cara menggunakannya adalah:
      <ol>
        <li>Klik tombol pesawat di foto/video Threads</li>
        <li>Salin tautan</li>
        <li>Masuk ke website ini dan paste link-nya</li>
        <li>Klik ✨ <strong>Download Sekarang</strong></li>
        <li>Kamu akan dibawa ke halaman download</li>
      </ol>
    </div>

    <div class="note">
      <b>Catatan:</b> jika diarahkan ke iklan Shopee,
      silakan kembali ke website ini lalu klik tombolnya lagi 💕
    </div>
  </div>

  <script>
    const AFFILIATE_LINKS = [
      "https://s.shopee.co.id/2g3cgGoYlO",
      "https://s.shopee.co.id/6KwunQvJ45",
      "https://s.shopee.co.id/3VcjQHIM53",
      "https://s.shopee.co.id/70CbakZ9tw",
      "https://s.shopee.co.id/7AW1n3YWYz"
    ];

    // ⚠️ GANTI INI DENGAN URL BACKEND KAMU SETELAH DEPLOY
    const BACKEND_URL = "https://your-backend-url.vercel.app/api/threads";

    const REDIRECT_INTERVAL_MS = 30000;
    const LAST_TIME_KEY = "aff_last_time";
    const LAST_INDEX_KEY = "aff_last_index";

    let mediaData = [];

    function setStatus(message, type = "info") {
      const el = document.getElementById("status");
      el.textContent = message || "";
      el.className = "status " + type;
    }

    function shouldOpenAffiliate() {
      const last = localStorage.getItem(LAST_TIME_KEY);
      return !last || Date.now() - parseInt(last, 10) > REDIRECT_INTERVAL_MS;
    }

    function getNextAffiliateLink() {
      let idx = parseInt(localStorage.getItem(LAST_INDEX_KEY) || "0", 10);
      localStorage.setItem(LAST_INDEX_KEY, (idx + 1) % AFFILIATE_LINKS.length);
      return AFFILIATE_LINKS[idx];
    }

    async function handleDownloadClick() {
      const input = document.getElementById("threadsURL");
      const url = (input.value || "").trim();

      if (!url) {
        setStatus("Link Threads-nya diisi dulu ya, sayang 💌", "error");
        return;
      }

      if (!url.startsWith("http")) {
        setStatus("Format link-nya kurang pas, coba paste ulang ya 🥺", "error");
        return;
      }

      if (!url.includes("threads.net") && !url.includes("threads.com")) {
        setStatus("Pastikan link-nya dari Threads ya 🥺", "error");
        return;
      }

      const btn = document.getElementById("downloadBtn");
      btn.disabled = true;
      btn.innerHTML = '<span class="loading"></span><span>Memproses...</span>';
      setStatus("Sedang mengambil media dari Threads...", "info");

      try {
        // Fetch media dari backend
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Gagal mengambil data");
        }

        if (!data.media || data.media.length === 0) {
          throw new Error("Tidak ada media ditemukan");
        }

        mediaData = data.media;
        displayMedia(mediaData);
        setStatus(`Ditemukan ${mediaData.length} media! Pilih yang mau didownload ✨`, "success");

      } catch (error) {
        setStatus(`Error: ${error.message} 😔`, "error");
        console.error(error);
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span class="icon">✨</span><span>Download Sekarang</span>';
      }
    }

    function displayMedia(media) {
      const container = document.getElementById("mediaContainer");
      container.innerHTML = "";

      if (media.length === 0) return;

      const grid = document.createElement("div");
      grid.className = "media-grid";

      media.forEach((item, index) => {
        const mediaItem = document.createElement("div");
        mediaItem.className = "media-item";

        const badge = document.createElement("div");
        badge.className = "media-type-badge";
        badge.textContent = item.type === "video" ? "📹 Video" : "🖼️ Foto";

        let mediaElement;
        if (item.type === "video") {
          mediaElement = document.createElement("video");
          mediaElement.src = item.url;
          mediaElement.muted = true;
          mediaElement.playsInline = true;
        } else {
          mediaElement = document.createElement("img");
          mediaElement.src = item.url;
          mediaElement.alt = `Media ${index + 1}`;
        }

        const downloadBtn = document.createElement("button");
        downloadBtn.className = "download-btn";
        downloadBtn.textContent = "Download";
        downloadBtn.onclick = (e) => {
          e.stopPropagation();
          const fileExt = item.type === 'video' ? 'mp4' : 'jpg';
          downloadMedia(item.url, `threads_${item.type}_${index + 1}.${fileExt}`);
        };

        mediaItem.appendChild(badge);
        mediaItem.appendChild(mediaElement);
        mediaItem.appendChild(downloadBtn);
        grid.appendChild(mediaItem);
      });

      container.appendChild(grid);
    }

    async function downloadMedia(url, filename) {
      // Buka affiliate kalau sudah 30 detik
      if (shouldOpenAffiliate()) {
        localStorage.setItem(LAST_TIME_KEY, Date.now().toString());
        window.open(getNextAffiliateLink(), "_blank");
        
        // Delay sebentar biar popup kebuka
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Start download
      try {
        setStatus("Memulai download... 💕", "info");
        
        // Fetch dengan mode no-cors untuk proxy URL
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'default'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        // Deteksi extension dari filename atau blob type
        let fileExtension = filename.split('.').pop();
        if (!['jpg', 'jpeg', 'png', 'mp4', 'webp'].includes(fileExtension)) {
          // Deteksi dari blob type
          if (blob.type.includes('video')) {
            fileExtension = 'mp4';
          } else if (blob.type.includes('image')) {
            fileExtension = 'jpg';
          }
          filename = filename + '.' + fileExtension;
        }
        
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }, 100);

        setStatus("Download berhasil! 💕", "success");
      } catch (error) {
        setStatus("Gagal download: " + error.message + " 😔", "error");
        console.error('Download error:', error);
      }
    }
  </script>

</body>
</html>
