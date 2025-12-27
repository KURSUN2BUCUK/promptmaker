<p align="center">
  <img src="logo.svg" alt="Prompt Studio Logo" width="120" height="120">
</p>

<h1 align="center">Prompt Studio</h1>

<p align="center">
  <strong>AI-Powered Prompt Generator & Web Tools</strong>
</p>

<p align="center">
  <a href="https://ps.aerys.site/">🌐 Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#api">API</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.0+-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/NVIDIA-NIM_API-76B900?style=flat-square&logo=nvidia&logoColor=white" alt="NVIDIA">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
</p>

---

## 🚀 Live Demo

<p align="center">
  <a href="https://ps.aerys.site/" target="_blank">
    <img src="https://img.shields.io/badge/Try_it_now-ps.aerys.site-00d4aa?style=for-the-badge" alt="Live Demo">
  </a>
</p>

> **Note:** The demo has a daily limit of 20 requests per IP address.

---

## ✨ Features

### 🎯 Prompt Generator
Generate professional AI prompts across 8 categories:
- 👻 Horror Stories
- ⭐ Anime Characters  
- 🎵 Song Lyrics
- 📢 Slogans
- 🐦 Tweets
- 📖 Story Summaries
- 🎨 Midjourney Prompts
- 💻 Code Documentation

### 🌐 Site Analyzer
Analyze any website with AI:
- YouTube channel/video analysis
- Web page content extraction
- Custom analysis prompts

### 🔍 AI Search
Research-powered AI answers:
- DuckDuckGo integration
- Multi-source content aggregation
- Source citations

### 🌍 Multi-language
- Turkish (TR)
- English (EN)

---

## 📦 Installation

### Requirements
- PHP 8.0+
- cURL extension
- Web server (Apache/Nginx)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/promptstudio.git
cd promptstudio
```

2. **Configure API Key**
```bash
cp config.example.php config.php
```

Edit `config.php` and add your NVIDIA NIM API key:
```php
<?php
return [
    'nvidia_api_key' => 'your-api-key-here'
];
```

3. **Get NVIDIA API Key**
   - Visit [NVIDIA NIM](https://build.nvidia.com/)
   - Create an account and generate an API key
   - The app uses `moonshotai/kimi-k2-instruct` model

4. **Deploy**
   - Upload files to your web server
   - Ensure `config.php` is not publicly accessible (already in `.gitignore`)

---

## 📁 Project Structure

```
promptstudio/
├── index.html          # Main SPA
├── style.css           # Styles
├── app.js              # Frontend logic
├── api.php             # AI API proxy
├── proxy.php           # Web scraping proxy
├── search.php          # Search API
├── limit.php           # Rate limiting
├── config.php          # API configuration (gitignored)
├── config.example.php  # Config template
├── logo.svg            # Logo
└── README.md
```

---

## 🔒 Security

- API key stored server-side only
- IP-based rate limiting (20 requests/day)
- CORS headers configured
- No sensitive data exposed to client

---

## 🛠️ API

### POST `/api.php`
AI chat completion proxy

```json
{
  "model": "moonshotai/kimi-k2-instruct",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "max_tokens": 1024
}
```

### POST `/proxy.php`
Web page fetcher with YouTube support

```json
{
  "url": "https://example.com"
}
```

### POST `/search.php`
DuckDuckGo search with content extraction

```json
{
  "query": "your search query"
}
```

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

<p align="center">
  <sub>Powered by</sub><br>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/NVIDIA_logo.svg/200px-NVIDIA_logo.svg.png" alt="NVIDIA" height="30">
</p>
