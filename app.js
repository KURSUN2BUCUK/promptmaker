// ===== Config =====
var API_URL = 'api.php';
var PROXY_URL = 'proxy.php';
var SEARCH_URL = 'search.php';
var MODEL = 'moonshotai/kimi-k2-instruct';

// ===== i18n =====
var currentLang = localStorage.getItem('lang') || 'tr';
var i18n = {
    tr: {
        'nav.generator': 'Generator',
        'nav.siteAnalyze': 'Site Analiz',
        'nav.aiSearch': 'AI Arama',
        'nav.history': 'Geçmiş',
        'beta.message': 'Beta sürümü - Tamamen ücretsiz kullanım',
        'hero.badge': 'AI Destekli',
        'hero.title': 'Mükemmel AI Promptları Oluşturun',
        'hero.subtitle': 'Profesyonel kalitede promptlar oluşturun',
        'categories.title': 'Kategori Seçin',
        'cat.horror': 'Korku Hikayesi', 'cat.horror.desc': 'Tüyler ürpertici hikayeler',
        'cat.anime': 'Anime Karakter', 'cat.anime.desc': 'Benzersiz karakterler',
        'cat.lyrics': 'Şarkı Sözü', 'cat.lyrics.desc': 'Etkileyici sözler',
        'cat.slogan': 'Slogan', 'cat.slogan.desc': 'Akılda kalıcı sloganlar',
        'cat.tweet': 'Tweet', 'cat.tweet.desc': 'Viral içerikler',
        'cat.summary': 'Hikaye Özeti', 'cat.summary.desc': 'Etkileyici özetler',
        'cat.midjourney': 'Midjourney', 'cat.midjourney.desc': 'AI görsel promptları',
        'cat.code': 'Kod Açıklama', 'cat.code.desc': 'Dokümantasyon',
        'btn.back': 'Geri', 'btn.generate': 'Prompt Oluştur', 'btn.analyze': 'Analiz Et',
        'btn.search': 'Araştır', 'btn.clear': 'Temizle',
        'form.topic': 'Konu / Tema', 'form.topicPlaceholder': 'Örn: Karanlık bir ormanda kaybolmuş bir çocuk...',
        'form.style': 'Stil', 'form.outputLang': 'Çıktı Dili',
        'style.creative': 'Yaratıcı', 'style.professional': 'Profesyonel', 'style.casual': 'Günlük',
        'style.dramatic': 'Dramatik', 'style.humorous': 'Komik',
        'result.title': 'Oluşturulan Prompt', 'result.subtitle': 'Kopyalayıp kullanabilirsiniz',
        'loading.title': 'AI Düşünüyor...', 'loading.subtitle': 'Mükemmel prompt oluşturuluyor',
        'site.badge': 'Web İçerik Analizi', 'site.title1': 'Site', 'site.title2': 'Analiz',
        'site.subtitle': 'Herhangi bir web sitesini AI ile analiz edin',
        'site.urlLabel': 'Web Sitesi URL', 'site.urlPlaceholder': 'https://example.com',
        'site.promptLabel': 'Ne yapmamı istersiniz?', 'site.promptPlaceholder': 'Bu siteyi özetle...',
        'site.resultTitle': 'Analiz Sonucu',
        'search.badge': 'AI Destekli Arama', 'search.title': 'Arama',
        'search.subtitle': 'Sorularınızı sorun, AI internette araştırıp yanıtlasın',
        'search.queryLabel': 'Sorunuz', 'search.queryPlaceholder': 'Herhangi bir soru sorun...',
        'search.resultTitle': 'Yanıt', 'search.sources': 'Kaynaklar',
        'history.title': 'Prompt Geçmişi', 'history.subtitle': 'Kaydettiğiniz promptlar',
        'history.empty': 'Henüz kayıtlı prompt yok', 'history.emptyDesc': 'Oluşturduğunuz promptları kaydedin',
        'toast.copied': 'Kopyalandı!', 'toast.saved': 'Kaydedildi!', 'toast.deleted': 'Silindi',
        'toast.cleared': 'Temizlendi', 'toast.enterTopic': 'Lütfen bir konu girin',
        'toast.limitReached': 'Günlük limit doldu', 'toast.enterUrl': 'URL girin',
        'toast.enterPrompt': 'Ne yapmamı istediğinizi yazın', 'toast.enterQuestion': 'Soru yazın'
    },
    en: {
        'nav.generator': 'Generator', 'nav.siteAnalyze': 'Site Analyze',
        'nav.aiSearch': 'AI Search', 'nav.history': 'History',
        'beta.message': 'Beta version - Completely free to use',
        'hero.badge': 'Powered by AI', 'hero.title': 'Create Perfect AI Prompts',
        'hero.subtitle': 'Generate professional quality prompts',
        'categories.title': 'Select Category',
        'cat.horror': 'Horror Story', 'cat.horror.desc': 'Spine-chilling stories',
        'cat.anime': 'Anime Character', 'cat.anime.desc': 'Unique characters',
        'cat.lyrics': 'Song Lyrics', 'cat.lyrics.desc': 'Impressive lyrics',
        'cat.slogan': 'Slogan', 'cat.slogan.desc': 'Memorable slogans',
        'cat.tweet': 'Tweet', 'cat.tweet.desc': 'Viral content',
        'cat.summary': 'Story Summary', 'cat.summary.desc': 'Impressive summaries',
        'cat.midjourney': 'Midjourney', 'cat.midjourney.desc': 'AI image prompts',
        'cat.code': 'Code Docs', 'cat.code.desc': 'Documentation',
        'btn.back': 'Back', 'btn.generate': 'Generate Prompt', 'btn.analyze': 'Analyze',
        'btn.search': 'Search', 'btn.clear': 'Clear',
        'form.topic': 'Topic / Theme', 'form.topicPlaceholder': 'E.g: A child lost in a dark forest...',
        'form.style': 'Style', 'form.outputLang': 'Output Language',
        'style.creative': 'Creative', 'style.professional': 'Professional', 'style.casual': 'Casual',
        'style.dramatic': 'Dramatic', 'style.humorous': 'Humorous',
        'result.title': 'Generated Prompt', 'result.subtitle': 'Copy and use it',
        'loading.title': 'AI is Thinking...', 'loading.subtitle': 'Creating the perfect prompt',
        'site.badge': 'Web Content Analysis', 'site.title1': 'Site', 'site.title2': 'Analyze',
        'site.subtitle': 'Analyze any website with AI',
        'site.urlLabel': 'Website URL', 'site.urlPlaceholder': 'https://example.com',
        'site.promptLabel': 'What would you like me to do?', 'site.promptPlaceholder': 'Summarize this site...',
        'site.resultTitle': 'Analysis Result',
        'search.badge': 'AI Powered Search', 'search.title': 'Search',
        'search.subtitle': 'Ask questions, AI will research and answer',
        'search.queryLabel': 'Your Question', 'search.queryPlaceholder': 'Ask any question...',
        'search.resultTitle': 'Answer', 'search.sources': 'Sources',
        'history.title': 'Prompt History', 'history.subtitle': 'Your saved prompts',
        'history.empty': 'No saved prompts yet', 'history.emptyDesc': 'Save your generated prompts',
        'toast.copied': 'Copied!', 'toast.saved': 'Saved!', 'toast.deleted': 'Deleted',
        'toast.cleared': 'Cleared', 'toast.enterTopic': 'Please enter a topic',
        'toast.limitReached': 'Daily limit reached', 'toast.enterUrl': 'Enter URL',
        'toast.enterPrompt': 'Enter what you want me to do', 'toast.enterQuestion': 'Enter a question'
    }
};

