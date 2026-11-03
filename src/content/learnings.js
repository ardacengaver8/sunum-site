// Öğrendiklerim bölümü. `visual` hangi mini çizimin gösterileceğini seçer
// (src/sections/learnings/visuals.jsx).
export const learnings = [
  {
    visual: 'context',
    title: 'Context window',
    lead: 'Model, o anda önüne konanın dışında bir şey bilmiyor.',
    points: [
      'İlk daily sorum buydu: RAG ile context nasıl birlikte çalışıyor? Cevap: talimat, sohbet, tool sonuçları ve belgeler aynı sınırlı alanı paylaşıyor.',
      'Uzun Claude Code oturumlarında bunu yaşadım: pencere dolunca konuşma özetleniyor, bu yüzden kararları dosyalara yazıyoruz.',
    ],
  },
  {
    visual: 'rag',
    title: 'RAG ve hafıza',
    lead: 'Modelin bilmediğini, soru anında önüne getirmek.',
    points: [
      'Eğitimden gelen bilgi bir refleks gibi, bulanık. Kesin bilgi gerekiyorsa aranıp context’e eklenmesi lazım.',
      'Rota kullanıcının nereden çıktığını, neyi sevdiğini ayrı bir hafızada tutup sonraki sohbetlerde kullanıyor.',
    ],
  },
  {
    visual: 'agent',
    title: 'Agent döngüsü',
    lead: 'Model sadece “şu tool’u çağır” diyor; çalıştıran biz.',
    points: [
      'Düşün, tool çağır, sonucu oku, tekrar. Döngüyü ve tool’ları harness yönetiyor.',
      'Rota’da hava, mesafe, mekân ve döviz kuru birer tool. Model bunları kendi kafasından değil, tool’dan alınca doğru cevap veriyor.',
    ],
  },
  {
    visual: 'loops',
    title: 'Loop engineering',
    lead: 'İşin bitip bitmediğine model değil, test karar veriyor.',
    points: [
      'Testler geçene kadar her turda temiz context’le yeni bir Claude çalışıyor. İlk denemede 12 testin hepsi tek turda geçti.',
      'Ralph loop’ta görev listesi PLAN.md’de. Cold Take’in ilk 10 özelliği böyle yapıldı, testler 12’den 101’e çıktı.',
    ],
  },
  {
    visual: 'harness',
    title: 'Harness',
    lead: 'Aynı model, etrafına ne koyduğuna göre çok farklı çalışıyor.',
    points: [
      'CLAUDE.md, skill’ler, hook’lar, alt ajanlar, hafıza: modelin kendisi değil ama sonucu en çok bunlar değiştiriyor.',
      'Projelerde kod düzeni kurallarını CLAUDE.md’ye yazdım, kod incelemesi gibi uzun işleri alt ajanlara verdim.',
    ],
  },
  {
    visual: 'trace',
    title: 'Ölç, sonra düzelt',
    lead: 'Yavaşlığın sebebini tahmin etmek yerine trace’e bakmak.',
    points: [
      'LangSmith her model ve tool çağrısını süresiyle gösteriyor. Tahminim yanlış çıktı; asıl yavaş olan harita aramalarıydı.',
      'O aramaları değiştirince 31 sn’den 2,5 sn’ye indi.',
    ],
  },
  {
    visual: 'stack',
    title: 'Gerçek bir proje düzeni',
    lead: 'Monorepo, Docker, CI, testler.',
    points: [
      'Rota’da web uygulaması ve agent tek repoda (Turborepo). Docker ile hepsi tek komutla açılıyor.',
      'Her PR’da GitHub Actions lint, testler, build ve tarayıcı testlerini çalıştırıyor. Kırmızıysa merge etmiyoruz.',
    ],
  },
  {
    visual: 'models',
    title: 'Model seçmek',
    lead: 'Hangisi iyi diye sormak yerine aynı soruları sormak.',
    points: [
      'OpenRouter’daki ücretsiz modelleri aynı senaryolarla denedim. Biri tool’dan gelmeyen bir yer adı uydurdu, onu ana model yapmadık.',
      'Ücretsiz modeller bazen tamamen kapanıyor. Bu yüzden her çağrıda süre sınırı ve yedek model var.',
    ],
  },
]
