import React from "react";
import { Header } from "../layout/Header";

const PrivacyPolicy = () => {
    return (
        <>
            <div className="md:hidden">
                <Header />
            </div>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
                <p className="text-muted-foreground mb-4">
                    Last Updated: 01 Sep 2025
                </p>

                <div className="space-y-8 text-sm leading-relaxed text-foreground">
                    <p>
                        At <strong>KaamDham</strong>, we value your privacy and are committed
                        to protecting your personal data. This Privacy Policy describes how
                        we collect, use, disclose, and safeguard your information when you
                        use our website <strong>(www.kaamdham.com)</strong> or mobile
                        application.
                    </p>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, billing/shipping address, etc.</li>
                            <li><strong>Usage Data:</strong> Device details, IP address, browser type, operating system, and app usage logs.</li>
                            <li><strong>Payment Data:</strong> Processed securely via trusted third-party gateways. We never store your card details.</li>
                            <li><strong>Location Data:</strong> If you enable GPS, we may collect approximate location for better service matching.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>To provide and manage requested services</li>
                            <li>To process transactions and issue invoices</li>
                            <li>To verify user identity and prevent fraud</li>
                            <li>To improve platform features and user experience</li>
                            <li>To send important updates, offers, and notifications (with consent)</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Sharing & Disclosure</h2>
                        <p>
                            We do not sell or rent your personal information. However, we may
                            share limited data with:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Service Providers:</strong> For payment processing, hosting, and analytics.</li>
                            <li><strong>Legal Obligations:</strong> When required by law or to protect our rights.</li>
                            <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or sale of assets.</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Data Retention & Deletion</h2>
                        <p>
                            We retain your personal information as long as your account is
                            active or required for legal and business purposes. You may
                            request account deletion anytime by contacting us at{" "}
                            <a
                                href="mailto:hello@kaamdham.com"
                                className="text-blue-600 underline"
                            >
                                hello@kaamdham.com
                            </a>. Once verified, your request will be processed within{" "}
                            <strong>7–10 business days</strong>.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your
                            information. However, please note that no method of transmission
                            over the internet is 100% secure, and we cannot guarantee
                            absolute security.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Right to access, update, or correct your personal data</li>
                            <li>Right to request deletion of your information</li>
                            <li>Right to withdraw consent for marketing communications</li>
                            <li>Right to lodge a complaint with relevant authorities</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">7. Third-Party Links</h2>
                        <p>
                            Our platform may contain links to third-party websites or
                            services. We are not responsible for the privacy practices or
                            content of these third parties.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">8. Children's Privacy</h2>
                        <p>
                            Our services are not directed to individuals under the age of 13.
                            We do not knowingly collect personal data from children. If you
                            believe a child has provided us with information, please contact
                            us for removal.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">9. Updates to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. Changes will
                            be effective upon posting on this page with an updated effective
                            date. We encourage you to review this policy periodically.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy or our data
                            practices, reach out to us at:
                        </p>
                        <p>
                            📧{" "}
                            <a
                                href="mailto:hello@kaamdham.com"
                                className="text-blue-600 underline"
                            >
                                hello@kaamdham.com
                            </a>
                        </p>
                        <p>📍 Kolkata, India</p>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
