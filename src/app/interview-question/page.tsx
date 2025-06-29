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

// Constants for question generation limits
const MAX_QUESTIONS_LIMIT = 15;
const QUESTIONS_PER_BATCH = 5;

export default function InterviewQuestionGeneratorPage() {
  // --- State Hooks ---
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [jobLevel, setJobLevel] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState<boolean>(false);
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

  // --- Handlers ---
  const sendRequestToN8n = async (append: boolean = false) => {
    if (!specialization.trim() || !experience || !companyType || !jobLevel) {
      setError("Please fill in all required fields to generate questions.");
      return;
    }
    if (append && generatedQuestions.length >= MAX_QUESTIONS_LIMIT) {
      setError(`You have reached the maximum of ${MAX_QUESTIONS_LIMIT} questions.`);
      return;
    }
    
    if (append) {
      setIsLoadingMoreQuestions(true);
    } else {
      setIsLoading(true);
      setGeneratedQuestions([]);
    }
    setError(null);

    try {
      const payload = {
        specialization: specialization.trim(),
        experience,
        companyType,
        jobLevel,
        questionLanguage: preferredLanguage, // Use renamed state
        generateMore: append,
        currentQuestionCount: generatedQuestions.length,
        requestedCount: QUESTIONS_PER_BATCH,
        existingQuestions: generatedQuestions,
      };

      const res = await fetch('/api/interview-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to generate questions. Server error.");
      }

      if (responseData && Array.isArray(responseData.questions)) {
        const newQuestions = responseData.questions
          .filter((q: string) => typeof q === 'string' && q.trim() !== '' && !generatedQuestions.includes(q))
          .slice(0, QUESTIONS_PER_BATCH);

        if (append) {
          setGeneratedQuestions(prevQuestions => {
            const combined = [...prevQuestions, ...newQuestions];
            return combined.slice(0, MAX_QUESTIONS_LIMIT);
          });
        } else {
          setGeneratedQuestions(newQuestions);
        }
      } else {
        throw new Error("Invalid response format from AI. Expected a 'questions' array.");
      }
    } catch (err: any) {
      console.error("Error generating questions:", err);
      setError(`Error: ${err.message || 'An unexpected error occurred. Please try again later.'}`);
    } finally {
      if (append) {
        setIsLoadingMoreQuestions(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequestToN8n(false);
  };

  const handleGenerateMoreQuestions = () => {
    sendRequestToN8n(true);
  };

  const hasReachedMaxQuestions = generatedQuestions.length >= MAX_QUESTIONS_LIMIT;
  const isFormIncomplete = !specialization.trim() || !experience || !companyType || !jobLevel;

  return (
    <>
      <Head>
        <title>AI Interview Question Generator - Personalized Prep | AskifyAI</title>
        <meta name="description" content="Generate AI-powered personalized interview questions tailored to your specialization, experience, job level, and target company. Practice effectively and confidently prepare for your next job interview with AskifyAI." />
        <meta name="keywords" content="AI interview questions, personalized interview prep, job interview practice, custom interview questions, interview generator, career preparation, technical interview, behavioral interview" />
        <link rel="canonical" href="https://www.askifyai.tech/interview-question" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Interview Question Generator - Personalized Prep | AskifyAI" />
        <meta property="og:description" content="Generate AI-powered interview questions tailored to your specialization, experience, and job level." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/interview-question" />
        <meta property="og:image" content="https://www.askifyai.tech/images/personalized-interview-og.svg" />
        <meta property="og:image:alt" content="AskifyAI Interview Question Generator with an AI chatbot asking tailored questions." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Interview Question Generator - Personalized Prep | AskifyAI" />
        <meta property="twitter:description" content="Generate AI-powered interview questions tailored to your specialization, experience, and job level." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/personalized-interview-twitter.svg" />
        <meta property="twitter:image:alt" content="AskifyAI's interface for generating custom interview questions." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="interview-generator-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full text-center">
            <Image src="/images/personalized-interview.svg" alt="AI Interview Question Generator icon: an AI robot head generating a question mark." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="interview-generator-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">AI Interview Question Generator</h1>
            <p className="text-lg text-gray-600 mb-4">
  Generate personalized, AI-powered interview questions tailored to your job role, experience level, and target company type.
</p>

<p className="text-lg text-gray-600 mb-8">
  Practice with confidence and improve your interview performance by focusing on the most relevant and impactful questions for your career path.
</p>

            
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label htmlFor="specialization" className="block text-gray-700 text-sm font-semibold mb-2">Job Title or Specialization:</label>
                <input type="text" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Senior Frontend Developer" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="specialization-options" required />
                <datalist id="specialization-options">{predefinedSpecializations.map((option) => (<option key={option} value={option} />))}</datalist>
                <p className="text-xs text-gray-500 mt-1">Select from suggestions or type your specific role.</p>
              </div>

              <div>
                <label htmlFor="experience" className="block text-gray-700 text-sm font-semibold mb-2">Your Years of Experience:</label>
                <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                  <option value="">Select your experience level</option>
                  <option value="No experience">No experience / Entry-level</option>
                  <option value="1-3 years">1-3 years (Junior)</option>
                  <option value="4-6 years">4-6 years (Mid-level)</option>
                  <option value="More than 6 years">More than 6 years (Senior/Lead)</option>
                </select>
              </div>

              <div>
                <label htmlFor="companyType" className="block text-gray-700 text-sm font-semibold mb-2">Target Company Environment:</label>
                <select id="companyType" value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                  <option value="">Select target company type</option>
                  <option value="Startup">Startup (Fast-paced, innovative)</option>
                  <option value="Large Company">Large Company (Established, structured)</option>
                  <option value="Government Company">Government/Public Sector</option>
                  <option value="Non-profit Organization">Non-profit Organization</option>
                </select>
              </div>

              <div>
                <label htmlFor="jobLevel" className="block text-gray-700 text-sm font-semibold mb-2">Target Job Level:</label>
                <select id="jobLevel" value={jobLevel} onChange={(e) => setJobLevel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                  <option value="">Select target job level</option>
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior / Associate</option>
                  <option value="Mid-level">Mid-level / Specialist</option>
                  <option value="Senior">Senior / Lead</option>
                  <option value="Manager">Manager / Director</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Generated Questions Language:</label>
                <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || isFormIncomplete}>
                {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>) : ('Generate Questions')}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {generatedQuestions.length > 0 && !error && (
              <div className={`mt-12 pt-8 border-t-2 border-gray-100 ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'} aria-live="polite">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your Personalized Interview Questions</h2>
                
                <div className="space-y-4">
                  {generatedQuestions.map((question, index) => (
                    <div key={index} className="p-5 bg-blue-50 rounded-lg shadow-sm border border-gray-100">
                      <p className="text-lg font-semibold text-gray-800">
                        <span className={`text-indigo-600 ${preferredLanguage === 'Arabic' ? 'ml-2' : 'mr-2'}`}>{index + 1}.</span>{question}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  {hasReachedMaxQuestions ? (
                    <p className="text-gray-600 font-semibold text-lg p-3 bg-gray-100 rounded-lg" aria-live="assertive">
                      You've reached the maximum of {MAX_QUESTIONS_LIMIT} questions.
                    </p>
                  ) : (
                    <button onClick={handleGenerateMoreQuestions} className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingMoreQuestions ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} flex items-center justify-center gap-3 mx-auto`} disabled={isLoadingMoreQuestions || isLoading}>
                      {isLoadingMoreQuestions ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>) : ('Generate More Questions')}
                    </button>
                  )}
                </div>

                <p className="mt-8 text-center text-gray-600 text-sm">*Disclaimer: These AI-generated questions are for practice purposes only.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}