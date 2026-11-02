# 3,5 Hafta

Intellica AI takımındaki ilk 3,5 haftamı anlatan tek sayfalık sunum sitesi: öğrendiklerim, **Cold Take** ve **Rota**.

## Çalıştırma

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ klasörüne statik site
```

`main`'e her push'ta GitHub Actions siteyi build alıp GitHub Pages'e koyar.

## Nerede ne var

- `src/content/`: sitedeki bütün metinler ve rakamlar. Linkler `site.js` içinde (boş link = düğme görünmez).
- `src/sections/`: sayfanın bölümleri, yukarıdan aşağı.
- `src/components/three/`: 3D sahneler (açılış, Cold Take posteri, Rota dünyası).

## Sunum modu

↓ → PgDn boşluk: sonraki bölüm · ↑ ← PgUp: önceki bölüm.
