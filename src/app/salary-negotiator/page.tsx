'use client';

import { useState, useMemo } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Cairo, Amiri, Tajawal } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });

// --- Interfaces ---
interface NegotiationStrategy {
  marketValueAnalysis: string;
  offerStrengths: string[];
  offerWeaknesses: string[];
  negotiationTips: string[];
  valueIncreaseTips: string[];
  fallbackMessage?: string;
}

export default function SalaryNegotiatorPage() {
  // --- State Hooks ---

  // Form states
  const [jobTitle, setJobTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [location, setLocation] = useState('');
  const [companyOfferedSalary, setCompanyOfferedSalary] = useState('');
  const [desiredSalary, setDesiredSalary] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency

  // Result states
  const [strategyResult, setStrategyResult] = useState<NegotiationStrategy | null>(null);

  // UI states
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Memoized Data ---
  const predefinedJobTitles = useMemo(() => [
   // 🔧 Programming & IT
  'Backend Developer', 'Frontend Developer', 'Full-stack Developer',
  'Mobile Developer (iOS)', 'Mobile Developer (Android)', 'Software Engineer',
  'Web Developer', 'DevOps Engineer', 'Cloud Engineer', 'System Administrator',
  'Database Administrator', 'IT Support Specialist', 'Network Engineer',
  'Cybersecurity Analyst', 'QA Engineer', 'Test Automation Engineer',
  'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
  'Blockchain Developer', 'Game Developer', 'Technical Support Engineer',
  'IT Project Manager', 'Help Desk Specialist', 'IT Security Specialist',

  // 🎨 Design & Creative
  'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer',
  'Graphic Designer', 'Web Designer', 'Visual Designer',
  'Motion Designer', 'Animator', 'Illustrator', 'Art Director',
  'Brand Designer', 'Creative Director', 'Design Researcher',
  'Content Designer', 'Content Writer', 'Copywriter', 'Technical Writer',

  // 💼 HR & Administration
  'HR Specialist', 'HR Manager', 'Recruitment Specialist', 'Talent Acquisition Specialist',
  'HR Business Partner', 'Compensation and Benefits Analyst',
  'Training and Development Officer', 'Employee Relations Specialist',
  'Administrative Assistant', 'Office Manager',

  // 📊 Finance & Accounting
  'Accountant', 'Auditor', 'Financial Analyst', 'Bookkeeper',
  'Tax Accountant', 'Management Accountant', 'Payroll Specialist',
  'Forensic Accountant', 'Investment Analyst', 'Finance Manager',
  'Risk Analyst', 'Treasury Analyst', 'Financial Planner',
  'Investment Banker', 'Controller', 'Chief Financial Officer (CFO)',

  // 📈 Business, Marketing & Sales
  'Business Analyst', 'Project Manager', 'Product Manager',
  'Marketing Specialist', 'Digital Marketing Manager', 'Growth Marketer',
  'Sales Manager', 'Sales Representative', 'Customer Support Specialist',
  'Customer Success Manager', 'CRM Specialist', 'Brand Strategist',
  'Market Research Analyst', 'E-commerce Specialist', 'SEO Specialist',
  'SEM Specialist', 'Social Media Manager', 'Partnership Manager',

  // ⚗️ Science & Healthcare
  'Medical Doctor', 'Nurse', 'Pharmacist', 'Medical Researcher',
  'Clinical Research Coordinator', 'Biologist', 'Chemist',
  'Lab Technician', 'Biomedical Engineer', 'Public Health Specialist',
  'Radiologist', 'Psychologist',

  // 🎓 Education
  'Teacher', 'Professor', 'Lecturer', 'Tutor',
  'Curriculum Developer', 'Instructional Designer', 'Education Consultant',
  'Education Administrator',

  // ⚖️ Legal & Compliance
  'Lawyer', 'Legal Consultant', 'Paralegal',
  'Compliance Officer', 'Contract Specialist',

  // 🧩 Miscellaneous
  'Consultant', 'Journalist', 'Photographer', 'Videographer',
  'Event Manager', 'Voice Actor', 'Translator',
  'Entrepreneur', 'Freelancer', 'Virtual Assistant'
], []);

  const predefinedLocations = useMemo(() => [
    'Remote', 'Amman, Jordan', 'Irbid, Jordan', 'Dubai, UAE', 'Riyadh, Saudi Arabia', 'Cairo, Egypt', 'New York, USA', 'London, UK'
  ], []);

  const predefinedExperienceYears = useMemo(() => [
    'No experience', '1-2 years', '3-5 years', '6-10 years', '10+ years'
  ], []);

  // --- Main Form Handler ---
  const handleAnalyzeNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim() || !experienceYears || !location.trim()) {
      setError('Please fill in job title, years of experience, and location.'); // UI Error: Always English
      return;
    }

    setIsLoading(true);
    setError(null);
    setStrategyResult(null);

    try {
      const payload = {
        jobTitle: jobTitle.trim(),
        experienceYears,
        location: location.trim(),
        companyOfferedSalary: companyOfferedSalary.trim(),
        desiredSalary: desiredSalary.trim(),
        strategyLanguage: preferredLanguage, // Use renamed state
      };

      const res = await fetch('/api/salary-negotiator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData: NegotiationStrategy | null = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse negotiation strategy response body:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? 'تلقينا استجابة غير قابلة للتحليل.' : 'Received an unparseable response.');
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.fallbackMessage || (preferredLanguage === 'Arabic' ? 'فشل توليد خطة التفاوض.' : 'Failed to generate strategy.'));
      }

      if (
        responseData && typeof responseData.marketValueAnalysis === 'string' &&
        Array.isArray(responseData.offerStrengths) &&
        Array.isArray(responseData.offerWeaknesses) &&
        Array.isArray(responseData.negotiationTips) &&
        Array.isArray(responseData.valueIncreaseTips)
      ) {
        setStrategyResult(responseData);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? 'تنسيق استجابة خطة التفاوض غير صالح.' : 'Invalid negotiation strategy response format from AI.');
      }

    } catch (err: any) {
      console.error("Error analyzing negotiation:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || (preferredLanguage === 'Arabic' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.')}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setJobTitle('');
    setExperienceYears('');
    setLocation('');
    setCompanyOfferedSalary('');
    setDesiredSalary('');
    setPreferredLanguage('English');
    setStrategyResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  // --- JSX Rendering ---
  return (
    <>
      <Head>
        <title>AI Salary Negotiator Assistant | AskifyAI</title>
        <meta name="description" content="Master salary negotiation with AI. Analyze market value, strengths, weaknesses, and get personalized negotiation tips to secure your best offer with AskifyAI." />
        <meta name="keywords" content="salary negotiation, AI salary tool, compensation negotiation, job offer negotiation, salary analysis, career advice, negotiation tips" />
        <link rel="canonical" href="https://www.askifyai.tech/salary-negotiator" />
        <meta property="og:title" content="AI Salary Negotiator Assistant | AskifyAI" />
        <meta property="og:description" content="Master salary negotiation with AI. Analyze market value and get personalized negotiation tips to secure your best offer." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/salary-negotiator" />
        <meta property="og:image" content="https://www.askifyai.tech/images/salary-negotiator-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Salary Negotiator Assistant | AskifyAI" />
        <meta property="twitter:description" content="Master salary negotiation with AI. Analyze market value and get personalized negotiation tips to secure your best offer." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/salary-negotiator-twitter.webp" />
      </Head>

      <main className={`font-inter bg-white text-gray-800 min-h-screen flex flex-col ${inter.variable} ${cairo.variable} ${amiri.variable} ${tajawal.variable}`} role="main">
        <header className="flex justify-between items-center px-8 py-6 shadow-md" role="banner">
          <Link href="/" className="flex items-center space-x-2" aria-label="AskifyAI Home">
            <Image src="/icon0.svg" alt="AskifyAI Logo" width={32} height={32} priority />
            <span className="text-xl font-semibold text-indigo-600">AskifyAI</span>
          </Link>
          <nav className="space-x-6 hidden md:flex" aria-label="Main Navigation">
            <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/#features-section" className="hover:text-indigo-600 font-medium">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 font-medium">About Us</Link>
          </nav>
        </header>

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="negotiator-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative">
            <Image
              src="/images/salary-negotiator.svg"
              alt="AI Salary Negotiator icon: a scale balancing coins and a contract, symbolizing fair compensation negotiation."
              width={100}
              height={100}
              className="mb-6 mx-auto"
              priority
            />
            <h1 id="negotiator-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
              AI Salary Negotiator
            </h1>
            <p className="text-lg text-gray-600 mb-4">
  Maximize your compensation with AI-powered salary analysis — including market insights, job offer breakdowns, and key negotiation strategies.
</p>

<p className="text-lg text-gray-600 mb-8">
  Gain the confidence to negotiate effectively and secure the salary you deserve with personalized, data-driven guidance.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert">
                <p className="font-bold">Error:</p> {/* UI: Always English */}
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="flex flex-col items-center text-indigo-600">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  <p className="text-xl font-semibold">Analyzing Offer...</p> {/* UI: Always English */}
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleAnalyzeNegotiation} className="space-y-6 text-left">
                <div>
                  <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-semibold mb-2">Job Title:</label>
                  <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Software Engineer" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="job-titles-options" required />
                  <datalist id="job-titles-options">{predefinedJobTitles.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="experienceYears" className="block text-gray-700 text-sm font-semibold mb-2">Years of Experience:</label>
                  <select id="experienceYears" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="">Select years of experience</option> {/* UI: Always English */}
                    {predefinedExperienceYears.map((option) => (<option key={option} value={option}>{option}</option>))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location:</label>
                  <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Amman, Jordan; Remote" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="location-options" required />
                  <datalist id="location-options">{predefinedLocations.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="companyOfferedSalary" className="block text-gray-700 text-sm font-semibold mb-2">Company Offered Salary (Optional):</label>
                  <input type="number" id="companyOfferedSalary" value={companyOfferedSalary} onChange={(e) => setCompanyOfferedSalary(e.target.value)} placeholder="e.g., 1500 (in local currency)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" min="0" />
                </div>

                <div>
                  <label htmlFor="desiredSalary" className="block text-gray-700 text-sm font-semibold mb-2">Your Desired Salary (Optional):</label>
                  <input type="number" id="desiredSalary" value={desiredSalary} onChange={(e) => setDesiredSalary(e.target.value)} placeholder="e.g., 1800 (in local currency)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" min="0" />
                </div>

                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Strategy Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !jobTitle.trim() || !experienceYears || !location.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || !jobTitle.trim() || !experienceYears || !location.trim()}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Analyzing...</>) : ('Analyze Offer')}
                </button>
              </form>
            )}

            {currentPhase === 'results' && strategyResult && (
              <div dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your Negotiation Strategy</h2>

                {strategyResult.fallbackMessage && (
                  <div className="mb-8 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm">
                    <p className="font-bold">Note:</p> {/* UI: Always English */}
                    <p className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>{strategyResult.fallbackMessage}</p>
                  </div>
                )}
                
                <div className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>
                  {strategyResult.marketValueAnalysis && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-blue-200">
                      <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2"><span className="text-2xl">📊</span> Market Value Analysis</h3>
                      <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: strategyResult.marketValueAnalysis }} />
                    </div>
                  )}
                  {strategyResult.offerStrengths.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-green-50 border border-green-200">
                      <h3 className="font-bold text-xl text-green-700 mb-3 flex items-center gap-2"><span className="text-2xl">👍</span> Offer Strengths</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.offerStrengths.map((strength, index) => (<li key={`strength-${index}`}>{strength}</li>))}</ul>
                    </div>
                  )}
                  {strategyResult.offerWeaknesses.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-red-50 border border-red-200">
                      <h3 className="font-bold text-xl text-red-700 mb-3 flex items-center gap-2"><span className="text-2xl">👎</span> Offer Weaknesses</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.offerWeaknesses.map((weakness, index) => (<li key={`weakness-${index}`}>{weakness}</li>))}</ul>
                    </div>
                  )}
                  {strategyResult.negotiationTips.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-purple-50 border border-purple-200">
                      <h3 className="font-bold text-xl text-purple-700 mb-3 flex items-center gap-2"><span className="text-2xl">🗣️</span> Negotiation Tips</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.negotiationTips.map((tip, index) => (<li key={`nego-tip-${index}`}>{tip}</li>))}</ul>
                    </div>
                  )}
                  {strategyResult.valueIncreaseTips.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-orange-50 border border-orange-200">
                      <h3 className="font-bold text-xl text-orange-700 mb-3 flex items-center gap-2"><span className="text-2xl">📈</span> Tips to Increase Value</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.valueIncreaseTips.map((tip, index) => (<li key={`value-tip-${index}`}>{tip}</li>))}</ul>
                    </div>
                  )}
                </div>

                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoading}>
                  Start New Analysis
                </button>
              </div>
            )}
          </div>
        </section>

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