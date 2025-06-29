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
interface CompanyInsights {
  cultureSummary: string;
  commonQuestions: string[];
  valuesToHighlight: string[];
  fitTips: string[];
  isFallbackInfo: boolean;
  fallbackMessage?: string;
}

export default function CompanyInsightsPage() {
  // --- State Hooks ---

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency

  // Result states
  const [analysisResult, setAnalysisResult] = useState<CompanyInsights | null>(null);

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

  const predefinedCompanies = useMemo(() => [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'IBM', 'Oracle', 'SAP', 'Cisco', 'Adobe', 'NVIDIA', 'Intel',
    'Salesforce', 'ServiceNow', 'Shopify', 'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Square', 'Zoom', 'Slack', 'Atlassian', 'Twilio', 'Classera',
    'Estarta Solutions', 'NextTwo', 'Zain Jordan', 'Orange Jordan', 'Umniah', 'Mawdoo3.com', 'HyperPay', 'Gate to Pay', 'Akhtaboot', 'Bayt.com', 'MadfooatCom',
    'Ekeif.com', 'Aumet', 'CashBasha', 'Jamalon', 'Dot.jo', 'ProgressSoft', 'Alchemist Trading', 'Aspire Global', 'Optimiza', 'IrisGuard', 'Accelerate Labs',
    'Arab Bank', 'Housing Bank for Trade and Finance', 'Bank al Etihad', 'Royal Jordanian', 'Hikma Pharmaceuticals', 'Aramex',
    'MenaITech', 'Advantage Software Factory (ASF)', 'Integrated Technology Group (ITG)',
    'Coca-Cola', 'PepsiCo', 'Nike', 'Adidas', 'Starbucks', 'McDonald\'s', 'Toyota', 'BMW',
    'Accenture', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Unilever', 'Procter & Gamble (P&G)', 'Johnson & Johnson'
  ].sort(), []);

  // --- Main Form Handler ---
  const handleGetInsights = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      setError('Please enter a company name to get insights.'); // UI Error: Always English
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const payload = {
        companyName: companyName.trim(),
        targetJobTitle: targetJobTitle.trim(),
        insightsLanguage: preferredLanguage, // Use renamed state
      };

      const res = await fetch('/api/company-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData: CompanyInsights | null = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse company insights response body:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? "تلقينا استجابة غير قابلة للتحليل. الرجاء المحاولة مرة أخرى." : "Received an unparseable response. Please try again.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || (preferredLanguage === 'Arabic' ? "فشل الحصول على الرؤى." : "Failed to get insights."));
      }

      if (
        responseData &&
        typeof responseData.cultureSummary === 'string' &&
        Array.isArray(responseData.commonQuestions) &&
        Array.isArray(responseData.valuesToHighlight) &&
        Array.isArray(responseData.fitTips) &&
        typeof responseData.isFallbackInfo === 'boolean'
      ) {
        setAnalysisResult(responseData);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? "تنسيق رؤى الشركة غير صالح من الخادم." : "Invalid company insights format from server.");
      }

    } catch (err: any) {
      console.error("Error getting company insights:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || (preferredLanguage === 'Arabic' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.')}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setCompanyName('');
    setTargetJobTitle('');
    setPreferredLanguage('English');
    setAnalysisResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  // --- JSX Rendering ---
  return (
    <>
      <Head>
        <title>AI Company Insights - Master Your Interview | AskifyAI</title>
        <meta name="description" content="Get AI-powered insights into any company's culture, common interview questions, and core values. Prepare for company-specific interviews and show your fit with AskifyAI's intelligent analysis." />
        <meta name="keywords" content="AI company insights, company culture, interview preparation, common interview questions, company values, culture fit, company research, interview prep" />
        <link rel="canonical" href="https://www.askifyai.tech/company-insights" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Company Insights - Master Your Interview | AskifyAI" />
        <meta property="og:description" content="Get AI-powered insights into any company's culture, common interview questions, and core values." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/company-insights" />
        <meta property="og:image" content="https://www.askifyai.tech/images/company-insights-og.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AskifyAI Company Insights icon: a building with an eye, symbolizing deep AI research into company culture." />
        <meta property="og:site_name" content="AskifyAI" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Company Insights - Master Your Interview | AskifyAI" />
        <meta property="twitter:description" content="Get AI-powered insights into any company's culture, common interview questions, and core values." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/company-insights-twitter.webp" />
        <meta property="twitter:image:alt" content="An illustration of a company building with data insights, representing AI-driven company research." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="company-insights-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image src="/images/company-insights.svg" alt="AI Company Insights icon: a building with a magnifying glass." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="company-insights-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
              AI Company Insights
            </h1>
            <p className="text-lg text-gray-600 mb-4">
  Access AI-powered insights into a company's culture, values, and typical interview questions — all tailored to help you prepare smarter.
</p>

<p className="text-lg text-gray-600 mb-8">
  Show recruiters you're the perfect fit by aligning your answers with the company's mission and work style — and boost your chances of getting hired.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert" aria-atomic="true">
                <p className="font-bold">Error:</p> {/* UI: Always English */}
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="flex flex-col items-center text-indigo-600">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-xl font-semibold">Gathering Insights...</p> {/* UI: Always English */}
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGetInsights} className="space-y-6 text-left" role="form" aria-labelledby="company-insights-heading">
                <div>
                  <label htmlFor="companyName" className="block text-gray-700 text-sm font-semibold mb-2">
                    Target Company Name:
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Zain Jordan" // UI: Always English
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    list="company-names-options"
                    aria-label="Enter company name for insights"
                    required
                  />
                  <datalist id="company-names-options">
                    {predefinedCompanies.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="targetJobTitle" className="block text-gray-700 text-sm font-semibold mb-2">
                    Target Job Title (Optional):
                  </label>
                  <input
                    type="text"
                    id="targetJobTitle"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Manager" // UI: Always English
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    list="job-titles-options"
                    aria-label="Enter target job title (optional)"
                  />
                  <datalist id="job-titles-options">
                    {predefinedJobTitles.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">
                    Insights Language:
                  </label>
                  <select
                    id="preferredLanguage"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    aria-label="Select language for insights"
                    required
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !companyName.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`}
                  disabled={isLoading || !companyName.trim()}
                  aria-label="Get Company Insights"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Gathering...
                    </>
                  ) : (
                    'Get Company Insights' // UI: Always English
                  )}
                </button>
              </form>
            )}

            {currentPhase === 'results' && analysisResult && (
              <div dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'} aria-live="polite">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
                  Company Insights Analysis {/* UI: Always English */}
                </h2>

                {analysisResult.isFallbackInfo && analysisResult.fallbackMessage && (
                  <div className="mb-8 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm" role="status">
                    <p className="font-bold">Note:</p> {/* UI: Always English */}
                    <p className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>{analysisResult.fallbackMessage}</p>
                  </div>
                )}
                
                {/* Conditionally apply Arabic font class to results content */}
                <div className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>
                  {analysisResult.cultureSummary && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-blue-200">
                      <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">🏢</span> Culture Summary
                      </h3>
                      <p className="text-gray-800">{analysisResult.cultureSummary}</p>
                    </div>
                  )}

                  {analysisResult.commonQuestions.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-purple-50 border border-purple-200">
                      <h3 className="font-bold text-xl text-purple-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">❓</span> Common Interview Questions
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.commonQuestions.map((q, index) => (
                          <li key={`q-${index}`}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.valuesToHighlight.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-green-50 border border-green-200">
                      <h3 className="font-bold text-xl text-green-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">🌟</span> Values to Highlight
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.valuesToHighlight.map((value, index) => (
                          <li key={`value-${index}`}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.fitTips.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-orange-50 border border-orange-200">
                      <h3 className="font-bold text-xl text-orange-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">🤝</span> Culture Fit Tips
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.fitTips.map((tip, index) => (
                          <li key={`tip-${index}`}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!analysisResult.cultureSummary && analysisResult.commonQuestions.length === 0 && analysisResult.valuesToHighlight.length === 0 && analysisResult.fitTips.length === 0 && !analysisResult.isFallbackInfo && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-gray-50 border border-gray-200">
                      <p className="text-gray-700 text-lg">
                        {preferredLanguage === 'Arabic' ?
                          'لم يتم العثور على رؤى محددة لهذه الشركة. الرجاء التأكد من دقة الاسم والمحاولة لاحقاً.' :
                          'No specific insights found for this company. Please ensure the name is accurate and try again.'
                        }
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartNewSession}
                  className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300"
                  disabled={isLoading}
                  aria-label="Start a new company insights analysis"
                >
                  Start New Analysis {/* UI: Always English */}
                </button>
              </div>
            )}
          </div>
        </section>

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