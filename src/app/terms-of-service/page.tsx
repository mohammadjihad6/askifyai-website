'use client';

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';

// Optimize Inter font loading for consistency
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function TermsOfServicePage() {
  const currentYear = new Date().getFullYear();
  const contactEmail = 'support@askifyai.tech';
  const contactPageUrl = 'https://www.askifyai.tech/contact';

  return (
    <>
      <Head>
        {/* SEO Meta Tags for Terms of Service Page */}
        <title>Terms of Service - AskifyAI</title>
        <meta name="description" content="Read the Terms of Service for AskifyAI, outlining the legal agreement between you and AskifyAI for the use of our AI-powered job interview preparation tools." />
        <meta name="keywords" content="AskifyAI terms, terms of service, legal agreement, website terms, user agreement, AI tools terms" />
        <link rel="canonical" href="https://www.askifyai.tech/terms-of-service" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/terms-of-service" />
        <meta property="og:title" content="Terms of Service - AskifyAI" />
        <meta property="og:description" content="Read the Terms of Service for AskifyAI, outlining the legal agreement for using our AI-powered tools." />
        <meta property="og:image" content="https://www.askifyai.tech/images/terms-of-service-og.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service - AskifyAI" />
        <meta name="twitter:description" content="Read the Terms of Service for AskifyAI, outlining the legal agreement for using our AI-powered tools." />
        <meta name="twitter:image" content="https://www.askifyai.tech/images/terms-of-service-twitter.webp" />
      </Head>

      <main className={`font-inter bg-white text-gray-800 ${inter.variable}`}>
        {/* Navbar */}
        <header className="flex justify-between items-center px-8 py-6 shadow-md">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icon0.svg" alt="AskifyAI Logo" width={32} height={32} priority />
            <span className="text-xl font-semibold text-indigo-600">AskifyAI</span>
          </Link>
          <nav className="space-x-6 hidden md:flex">
            <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/#features-section" className="hover:text-indigo-600 font-medium">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 font-medium">About Us</Link>
          </nav>
        </header>

        {/* Terms of Service Content Section */}
        <section className="flex-grow py-16 px-8 md:px-20 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 text-left prose prose-indigo max-w-none">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6 text-center">
              Terms of Service
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">Last updated: June 29, {currentYear}</p>

            <p>
              Welcome to AskifyAI! These Terms of Service ("Terms") govern your use of the AskifyAI website and all its related AI-powered tools and services (collectively, the "Service").
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
            
            <p className="text-base text-gray-700 mt-6 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <strong className="text-indigo-700">Privacy Policy:</strong> Please review our{" "}
              <Link href="/privacy-policy" className="text-indigo-600 hover:underline font-semibold">
                  Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information. By using our Service, you also agree to the terms of our Privacy Policy.
            </p>

            <h2>1. Use of the Service</h2>
            <p>
              AskifyAI provides AI-powered tools designed to assist individuals in preparing for job interviews, analyzing CVs, practicing problem-solving, and offering career advice. The Service is provided for informational and preparatory purposes only. While our AI aims for accuracy and helpfulness, we do not guarantee employment or specific interview outcomes.
            </p>

            <h2>2. User Content</h2>
            <p>
              Our Service allows you to submit or upload content, including but not limited to text (e.g., CV details, answers, code solutions) and files. You are solely responsible for the content you provide. You represent and warrant that you own or have the necessary rights to use your content and that it does not violate any law or infringe upon any third-party rights.
            </p>
            
            <h2>3. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of AskifyAI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>

            <h2>4. Prohibited Uses</h2>
            <p>You agree not to use the Service in any way that violates any applicable law, infringes on the rights of others, or is harmful, fraudulent, or malicious. You also agree not to interfere with the proper working of the Service.</p>

            <h2>5. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
            </p>

            <h2>6. Disclaimer of Warranty</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. ASKIFYAI MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICE OR THE INFORMATION, CONTENT, OR MATERIALS INCLUDED.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL ASKIFYAI, NOR ITS DIRECTORS OR EMPLOYEES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Jordan, without regard to its conflict of law provisions.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. By continuing to use the Service after revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, you can contact us:</p>
            <ul>
              <li>By email: <a href={`mailto:${contactEmail}`} className="text-indigo-600 hover:underline">{contactEmail}</a></li>
              <li>By visiting this page on our website: <Link href="/contact" className="text-indigo-600 hover:underline">{contactPageUrl}</Link></li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10 px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <p className="text-lg font-bold mb-4">AskifyAI</p>
            <p className="text-sm text-gray-400">© {currentYear} AskifyAI. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-indigo-400 text-sm">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-indigo-400 text-sm">Terms of Service</Link>
              <Link href="/contact" className="text-gray-400 hover:text-indigo-400 text-sm">Contact Us</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}