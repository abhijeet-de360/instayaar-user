import React from "react";
import { Header } from "../layout/Header";

const TermsAndConditions = () => {
  return (
    <>
      <div className="md:hidden">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-4">
          Last Updated: 01 Sep 2025
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">

          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              1. Nature of Service
            </h2>
            <p>
              InstaYaar is a digital marketplace connecting customers (“Clients”) with
              independent service providers (“Yaars”).
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>We are a facilitator, we hold no responsibility for Client or Freelancer/Yaar</li>
              <li>We are not responsible for the quality, safety, legality, or performance of services rendered by yaars.</li>
              <li>We reserve the right to suspend or remove profiles receiving repeated negative feedback to maintain platform quality.</li>
              <li>Clients and Freelancer/Yaar are advised to perform their own due diligence before availing services.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. Eligibility, Registration, and Accounts
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Users must be 18 years or older to register and use the platform.</li>
              <li>You agree to provide accurate, complete, and updated information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must use the platform only for lawful purposes and avoid any fraudulent or abusive conduct.</li>
              <li>InstaYaar reserves the right to suspend or terminate accounts violating these Terms.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. Bookings and Payments
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>All bookings and payments must be made exclusively via InstaYaar.</li>
              <li>Freelancers/Yaars may set their own service rates and cancellation policies.</li>
              <li>InstaYaar charges a commission from yaars upon successful service completion.</li>
              <li>Payments are processed securely through third-party gateways. InstaYaar does not store sensitive payment information.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. Cancellations
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>All cancellations are subject to the freelancer’s individual cancellation policy, if declared explicitly.</li>
              <li>If a freelancer/yaar cancels a confirmed booking, the client will receive a 100% refund.</li>
              <li>Client no-shows or late cancellations may incur charges as per the freelancer’s policy.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              5. Refunds
            </h2>
            <p>Refunds apply only under the following conditions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The freelancer cancels the booking.</li>
              <li>The service could not be delivered as promised.</li>
            </ul>
            <p className="mt-3">Refunds do not apply for:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Client no-shows.</li>
              <li>Dissatisfaction with service quality (since yaars are independent).</li>
              <li>Cancellations made outside the freelancer’s cancellation window.</li>
            </ul>
            <p className="mt-3">
              Refund requests must be raised within <strong>48 hours</strong> of the scheduled service time. Approved refunds are processed within <strong>5–7 business days</strong>.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              6. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide accurate information and update it as necessary.</li>
              <li>Do not engage in illegal, abusive, or fraudulent activity.</li>
              <li>Do not use the platform to solicit, spam, or promote external services.</li>
              <li>Refrain from making cash transactions outside the platform.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              7. Freelancer Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Deliver services professionally, on time, and as described.</li>
              <li>Maintain clear communication with clients.</li>
              <li>Avoid discrimination, harassment, or unprofessional conduct.</li>
              <li>Comply with all applicable local laws and regulations.</li>
              <li>Service providers are solely responsible for their delivered services.</li>
              <li>InstaYaar does not guarantee service quality, timelines, or outcomes.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              8. Safety and Security
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Freelancers/Yaars and Clients must do Digi locker (GOI) verification before activation.</li>
              <li>Clients and Freelancers/Yaars should report suspicious activity</li>
              <li>Harassment, abuse, and unlawful acts are strictly forbidden.</li>
              <li>Freelancer/Yaar and client must meet in public place.</li>
              <li>Report any incidents via app support or email; urgent issues to local authorities.</li>
            </ul>
          </section>

          {/* Section 9–15 */}
          {[
            ["9. Intellectual Property", "All platform content, including text, logos, and designs, is the property of InstaYaar or its licensors. Unauthorized use is prohibited."],
            ["10. Fraud, Misuse, and Account Termination", "Fraudulent or abusive activity may result in account suspension and legal action."],
            ["11. Limitation of Liability", "InstaYaar is not liable for disputes between clients and yaars. Our maximum liability is limited to the commission earned from the disputed transaction."],
            ["12. Privacy and Data Protection", "We collect and process your data in accordance with our Privacy Policy. Refer to the app or website for full details."],
            ["13. Governing Law and Jurisdiction", "These Terms are governed by Indian law and subject to the courts of Kolkata, West Bengal."],
            ["14. Changes to Terms", "InstaYaar may modify these Terms periodically. Continued use after changes means acceptance."],
          ].map(([title, text], index) => (
            <section key={index}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
              <p>{text}</p>
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">15. Contact Us</h2>
            <ul className="list-none space-y-1">
              <li> Email: <a href="mailto:hello@instayaar.com" className="text-blue-600 hover:underline">hello@instayaar.com</a></li>
              <li> Phone: <a href="tel:+919073007070" className="text-blue-600 hover:underline">+91 9073007070</a></li>
              <li> Address: Kolkata, West Bengal, India</li>
            </ul>
          </section>

        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
