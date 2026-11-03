// Cold Take bölümü.
export const coldTake = {
  tagline: 'Önce sen puanla, sonra başkalarını gör.',
  problem:
    'Bir filmin 8.4 aldığını gördükten sonra verdiğin puan artık tam senin değil. Buna anchoring deniyor. Cold Take’te sen puan verene kadar ortalama, dağılım ve yorumlar kapalı.',
  steps: [
    { n: '01', title: 'Kapalı', text: 'Poster buzlu. Ortalama yok, yorum yok; sadece kaç yorum olduğu yazıyor.' },
    { n: '02', title: 'Puanla', text: '1.0 ile 10.0 arasında kaydır, kaydetmek için 1 saniye basılı tut. Sonradan değişmiyor.' },
    { n: '03', title: 'Açılış', text: 'Herkesin puan dağılımı açılıyor, senin puanın üstünde işaretli.' },
  ],
  // Gerçek ekran görüntülerinin altındaki notlar.
  screens: {
    home: [
      'Puanlamadığın her film buzlu görünüyor.',
      'Hot on Cold Take: son 30 günde en çok puanlanan filmler. Burada da puanlar kapalı.',
      'Arama tek kutu: filmler, yönetmen ve oyuncular, profiller.',
    ],
    film: 'Film sayfasında oyuncular, Türkiye’de nerede izlenebileceği ve detaylar var, puanlar kapalı. Bunu sadece arayüzde gizlemiyoruz: sunucu, görmemen gereken puanı tarayıcıya ya da uygulamaya hiç göndermiyor.',
  },
  features: [
    { icon: 'CalendarHeart', title: 'Günün filmi', tag: 'Birlikte', text: 'Herkese aynı film. Puanlar gece yarısı hep birlikte açılıyor.' },
    { icon: 'Users', title: 'Birlikte puanlama', tag: 'Birlikte', text: 'Bir arkadaşınla aynı filmi puanla; ikiniz de bitirmeden kimse bir şey görmüyor.' },
    { icon: 'Clapperboard', title: 'Kulüpler', tag: 'Birlikte', text: 'Her tur bir film. Herkes görmeden puanlıyor, sonuç birlikte açılıyor.' },
    { icon: 'Vibrate', title: 'Dürtme', tag: 'Sosyal', text: 'MSN’deki gibi: arkadaşının ekranı titriyor, telefonuna bildirim gidiyor.' },
    { icon: 'Rss', title: 'Feed ve takip', tag: 'Sosyal', text: 'Takip ettiklerinin puanları; senin puanlamadığın filmlerde kapalı.' },
    { icon: 'Scale', title: 'Crowd vs. you', tag: 'Profil', text: 'Genelden ne kadar farklı puanladığın ve biriyle zevkinin ne kadar uyduğu.' },
    { icon: 'ListOrdered', title: 'Listeler ve Discover', tag: 'Keşif', text: 'Kullanıcıların listeleri ve her gün sana göre birkaç öneri.' },
    { icon: 'ChartColumn', title: 'Stats for nerds', tag: 'Profil', text: 'Spotify Wrapped gibi bir özet: puanların, türler, yıllar, yönetmenler.' },
    { icon: 'Import', title: 'Letterboxd / IMDb', tag: 'İçe aktar', text: 'Başka sitedeki puanlarını tek dosyayla getirebiliyorsun.' },
  ],
  stack: ['Python', 'Flask', 'SQLite', 'TMDB API', 'Expo', 'React Native', 'PythonAnywhere', 'pytest'],
  stats: [
    { value: 483, label: 'test' },
    { value: 188, label: 'commit' },
    { value: 2, label: 'platform', suffix: '', note: 'web + iOS/Android' },
  ],
  lab: {
    title: 'Loop engineering’i ilk burada denedim',
    text: 'Kursta Ralph loop’u okuduğum gün Cold Take’e uyguladık. Bir script her turda temiz context’le yeni bir Claude açıyor; o da PLAN.md’deki ilk bitmemiş görevi yapıyor, ne yaptığını PROGRESS.md’ye yazıyor. Görev ancak pytest geçince bitmiş sayılıyor.',
    rounds: [
      { label: 'Tur 1', tasks: 5, tests: [12, 51] },
      { label: 'Tur 2', tasks: 5, tests: [51, 101] },
    ],
  },
}
