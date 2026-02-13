import { Footer } from "@/components/sections/footer";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-6 pb-16 pt-32">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg mb-6 text-foreground">
              <strong>SAME. – Privacy & Cookie Policy</strong>
            </p>

            <p className="mb-6 text-muted-foreground">
              This Privacy and Cookie Policy describes how SAME. ("we", "our", "us") collects, uses, shares, and safeguards personal information through the www.sameperfumes.com website and its related customer service channels.
            </p>

            <p className="mb-6 text-muted-foreground">
              We value your privacy and are committed to protecting your personal data in accordance with the applicable data protection laws of the United Arab Emirates (UAE).
            </p>

            <p className="mb-8 text-muted-foreground">
              By accessing our website or communicating with us, you agree to the terms outlined in this Privacy and Cookie Policy and our Website Terms and Conditions.
            </p>

            <p className="mb-12 text-sm text-muted-foreground">
              Please note that this policy may be updated periodically, and the latest version will always be available on our website. You are encouraged to review this page regularly to stay informed of any updates.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
              <p className="mb-4 text-muted-foreground">
                We and our authorized service providers may collect information provided directly by you through our website, by phone, email, or any other communication channels. We may also receive information from third parties legally authorized to share it with us. The information collected may include:
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">a. Personal and Contact Information:</h3>
              <p className="mb-4 text-muted-foreground">
                Name, billing and delivery addresses, phone number, email, payment details, date of birth, gender, nationality, and information related to gift recipients.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">b. Website and Technical Data:</h3>
              <p className="mb-4 text-muted-foreground">
                IP address, location, browser type, device details, the URL used to access our website, pages visited, search terms, and items clicked.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">c. Transactional Information:</h3>
              <p className="mb-4 text-muted-foreground">
                Orders placed, products purchased, dates and times of transactions, incomplete orders, preferences, and personalized requests.
              </p>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">d. Third-Party Information:</h3>
              <p className="mb-4 text-muted-foreground">
                Data provided by payment processors, delivery partners, loyalty programs, surveys, or promotional campaigns.
              </p>

              <p className="text-sm text-muted-foreground">
                Please note that full payment card details are used only to process your transaction and are not stored or accessible to our staff. All payments are securely handled by certified and legally authorized partners.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
              <p className="mb-4 text-muted-foreground">Your personal data may be used for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground">
                <li>To process and fulfill your orders or deliver requested services.</li>
                <li>To verify and complete financial transactions, including fraud prevention and credit checks.</li>
                <li>To respond to customer inquiries and provide support.</li>
                <li>To manage your account and improve your shopping experience.</li>
                <li>For analytical and statistical purposes to enhance website performance.</li>
                <li>For marketing communications, including newsletters and promotions (unless you choose to opt out).</li>
                <li>To ensure compliance with legal obligations and protect our rights and the rights of others.</li>
                <li>To maintain website integrity and security.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We may offer a Live Chat feature for customer support. Chat transcripts may be recorded and accessed solely for service quality purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Information Sharing</h2>
              <p className="mb-4 text-muted-foreground">We may share your personal data with:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-muted-foreground">
                <li>Our affiliated companies and trusted business partners.</li>
                <li>Authorized third-party service providers handling payment processing, logistics, IT, marketing, or website maintenance.</li>
                <li>Professional advisors such as lawyers, auditors, and insurers.</li>
                <li>Governmental, regulatory, or law enforcement authorities when legally required.</li>
                <li>Successors or acquirers in the event of a merger, acquisition, or restructuring.</li>
                <li>Gift recipients or warranty providers related to your order.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                All third parties handling your information are contractually required to keep it confidential and use it only for the agreed purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Marketing Preferences and Contact</h2>
              <p className="mb-4 text-muted-foreground">
                When registering on our website, you may choose whether to receive marketing communications from us or our selected partners.
              </p>
              <p className="mb-4 text-muted-foreground">
                You can unsubscribe at any time by clicking the "unsubscribe" link in our emails or by contacting us directly.
              </p>
              <p className="text-muted-foreground">
                For any privacy-related inquiries or to update your communication preferences, please contact us at:
                <br />
                📧 <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Security</h2>
              <p className="mb-4 text-muted-foreground">
                Your personal information is stored on secure servers, and all payment transactions are encrypted using Secure Socket Layer (SSL) technology.
              </p>
              <p className="mb-4 text-muted-foreground">
                You are responsible for keeping your account credentials (username and password) confidential.
              </p>
              <p className="mb-4 text-muted-foreground">
                We have implemented robust security measures including encryption, monitoring, and authentication to safeguard our systems.
              </p>
              <p className="text-sm text-muted-foreground">
                However, please note that no internet transmission is completely secure, and the exchange of data is carried out at your own risk.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. International Data Transfers</h2>
              <p className="mb-4 text-muted-foreground">
                Your personal data may be transferred and stored outside the United Arab Emirates.
              </p>
              <p className="mb-4 text-muted-foreground">
                By using our website, you consent to such transfers, acknowledging that privacy laws in other jurisdictions may differ.
              </p>
              <p className="text-muted-foreground">
                We ensure that any third parties handling your data maintain strict confidentiality and comply with recognized data protection standards.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Policy Updates</h2>
              <p className="mb-4 text-muted-foreground">
                We may revise this Privacy & Cookie Policy from time to time to reflect regulatory or operational changes.
              </p>
              <p className="text-muted-foreground">
                Updates take effect once published on www.sameperfumes.com, and your continued use of the website signifies your acceptance of the revised policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Third-Party Advertising</h2>
              <p className="mb-4 text-muted-foreground">
                Certain advertisements on our website may be served by third-party networks using cookies or similar technologies to personalize ads based on your interests.
              </p>
              <p className="mb-4 text-muted-foreground">
                We do not control the data collection practices of these third parties, and their privacy practices are not covered by this policy.
              </p>
              <p className="text-muted-foreground">
                We recommend reviewing their privacy statements for additional details.
              </p>
            </section>

            <section className="mb-12 bg-muted p-6 rounded-lg text-foreground">
              <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All credit/debit card details and personally identifiable information will not be stored, sold, shared, rented, or leased to any third party.</li>
                <li>Customers are encouraged to review this page periodically for updates.</li>
                <li>Any modifications to this policy will be effective on the date of publication on our website.</li>
              </ul>
            </section>

            <div className="text-center pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                📧 <a href="mailto:contact@sameperfumes.com" className="text-primary hover:underline">contact@sameperfumes.com</a>
                <br />
                📞 +971 58 562 1027
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
