'use client';

import { PageContainer } from '@/components/ui/page-container';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className="overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Privacy Policy
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              1. Information We Collect
            </h2>
            <p className="mb-4 leading-relaxed">
              We collect information that you provide directly to us, including when you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account or make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our customer service team</li>
              <li>Participate in surveys or promotions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              2. How We Use Your Information
            </h2>
            <p className="mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you important updates about your purchases</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              3. Cookies and Tracking Technologies
            </h2>
            <p className="mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience.
              These technologies help us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and advertisements</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              You can manage your cookie preferences at any time through your browser settings or
              our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              4. Data Sharing and Disclosure
            </h2>
            <p className="mb-4 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist us in operating our business</li>
              <li>Payment processors to complete transactions</li>
              <li>Shipping companies to deliver your orders</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              5. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              6. Your Rights
            </h2>
            <p className="mb-4 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Unsubscribe from marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              7. Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              8. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              9. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please
              contact us at:
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
