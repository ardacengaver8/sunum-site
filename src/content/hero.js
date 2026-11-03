// Açılıştaki canlı kayıt. Sıra, HeroScene'deki harness halkasıyla aynı
// (tool, skill, hook, alt ajan, hafıza, test): halkada hangi düğüm yanarsa
// burada onun çağrısı (→) ve dönen sonucu (←) yazılır.
export const heroLog = [
  { node: 'tool', call: 'get_weather("Sapanca", 6 Kasım)', result: '14°, güneşli' },
  { node: 'skill', call: 'skill: pdf okuma talimatı', result: 'talimat context’e eklendi' },
  { node: 'hook', call: 'hook: commit öncesi lint', result: 'temiz, devam' },
  { node: 'alt ajan', call: 'alt ajan: 20 sohbeti oku', result: '3 hata listelendi' },
  { node: 'hafıza', call: 'hafıza: nereden yola çıkıyor?', result: 'İstanbul' },
  { node: 'test', call: 'pytest', result: '637 geçti' },
]
