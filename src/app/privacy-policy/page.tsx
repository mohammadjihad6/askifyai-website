'use client';

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';

// Optimize Inter font loading for consistency
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function PrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();
  const contactEmail = 'support@askifyai.tech';
  const contactPageUrl = 'https://www.askifyai.tech/contact';

  return (
    <>
      <Head>
        {/* SEO Meta Tags for Privacy Policy Page */}
        <title>Privacy Policy - AskifyAI</title>
        <meta name="description" content="Read the Privacy Policy for AskifyAI, detailing how we collect, use, process, and protect your information when you use our AI-powered job interview preparation tools." />
        <meta name="keywords" content="AskifyAI privacy, privacy policy, data collection, data usage, AI data processing, GDPR compliance, CCPA compliance" />
        <link rel="canonical" href="https://www.askifyai.tech/privacy-policy" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/privacy-policy" />
        <meta property="og:title" content="Privacy Policy - AskifyAI" />
        <meta property="og:description" content="Read the Privacy Policy for AskifyAI, detailing how we collect, use, and protect your information." />
        <meta property="og:image" content="https://www.askifyai.tech/images/privacy-policy-og.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - AskifyAI" />
        <meta name="twitter:description" content="Read the Privacy Policy for AskifyAI, detailing how we collect, use, and protect your information." />
        <meta name="twitter:image" content="https://www.askifyai.tech/images/privacy-policy-twitter.webp" />
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

        {/* Privacy Policy Content Section */}
        <section className="flex-grow py-16 px-8 md:px-20 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 text-left prose prose-indigo max-w-none">
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6 text-center">
              Privacy Policy
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">Last updated: June 25, {currentYear}</p>

            <p>
              This Privacy Policy describes how AskifyAI ("we", "us", or "our") collects, uses, and discloses your information when you use our website and AI-powered job interview preparation tools (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect various types of information for various purposes to provide and improve our Service to you.</p>
            <h3>1.1. User-Provided Information</h3>
            <p>While using our Service, you may provide us with certain information directly. This includes:</p>
            <ul>
              <li><strong>CV/Resume Content:</strong> When you upload your CV, you provide us with its full textual content, which may contain personally identifiable information (PII).</li>
              <li><strong>Answers and Code Solutions:</strong> When you provide answers to behavioral questions or submit code for problem-solving challenges, we collect the text of your answers/code.</li>
              <li><strong>User Inputs:</strong> Information about your professional field, experience level, job preferences, and other inputs required for our tools to function.</li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              <strong>Note:</strong> AskifyAI does not require account creation. If you include PII within content you upload (e.g., your CV), we will process it as part of that content to provide the service.
            </p>

            <h3>1.2. Automatically Collected Information (Usage Data)</h3>
            <p>We may collect information that your browser sends, such as your IP address, browser type, and pages visited, for analytical purposes to improve our service. AskifyAI currently does not use cookies for tracking beyond basic functionality.</p>

            <h2>2. How We Use Your Information</h2>
            <p>AskifyAI uses the collected data for various purposes:</p>
            <ul>
              <li>To provide, operate, and maintain our Service.</li>
              <li>To improve, personalize, and expand our Service.</li>
              <li>To understand and analyze how you use our Service.</li>
              <li>To detect, prevent, and address technical issues.</li>
              <li>To fulfill the purposes for which you provided the information.</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>We may share your information in the following situations:</p>
            <ul>
              <li><strong>With AI Service Providers:</strong> To provide our AI features, we share your input data with third-party AI model providers (e.g., OpenAI, Google Gemini). Their processing of this data is subject to their own privacy policies.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              AskifyAI does not sell your personal data to third parties.
            </p>

            <h2>4. Data Retention</h2>
            <p>
              AskifyAI retains your information only for as long as is necessary for the purposes set out in this Privacy Policy. User-provided content is processed immediately and is not permanently stored on our servers in a way that is tied to an individual user profile. Anonymized or aggregated data may be retained for analytical purposes.
            </p>

            <h2>5. Data Security</h2>
            <p>
              The security of your data is important to us. While we strive to use commercially acceptable means to protect your information, no method of transmission over the Internet is 100% secure. We implement appropriate technical and organizational measures to protect your data.
            </p>
            
            <h2>6. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have rights such as access, rectification, or erasure of your personal data. As we do not maintain user accounts, exercising certain rights may be limited, but we will make reasonable efforts to comply with requests concerning any data we can identify as yours.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you can contact us:</p>
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