import { useState } from 'react'
import MangoRunEasterEgg,{ useMangoRun } from './components/MangoRunEasterEgg'

/* ─── DATA ─────────────────────────────────────────────── */
const problems = [
  {
    icon: '👤',
    title: '業務の属人化',
    desc: '担当者のノウハウや記憶に依存し、引き継ぎや不在時の対応が困難な状況が続いています。',
  },
  {
    icon: '📦',
    title: '在庫状況の把握が困難',
    desc: '現在ExcelやPOSで管理していますが、リアルタイムの在庫確認ができず、過不足が頻発します。',
  },
  {
    icon: '📊',
    title: '売上・利用状況の分析が不正確',
    desc: '複数のシステムや台帳が分散しており、正確な売上データや稼働率を把握できていません。',
  },
  {
    icon: '⏱️',
    title: '受付・貸出に時間がかかる',
    desc: '予約確認・在庫確認・伝票作成などの手作業が多く、顧客対応に時間がかかりすぎています。',
  },
]

const solutions = [
  {
    num: '01',
    title: '受付から返却まで一元管理',
    desc: '予約・受付・貸出・返却・請求のすべてのフローをRendixひとつで完結。複数システムを行き来する手間がなくなります。',
    color: '#f3f0ff',
  },
  {
    num: '02',
    title: 'レンタル業務を効率化',
    desc: 'バーコード・QRコードによるスキャン操作で受付・返却を瞬時に処理。スタッフの工数を大幅に削減します。',
    color: '#f0f9ff',
  },
  {
    num: '03',
    title: 'レンタルの収益を最大化',
    desc: 'リアルタイムの在庫状況・稼働率・売上データを可視化。データに基づいた経営判断を支援します。',
    color: '#f0fdf4',
  },
]

const strengths = [
  {
    num: '01',
    title: 'Rendix1つにレンタル業務の全てを集約',
    lines: [
      '予約・受付から貸出、返却、在庫管理まで、レンタル業務を一つのシステムで一元管理。',
      '従来の紙やExcel、属人的な管理では難しかった「効率的でミスのないレンタル運営」を実現し、',
      '現場の負担を減らします。誰でも簡単に運営できる、シンプルで効率的なレンタル環境を提供します。',
    ],
  },
  {
    num: '02',
    title: 'レンタル業務のデータを「経営資産」に',
    lines: [
      '予約・貸出・返却・在庫などのデータをRendixに蓄積し、店舗の利用状況や商品の稼働率、売上まで可視化・分析。',
      '感覚や経験に頼っていた店舗運営をデータに基づく判断へ変えていきます。蓄積されたデータを業務改善や需要予測、',
      '在庫最適化にも活用し、レンタルショップの成長を支える経営資産へと変えていきます。',
    ],
  },
]

const flowSteps = [
  { num: '01',title: 'お問い合わせ',desc: 'フォームまたはお電話にてお気軽にご相談ください。' },
  { num: '02',title: 'ヒアリング',desc: '現状の業務フローや課題をヒアリングし、最適な導入プランをご提案します。' },
  { num: '03',title: '初期設定・トライアル導入',desc: '商品・在庫・顧客データの移行と初期設定を行い、実際の環境でお試しいただきます。' },
  { num: '04',title: '運用開始・サポート開始',desc: '本番稼働後も専任担当者がサポート。安心してご利用いただけます。' },
]

const faqs = [
  { q: '導入期間はどれくらいかかりますか？',a: '標準的な導入期間は2〜4週間です。データ移行の規模や業務フローの複雑さによって変動します。' },
  { q: '既存のデータを移行できますか？',a: 'Excelや他システムからのデータ移行に対応しています。専任担当者がサポートします。' },
  { q: 'サポート体制はどうなっていますか？',a: 'メール・電話によるサポートを提供。導入後も安心してご利用いただけます。' },
  { q: 'セキュリティは大丈夫ですか？',a: 'SSL暗号化通信・定期バックアップ・アクセス権限管理など、エンタープライズグレードのセキュリティを提供しています。' },
]

