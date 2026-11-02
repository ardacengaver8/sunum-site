// Rota bölümü.
export const rota = {
  tagline: 'Aklındaki geziyi yaz, Rota planlasın.',
  intro:
    'Serbestçe yazdığın bir mesajı seçeneklere, gün gün bir plana ve gerçek verilere dayanan bir bütçeye çeviren bir AI agent. Arkadaşlarınla aynı sohbette planlayıp oy verebiliyorsun.',

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

  // Bir mesajın yolculuğu (docs/TECH_STACK.md).
  flow: [
    { node: 'Tarayıcı', tech: 'Next.js UI', text: 'Mesajı gönderir; gelen olayları kartlara çevirir (kartpostal, bilet, fiş).' },
    { node: 'Gateway', tech: 'Next.js Route Handler', text: 'Oturumu kontrol eder, anahtarları saklar, akışı tarayıcıya aktarır (SSE).' },
    { node: 'Agent', tech: 'LangGraph · Python', text: 'Rota grafını başlatır. Model “hava ve konaklama lazım” der, tool’lar çalışır.' },
    { node: 'Model', tech: 'OpenRouter', text: 'Ücretsiz modeller; biri çökerse yedek model cevaplar.' },
    { node: 'Gerçek veri', tech: 'Open-Meteo · OSRM · Geoapify', text: 'Hava, mesafe, mekân, kur. Uydurma değil, ölçülen veri.' },
    { node: 'Hafıza', tech: 'Postgres · Redis', text: 'Her adım kaydedilir; sayfa yenilense de sohbet kaldığı yerden devam eder.' },
    { node: 'İz', tech: 'LangSmith', text: 'Her çalışmanın zaman çizelgesi: hangi adım ne kadar sürdü.' },
  ],

  features: [
    { title: 'Seçenek → plan → bütçe', tag: 'Çekirdek', text: 'Önce kartpostal gibi seçenekler, sonra gün gün plan ve kalem kalem fiş.' },
    { title: 'Arkadaşlarla planlama', tag: 'Birlikte', text: 'Davet linkiyle aynı sohbete gir, seçeneklere oy ver.' },
    { title: 'Masraf bölüşme', tag: 'Birlikte', text: '“600 TL odun aldım” yaz, kim kime ne borçlu hesaplansın.' },
    { title: 'Hava uyarısı', tag: 'Otomatik', text: 'Yaklaşan gezinin tahmini değişirse haber verir.' },
    { title: 'Hafıza', tag: 'Agent', text: 'Nereden çıktığını, neyi sevdiğini hatırlar; Profil’de görünür.' },
    { title: 'Tren ve otobüs', tag: 'Ulaşım', text: 'Arabanın yanında toplu taşıma seçenekleri ve feribot.' },
    { title: 'Paylaşım linki', tag: 'Paylaş', text: 'Hesabı olmayana salt okunur plan: harita, hava, maliyet.' },
    { title: 'Türkçe / İngilizce', tag: 'Arayüz', text: 'Her ekran iki dilde; agent da yazdığın dilde cevap verir.' },
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
    { value: 29, label: 'PR' },
    { value: 929, label: 'test', note: '550 agent · 353 web · 26 E2E' },
    { value: 21, label: 'aşama' },
  ],

  hunt: {
    title: 'Gerçek modelle hata avı',
    text: 'Testler geçiyor diye bitmiyor. Gerçek modelle 80 garip ve normal senaryo, ardından LangSmith’ten 124 sohbet indirildi; 6 alt ajan her konuşmayı okuyup hataları çıkardı.',
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