// ===== Categories =====
var categories = {
    horror: { name: 'Korku Hikayesi', nameEn: 'Horror Story', icon: 'fa-ghost', prompt: 'Korku hikayesi yaz. Kısa, gerilimli.' },
    anime: { name: 'Anime Karakter', nameEn: 'Anime Character', icon: 'fa-star', prompt: 'Anime karakteri oluştur. İsim, görünüş, kişilik.' },
    lyrics: { name: 'Şarkı Sözü', nameEn: 'Song Lyrics', icon: 'fa-music', prompt: 'Şarkı sözü yaz. Kafiyeli.' },
    slogan: { name: 'Slogan', nameEn: 'Slogan', icon: 'fa-bullhorn', prompt: '5 kısa slogan öner.' },
    tweet: { name: 'Tweet', nameEn: 'Tweet', icon: 'fa-x-twitter', prompt: '5 viral tweet yaz.' },
    summary: { name: 'Hikaye Özeti', nameEn: 'Story Summary', icon: 'fa-book-open', prompt: 'Hikaye özeti yaz.' },
    midjourney: { name: 'Midjourney', nameEn: 'Midjourney', icon: 'fa-image', prompt: 'Midjourney promptu yaz. İngilizce.' },
    code: { name: 'Kod Açıklama', nameEn: 'Code Docs', icon: 'fa-code', prompt: 'Kod dokümantasyonu yaz.' }
};

