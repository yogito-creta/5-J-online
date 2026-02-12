const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.'));

// VERİLERİ RAM'DE TUTAN LİSTELER
let onayliGonderiler = [{id: 1, metin: "Sınıf portalına hoş geldiniz!"}];
let bekleyenGonderiler = [];
let duyurular = ["Okula bir hafta kırmızı beyaz giyiniyoruz 🇹🇷"];
let odevler = [{ders: "Matematik", detay: "Fasikül sayfa 20'ye kadar."}];

// --- GÖNDERİ API ---
app.get('/api/onayli-liste', (req, res) => res.json(onayliGonderiler));
app.get('/api/liste', (req, res) => res.json(bekleyenGonderiler));
app.post('/api/ekle', (req, res) => {
    const yeni = { id: Date.now(), metin: req.body.metin };
    bekleyenGonderiler.push(yeni);
    res.sendStatus(200);
});
app.post('/api/onayla', (req, res) => {
    if(req.body.sifre === "3131") {
        const gonderi = bekleyenGonderiler.find(g => g.id === req.body.id);
        if(gonderi) {
            onayliGonderiler.push(gonderi);
            bekleyenGonderiler = bekleyenGonderiler.filter(g => g.id !== req.body.id);
            return res.sendStatus(200);
        }
    }
    res.status(401).send("Hatalı şifre");
});

// --- DUYURU VE ÖDEV API ---
app.get('/api/duyurular', (req, res) => res.json(duyurular));
app.get('/api/odevler', (req, res) => res.json(odevler));

app.post('/api/duyuru-ekle', (req, res) => {
    if(req.body.sifre === "3131") {
        duyurular.unshift(req.body.metin);
        return res.sendStatus(200);
    }
    res.sendStatus(401);
});

app.post('/api/odev-ekle', (req, res) => {
    if(req.body.sifre === "3131") {
        odevler.unshift({ ders: req.body.ders, detay: req.body.detay });
        return res.sendStatus(200);
    }
    res.sendStatus(401);
});

app.listen(process.env.PORT || 3000, () => console.log("Sunucu hazır!"));
