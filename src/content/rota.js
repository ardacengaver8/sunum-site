// Rota bölümü.
export const rota = {
  tagline: 'Geziyi anlat, Rota planlasın.',
  intro:
    'Ekipten istenen agent projesi. “3 kişiyiz, göl kenarı, kişi başı 5.000 TL” gibi bir mesajdan önce birkaç seçenek, sonra gün gün plan ve bütçe çıkarıyor. Hava, mesafe ve mekânlar gerçek servislerden geliyor; model bunları uydurmuyor.',

  // Sohbet canlandırması (örnek veriler; gerçek demo sunumda).
  demo: {
    user: '6–8 Kasım, 3 arkadaş İstanbul’dan çıkıyoruz. Göl kenarında bir ev, kişi başı 5.000 TL.',
    steps: ['Hava durumuna bakılıyor', 'Abant, Sapanca ve Gölcük karşılaştırılıyor', 'Konaklama aranıyor'],
    options: [
      { place: 'Sapanca', drive: '1 sa 50 dk', cost: '4.800 TL', weather: '14° güneşli', hue: 'sun' },
      { place: 'Abant', drive: '2 sa 50 dk', cost: '4.200 TL', weather: '11° parçalı', hue: 'sea' },
      { place: 'Gölcük', drive: '3 sa 10 dk', cost: '3.900 TL', weather: '9° yağmurlu', hue: 'violet' },
    ],
  },

  // Gerçek plan ekranı (paylaşım linkinden, hesapsız görünüm).
  screen: {
    lead: 'Gerçek modelle yapılmış bir plan, hesabı olmayanların da açabildiği paylaşım linkinden. Şehir belli olduğu için Rota seçenek sormadı, doğrudan planı yazdı.',
    notes: [
      'Gün gün, saatli plan. Satırdaki numara haritadaki numarayla aynı, otel ev işaretiyle gösteriliyor.',
      'Her yerin altında haritada açma, varsa web sitesi, otelde fiyat linki var. Mekânlar OpenStreetMap ve Geoapify’dan geliyor.',
      'Tarih tahmin için çok uzaksa hava, geçmiş yılların ortalamasından. En altta kişi sayısına göre kalem kalem maliyet.',
    ],
  },

  // Bir mesajın yolculuğu (docs/TECH_STACK.md).
  flow: [
    { node: 'Tarayıcı', tech: 'Next.js UI', text: 'Mesajı gönderiyor, akıştan gelen olayları kartlara çeviriyor: kartpostal, bilet, fiş.' },
    { node: 'Gateway', tech: 'Next.js Route Handler', text: 'Oturumu kontrol ediyor, API anahtarlarını tarayıcıdan uzak tutuyor, akışı SSE ile aktarıyor.' },
    { node: 'Agent', tech: 'LangGraph · Python', text: 'Grafı çalıştırıyor. Model “hava ve konaklama lazım” diyor, tool’ları agent çağırıyor.' },
    { node: 'Model', tech: 'OpenRouter', text: 'Ücretsiz modeller. Ana model cevap vermezse yedek model devreye giriyor.' },
    { node: 'Gerçek veri', tech: 'Open-Meteo · OSRM · Geoapify', text: 'Hava, mesafe, mekân, kur. Plandaki sayılar buradan geliyor.' },
    { node: 'Hafıza', tech: 'Postgres · Redis', text: 'Her adım kaydediliyor; sayfa yenilense de sohbet kaldığı yerden devam ediyor.' },
    { node: 'İz', tech: 'LangSmith', text: 'Her çalışmanın zaman çizelgesi. Yavaşlıkları buradan bulduk.' },
  ],

  features: [
    { icon: 'Route', title: 'Seçenek → plan → bütçe', tag: 'Çekirdek', text: 'Önce kartpostal gibi 2–3 seçenek, birini seçince gün gün plan ve bütçe fişi.' },
    { icon: 'Zap', title: 'Yer belliyse direkt plan', tag: 'Yeni', text: '“Amasya’ya gidiyoruz” dersen seçenek sormadan doğrudan planı yazıyor.' },
    { icon: 'MapPin', title: 'Numaralı harita ve linkler', tag: 'Yeni', text: 'Plandaki her yer haritada aynı numarayla; altında harita, site ve fiyat linkleri.' },
    { icon: 'Signpost', title: 'Birkaç şehirli rota', tag: 'Yeni', text: 'Kapadokya → Antalya gibi gezilerde her şehrin gecesi, oteli ve aradaki yol ayrı hesaplanıyor.' },
    { icon: 'UsersRound', title: 'Arkadaşlarla planlama', tag: 'Birlikte', text: 'Davet linkiyle arkadaşların aynı sohbete giriyor, seçeneklere oy veriyor.' },
    { icon: 'Receipt', title: 'Masraf bölüşme', tag: 'Birlikte', text: '“600 TL odun aldım” yazınca kimin kime ne borçlu olduğunu hesaplıyor.' },
    { icon: 'CloudRain', title: 'Hava uyarısı', tag: 'Otomatik', text: 'Yaklaşan gezinin hava tahmini değişirse haber veriyor.' },
    { icon: 'Brain', title: 'Hafıza', tag: 'Agent', text: 'Nereden yola çıktığını, neyi sevdiğini hatırlıyor; Profil’den görüp silebiliyorsun.' },
    { icon: 'TrainFront', title: 'Tren, otobüs, feribot', tag: 'Ulaşım', text: 'Arabanın yanında tren ve otobüs; uzaksa uçak. Yolda feribot varsa ücreti fişe ekleniyor.' },
    { icon: 'RefreshCw', title: 'Canlı güncelleme', tag: 'Yeni', text: 'Arkadaşın aynı sohbete yazınca sayfayı yenilemeden görüyorsun.' },
    { icon: 'Link', title: 'Paylaşım linki', tag: 'Paylaş', text: 'Hesabı olmayan biri de planı, haritayı ve maliyeti görebiliyor.' },
    { icon: 'Languages', title: 'Türkçe / İngilizce', tag: 'Arayüz', text: 'Arayüz iki dilde; agent da hangi dilde yazarsan o dilde cevap veriyor.' },
  ],

  phases: [
    'Kurulum', 'Belgeler', 'Monorepo', 'İlk agent', 'Gateway + akış', 'Üretken arayüz',
    'Gerçek yetenekler', 'Kalıcılık + Docker', 'E2E + CI', 'Uygulamanın geri kalanı',
    'Gerçek model', 'Tasarım', 'Hata ve hız', 'Giriş ve arkadaşlar', 'İnternette',
    'Hata ve hız 2', 'Açık uçlar', 'Sabit link', 'Paylaşım linki', 'Türkçe arayüz',
    'Tren ve otobüs', 'Gösteri',
  ],
  phasesDone: 21,

  stack: [
    { name: 'Turborepo', spec: true }, { name: 'Next.js', spec: true }, { name: 'TypeScript' },
    { name: 'LangGraph', spec: true }, { name: 'LangChain', spec: true }, { name: 'LangSmith', spec: true },
    { name: 'Python · uv' }, { name: 'PostgreSQL', spec: true }, { name: 'Redis', spec: true },
    { name: 'Docker', spec: true }, { name: 'GitHub Actions', spec: true }, { name: 'Playwright' },
    { name: 'pytest · Vitest' }, { name: 'OpenRouter' }, { name: 'Tailscale Funnel' },
  ],

  stats: [
    { value: 409, label: 'commit' },
    { value: 30, label: 'PR' },
    { value: 1017, label: 'test', note: '637 agent · 354 web · 26 E2E' },
    { value: 21, label: 'aşama' },
  ],

  hunt: {
    title: 'Gerçek modelle hata avı',
    text: 'Testler sahte modelle çalışıyor, gerçek model başka şeyler yapıyor. Gerçek modelle normal ve garip 80 senaryo denedik, LangSmith’ten 124 sohbeti indirdik ve 6 alt ajana böldük. Her biri konuşmaları okuyup modelin nerede yanlış yaptığını listeledi.',
    numbers: [
      { value: 124, label: 'sohbet' },
      { value: 587, label: 'model çağrısı' },
      { value: 6, label: 'alt ajan' },
    ],
    speed: [
      { label: 'Bir cevap (ilk hafta)', before: 180, after: 30, unit: 'sn' },
      { label: 'Yer belliyse plan', before: 108, after: 65, unit: 'sn' },
      { label: '3 harita araması', before: 31, after: 2.5, unit: 'sn' },
    ],
  },
}