// ===== State =====
var selectedCategory = null;
var currentPrompt = null;
var promptHistory = [];
var usageInfo = { used: 0, total: 20, remaining: 20 };

// Load history
try { var saved = localStorage.getItem('promptHistory'); if (saved) { var parsed = JSON.parse(saved); if (Array.isArray(parsed)) promptHistory = parsed; } } catch(e) {}

// ===== Helpers =====
function qs(s) { return document.querySelector(s); }
function qsa(s) { return document.querySelectorAll(s); }
function t(key) { return i18n[currentLang][key] || key; }


// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLang();
    initParticles();
    bindEvents();
    renderHistory();
    checkLimit();
});

function initTheme() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        qs('#themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function initLang() {
    currentLang = localStorage.getItem('lang') || 'tr';
    qs('#langText').textContent = currentLang.toUpperCase();
    applyTranslations();
}

function initParticles() {
    var c = qs('#particles');
    if (!c) return;
    for (var i = 0; i < 20; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = 'left:' + Math.random()*100 + '%;top:' + Math.random()*100 + '%;animation-delay:' + Math.random()*4 + 's';
        c.appendChild(p);
    }
}

// ===== i18n Functions =====
function toggleLang() {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('lang', currentLang);
    qs('#langText').textContent = currentLang.toUpperCase();
    applyTranslations();
}

function applyTranslations() {
    var texts = i18n[currentLang];
    qsa('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (texts[key]) el.textContent = texts[key];
    });
    qsa('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (texts[key]) el.placeholder = texts[key];
    });
}

// ===== Menu Functions =====
function toggleMenu() {
    var nav = qs('#navLinks');
    var toggle = qs('#menuToggle');
    var overlay = qs('#menuOverlay');
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
    overlay.classList.toggle('active');
}

