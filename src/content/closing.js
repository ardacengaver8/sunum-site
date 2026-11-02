// Rakamlar, çalışma şekli, dersler ve sırada olanlar.
export const totals = [
  { value: 3.5, decimals: 1, label: 'hafta' },
  { value: 2, label: 'canlı proje' },
  { value: 597, label: 'commit' },
  { value: 1500, label: 'otomatik test' },
  { value: 8, label: 'kurs ve bölüm', note: '3 Bazaar bölümü · 5 Academy kursu' },
]

export const howIWork = [
  {
    n: '01',
    title: 'Fikri netleştir',
    text: 'Kod yok. Önce ne istediğimi yazıyorum: amaç, kapsam dışı, tasarım taslakları. Claude soru soruyor, ben karar veriyorum.',
    files: ['INTENT.md', 'SRS.md', 'mockups/'],
  },
  {
    n: '02',
    title: 'Aşamalara böl',
    text: 'PLAN.md’de her aşamanın ne bitince bittiğini yazıyoruz. Her aşama ayrı dal, 8–15 küçük commit, tek PR.',
    files: ['PLAN.md', 'CLAUDE.md'],
  },
  {
    n: '03',
    title: 'Testle ve incelet',
    text: 'Kod ve testi birlikte. CI yeşil olmadan merge yok. Büyük işlerden sonra inceleme ajanları kodu baştan okuyor.',
    files: ['pytest', 'Vitest', 'Playwright', 'CI'],
  },
  {
    n: '04',
    title: 'Gerçek dünyada dene',
    text: 'Gerçek modelle, gerçek senaryolarla (yurt dışı dahil) dene; trace’leri oku, ölç, düzelt, tekrar.',
    files: ['LangSmith', 'senaryolar'],
  },
]

export const lessons = [
  {
    q: 'Testler gerçek veritabanını sildi.',
    a: 'Cold Take’te test ayarları yanlış sırayla yüklenince testler canlı veritabanında çalıştı. Artık testler gerçek veritabanını görürse hiç başlamıyor; riskli işlerden önce yedek alıyorum.',
  },
  {
    q: 'Model yer adı uydurdu.',
    a: 'Bir model, tool’dan gelmeyen bir yer önerdi. Prompt’a “tool’dan gelmeyen yer ya da fiyat söyleme” kuralı girdi; fiyatlar ve bütçe cümleleri artık koddan geliyor.',
  },
  {
    q: 'Ücretsiz model çöktü.',
    a: 'Ana model OpenRouter’da %0 erişilebilir oldu, bir tur 5 dakika takıldı. Her model cevabına 120 sn sınır kondu; dolarsa yedek model cevaplıyor.',
  },
  {
    q: 'Model bozuk JSON gönderdi.',
    a: 'Plan kartı bazen açılmıyordu. Sebebi trace’te çıktı: sondaki virgül, yanlış parantez. Modele güvenmek yerine araya bir onarım katmanı koyduk.',
  },
  {
    q: 'Yavaşlık sandığım yerde değildi.',
    a: 'Eski mesajları suçluyordum; trace’ler modelin kartın sayılarını boşuna yazdığını gösterdi. Şema yarıya indi, sayılar koddan geldi.',
  },
  {
    q: 'Ralph loop mu, doğrudan Claude mu?',
    a: 'Büyük, net bölünmüş iş paketlerinde Ralph loop iyi. Küçük değişikliklerde doğrudan çalışmak hem daha hızlı hem daha az kota harcıyor.',
  },
]

export const next = [
  {
    project: 'Rota',
    hue: 'sun',
    items: [
      'Restoranları harita bilgisinden puanlayıp sıralamak',
      'Plan yazılırken iskeleti hemen göstermek (günler, hava, harita)',
      'Yurt dışında tren ve otobüs saatleri',
    ],
  },
  {
    project: 'Cold Take',
    hue: 'frost',
    items: [
      'Herkese açılış: önce site, sonra Android, en son iOS',
      'Şikâyet / engelleme, yasal sayfalar',
      'coldtake alan adı',
    ],
  },
]
