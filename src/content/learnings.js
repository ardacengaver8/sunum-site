// Öğrendiklerim bölümü. `visual` hangi mini çizimin gösterileceğini seçer
// (src/sections/learnings/visuals.jsx).
export const learnings = [
  {
    visual: 'context',
    title: 'Context window',
    lead: 'Model sadece penceresinde olanı görür.',
    points: [
      'Sistem talimatı, sohbet geçmişi, tool sonuçları ve getirilen belgeler aynı pencereyi paylaşır.',
      'Pencere dolunca eski şeyler özetlenir ya da dışarı alınır (offloading, alt ajanlar).',
    ],
  },
  {
    visual: 'rag',
    title: 'RAG ve hafıza',
    lead: 'Modelin bilmediğini, soru anında pencereye getirmek.',
    points: [
      'Belgeler parçalanır, soruya en yakın parçalar bulunup context’e eklenir.',
      'Parametrik hafıza (eğitimden gelen) bulanıktır; uzun süreli hafıza ayrı bir depoda tutulur.',
    ],
  },
  {
    visual: 'agent',
    title: 'Agent döngüsü',
    lead: 'Model karar verir, tool’u harness çalıştırır.',
    points: [
      'Düşün → tool çağır → sonucu gör → tekrar. Model sadece “şunu çağır” der.',
      'Rota’da hava, mesafe, mekân ve kur tool’ları bu döngüyle çalışıyor.',
    ],
  },
  {
    visual: 'loops',
    title: 'Loop engineering',
    lead: 'İşin bittiğine model değil, testler karar verir.',
    points: [
      'Seviye 2: testler geçene kadar her turda temiz bir Claude düzeltir (12/12, 1 turda).',
      'Seviye 4, Ralph loop: PLAN.md’deki görevleri tek tek yapar; 10 turda 10 görev, testler 12 → 101.',
    ],
  },
  {
    visual: 'harness',
    title: 'Harness',
    lead: 'Aynı model, etrafındaki düzenle bambaşka çalışır.',
    points: [
      'CLAUDE.md / AGENTS.md, skill’ler, hook’lar, alt ajanlar ve hafıza: hepsi harness’ın parçası.',
      'Projelerde kuralları CLAUDE.md’ye yazdım; inceleme işlerini alt ajanlara dağıttım.',
    ],
  },
  {
    visual: 'trace',
    title: 'Ölç, sonra düzelt',
    lead: 'Yavaşlığı tahmin etmek yerine trace’lerden okumak.',
    points: [
      'LangSmith her model ve tool çağrısını zaman çizelgesi olarak kaydeder.',
      'Harita aramaları 31 sn → 2,5 sn; bir cevap 3 dk → yarım dk.',
    ],
  },
  {
    visual: 'stack',
    title: 'Gerçek bir yazılım düzeni',
    lead: 'Monorepo, Docker, CI, testler.',
    points: [
      'Turborepo ile iki uygulama tek repoda; Docker ile tek komutla ayağa kalkıyor.',
      'Her PR’da GitHub Actions: lint, birim testleri, build ve tarayıcıda E2E.',
    ],
  },
  {
    visual: 'models',
    title: 'Model seçmek',
    lead: 'Hızlı mı, doğru mu? Ölçerek seçmek.',
    points: [
      'OpenRouter ile ücretsiz modelleri aynı senaryolarla karşılaştırdım.',
      'Ana model çökerse ya da takılırsa yedek model devreye giriyor.',
    ],
  },
]