const companyInfo = [
  { label: '会社名',value: '合同会社GOATech' },
  { label: '所在地',value: '〒212-0055 神奈川県川崎市幸区南加瀬5-5-63' },
  { label: '設立',value: '2026年10月予定' },
  { label: '代表者',value: '藤城 龍之介' },
  { label: '事業内容',value: 'レンタル業向けのSaaSプロダクトの企画・開発・販売' },
]

/* ─── COMPONENTS ────────────────────────────────────────── */

const navLinks = [
  { label: '会社概要',href: '#about-goatech' },
  { label: 'Rendixとは？',href: '#rendix' },
  { label: '料金プラン',href: '#price' },
  { label: 'よくある質問',href: '#faq' },
  { label: 'お問い合わせ',href: '#contact' },
]

function Navbar() {
  const [open,setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img
            src="/src/imports/SquareLogo_Purple.jpg"
            alt="GOATech"
            className="h-14 w-auto"
          />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-slate-600 hover:text-[#3a00d5] transition-colors font-medium">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 px-4 py-2 bg-[#3a00d5] text-white text-sm font-semibold rounded-lg hover:bg-[#2d00a8] transition-colors"
          >
            資料請求
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-slate-700 font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="px-4 py-2 bg-[#3a00d5] text-white text-sm font-semibold rounded-lg text-center" onClick={() => setOpen(false)}>
            資料請求
          </a>
        </div>
      )}
    </nav>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="h-px w-8 bg-[#3a00d5]" />
      <span className="text-[#3a00d5] text-xs font-semibold tracking-widest uppercase">{children}</span>
      <div className="h-px w-8 bg-[#3a00d5]" />
    </div>
  )
}

