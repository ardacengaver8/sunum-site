// Cold Take bölümü.
export const coldTake = {
  tagline: 'Puanın, onlarınkinden önce.',
  problem:
    'Bir filmin ortalamasını gördükten sonra verdiğin puan artık tam senin değil (anchoring etkisi). Cold Take’te sen puanlayana kadar ortalama, dağılım ve yorumlar mühürlü.',
  steps: [
    { n: '01', title: 'Mühürlü', text: 'Poster buzlu camın arkasında. Ortalama yok, yorum yok, sadece “12 yorum mühürlü”.' },
    { n: '02', title: 'Puanla', text: '1.0 – 10.0 cetveli kaydır, kilitlemek için 1 saniye basılı tut. Take kesindir.' },
    { n: '03', title: 'Açılış', text: 'Mühür açılır, salonun puan dağı çizilir ve senin çizgin üstüne düşer.' },
  ],
  features: [
    { title: 'Günün filmi', tag: 'Birlikte', text: 'Herkese aynı film. Take’ler gece yarısı birlikte açılır.' },
    { title: 'Birlikte mühürlü', tag: 'Birlikte', text: 'Bir arkadaşla puanla; ikiniz de bitirmeden kimse bir şey görmez.' },
    { title: 'Kulüpler', tag: 'Birlikte', text: 'Her tur bir film, herkes kör puanlar, take’ler birlikte açılır. Sohbet ve istatistik.' },
    { title: 'Dürtme', tag: 'Sosyal', text: 'MSN gibi: arkadaşının sayfası bir kez titrer, telefonda bildirim gelir.' },
    { title: 'Feed ve takip', tag: 'Sosyal', text: 'Takip ettiklerinin take’leri, puanlamadığın filmlerde mühürlü.' },
    { title: 'Crowd vs. you', tag: 'Profil', text: 'Kalabalıktan ne kadar farklı puanlıyorsun? Başkasıyla zevk uyumu %.' },
    { title: 'Listeler ve Discover', tag: 'Keşif', text: 'Sıralı ya da koleksiyon listeler, her gün sana özel öneriler.' },
    { title: 'Stats for nerds', tag: 'Profil', text: 'Wrapped tarzı özet: puan dağılımı, türler, on yıllar, yönetmenler.' },
    { title: 'Letterboxd / IMDb', tag: 'İçe aktar', text: 'Eski puanlarını ve izleme listeni tek dosyayla getir.' },
  ],
  stack: ['Python', 'Flask', 'SQLite', 'TMDB API', 'Expo', 'React Native', 'PythonAnywhere', 'pytest'],
  stats: [
    { value: 483, label: 'test' },
    { value: 188, label: 'commit' },
    { value: 2, label: 'platform', suffix: '', note: 'web + iOS/Android' },
  ],
  lab: {
    title: 'Loop engineering laboratuvarı',
    text: 'Cold Take’in ilk özellikleri Ralph loop ile yapıldı: her turda temiz context’le yeni bir Claude, PLAN.md’deki ilk bitmemiş görevi yapıyor; turlar arası hafıza PROGRESS.md’de, işin bittiğine pytest karar veriyor.',
    rounds: [
      { label: 'Tur 1', tasks: 5, tests: [12, 51] },
      { label: 'Tur 2', tasks: 5, tests: [51, 101] },
    ],
  },
}
