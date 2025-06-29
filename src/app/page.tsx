'use client';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Inter } from 'next/font/google'; // Import Google Font optimization

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export default function Home() {
  return (
    <>
      <Head>
        {/* Primary SEO Meta Tags */}
        <title>AskifyAI - AI-Powered Job Interview Prep & Career Tools</title>
        <meta name="description" content="Master your next job interview and accelerate your career with AskifyAI's advanced AI tools: CV analysis, personalized interview questions, problem-solving, behavioral analysis, AI cover letters, skill gap insights, and company-specific preparation." />
        <meta name="keywords" content="AI interview preparation, CV analyzer, resume checker, personalized interview questions, problem-solving challenges, coding interview prep, behavioral interview analysis, STAR method, AI career coach, job search tools, career development, AI cover letter generator, skill gap analysis, company interview insights, job readiness" />
        <link rel="canonical" href="https://www.askifyai.tech/" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook / LinkedIn Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/" />
        <meta property="og:title" content="AskifyAI - AI-Powered Job Interview Prep & Career Tools" />
        <meta property="og:description" content="Master your next job interview and accelerate your career with AskifyAI's advanced AI tools: CV analysis, personalized interview questions, problem-solving, behavioral analysis, AI cover letters, skill gap insights, and company-specific preparation." />
        <meta property="og:image" content="https://www.askifyai.tech/images/askifyai-og-image.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AskifyAI logo with various AI tools icons for job interview preparation and career advancement" />
        <meta property="og:site_name" content="AskifyAI" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.askifyai.tech/" />
        <meta name="twitter:title" content="AskifyAI - AI-Powered Job Interview Prep & Career Tools" />
        <meta name="twitter:description" content="Master your next job interview and accelerate your career with AskifyAI's advanced AI tools: CV analysis, personalized interview questions, problem-solving, behavioral analysis, AI cover letters, skill gap insights, and company-specific preparation." />
        <meta name="twitter:image" content="https://www.askifyai.tech/images/askifyai-twitter-image.webp" />
        <meta name="twitter:image:alt" content="AskifyAI logo with various AI tools icons for job interview preparation and career advancement" />

        {/* Favicons - Essential for branding and user experience */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className={`font-inter bg-white text-gray-800 ${inter.variable}`} role="main">
        {/* Navbar */}
        <header className="flex justify-between items-center px-8 py-6 shadow-md" role="banner">
          <Link href="/" className="flex items-center space-x-2" aria-label="AskifyAI Home Page">
            <Image
              src="/icon0.svg"
              alt="AskifyAI Logo - AI-powered career tools"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-semibold text-indigo-600">AskifyAI</span>
          </Link>
          <nav className="space-x-6 hidden md:flex" aria-label="Main Website Navigation">
            <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
            <Link href="#features-section" className="hover:text-indigo-600 font-medium">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 font-medium">About Us</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-16 bg-gradient-to-r from-white to-blue-50">
          <div className="md:w-1/2 text-center md:text-left pr-0 md:pr-12">
            <p className="text-sm text-orange-600 font-semibold uppercase mb-3">Your AI Interview & Career Companion</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-gray-800">
              Ace Your Interview and Land Your Dream Job with AI
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Choose from AskifyAI's powerful, AI-driven tools to confidently prepare for your next job interview. Get personalized feedback, master interview questions, and gain expert career advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/cv-analyzer" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Preparing Now
              </Link>
              <a href="#features-section" className="flex items-center space-x-2 text-gray-700 font-medium px-4 py-2 rounded-xl hover:text-indigo-600 transition-colors" aria-label="Explore AskifyAI's AI-powered tools">
                <span className="w-4 h-4 bg-indigo-500 rounded-full" aria-hidden="true"></span>
                <span>Explore Tools</span>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 text-center">
            <Image
              src="/images/job-interview.webp"
              alt="Person confidently preparing for a job interview on a laptop, powered by AskifyAI's artificial intelligence tools"
              width={800}
              height={800}
              priority
              className="w-full max-w-md mx-auto rounded-lg shadow-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" className="py-20 px-8 md:px-20 bg-white" aria-labelledby="features-heading">
          <div className="text-center mb-12">
            <p className="text-sm text-orange-600 font-semibold mb-2 uppercase">Discover Our Tools</p>
            <h2 id="features-heading" className="text-3xl md:text-4xl font-extrabold text-gray-800">Advanced AI Tools for Rapid Career Growth</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
            {/* Feature Cards */}
            <Link href="/cv-analyzer" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Explore the AI CV and Resume Analyzer tool">
              <Image src="/images/cv-analyzer.svg" alt="Icon for AI CV and Resume Analyzer" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI CV/Resume Analyzer</h3>
              <p className="text-gray-600 text-base">Get instant, detailed feedback and AI-driven suggestions to optimize your resume for ATS and improve your chances.</p>
            </Link>
            <Link href="/interview-question" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Generate personalized interview questions with AI">
              <Image src="/images/personalized-interview.svg" alt="Icon for Personalized Interview Question Generator" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Personalized Interview Questions</h3>
              <p className="text-gray-600 text-base">Generate tailored interview questions based on your unique experience, job title, and target company requirements.</p>
            </Link>
            <Link href="/problem-solving" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Practice Interactive AI Problem-Solving Challenges">
              <Image src="/images/problem-solving.svg" alt="Icon for Interactive Problem-Solving Challenges" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Interactive Coding Challenges</h3>
              <p className="text-gray-600 text-base">Practice real-time coding challenges with instant AI feedback to sharpen your problem-solving skills for technical interviews.</p>
            </Link>
            <Link href="/topic-review" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Get a Quick AI Subject Review">
              <Image src="/images/topic-review.svg" alt="Icon for Quick Subject Review tool" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Quick Subject Review</h3>
              <p className="text-gray-600 text-base">Rapidly review core concepts and crucial topics related to your target job field through an intelligent Q&A format.</p>
            </Link>
            <Link href="/interview-tips" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Access comprehensive AI Interview Tips">
              <Image src="/images/interview-tips.svg" alt="Icon for Expert Interview Tips" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Expert Interview Tips</h3>
              <p className="text-gray-600 text-base">Gain invaluable general and professional tips, strategies, and insights to confidently ace any job interview.</p>
            </Link>
            <Link href="/behavioral-analysis" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Analyze behavioral interview questions with AI">
              <Image src="/images/behavioral-analysis.svg" alt="Icon for Behavioral Question Analyzer" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Behavioral Question Analyzer</h3>
              <p className="text-gray-600 text-base">Master behavioral questions with AI-driven insights and structured guidance using the STAR method.</p>
            </Link>
            <Link href="/cover-letter-generator" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Generate AI-powered cover letters">
              <Image src="/images/cover-letter.svg" alt="Icon for AI Cover Letter Generator" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Cover Letter Generator</h3>
              <p className="text-gray-600 text-base">Generate highly personalized, AI-powered cover letters instantly to tailor your application perfectly to any job description.</p>
            </Link>
            <Link href="/skill-gap-analyzer" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Analyze your skill gaps with AI">
              <Image src="/images/skill-gap.svg" alt="Icon for AI Skill Gap Analyzer" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Skill Gap Analyzer</h3>
              <p className="text-gray-600 text-base">Identify crucial missing skills for your target job and get personalized learning paths to bridge your career gaps.</p>
            </Link>
            <Link href="/company-insights" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Get AI-powered company insights">
              <Image src="/images/company-insights.svg" alt="Icon for AI Company Insights" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Company Insights</h3>
              <p className="text-gray-600 text-base">Understand company culture, values, and interview specifics with AI-powered insights to ace your company-specific interview.</p>
            </Link>
            <Link href="/job-search-strategist" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Create a job search strategy with AI">
              <Image src="/images/job-search-strategist.svg" alt="Icon for AI Job Search Strategist" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Job Search Strategist</h3>
              <p className="text-gray-600 text-base">Craft a winning job search plan with AI-powered strategies for platforms, networking, and personal branding.</p>
            </Link>
            <Link href="/salary-negotiator" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Negotiate your salary with AI">
              <Image src="/images/salary-negotiator.svg" alt="Icon for AI Salary Negotiator" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Salary Negotiator</h3>
              <p className="text-gray-600 text-base">Master salary negotiation with AI insights, personalized offer analysis, and actionable tips to secure your ideal compensation.</p>
            </Link>
            <Link href="/career-planner" className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block" aria-label="Plan your career with AI">
              <Image src="/images/career-planner.svg" alt="Icon for AI Career Planner" width={72} height={72} className="mx-auto mb-4" loading="lazy" />
              <h3 className="text-xl font-bold mb-2 text-indigo-700">AI Career Planner</h3>
              <p className="text-gray-600 text-base">Map your future with AI-powered progression plans, required skills roadmaps, and learning resources for strategic growth.</p>
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