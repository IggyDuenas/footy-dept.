import { Metadata } from 'next'
import Link from 'next/link'
import NavShell from '@/components/NavShell'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'Returns, exchanges, and refund policy for Footy Dept. — how to return or exchange your order.',
}

export default function ReturnsPage() {
  return (
    <main className="bg-black min-h-screen">
      <NavShell />

      <div className="pt-16">
        {/* Hero */}
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Returns & Refunds.
          </h1>
          <p className="text-white/50 text-sm">Last updated: June 19, 2026</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          <div className="space-y-10 text-white/70 text-sm leading-relaxed">
            <p>
              We want you to be happy with your order. Here&rsquo;s how returns, exchanges, and refunds work at Footy Dept.
            </p>

            {/* 1 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Standard Items (No Customization)</h2>
              <p>
                If your order does not include custom name/number personalization, you may return it within <strong className="text-white">30 days</strong> of delivery for a refund, subject to the conditions below.
              </p>

              <h3 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-2 mt-6">Conditions for return</h3>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Item must be unworn, unwashed, and in its original condition with tags attached (if applicable).</li>
                <li>Item must not show signs of wear, damage, or odor.</li>
                <li>Proof of purchase (order confirmation email or order reference) is required.</li>
              </ul>

              <h3 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-2 mt-6">To start a return</h3>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>Use our <Link href="/track" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Track Your Order</Link> page to confirm your order details, or contact us at <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a> with your order reference.</li>
                <li>We&rsquo;ll provide return instructions, including the return address.</li>
                <li>Once we receive and inspect the returned item, we&rsquo;ll process your refund to your original payment method within 5&ndash;10 business days.</li>
              </ol>

              <p className="mt-4">
                <strong className="text-white/90">Return shipping:</strong> Unless the item arrived damaged, defective, or incorrect (see Section 3), the customer is responsible for return shipping costs. We recommend using a trackable shipping method, as we are not responsible for items lost in transit back to us.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. Customized Items (Custom Name, Number, or Badges)</h2>
              <p>
                Because personalized items are made specifically for you, <strong className="text-white">customized items are not eligible for a refund</strong>. We understand sizing can be tricky, so:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 mt-3">
                <li><strong className="text-white/90">Exchanges are accepted</strong> within 30 days of delivery for a different size of the same item, provided the item is unworn, unwashed, and in original condition.</li>
                <li>The custom name, number, and badges will be re-applied to the replacement size at no additional charge.</li>
                <li>You are responsible for return shipping on the original item; we cover shipping on the replacement.</li>
                <li>If the size you need is unavailable, we will offer store credit instead of a refund.</li>
              </ul>
              <p className="mt-3">
                This exchange-only policy does not apply if the customized item arrived damaged, defective, or with an error on our part (see Section 3 below) — in those cases, we will make it right at no cost to you.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Damaged, Defective, or Incorrect Items</h2>
              <p>
                If your order arrives damaged, defective, or different from what you ordered (including customization errors caused by us), contact us within <strong className="text-white">7 days</strong> of delivery at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>{' '}
                with photos of the issue and your order reference. We will offer, at your choice:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 mt-3">
                <li>A full refund, or</li>
                <li>A free replacement/exchange, or</li>
                <li>Store credit.</li>
              </ul>
              <p className="mt-3">We cover all shipping costs in these cases.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Order Cancellations</h2>
              <p>
                Because we begin processing orders quickly to get your gear to you faster, we can only accommodate cancellation requests within a short window after the order is placed. Contact us immediately at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>{' '}
                if you need to cancel — we&rsquo;ll do our best to catch it before it ships, but cannot guarantee cancellation once an order has entered processing.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Sale and Discounted Items</h2>
              <p>
                Items purchased at a discount (including volume discounts and promo codes) follow the same return policy as full-price items, with refunds issued for the amount actually paid.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">6. Late or Missing Refunds</h2>
              <p>
                If you haven&rsquo;t received a refund within 10 business days of our confirming it, first check with your bank or card issuer — processing times vary. If you still have concerns, contact us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">7. Contact Us</h2>
              <p>
                Questions about a return, exchange, or refund? Reach us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>{' '}
                or use the <Link href="/track" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Track Your Order</Link> page to find your order details first.
              </p>
            </section>

            {/* Disclaimer */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-white/30 text-xs leading-relaxed italic">
                Footy Dept. is an independent retailer of unofficial fan kits. We are not affiliated with, endorsed by, or licensed by any football club, league, federation, or governing body. All team names, crests, and trademarks belong to their respective owners.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
