// Genel bilgiler. Linkler boşsa sitede o düğme görünmez.
export const site = {
  name: 'Arda Cengaver',
  team: 'Intellica · AI Takımı',
  range: '13 Ekim – 4 Kasım 2026',
  links: {
    coldTakeRepo: '',
    coldTakeLive: 'https://ardacengo.pythonanywhere.com',
    rotaRepo: '',
    github: 'https://github.com/ardacengaver8',
  },
}

// Sunum modundaki duraklar, sırayla. id'ler section'ların id'si.
// `chapter` olanlar ara ekran: menüde görünmez ama ok tuşuyla durulur.
export const sections = [
  { id: 'giris', label: 'Giriş' },
  { id: 'bolum-1', chapter: true },
  { id: 'yolculuk', label: 'Yolculuk' },
  { id: 'ogrendiklerim', label: 'Öğrendiklerim' },
  { id: 'bolum-2', chapter: true },
  { id: 'cold-take', label: 'Cold Take' },
  { id: 'bolum-3', chapter: true },
  { id: 'rota', label: 'Rota' },
  { id: 'bolum-4', chapter: true },
  { id: 'rakamlar', label: 'Rakamlar' },
  { id: 'nasil', label: 'Nasıl çalışıyorum' },
  { id: 'dersler', label: 'Dersler' },
  { id: 'son', label: 'Sırada' },
]

// Bölüm ara ekranları.
export const chapters = {
  'bolum-1': { number: 'I', title: 'Öğrenmek', word: 'öğrenmek', line: 'Kurslar, daily’deki sorular ve ilk denemeler.', tone: 'dusk' },
  'bolum-2': { number: 'II', title: 'Cold Take', word: 'kör puan', line: 'İlk proje: film puanlarken başkalarının puanından etkilenmemek.', tone: 'frost' },
  'bolum-3': { number: 'III', title: 'Rota', word: 'agent', line: 'Ekibin verdiği teknolojilerle bir AI agent: plandan internete.', tone: 'sun' },
  'bolum-4': { number: 'IV', title: 'Geriye bakış', word: 'dersler', line: 'Nasıl çalıştığım, ters giden şeyler ve sırada olanlar.', tone: 'dusk' },
}
