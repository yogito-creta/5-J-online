const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let gonderiler = [];

// Ana Sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GİZLİ ADMİN PANELİ (Sadece AI yönlendirmesiyle girilecek)
app.get('/gizli-yonetim-3131', (req, res) => {
    res.send(`
        <html lang="tr">
        <head><title>5/J Admin</title><meta charset="UTF-8"></head>
        <body style="background:#0f2027; color:white; font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#00c6ff;">🔒 5/J Yönetim Paneli</h1>
            <input type="password" id="pass" placeholder="Admin Şifresi (3131)" style="padding:12px; border-radius:8px; border:none; margin-bottom:20px; width:250px;">
            <div id="list"></div>
            <br><button onclick="window.location.href='/'" style="background:#555; color:white; border:none; padding:10px; cursor:pointer; border-radius:5px;">Siteden Çık</button>

            <script>
                async function yukle() {
                    const r = await fetch('/api/liste');
                    const d = await r.json();
                    const listDiv = document.getElementById('list');
                    if(d.length === 0) { listDiv.innerHTML = "<p>Onay bekleyen gönderi yok.</p>"; return; }
                    listDiv.innerHTML = d.map(g => 
                        \`<div style="border:1px solid #00c6ff; margin:10px; padding:15px; border-radius:10px; background:rgba(255,255,255,0.05)">
                            <p>\${g.metin}</p> 
                            <button onclick="onayla(\${g.id})" style="background:#2ecc71; color:white; border:none; padding:10px 20px; cursor:pointer; border-radius:5px;">ONAYLA ✅</button>
                        </div>\`
                    ).join('');
                }
                async function onayla(id) {
                    const p = document.getElementById('pass').value;
                    const res = await fetch('/api/onayla', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ sifre: p, id: id })
                    });
                    if(res.ok) { alert("Onaylandı!"); yukle(); } else { alert("Şifre Hatalı!"); }
                }
                yukle();
            </script>
        </body>
        </html>
    `);
});

// API Uçları
app.get('/api/liste', (req, res) => res.json(gonderiler.filter(g => !g.onayli)));
app.get('/api/onayli-liste', (req, res) => res.json(gonderiler.filter(g => g.onayli)));

app.post('/api/ekle', (req, res) => {
    if(req.body.metin) {
        gonderiler.push({ id: Date.now(), metin: req.body.metin, onayli: false });
        res.json({ success: true });
    }
});

app.post('/api/onayla', (req, res) => {
    if (req.body.sifre === "3131") {
        const g = gonderiler.find(x => x.id === req.body.id);
        if (g) g.onayli = true;
        res.json({ success: true });
    } else {
        res.status(403).send("Hatalı!");
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Sunucu Aktif!"));
