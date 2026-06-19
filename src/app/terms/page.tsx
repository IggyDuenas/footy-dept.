import { Metadata } from 'next'
import Link from 'next/link'
import NavShell from '@/components/NavShell'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Footy Dept. — read our terms governing use of the site and purchases.',
}

export default function TermsPage() {
  return (
    <main className="bg-black min-h-screen">
      <NavShell />

      <div className="pt-16">
        {/* Hero */}
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Terms of Service.
          </h1>
          <p className="text-white/50 text-sm">Last updated: June 19, 2026</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          <div className="space-y-10 text-white/70 text-sm leading-relaxed">
            <p>
              Welcome to Footy Dept. (&ldquo;Footy Dept.,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of footydept.com (the &ldquo;Site&rdquo;) and any purchases you make through it. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
            </p>

            {/* 1 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Who We Are</h2>
              <p>
                Footy Dept. is an independent retailer of fan-grade football apparel. We are not affiliated with, endorsed by, sponsored by, or officially licensed by any football club, league, national federation, FIFA, UEFA, or any other governing body, brand, or rights holder. All team names, club crests, national emblems, and related marks referenced on this Site are the property of their respective owners and are used solely for descriptive purposes to identify the products we sell.
              </p>
              <p className="mt-3">
                Our products are fan-grade replicas, not officially licensed merchandise. If you are looking for officially licensed product, please purchase directly from the relevant club, federation, or their authorized retailers.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. Eligibility</h2>
              <p>
                You must be at least 18 years old, or the age of majority in your jurisdiction, to make a purchase on this Site. If you are under that age, you may use the Site only with the involvement and consent of a parent or guardian.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Accounts and Order Lookup</h2>
              <p>
                We do not currently require account creation to make a purchase. You may look up an existing order using the email address and order reference provided in your confirmation email. You are responsible for keeping your order confirmation email secure, as it can be used to access your order details.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Products, Pricing, and Availability</h2>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>All prices are listed in U.S. dollars unless otherwise stated and are subject to change without notice.</li>
                <li>We make reasonable efforts to display product information, sizing, and images accurately, but we do not warrant that product descriptions, images, or other content are error-free.</li>
                <li>We reserve the right to limit quantities, refuse service, or cancel orders at our discretion, including in cases of suspected fraud, pricing errors, or unavailability of inventory. If we cancel an order after payment, you will receive a full refund.</li>
                <li>Volume discounts, promotional codes, and other pricing offers are applied as described on the Site at the time of purchase and may be modified or discontinued at any time.</li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Customization (Name, Number, and Badges)</h2>
              <p>
                Where offered, you may personalize certain products with a custom name, number, and/or badges for an additional fee. By submitting a customization request, you confirm that:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-2 mt-3">
                <li>The content you submit does not infringe any third party&rsquo;s rights, including trademarks, and is not unlawful, offensive, or in violation of these Terms.</li>
                <li>We reserve the right to refuse any customization request that we determine, in our sole discretion, to be inappropriate, infringing, or otherwise unsuitable.</li>
                <li>Customized items are subject to the exchange-only policy described in our <Link href="/returns" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Returns &amp; Refund Policy</Link>.</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">6. Orders, Payment, and Order Confirmation</h2>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>All payments are processed securely through Stripe. We do not store your full payment card details on our servers.</li>
                <li>An order confirmation email does not guarantee product availability; it confirms that we have received your order and payment.</li>
                <li>You are responsible for providing an accurate shipping address. We are not responsible for orders misdirected due to incorrect address information provided at checkout.</li>
              </ul>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">7. Shipping</h2>
              <p>
                Shipping methods, timeframes, and costs are presented at checkout. Shipping times are estimates only and are not guaranteed. Risk of loss and title for products purchased pass to you upon our delivery to the carrier.
              </p>
              <p className="mt-3">
                For international orders (where offered), you are responsible for any customs duties, import taxes, or fees levied by your country. We are not responsible for delays caused by customs processing.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">8. Returns, Exchanges, and Refunds</h2>
              <p>
                Returns, exchanges, and refunds are governed by our <Link href="/returns" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Returns &amp; Refund Policy</Link>, which is incorporated into these Terms by reference.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">9. Intellectual Property</h2>
              <p>
                The Site itself — including its design, layout, original graphics, text, and software — is the property of Footy Dept. or its licensors and is protected by applicable intellectual property laws. You may not copy, reproduce, distribute, or create derivative works from the Site without our prior written consent.
              </p>
              <p className="mt-3">
                Team names, crests, and other third-party marks displayed on the Site remain the property of their respective owners, as noted in Section 1.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">10. Prohibited Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Use the Site for any unlawful purpose or in violation of these Terms;</li>
                <li>Attempt to gain unauthorized access to the Site, our systems, or other users&rsquo; order information;</li>
                <li>Use automated means (bots, scrapers) to access the Site without our prior written permission;</li>
                <li>Submit customization content that is unlawful, defamatory, or infringes a third party&rsquo;s rights;</li>
                <li>Interfere with or disrupt the operation of the Site.</li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">11. Disclaimer of Warranties</h2>
              <p className="uppercase text-white/50 text-xs leading-relaxed">
                THE SITE AND ALL PRODUCTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT PRODUCTS WILL MEET YOUR EXPECTATIONS REGARDING OFFICIAL LICENSING, AS OUR PRODUCTS ARE EXPRESSLY UNOFFICIAL AND UNLICENSED.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">12. Limitation of Liability</h2>
              <p className="uppercase text-white/50 text-xs leading-relaxed">
                TO THE FULLEST EXTENT PERMITTED BY LAW, FOOTY DEPT. AND ITS OWNERS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR PRODUCTS PURCHASED THROUGH IT. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM YOUR USE OF THE SITE OR A PURCHASE SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE PRODUCT(S) GIVING RISE TO THE CLAIM.
              </p>
              <p className="mt-3">
                Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Footy Dept. from any claims, damages, losses, or expenses (including reasonable attorneys&rsquo; fees) arising from your violation of these Terms, your misuse of the Site, or content you submit (including customization content).
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">14. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent changes. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">15. Governing Law</h2>
              <p>
                These Terms are governed by the laws of the State of Florida, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved in the courts located in the State of Florida, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">17. Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>.
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
