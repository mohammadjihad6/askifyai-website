'use client';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Inter } from 'next/font/google';

// Optimize Inter font loading
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function AboutPage() {
  return (
    <>
      <Head>
        {/* Primary SEO Meta Tags for About Page */}
        <title>About AskifyAI - Your AI-Powered Career Advancement Partner</title>
        <meta name="description" content="Discover AskifyAI's mission to empower job seekers globally with cutting-edge AI tools for CV optimization, personalized interview practice, skill gap analysis, and expert career guidance." />
        <meta name="keywords" content="About AskifyAI, our mission, AI interview preparation, career advancement, job seeker success, AI career tools, CV analysis, interview practice, skill development, professional growth" />
        <link rel="canonical" href="https://www.askifyai.tech/about" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Social Media Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/about" />
        <meta property="og:title" content="About AskifyAI - Your AI-Powered Career Advancement Partner" />
        <meta property="og:description" content="Discover AskifyAI's mission to empower job seekers with cutting-edge AI tools for CV optimization, interview practice, and expert career guidance." />
        <meta property="og:image" content="https://www.askifyai.tech/images/about-askifyai-og.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AskifyAI company logo representing AI-powered career tools." />
        <meta property="og:site_name" content="AskifyAI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.askifyai.tech/about" />
        <meta property="twitter:title" content="About AskifyAI - Your AI-Powered Career Advancement Partner" />
        <meta property="twitter:description" content="Discover AskifyAI's mission to empower job seekers with cutting-edge AI tools for CV optimization, interview practice, and expert career guidance." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/about-askifyai-twitter.webp" />
        <meta property="twitter:image:alt" content="AskifyAI logo with text 'Empowering Your Career Journey'." />
      </Head>

      <main className={`font-inter bg-white text-gray-800 min-h-screen flex flex-col ${inter.variable}`} role="main">
        {/* Navbar - Consistent with other pages */}
        <header className="flex justify-between items-center px-8 py-6 shadow-md" role="banner">
          <Link href="/" className="flex items-center space-x-2" aria-label="AskifyAI Home Page">
            <Image
              src="/icon0.svg"
              alt="AskifyAI Logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-semibold text-indigo-600">AskifyAI</span>
          </Link>
          <nav className="space-x-6 hidden md:flex" aria-label="Main Navigation">
            <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/#features-section" className="hover:text-indigo-600 font-medium">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 font-medium">About Us</Link>
          </nav>
        </header>

        {/* Hero Section for About Page */}
        <section className="flex flex-col items-center justify-center px-8 md:px-20 py-16 bg-gradient-to-r from-white to-blue-50 text-center" aria-labelledby="about-heading">
          <div className="max-w-3xl mx-auto">
            <h1 id="about-heading" className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-800">
              About AskifyAI:<br />Empowering Your Career Journey with AI
            </h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              At **AskifyAI**, we believe that every individual deserves the opportunity to secure their dream job. Our mission is to **transform the job interview preparation process** by harnessing the power of cutting-edge **Artificial Intelligence**.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are dedicated to empowering job seekers like you with **personalized, instant, and highly effective AI tools** designed to provide a significant competitive edge in today's dynamic job market.
            </p>
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="py-20 px-8 md:px-20 bg-white" aria-labelledby="vision-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="vision-heading" className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-8">
              Our Vision: Revolutionizing Career Preparation
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              The modern job market is intensely competitive, with **Applicant Tracking Systems (ATS)** often filtering out highly qualified candidates, and interviews becoming increasingly complex. We identified a critical need for a smarter, more accessible, and truly effective way to prepare.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              **AskifyAI** was founded on this very vision: to **leverage the power of AI to demystify the entire hiring process**. We bridge the gap between a candidate's full potential and an employer's precise expectations by providing **tailored insights and unparalleled practice opportunities** that traditional preparation methods simply cannot match.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We are deeply committed to **continuous innovation**, ensuring our AI tools evolve seamlessly with the ever-changing demands of the global job market, always prioritizing **your success and career growth** above all else.
            </p>
          </div>
        </section>

        {/* How AskifyAI Empowers You Section */}
        <section className="py-20 px-8 md:px-20 bg-blue-50" aria-labelledby="empowerment-heading">
          <div className="max-w-6xl mx-auto text-center">
            <h2 id="empowerment-heading" className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-10">
              How AskifyAI Empowers Your Job Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div className="p-6 rounded-xl shadow-lg bg-white transform transition-transform duration-300 hover:scale-105">
                <div className="text-indigo-600 mb-4 text-4xl" aria-hidden="true">✨</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Personalized Preparation</h3>
                <p className="text-gray-600">Our advanced AI adapts to your **specific field, experience level, and target job role**, offering highly relevant questions and customized advice, far beyond generic tips.</p>
              </div>
              <div className="p-6 rounded-xl shadow-lg bg-white transform transition-transform duration-300 hover:scale-105">
                <div className="text-green-600 mb-4 text-4xl" aria-hidden="true">⚡</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Instant & Actionable Feedback</h3>
                <p className="text-gray-600">Receive **immediate, insightful analysis** on your CV and interview answers, complete with concrete suggestions for improvement based on **STAR methodology** and **ATS best practices**.</p>
              </div>
              <div className="p-6 rounded-xl shadow-lg bg-white transform transition-transform duration-300 hover:scale-105">
                <div className="text-yellow-600 mb-4 text-4xl" aria-hidden="true">🚀</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">Boost Your Confidence</h3>
                <p className="text-gray-600">Practice in a **stress-free, simulated environment**, accurately identify your strengths, and proactively address any weaknesses before your real interview, building **unwavering confidence**.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-8 md:px-20 bg-white text-center" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6">
              Ready to Secure Your Dream Job?
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Join thousands of successful job seekers who are actively transforming their career prospects with **AskifyAI's innovative tools**. Explore our comprehensive suite of AI-powered solutions and **start your journey to success today!**
            </p>
            <Link href="/#features-section" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg" aria-label="Explore AskifyAI Features">
              Explore Our Tools Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10 px-8 text-center" role="contentinfo">
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