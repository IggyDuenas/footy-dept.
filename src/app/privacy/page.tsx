import { Metadata } from 'next'
import NavShell from '@/components/NavShell'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Footy Dept. — how we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-black min-h-screen">
      <NavShell />

      <div className="pt-16">
        {/* Hero */}
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Privacy Policy.
          </h1>
          <p className="text-white/50 text-sm">Last updated: June 19, 2026</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
          <div className="space-y-10 text-white/70 text-sm leading-relaxed">
            <p>
              Footy Dept. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information when you use footydept.com (the &ldquo;Site&rdquo;).
            </p>

            {/* 1 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">1. Information We Collect</h2>

              <h3 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-2 mt-4">Information you provide to us</h3>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li><strong className="text-white/90">Order information:</strong> name, email address, shipping address, and order details (items, size, customization, quantity) when you place an order.</li>
                <li><strong className="text-white/90">Customization content:</strong> any custom name or number you submit for personalized products.</li>
                <li><strong className="text-white/90">Communications:</strong> information you provide when you contact us for support.</li>
              </ul>

              <h3 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-2 mt-6">Information collected automatically</h3>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li><strong className="text-white/90">Usage data:</strong> pages visited, time spent on the Site, browser type, device type, and general location (city/region level) inferred from IP address, collected via standard web analytics.</li>
                <li><strong className="text-white/90">Cookies:</strong> small files stored on your device to support cart functionality, remember preferences, and (if applicable) measure Site performance. See Section 6 for more on cookies.</li>
              </ul>

              <h3 className="text-white/90 font-bold text-xs uppercase tracking-wider mb-2 mt-6">Information we do not collect</h3>
              <p>
                We do not collect or store your full payment card number, CVV, or other sensitive card data. Payments are processed directly by Stripe, our payment processor, which collects this information under its own privacy policy.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Process and fulfill your orders, including order confirmation emails sent via our email provider, Resend;</li>
                <li>Respond to customer service inquiries;</li>
                <li>Operate, maintain, and improve the Site;</li>
                <li>Detect and prevent fraud, abuse, or security incidents;</li>
                <li>Comply with legal obligations.</li>
              </ul>
              <p className="mt-3">We do not sell your personal information to third parties.</p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">3. Who We Share Information With</h2>
              <p className="mb-4">
                We share information with the following categories of service providers, solely to operate the Site and fulfill orders:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-white font-bold text-xs uppercase tracking-wider py-3 pr-6">Service Provider</th>
                      <th className="text-white font-bold text-xs uppercase tracking-wider py-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-6">Stripe</td>
                      <td className="py-3">Payment processing</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-6">Supabase</td>
                      <td className="py-3">Database hosting (order, product, and account data)</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-6">Resend</td>
                      <td className="py-3">Sending order confirmation emails</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-3 pr-6">Vercel</td>
                      <td className="py-3">Website hosting</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Each of these providers processes data under their own privacy policies and security practices. We may also disclose information if required by law, subpoena, or other legal process, or to protect the rights, property, or safety of Footy Dept., our customers, or others.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">4. Data Retention</h2>
              <p>
                We retain order information for as long as necessary to fulfill the order, comply with our legal and tax obligations, resolve disputes, and enforce our agreements. If you would like your data deleted sooner, contact us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>{' '}
                and we will honor your request to the extent we are not legally required to retain it (for example, tax and accounting records).
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">5. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>Request access to the personal information we hold about you;</li>
                <li>Request correction of inaccurate information;</li>
                <li>Request deletion of your personal information, subject to legal retention requirements;</li>
                <li>Object to or restrict certain processing of your information.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>.
                We will respond within a reasonable timeframe.
              </p>
              <p className="mt-3">
                If you are located in the European Economic Area or United Kingdom, you may also have the right to lodge a complaint with your local data protection authority. If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and the right to opt out of the sale of personal information — note that we do not sell personal information as defined under the CCPA.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">6. Cookies</h2>
              <p className="mb-3">We use cookies and similar technologies for:</p>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li><strong className="text-white/90">Essential functions:</strong> keeping items in your cart, remembering your session.</li>
                <li><strong className="text-white/90">Analytics</strong> (if enabled): understanding how visitors use the Site so we can improve it.</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Disabling cookies may affect the functionality of the Site, including cart functionality.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">7. Children&rsquo;s Privacy</h2>
              <p>
                The Site is not directed at children under 13 (or the relevant minimum age in your jurisdiction), and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">8. Data Security</h2>
              <p>
                We take reasonable technical and organizational measures to protect your information, including encrypted connections (HTTPS), access controls on our database, and use of reputable third-party processors. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">9. International Data Transfers</h2>
              <p>
                Our service providers may process and store data in countries other than your own, including the United States. By using the Site, you consent to the transfer of your information to these jurisdictions, which may have different data protection laws than your country of residence.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date above reflects the most recent revision. Material changes will be reflected on this page; continued use of the Site after changes are posted constitutes acceptance of the revised policy.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your information, contact us at{' '}
                <a href="mailto:iggyduenas@gmail.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">iggyduenas@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
