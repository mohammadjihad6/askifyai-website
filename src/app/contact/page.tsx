'use client';

import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';

// Optimize Inter font loading for consistency
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function ContactPage() {
  const contactEmail = 'support@askifyai.tech';

  return (
    <>
      <Head>
        {/* SEO Meta Tags for Contact Us Page */}
        <title>Contact AskifyAI - Get In Touch With Us</title>
        <meta name="description" content="Have questions or need support for AskifyAI's tools? Contact us directly via email. We're here to help you master your job interview preparation." />
        <meta name="keywords" content="AskifyAI contact, support, customer service, email, get in touch, interview prep help" />
        <link rel="canonical" href="https://www.askifyai.tech/contact" />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/contact" />
        <meta property="og:title" content="Contact AskifyAI - Get In Touch With Us" />
        <meta property="og:description" content="Have questions or need support for AskifyAI's tools? Contact us directly via email." />
        <meta property="og:image" content="https://www.askifyai.tech/images/contact-askifyai-og.webp" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact AskifyAI - Get In Touch With Us" />
        <meta name="twitter:description" content="Have questions or need support for AskifyAI's tools? Contact us directly via email." />
        <meta name="twitter:image" content="https://www.askifyai.tech/images/contact-askifyai-twitter.webp" />
      </Head>

      <main className={`font-inter bg-white text-gray-800 min-h-screen flex flex-col ${inter.variable}`}>
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

        {/* Contact Section */}
        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50 text-center">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full">
            <Image
              src="/images/contact-icon.svg"
              alt="An icon representing contact methods like mail and messages"
              width={100}
              height={100}
              className="mb-6 mx-auto"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-indigo-700">
              Get In Touch
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              Have questions about AskifyAI, need support, or want to share your feedback? We're here to help!
            </p>
            
            <p className="text-gray-800 text-xl font-semibold mb-2">
              Send us an email:
            </p>
            <a 
              href={`mailto:${contactEmail}`} 
              className="text-indigo-600 hover:text-indigo-800 text-2xl font-bold transition-colors duration-200"
              aria-label={`Email us at ${contactEmail}`}
            >
              {contactEmail}
            </a>

            <p className="text-gray-600 text-base mt-8">
              We aim to respond to all inquiries within 24-48 business hours.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10 px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <p className="text-lg font-bold mb-4">AskifyAI</p>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} AskifyAI. All rights reserved.</p>
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