function goHome(event) {
    if (event) event.preventDefault();
    qsa('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    qs('.nav-link[data-page="generator"]').classList.add('active');
    qsa('.page').forEach(function(p) { p.classList.remove('active'); });
    qs('#page-generator').classList.add('active');
    goBack();
}

function bindEvents() {
    // Theme
    qs('#themeToggle').onclick = function() {
        document.body.classList.toggle('light-theme');
        var isLight = document.body.classList.contains('light-theme');
        this.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    };

    // Navigation
    qsa('.nav-link[data-page]').forEach(function(link) {
        link.onclick = function(e) {
            e.preventDefault();
            var page = this.dataset.page;
            qsa('.nav-link').forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
            qsa('.page').forEach(function(p) { p.classList.remove('active'); });
            qs('#page-' + page).classList.add('active');
            if (page === 'history') renderHistory();
            // Close mobile menu
            qs('#navLinks').classList.remove('open');
            qs('#menuToggle').classList.remove('active');
            qs('#menuOverlay').classList.remove('active');
        };
    });

    // Categories
    qsa('.category-card').forEach(function(card) {
        card.onclick = function() { selectCategory(this.dataset.category); };
    });

    // Generator
    qs('#backBtn').onclick = goBack;
    qs('#generateBtn').onclick = generate;
    qs('#regenerateBtn').onclick = generate;
    qs('#copyBtn').onclick = function() { copyText(currentPrompt); };
    qs('#saveBtn').onclick = savePrompt;
    qs('#topicInput').onkeypress = function(e) { if (e.key === 'Enter') generate(); };

    // Site Analyze
    qs('#analyzeBtn').onclick = analyzeSite;
    qs('#copySiteResult').onclick = function() { copyText(qs('#siteResult').textContent); };
    qs('#sitePrompt').onkeydown = function(e) { if (e.key === 'Enter' && e.ctrlKey) analyzeSite(); };

    // AI Search
    qs('#searchBtn').onclick = aiSearch;
    qs('#copySearchResult').onclick = function() { copyText(qs('#searchResult').textContent); };
    qs('#searchQuery').onkeydown = function(e) { if (e.key === 'Enter' && e.ctrlKey) aiSearch(); };

    // History
    qs('#clearHistoryBtn').onclick = clearHistory;
}

// ===== Limit =====
async function checkLimit() {
    try {
        var res = await fetch('limit.php');
        var data = await res.json();
        if (data.limit) {
            usageInfo = data.limit;
            qs('#usageText').textContent = usageInfo.used + '/' + usageInfo.total;
        }
    } catch(e) {}
}


// ===== Generator =====
function selectCategory(id) {
    selectedCategory = id;
    var cat = categories[id];
    qs('#panelIcon').innerHTML = '<i class="fas ' + cat.icon + '"></i>';
    qs('#panelTitle').textContent = currentLang === 'en' ? cat.nameEn : cat.name;
    qs('#categoriesSection').style.display = 'none';
    qs('#generatorPanel').style.display = 'block';
    qs('#resultPanel').style.display = 'none';
    qs('#topicInput').value = '';
    qs('#topicInput').focus();
}

function goBack() {
    qs('#generatorPanel').style.display = 'none';
    qs('#resultPanel').style.display = 'none';
    qs('#categoriesSection').style.display = 'block';
}

async function generate() {
    var topic = qs('#topicInput').value.trim();
    if (!topic) return showToast(t('toast.enterTopic'), 'error');
    if (usageInfo.remaining <= 0) return showToast(t('toast.limitReached'), 'error');

    var cat = categories[selectedCategory];
    var style = qs('#styleSelect').value;
    var lang = qs('#languageSelect').value;
    var styleMap = {creative:'yaratıcı',professional:'profesyonel',casual:'günlük',dramatic:'dramatik',humorous:'komik'};

    qs('#generateBtn').disabled = true;
    qs('#loadingOverlay').style.display = 'flex';
    qs('#resultPanel').style.display = 'none';

    var start = Date.now();
    try {
        var res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {role: 'system', content: cat.prompt + ' Stil: ' + styleMap[style] + '. Dil: ' + (lang==='tr'?'Türkçe':'English')},
                    {role: 'user', content: topic}
                ],
                max_tokens: 1024
            })
        });
        var data = await res.json();
        if (data.limit) { usageInfo = data.limit; qs('#usageText').textContent = usageInfo.used + '/' + usageInfo.total; }
        if (data.error) throw new Error(data.error.message);
        
        currentPrompt = data.choices[0].message.content;
        qs('#resultContent').textContent = currentPrompt;
        qs('#generationTime').textContent = ((Date.now()-start)/1000).toFixed(1) + 's';
        qs('#resultPanel').style.display = 'block';
    } catch(e) { showToast(e.message, 'error'); }
    finally { qs('#generateBtn').disabled = false; qs('#loadingOverlay').style.display = 'none'; }
}

