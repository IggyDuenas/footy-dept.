import { Metadata } from 'next'
import Link from 'next/link'
import NavShell from '@/components/NavShell'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about our football jerseys, shipping, sizing, returns, and more.',
}

const FAQS = [
  {
    category: 'Our Jerseys',
    questions: [
      {
        q: 'Are your jerseys officially licensed?',
        a: 'No — Footy Dept. sells high-quality unofficial fan kits. We are not affiliated with, endorsed by, or licensed by any football club, league, federation, or governing body. All team names and crests belong to their respective owners. We are transparent about this — our kits are fan-grade replicas made by quality manufacturers.',
      },
      {
        q: 'What is the quality like?',
        a: 'Our jerseys are manufactured in Thailand by factories that specialise in fan-grade football kits. The fabric, stitching, and print quality are checked before fulfillment. These are not the cheapest knockoffs you find on random sites — we curate what we sell and we would wear every kit on the site ourselves.',
      },
      {
        q: 'What is the difference between Fan version and Player version?',
        a: 'Fan version jerseys are the standard replica cut — the style most supporters wear in the stands. Player version jerseys use a tighter athletic fit, lighter fabric, and closer construction to what players wear on the pitch. Both are available where listed.',
      },
      {
        q: 'What is a Retro kit?',
        a: 'Retro kits are reproductions of classic jerseys from past decades — think Argentina 1986, Germany 1990, Brazil 1970. These are fan-favourite historical designs recreated in quality fabric. They are sorted by era in our shop filters.',
      },
      {
        q: 'What is the Mystery Box?',
        a: 'The Mystery Box is a curated surprise — you pick your size, we pick the kit. It could be a current national team jersey, a retro classic, or a limited club kit. Always premium, always a surprise. Mystery Boxes are final sale and cannot be returned.',
      },
    ],
  },
  {
    category: 'Sizing',
    questions: [
      {
        q: 'How do I pick the right size?',
        a: 'Football jerseys generally run true to size. If you prefer a looser fit for wearing casually, size up one. If you want a fitted athletic look, go true to size. Check our Size Guide for specific chest and length measurements.',
      },
      {
        q: 'Do your sizes run small or large?',
        a: 'Our jerseys follow standard European sizing which can run slightly smaller than US sizing. We recommend sizing up if you are between sizes or prefer a relaxed fit.',
      },
      {
        q: 'Can I add a custom name and number to my jersey?',
        a: 'Yes — on eligible products you can add a custom name (up to 12 characters) and number (0-99) for a flat fee of $10. This is added during the product page customization step before adding to cart.',
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        q: 'Where do you ship to?',
        a: 'We ship internationally including the USA, Canada, UK, Australia, France, Germany, Spain, Italy, Brazil, and Mexico. Shipping destinations are selected at Stripe checkout.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee. All orders are tracked.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order ships you will receive a confirmation. You can also use our Order Tracking page at footydept.com/track — enter your order number and email address to see your current status.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Free standard shipping is available on qualifying orders. Express shipping is always a paid upgrade.',
      },
    ],
  },
  {
    category: 'Orders & Returns',
    questions: [
      {
        q: 'Can I return my jersey?',
        a: 'Unworn, unwashed items in original condition can be returned within 30 days of delivery. Mystery Boxes are final sale and cannot be returned. Jerseys with custom name and number printing are also final sale. Contact us to initiate a return.',
      },
      {
        q: 'What if my jersey arrives damaged or incorrect?',
        a: 'If your order arrives damaged or we sent the wrong item, contact us immediately and we will make it right — replacement or full refund, your choice.',
      },
      {
        q: 'Can I cancel or change my order?',
        a: 'Orders can be cancelled or changed within 24 hours of placing them. After that the order enters processing and we cannot guarantee changes. Contact us as soon as possible.',
      },
      {
        q: 'Do you offer discounts for buying multiple jerseys?',
        a: 'Yes — we automatically apply volume discounts at checkout. Buy 3-4 jerseys and get 5% off each. 5-6 jerseys gets you 10% off. 7-9 jerseys 15% off. 10 jerseys (the maximum per order) gets you 20% off each jersey. Discounts apply to the jersey base price only.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We use Stripe for secure payment processing. All major credit and debit cards are accepted including Visa, Mastercard, and American Express.',
      },
      {
        q: 'Is checkout secure?',
        a: 'Yes. All payments are processed by Stripe, one of the world\'s leading payment processors. We never store your card details.',
      },
      {
        q: 'Do you have a discount code?',
        a: 'Check our announcement banner for current active codes. Our World Cup 2026 promotion code WORLDCUP is currently active — enter it in the cart drawer before checkout.',
      },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.flatMap(cat =>
    cat.questions.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
}

export default function FAQPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <NavShell />

      <div className="pt-16">
        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">FAQ</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Got Questions.
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Everything you need to know about Footy Dept.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4 mt-10">
                {section.category}
              </h2>
              <div className="border-t border-white/10">
                {section.questions.map((item) => (
                  <details key={item.q} className="group border-b border-white/10">
                    <summary className="flex items-center justify-between text-white font-semibold text-base py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="text-white/30 text-xl ml-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="text-white/50 text-sm leading-relaxed pb-4 pr-8">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 text-center border-t border-white/10 pt-12">
            <p className="text-white/40 text-sm tracking-wider uppercase mb-6">
              Still have questions?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="text-blue-400 hover:text-blue-300 text-sm underline underline-offset-4 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/shop"
                className="bg-white text-black font-black text-xs tracking-widest uppercase px-8 py-4 hover:bg-blue-500 hover:text-white transition-colors duration-200"
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
