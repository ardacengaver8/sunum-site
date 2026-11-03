// Rakamlar, çalışma şekli, dersler ve sırada olanlar.
export const totals = [
  { value: 2, label: 'proje', note: 'Cold Take · Rota' },
  { value: 597, label: 'commit', note: 'küçük adımlar, hepsi git’te' },
  { value: 1500, label: 'otomatik test', note: 'çoğunu Claude yazdı' },
  { value: 30, label: 'Rota PR’ı', note: 'her biri CI’dan geçti' },
  { value: 8, label: 'kurs ve bölüm', note: '3 Bazaar bölümü · 5 Academy kursu' },
]

export const howIWork = [
  {
    n: '01',
    title: 'Önce ne istediğimi yaz',
    text: 'Kodla başlamıyoruz. Amaç, kapsam dışı olanlar ve ekran taslakları önce yazılıyor. Claude soru soruyor, kararları ben veriyorum.',
    files: ['INTENT.md', 'SRS.md', 'mockups/'],
  },
  {
    n: '02',
    title: 'Küçük parçalara böl',
    text: 'PLAN.md’de her aşamanın ne zaman bitmiş sayılacağı yazıyor. Her aşama ayrı dal ve tek PR; içinde 8–15 küçük commit.',
    files: ['PLAN.md', 'CLAUDE.md'],
  },
  {
    n: '03',
    title: 'Testsiz merge yok',
    text: 'Kod ve testi birlikte yazılıyor. CI yeşil olmadan merge etmiyoruz. Büyük bir işten sonra kodu baştan okuması için ayrı bir inceleme ajanı açıyoruz.',
    files: ['pytest', 'Vitest', 'Playwright', 'CI'],
  },
  {
    n: '04',
    title: 'Gerçekte dene',
    text: 'Testler geçince bitmiyor. Gerçek modelle, Türkiye dışı şehirler de dahil gerçek isteklerle deniyorum; trace’leri okuyup düzeltiyoruz.',
    files: ['LangSmith', 'senaryolar'],
  },
]

export const lessons = [
  {
    q: 'Testler gerçek veritabanını sildi.',
    a: 'Cold Take’te test ayarları yanlış sırada yüklenince testler benim yerel veritabanımda çalıştı ve sildi. Şimdi testler gerçek veritabanını görürse hiç başlamıyor; riskli bir şeyden önce yedek alıyorum.',
  },
  {
    q: 'Model olmayan bir yer önerdi.',
    a: 'Model karşılaştırmasında bir model, hiçbir tool’un döndürmediği bir yer adı yazdı. Prompt’a “tool’dan gelmeyen yer ya da fiyat söyleme” kuralı girdi; fiyatları ve bütçe cümlelerini artık model değil kod yazıyor.',
  },
  {
    q: 'Ücretsiz model ortadan kayboldu.',
    a: 'Ana modelimiz bir gün OpenRouter’da hiç cevap vermedi, bir istek 5 dakika bekledi. Her model çağrısına 120 sn sınır koyduk; süre dolunca yedek model cevaplıyor.',
  },
  {
    q: 'Plan kartı bazen hiç açılmıyordu.',
    a: 'Trace’e bakınca sebep çıktı: model JSON’u bozuk gönderiyordu, sonda fazladan virgül ya da eksik parantez. Modelin hep düzgün yazmasını beklemek yerine araya küçük bir onarım adımı koyduk.',
  },
  {
    q: 'Yavaşlığın sebebini yanlış tahmin ettim.',
    a: 'Uzun sohbet geçmişinin yavaşlattığını düşünüyordum. Trace’ler modelin kartlardaki sayıları da tek tek yazdığını gösterdi. O sayıları koda verdik, modelin yazdığı kısım yarıya indi.',
  },
  {
    q: 'Ralph loop her iş için değil.',
    a: 'Net bölünmüş büyük işlerde iyi çalışıyor. Küçük bir değişiklik için döngü kurmak, doğrudan Claude ile konuşmaktan hem daha yavaş hem daha pahalı.',
  },
]

export const next = [
  {
    project: 'Rota',
    hue: 'sun',
    items: [
      'Restoranları harita bilgisine göre puanlayıp sıralamak (şu an aynı kafe planda üç kez çıkabiliyor)',
      'Plan yazılırken günleri, havayı ve haritayı hemen göstermek',
      'Yurt dışında tren ve otobüs saatleri',
    ],
  },
  {
    project: 'Cold Take',
    hue: 'frost',
    items: [
      'Herkese açmak: önce site, sonra Android, en son iOS',
      'Şikâyet, engelleme ve yasal sayfalar',
      'Kendi alan adı',
    ],
  },
]