function savePrompt() {
    if (!currentPrompt) return;
    promptHistory.unshift({
        id: Date.now(),
        category: selectedCategory,
        categoryName: categories[selectedCategory].name,
        icon: categories[selectedCategory].icon,
        content: currentPrompt,
        topic: qs('#topicInput').value,
        date: new Date().toISOString()
    });
    if (promptHistory.length > 50) promptHistory.pop();
    localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    showToast(t('toast.saved'));
}

// ===== Site Analyze =====
async function analyzeSite() {
    var url = qs('#siteUrl').value.trim();
    var prompt = qs('#sitePrompt').value.trim();
    if (!url) return showToast(t('toast.enterUrl'), 'error');
    if (!prompt) return showToast(t('toast.enterPrompt'), 'error');
    if (usageInfo.remaining <= 0) return showToast(t('toast.limitReached'), 'error');

    if (url.indexOf('http') !== 0) url = 'https://' + url;

    var btn = qs('#analyzeBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = currentLang === 'en' ? 'Analyzing...' : 'Analiz ediliyor...';
    qs('#siteResultPanel').style.display = 'none';

    try {
        var proxyRes = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        });
        var proxyData = await proxyRes.json();
        if (proxyData.error) throw new Error(proxyData.error);

        var content = proxyData.content || cleanHTML(proxyData.html || '');
        if (content.length < 100) throw new Error(currentLang === 'en' ? 'Could not fetch page content' : 'Sayfa içeriği alınamadı');
        if (content.length > 12000) content = content.substring(0, 12000);

        var res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {role: 'system', content: 'Web içeriğini analiz et. Türkçe, kısa.'},
                    {role: 'user', content: 'URL: ' + url + '\n\nİÇERİK:\n' + content + '\n\nİSTEK: ' + prompt}
                ],
                max_tokens: 2048
            })
        });
        var data = await res.json();
        if (data.limit) { usageInfo = data.limit; qs('#usageText').textContent = usageInfo.used + '/' + usageInfo.total; }
        if (data.error) throw new Error(data.error.message);

        qs('#siteResult').textContent = data.choices[0].message.content;
        qs('#siteResultPanel').style.display = 'block';
    } catch(e) { showToast(e.message, 'error'); }
    finally { btn.disabled = false; btn.querySelector('span').textContent = t('btn.analyze'); }
}


// ===== AI Search =====
function setSearchQuery(q) { qs('#searchQuery').value = q; }

async function aiSearch() {
    var query = qs('#searchQuery').value.trim();
    if (!query) return showToast(t('toast.enterQuestion'), 'error');
    if (usageInfo.remaining <= 0) return showToast(t('toast.limitReached'), 'error');

    var btn = qs('#searchBtn');
    btn.disabled = true;
    btn.querySelector('span').textContent = currentLang === 'en' ? 'Searching...' : 'Araştırılıyor...';
    qs('#searchResultPanel').style.display = 'none';

    try {
        var searchRes = await fetch(SEARCH_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query: query})
        });
        var searchData = await searchRes.json();
        if (searchData.error) throw new Error(searchData.error);

        var context = searchData.contents.map(function(c,i) {
            return '[KAYNAK ' + (i+1) + ': ' + c.title + ']\n' + c.content;
        }).join('\n\n');

        var res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {role: 'system', content: 'Web kaynaklarına dayanarak yanıtla. Türkçe, kısa.'},
                    {role: 'user', content: 'SORU: ' + query + '\n\nKAYNAKLAR:\n' + context}
                ],
                max_tokens: 2048
            })
        });
        var data = await res.json();
        if (data.limit) { usageInfo = data.limit; qs('#usageText').textContent = usageInfo.used + '/' + usageInfo.total; }
        if (data.error) throw new Error(data.error.message);

        qs('#searchResult').textContent = data.choices[0].message.content;
        qs('#searchResultPanel').style.display = 'block';

        if (searchData.sources && searchData.sources.length) {
            qs('#sourcesSection').style.display = 'block';
            qs('#sourcesList').innerHTML = searchData.sources.map(function(s) {
                return '<div class="source-item"><a href="' + s.url + '" target="_blank">' + s.title + '</a></div>';
            }).join('');
        }
    } catch(e) { showToast(e.message, 'error'); }
    finally { btn.disabled = false; btn.querySelector('span').textContent = t('btn.search'); }
}

