'use client';

import { useState, useMemo } from "react";
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Cairo, Amiri, Tajawal } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });

// --- Constants ---
const ASSUMED_TIPS_PER_CATEGORY = 5; // AI will generate up to this many tips per category

// --- Interfaces ---
interface Tips {
  general: string[];
  technical: string[];
  behavioral: string[];
}

export default function InterviewTipsPage() {
  // --- State Hooks ---
  const [specialization, setSpecialization] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [tips, setTips] = useState<Tips>({ general: [], technical: [], behavioral: [] });
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Memoized Data ---
  const predefinedSpecializations = useMemo(() => [
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

  // --- API Handler ---
  const sendTipsRequestToN8n = async () => {
    if (!specialization.trim()) {
      setError("Please enter your specialization to get tips.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTips({ general: [], technical: [], behavioral: [] });

    try {
      const payload = {
        action: 'generate_interview_tips',
        specialization: specialization.trim(),
        preferredLanguage,
        requestedTipsPerCategory: ASSUMED_TIPS_PER_CATEGORY,
      };

      const res = await fetch('/api/interview-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const rawTextResponse = await res.text();
      let responseData: Tips | null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        responseData = jsonMatch && jsonMatch[1] ? JSON.parse(jsonMatch[1]) : JSON.parse(rawTextResponse);
      } catch (parseError) {
        throw new Error(preferredLanguage === 'Arabic' ? "تلقينا استجابة غير قابلة للتحليل." : "Received an unparseable response.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || (preferredLanguage === 'Arabic' ? "فشل توليد النصائح." : "Failed to generate tips."));
      }

      if (responseData && Array.isArray(responseData.general) && Array.isArray(responseData.technical) && Array.isArray(responseData.behavioral)) {
        setTips({
          general: responseData.general.slice(0, ASSUMED_TIPS_PER_CATEGORY),
          technical: responseData.technical.slice(0, ASSUMED_TIPS_PER_CATEGORY),
          behavioral: responseData.behavioral.slice(0, ASSUMED_TIPS_PER_CATEGORY),
        });
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? "تنسيق استجابة غير صالح من الخادم." : "Invalid response format from server.");
      }
    } catch (err: any) {
      console.error("Error generating tips:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || 'An unexpected error occurred.'}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGetTipsButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    sendTipsRequestToN8n();
  };

  const handleStartNewSession = () => {
    setSpecialization('');
    setPreferredLanguage('English');
    setTips({ general: [], technical: [], behavioral: [] });
    setCurrentPhase('form');
    setError(null);
  };

  return (
    <>
      <Head>
        <title>AI Interview Tips & Strategies - Master Your Interview | AskifyAI</title>
        <meta name="description" content="Get personalized AI-powered interview tips covering general, technical, and behavioral strategies tailored to your specialization. Prepare effectively and confidently with expert advice from AskifyAI." />
        <meta name="keywords" content="interview tips, AI interview advice, technical interview, behavioral interview, general interview strategies, job interview prep, expert advice, interview coaching" />
        <link rel="canonical" href="https://www.askifyai.tech/interview-tips" />
        <meta property="og:title" content="AI Interview Tips & Strategies - Master Your Interview | AskifyAI" />
        <meta property="og:description" content="Get personalized AI-powered interview tips covering general, technical, and behavioral strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/interview-tips" />
        <meta property="og:image" content="https://www.askifyai.tech/images/interview-tips-og.svg" />
        <meta property="og:alt" content="AskifyAI Interview Tips icon: a person confidently giving advice." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Interview Tips & Strategies - Master Your Interview | AskifyAI" />
        <meta property="twitter:description" content="Get personalized AI-powered interview tips covering general, technical, and behavioral strategies." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/interview-tips-twitter.svg" />
        <meta property="twitter:image:alt" content="An illustration representing AI-powered interview tips for job seekers." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="interview-tips-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image src="/images/interview-tips.svg" alt="AI Interview Tips icon: a professional speaker giving advice." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="interview-tips-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">Personalized AI Interview Tips</h1>
            <p className="text-lg text-gray-600 mb-4">
  Get personalized, AI-powered interview tips tailored to your field — including proven strategies for technical, behavioral, and general interview questions.
</p>

<p className="text-lg text-gray-600 mb-8">
  Boost your confidence and enhance your interview performance with expert insights designed to help you stand out and succeed in your next job opportunity.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert" aria-atomic="true">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGetTipsButtonClick} className="space-y-6 text-left">
                <div>
                  <label htmlFor="specialization" className="block text-gray-700 text-sm font-semibold mb-2">Your Specialization:</label>
                  <input type="text" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Software Engineer, Marketing Specialist" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="specialization-options" required />
                  <datalist id="specialization-options">{predefinedSpecializations.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Preferred Language for Tips:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !specialization.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || !specialization.trim()}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Getting Tips...</>) : ('Get Interview Tips')}
                </button>
              </form>
            )}

            {currentPhase === 'results' && (
              <div className={`mt-12 pt-8 border-t-2 border-gray-100 ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your Personalized Interview Tips</h2>
                
                {tips.general.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3"><span className="text-green-500">✅</span> General Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tips.general.map((tip, index) => (<div key={`general-${index}`} className="p-5 rounded-lg shadow-md border border-blue-100 bg-blue-50"><p>{tip}</p></div>))}</div>
                  </div>
                )}
                {tips.technical.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3"><span className="text-yellow-500">🧠</span> Technical Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tips.technical.map((tip, index) => (<div key={`technical-${index}`} className="p-5 rounded-lg shadow-md border border-red-100 bg-red-50"><p>{tip}</p></div>))}</div>
                  </div>
                )}
                {tips.behavioral.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3"><span className="text-red-500">🗣️</span> Behavioral Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{tips.behavioral.map((tip, index) => (<div key={`behavioral-${index}`} className="p-5 rounded-lg shadow-md border border-green-100 bg-green-50"><p>{tip}</p></div>))}</div>
                  </div>
                )}

                <p className="mt-8 text-center text-gray-600 text-sm">*Disclaimer: These AI-generated tips provide general guidance. Always adapt your approach to the specific job and company.</p>
                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoading}>Start New Session</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}