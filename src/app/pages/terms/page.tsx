'use client';

import { PageContainer } from '@/components/ui/page-container';

export default function TermsPage() {
  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Terms & Conditions
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using SAME.&apos;s website and services, you accept and agree to be
              bound by the terms and provisions of this agreement. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. Use License
            </h2>
            <p className="mb-4 leading-relaxed">
              Permission is granted to temporarily access the materials on SAME.&apos;s website for
              personal, non-commercial transitory viewing only. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. Product Information
            </h2>
            <p className="leading-relaxed">
              We strive to provide accurate product descriptions and imagery. However, we do not
              warrant that product descriptions or other content is accurate, complete, reliable,
              current, or error-free. Colors and scents may vary slightly from what appears on
              your screen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Pricing and Payment
            </h2>
            <p className="mb-4 leading-relaxed">
              All prices are listed in USD and are subject to change without notice. We reserve
              the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify prices at any time</li>
              <li>Refuse or cancel orders if pricing errors occur</li>
              <li>Limit quantities purchased per person or household</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Payment must be received before order fulfillment. We accept major credit cards and
              other payment methods as displayed at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Shipping and Delivery
            </h2>
            <p className="leading-relaxed">
              We aim to process and ship orders within 1-3 business days. Delivery times vary
              based on your location and chosen shipping method. We are not responsible for delays
              caused by shipping carriers or customs processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Returns and Refunds
            </h2>
            <p className="mb-4 leading-relaxed">
              We want you to be completely satisfied with your purchase. Our return policy includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>30-day return window from delivery date</li>
              <li>Products must be unused and in original packaging</li>
              <li>Refunds processed within 5-10 business days</li>
              <li>Customer responsible for return shipping costs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Account Registration
            </h2>
            <p className="leading-relaxed">
              When creating an account, you must provide accurate and complete information. You are
              responsible for maintaining the confidentiality of your account credentials and for
              all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              8. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software,
              is the property of SAME. and protected by international copyright laws.
              Unauthorized use of any materials may violate copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              SAME. shall not be liable for any direct, indirect, incidental, consequential, or
              special damages arising out of or in connection with your use of our website or
              products, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              10. Governing Law
            </h2>
            <p className="leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws
              of [Your Jurisdiction], and you irrevocably submit to the exclusive jurisdiction of
              the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              11. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting to the website. Your continued use of the website after
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              12. Contact Information
            </h2>
            <p className="leading-relaxed">
              Questions about the Terms & Conditions should be sent to us at:
            </p>
            <p className="mt-4 leading-relaxed">
              Email: contact@sameperfumes.com<br />
              Address: [Your Company Address]
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Last Updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