// ===== History =====
function renderHistory() {
    var list = qs('#historyList');
    var empty = qs('#emptyHistory');
    var info = qs('#usageInfo');

    var todayLabel = currentLang === 'en' ? 'Today' : 'Bugün';
    if (info) info.innerHTML = '<div class="usage-badge"><i class="fas fa-chart-pie"></i> ' + todayLabel + ': ' + usageInfo.used + '/' + usageInfo.total + '</div>';

    if (!promptHistory.length) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    var copyLabel = currentLang === 'en' ? 'Copy' : 'Kopyala';
    var deleteLabel = currentLang === 'en' ? 'Delete' : 'Sil';
    list.innerHTML = promptHistory.map(function(item) {
        return '<div class="history-item"><div class="history-item-header"><span class="history-category"><i class="fas ' + item.icon + '"></i> ' + item.categoryName + '</span><span class="history-date">' + formatDate(item.date) + '</span></div><div class="history-content">' + escapeHtml(item.content) + '</div><div class="history-actions"><button class="history-btn" onclick="copyHistoryItem(' + item.id + ')"><i class="fas fa-copy"></i> ' + copyLabel + '</button><button class="history-btn delete" onclick="deleteHistoryItem(' + item.id + ')"><i class="fas fa-trash"></i> ' + deleteLabel + '</button></div></div>';
    }).join('');
}

function copyHistoryItem(id) {
    var item = promptHistory.find(function(h) { return h.id === id; });
    if (item) copyText(item.content);
}

function deleteHistoryItem(id) {
    promptHistory = promptHistory.filter(function(h) { return h.id !== id; });
    localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    renderHistory();
    showToast(t('toast.deleted'));
}

function clearHistory() {
    var confirmMsg = currentLang === 'en' ? 'Are you sure you want to clear all history?' : 'Tüm geçmişi silmek istediğinize emin misiniz?';
    if (!confirm(confirmMsg)) return;
    promptHistory = [];
    localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    renderHistory();
    showToast(t('toast.cleared'));
}

// ===== Utils =====
function cleanHTML(html) {
    return html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/gi,' ').replace(/\s+/g,' ').trim();
}

function copyText(text) {
    if (text) { navigator.clipboard.writeText(text); showToast(t('toast.copied')); }
}

function showToast(msg, type) {
    var toast = qs('#toast');
    qs('#toastMessage').textContent = msg;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    toast.querySelector('.toast-icon i').className = type === 'error' ? 'fas fa-times' : 'fas fa-check';
    setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function formatDate(d) {
    var diff = Date.now() - new Date(d);
    if (currentLang === 'en') {
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff/60000) + ' min ago';
        if (diff < 86400000) return Math.floor(diff/3600000) + ' hours ago';
        return Math.floor(diff/86400000) + ' days ago';
    }
    if (diff < 60000) return 'Az önce';
    if (diff < 3600000) return Math.floor(diff/60000) + ' dk önce';
    if (diff < 86400000) return Math.floor(diff/3600000) + ' saat önce';
    return Math.floor(diff/86400000) + ' gün önce';
}

function escapeHtml(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
