# Yaparak Öğrendiklerim

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ardacengaver8/sunum-site)

Intellica AI takımına yaptığım sunumun sitesi (13 Ekim – 4 Kasım 2026): neler öğrendim ve bunları denediğim iki proje, **Cold Take** ve **Rota**.

**Canlı:** https://ardacengaver8.github.io/sunum-site/
**DeepWiki:** https://deepwiki.com/ardacengaver8/sunum-site

## Sayfada ne var

| Bölüm | İçerik |
| --- | --- |
| Giriş | 3D sahne: ortada model, etrafında harness (tool, skill, hook, alt ajan, hafıza, test), modele akan context ve yörüngede iki ürün. Turuncu ışık tool çağrısı, yeşil ışık dönen sonuç; soldaki “agent döngüsü” paneli aynı çağrıları canlı olarak yazar. Ürüne tıklayınca o bölüme gider. |
| I · Öğrenmek | Gün gün yolculuk (yatay kayan zaman çizelgesi) ve küçük animasyonlarla anlatılan sekiz kavram: context, RAG, agent, döngüler, harness, trace… |
| II · Cold Take | Kör puanlama fikri; sitede denenebilen puanlama (basılı tut; cam kalkar, posterde salonun ortalaması, dağılımı ve senin puanın görünür), canlı sitenin ekranları, Ralph loop deneyi, rakamlar. |
| III · Rota | Gerçek kıtalarla çizilmiş dünya: sırayla bir örnek gezi ve Rota'nın o gezide çağırdığı tool'lar; sohbet canlandırması, gerçek bir plan (Paris, paylaşım linkinden), bir mesajın Tarayıcı → Gateway → LangGraph → Model → gerçek veri yolculuğu, 22 aşama, özellikler, gerçek modelle hata avı. |
| IV · Geriye bakış | Toplam rakamlar, çalışma şeklim, ters giden şeyler ve sırada olanlar. |

## Sunum modu

Sayfa slayt gibi de gezilebilir:

- ↓ → PgDn boşluk: sonraki durak
- ↑ ← PgUp: önceki durak

Bölüm ara ekranları (I–IV) da birer durak.

## Çalıştırma

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ klasörüne statik site
```

`main`'e her push'ta GitHub Actions siteyi build alıp GitHub Pages'e koyar (`.github/workflows/deploy.yml`), yaklaşık bir dakika sürer.

## Nerede ne var

- `src/content/`: sitedeki bütün metinler ve rakamlar. Bir şeyi değiştirmek için çoğu zaman sadece burayı düzenlemek yeter.
  - `site.js`: isim, tarih, linkler (boş link = düğme görünmez), sunum durakları, bölüm ara ekranları.
  - `hero.js`: açılıştaki agent döngüsü panelinin satırları.
  - `journey.js`, `learnings.js`, `coldtake.js`, `rota.js`, `closing.js`: bölümlerin içeriği.
- `src/sections/`: sayfanın bölümleri, yukarıdan aşağı.
- `src/components/three/`: 3D sahneler (açılış, Cold Take posteri, Rota dünyası). `landDots.json`, dünyadaki kara noktaları; Natural Earth verisinden bir kez üretildi.
- `public/shots/`: projelerin gerçek ekran görüntüleri (webp).

## Ekran görüntüleri nereden

- **Cold Take:** canlı sitenin hesapsız açılan sayfaları (ana sayfa, film sayfası).
- **Rota:** yerelde kaydedilmiş bir gezinin salt okunur paylaşım linki (`/shared/<kod>`), Türkçe arayüz, 1440×900.

## Kullanılanlar

Vite · React 19 · Tailwind CSS v4 · three.js + React Three Fiber + drei · Motion · Lenis · lucide ikonları. Sadece frontend; sunucu veya veritabanı yok.