function Hero() {
  return (
    <section className="pt-28 pb-20 bg-gradient-to-br from-[#f8f5ff] via-white to-[#f3f0ff] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f1f3d] leading-tight mb-6">
            レンタル業務を、<br />
            <span className="text-[#3a00d5]">もっとシンプルに。</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            予約・受付・貸出・返却・請求・在庫管理まで、<br />
            レンタルショップの業務をRendixひとつで完結。<br />
            現場目線で設計されたSaaSで、業務効率を劇的に改善します。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#contact"
              className="px-6 py-3 bg-[#3a00d5] text-white font-semibold rounded-xl hover:bg-[#2d00a8] transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-0.5"
            >
              無料で資料請求する
            </a>
            <a
              href="#rendix"
              className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#3a00d5] hover:text-[#3a00d5] transition-colors"
            >
              まず詳細を見る
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-100 ring-1 ring-slate-100">
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&h=480&fit=crop&auto=format"
              alt="レンタル業務の現場"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Before / After */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">Before</span>
              <span className="text-slate-500 text-sm">旧・ExcelやPOS管理</span>
            </div>
            <ul className="space-y-2">
              {['記入ミス・転記漏れが絶えない','在庫状況がリアルタイムで不明','属人化が激しく引き継ぎ困難','売上分析に膨大な時間が必要'].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-red-400 mt-0.5">✕</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#3a00d5] to-[#6b3ff7] rounded-2xl p-6 shadow-lg shadow-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">After</span>
              <span className="text-purple-100 text-sm">Rendixで一元管理</span>
            </div>
            <ul className="space-y-2">
              {['スキャン操作で受付・返却が即完了','リアルタイム在庫・稼働状況を把握','業務フローが標準化・誰でも操作可','売上データを自動集計・即座に確認'].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-white">
                  <span className="text-purple-200 mt-0.5">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatIsRendix() {
  return (
    <section id="rendix" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionLabel>Rendixとは？</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-6">
          レンタルショップに特化した<br />業務管理SaaS
        </h2>
        <p className="text-slate-600 leading-relaxed text-base max-w-2xl mx-auto mb-12">
          Rendix（レンディクス）は、レンタルショップの業務を一元化する次世代の業務管理システムです。
          予約・受付・貸出・返却・請求・在庫管理・売上分析・顧客管理のすべてを
          レンタルショップのDXを実現し、迅速な変化の波を乗り越えるための武器となります。
        </p>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="py-20 bg-[#f8f5ff]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Problem</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">主な悩みと課題</h2>
          <p className="text-slate-500 text-sm">
            こんなお悩みはありませんか？
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="font-bold text-[#0f1f3d]">{p.title}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Solution</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">
            Rendixなら<br className="md:hidden" />そのレンタル業務を、<br />もっとシンプルにできます
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            正直なシステム業界で1番と言っていい「レンタルに特化した」システムです。
            予約から返却・管理・分析まで、あらゆるフローをデータを活用してサポートします。
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl p-7 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              style={{ backgroundColor: s.color }}
            >
              <div className="text-4xl font-bold text-[#3a00d5]/20 mb-4 font-['DM_Sans']">{s.num}</div>
              <h3 className="font-bold text-[#0f1f3d] mb-3 text-lg leading-snug">{s.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-gradient-to-r from-[#3a00d5] to-[#6b3ff7] rounded-2xl p-8 md:p-12 text-white text-center shadow-xl shadow-purple-200">
          <p className="text-purple-100 text-sm mb-3 font-medium">導入実績多数</p>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">レンタル業務を、もっとシンプルに。</h3>
          <p className="text-purple-100 text-sm mb-8 max-w-lg mx-auto">
            Rendixを実際に試してみませんか？まずは資料請求からお気軽にどうぞ。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              className="px-6 py-3 bg-white text-[#3a00d5] font-bold rounded-xl hover:bg-purple-50 transition-colors shadow"
            >
              無料で資料請求する
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              まずは無料相談
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function StrengthSection() {
  return (
    <section className="py-20 bg-[#f8f5ff]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Our Strength</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">私たちの強み</h2>
        </div>
        <div className="space-y-8">
          {strengths.map((s) => (
            <div key={s.num} className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-6">
                <div className="text-5xl font-bold text-[#3a00d5]/15 flex-shrink-0 font-['DM_Sans'] leading-none">
                  {s.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0f1f3d] mb-3">{s.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {s.lines.map((line,i) => (
                      <span key={i}>{line}{i < s.lines.length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FlowSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>Flow</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">導入フロー</h2>
          <p className="text-slate-500 text-sm">Rendixは最短2週間で導入可能。各ステップで専任担当者がサポートします。</p>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-[#3a00d5]/20" />
          <div className="grid md:grid-cols-4 gap-6">
            {flowSteps.map((step,i) => (
              <div key={step.num} className="relative text-center group">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#f3f0ff] border-2 border-[#3a00d5]/20 flex items-center justify-center group-hover:bg-[#3a00d5] group-hover:border-[#3a00d5] transition-all">
                  <span className="text-2xl font-bold text-[#3a00d5] group-hover:text-white transition-colors font-['DM_Sans']">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-[#0f1f3d] mb-2 text-sm">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                {i < flowSteps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-4 mb-2 text-[#3a00d5]/40 text-xl">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PriceSection() {
  return (
    <section id="price" className="py-20 bg-[#f8f5ff]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionLabel>Price</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">料金プラン</h2>
        <p className="text-slate-500 text-sm mb-12">シンプルで透明な料金体系。規模に合わせてお選びいただけます。</p>
        <div className="bg-white rounded-2xl border border-dashed border-[#3a00d5]/30 p-16 shadow-sm">
          <div className="text-5xl mb-6">🚧</div>
          <h3 className="text-xl font-bold text-[#0f1f3d] mb-3">Coming Soon…</h3>
          <p className="text-slate-500 text-sm mb-8">
            料金プランは現在準備中です。<br />
            詳細は資料請求またはお問い合わせにてご確認いただけます。
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a00d5] text-white font-semibold rounded-xl hover:bg-[#2d00a8] transition-colors"
          >
            料金を問い合わせる →
          </a>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open,setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">よくある質問</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq,i) => (
            <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f8f5ff] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-[#0f1f3d] text-sm pr-4">{faq.q}</span>
                <span className={`text-[#3a00d5] text-xl flex-shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                  <div className="pt-4">{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about-goatech" className="py-20 bg-[#f8f5ff]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <SectionLabel>About GOATech</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f1f3d] mb-4">GOATech について</h2>
        </div>

        {/* Mission・Vision・Value: ヤギ背景＋縦並び */}
        <div className="relative mb-12 rounded-3xl overflow-hidden">
          {/* 背景画像（50%透過） */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: "url('/src/imports/ChatGPT_Image_2026_8_23__16_19_59.png')",
              opacity: 0.12,
            }}
          />
          {/* コンテンツ */}
          <div className="relative z-10 flex flex-col items-center gap-12 py-14 px-6 text-center">
            {/* Mission */}
            <div>
              <div className="text-[#3a00d5] text-2xl font-bold tracking-widest uppercase mb-3">Mission</div>
              <div className="font-bold text-[#0f1f3d] text-xl mb-2">Simplify Every Rental</div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                あらゆるレンタル業務の複雑さを取り除き、事業者が本来の価値提供に集中できる環境を作ります。
              </p>
            </div>

            <div className="w-16 h-px bg-[#3a00d5]/20" />

            {/* Vision */}
            <div>
              <div className="text-[#3a00d5] text-2xl font-bold tracking-widest uppercase mb-3">Vision</div>
              <div className="font-bold text-[#0f1f3d] text-xl mb-2">レンタル業界のスタンダードになる</div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                日本のレンタル業界全体のデジタル基盤となり、業界標準のシステムを目指します。
              </p>
            </div>

            <div className="w-16 h-px bg-[#3a00d5]/20" />

            {/* Value */}
            <div>
              <div className="text-[#3a00d5] text-2xl font-bold tracking-widest uppercase mb-3">Value</div>
              <div className="font-bold text-[#0f1f3d] text-xl mb-6 tracking-widest">G.O.A.T.</div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="text-left">
                  <ul className="space-y-2">
                    {[
                      { letter: 'G',word: 'Growth',desc: '成長し続ける' },
                      { letter: 'O',word: 'Obsession',desc: '顧客課題に執着する' },
                      { letter: 'A',word: 'Ambition',desc: '高い目標に挑戦する' },
                      { letter: 'T',word: 'Trust',desc: '信頼を築く' },
                    ].map((v) => (
                      <li key={v.letter} className="flex items-baseline gap-2 text-sm">
                        <span className="font-bold text-[#3a00d5] w-4">{v.letter}</span>
                        <span className="font-semibold text-[#0f1f3d]">{v.word}</span>
                        <span className="text-slate-400 text-xs">{v.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:border-l border-[#3a00d5]/20 sm:pl-6 flex flex-col justify-center text-left">
                  <p className="font-bold text-[#0f1f3d] text-sm mb-1">Greatest of All Time</p>
                  <p className="text-slate-500 text-sm">=&nbsp;最高を目指し続ける</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#f3f0ff] border-b border-slate-100">
            <h3 className="font-bold text-[#0f1f3d] text-sm">会社概要</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {companyInfo.map((row) => (
              <div key={row.label} className="grid grid-cols-3 px-6 py-4">
                <div className="text-slate-500 text-sm font-medium">{row.label}</div>
                <div className="col-span-2 text-[#0f1f3d] text-sm">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [form,setForm] = useState({ name: '',company: '',email: '',message: '' })
  const [sent,setSent] = useState(false)
  const [errors,setErrors] = useState<{ name?: string; email?: string; api?: string }>({})
  const [isSending,setIsSending] = useState(false)
  const [lastAttempt,setLastAttempt] = useState(0)
  const {
    isReady: mangoRunReady,
    mangoRunRef,
    handleTriggerClick,
    handleComplete: handleMangoRunComplete,
  } = useMangoRun()

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (isSending) return
    const now = Date.now()
    if (now - lastAttempt < 3000) return
    setLastAttempt(now)

    // Frontend validation
    if (!form.name.trim()) {
      setErrors({ name: 'お名前を入力してください。' })
      return
    }
    if (!form.email.trim()) {
      setErrors({ email: 'メールアドレスを入力してください。' })
      return
    }
    if (!validateEmail(form.email)) {
      setErrors({ email: '正しいメールアドレスを入力してください。' })
      return
    }

    setIsSending(true)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const apiUrl = import.meta.env.VITE_CONTACT_API_URL || '/api/contact'
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hp: '' }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (resp.status === 200) {
        setSent(true)
        return
      }

      if (resp.status === 400) {
        const data = await resp.json().catch(() => ({}))
        setErrors({ ...(data.errors || {}), api: data.message || '入力内容に誤りがあります。' })
        return
      }

      if (resp.status === 429) {
        setErrors({ api: '短時間に送信が集中しています。\nしばらく時間をおいてから再度お試しください。' })
        return
      }

      if (resp.status >= 500) {
        setErrors({ api: '現在お問い合わせフォームを利用できません。\nお手数ですが、時間をおいて再度お試しください。' })
        return
      }

      setErrors({ api: '送信に失敗しました。時間をおいて再度お試しください。' })
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        setErrors({ api: '送信に時間がかかりすぎています。時間をおいて再度お試しください。' })
      } else {
        setErrors({ api: '送信に失敗しました。時間をおいて再度お試しください。' })
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#0f1f3d] to-[#1a3470] text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-white/30" />
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Contact</span>
            <div className="h-px w-8 bg-white/30" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">お問い合わせ・資料請求</h2>
          <p className="text-purple-200 text-sm max-w-lg mx-auto">
            Rendixにご興味をお持ちの方は、お気軽にご連絡ください。専任担当者よりご連絡いたします。
          </p>
        </div>

        {sent ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-6">✅</div>
            <h3 className="text-2xl font-bold mb-3">お送りいただきありがとうございます！</h3>
            <p className="text-purple-200 text-sm">担当者より2営業日以内にご連絡いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">お名前 *</label>
                <input
                  type="text"
                  required
                  placeholder="山田 太郎"
                  value={form.name}
                  onChange={(e) => setForm({ ...form,name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/50 transition-colors"
                />
                {errors.name && <div className="text-xs text-yellow-300 mt-2">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">会社名</label>
                <input
                  type="text"
                  placeholder="株式会社〇〇"
                  value={form.company}
                  onChange={(e) => setForm({ ...form,company: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-white/80 mb-2">メールアドレス *</label>
              <input
                type="email"
                required
                placeholder="taro@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form,email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              {errors.email && <div className="text-xs text-yellow-300 mt-2">{errors.email}</div>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white/80 mb-2">お問い合わせ内容</label>
              <textarea
                rows={4}
                placeholder="ご質問・ご要望をお気軽にどうぞ"
                value={form.message}
                onChange={(e) => setForm({ ...form,message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/50 transition-colors resize-none"
              />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                type={mangoRunReady ? 'button' : 'submit'}
                disabled={isSending && !mangoRunReady}
                onClick={mangoRunReady ? handleTriggerClick : undefined}
                className={`px-8 py-3 bg-white text-[#3a00d5] font-bold rounded-xl transition-all shadow-lg ${
                  mangoRunReady
                    ? 'cursor-pointer mango-run-trigger hover:bg-purple-50 active:scale-95 active:brightness-110'
                    : isSending
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-purple-50'
                }`}
              >
                {mangoRunReady ? 'GO!!!' : isSending ? '送信中...' : '送信する'}
              </button>
              {errors.api && <div className="text-sm text-yellow-300">{errors.api}</div>}
            </div>
          </form>
        )}
      </div>
      <MangoRunEasterEgg ref={mangoRunRef} onComplete={handleMangoRunComplete} />
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/src/imports/GOATech____.png"
                alt="GOATech"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              レンタル業務を、もっとシンプルに。<br />
              合同会社GOATechは、レンタル業界のDXを推進します。
            </p>
            <p className="text-slate-600 text-xs">© 2026 合同会社GOATech. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">Rendix</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Rendixとは？','機能一覧','料金プラン'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/80">会社情報</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                { label: '会社概要',href: '#about-goatech' },
                { label: 'お問い合わせ',href: '#contact' },
              ].map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <p className="text-slate-500 text-xs">Rendix — レンタル業務をシンプルに。</p>
            <div className="flex gap-4">
              <a href="#contact" className="px-4 py-2 bg-[#3a00d5] text-white text-xs font-semibold rounded-lg hover:bg-[#2d00a8] transition-colors">
                無料で資料請求する
              </a>
              <a href="#contact" className="px-4 py-2 border border-white/20 text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors">
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── ROOT ──────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhatIsRendix />
      <ProblemSection />
      <SolutionSection />
      <StrengthSection />
      <FlowSection />
      <PriceSection />
      <FAQSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
