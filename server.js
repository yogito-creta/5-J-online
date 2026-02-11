const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verilerin tutulduğu yer (Geçici hafıza)
let gonderiler = [];

// ANA SAYFA (Senin verdiğin HTML kodunun olduğu dosya)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ADMIN SAYFASI
app.get('/admin-panel-ozel', (req, res) => {
    res.send(`
        <html>
        <body style="background:#1a1a1a; color:white; font-family:sans-serif; text-align:center;">
            <h2>5/J Admin Kontrol</h2>
            <input type="password" id="pass" placeholder="Şifre (3131)">
            <div id="list"></div>
            <script>
                async function yukle() {
                    const r = await fetch('/api/liste');
                    const d = await r.json();
                    document.getElementById('list').innerHTML = d.map(g => 
                        \`<div style="border:1px solid #555; margin:10px; padding:10px;">
                            \${g.metin} 
                            <button onclick="onayla(\${g.id})">Onayla</button>
                        </div>\`
                    ).join('');
                }
                async function onayla(id) {
                    const p = document.getElementById('pass').value;
                    await fetch('/api/onayla', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ sifre: p, id: id })
                    });
                    yukle();
                }
                yukle();
            </script>
        </body>
        </html>
    `);
});

// API UÇLARI
app.get('/api/liste', (req, res) => res.json(gonderiler.filter(g => !g.onayli)));
app.get('/api/onayli-liste', (req, res) => res.json(gonderiler.filter(g => g.onayli)));

app.post('/api/ekle', (req, res) => {
    gonderiler.push({ id: Date.now(), metin: req.body.metin, onayli: false });
    res.json({ success: true });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sistem aktif!"));
