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
const MAX_REVIEW_QUESTIONS_LIMIT = 15;
const REVIEW_QUESTIONS_PER_BATCH = 5;

// --- Interfaces ---
interface ReviewQuestion {
  question: string;
  answer: string;
}

export default function QuickReviewPage() {
  // --- State Hooks ---
  const [subjectField, setSubjectField] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [generatedQuestions, setGeneratedQuestions] = useState<ReviewQuestion[]>([]);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results' | 'limitReached'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState(false);
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

  // --- API Handlers ---
  const sendReviewRequestToN8n = async (append: boolean = false) => {
    if (!append && (!subjectField.trim() || !experienceLevel)) {
      setError("Please fill in all required fields to generate review questions.");
      return;
    }
    if (append && currentQuestionCount >= MAX_REVIEW_QUESTIONS_LIMIT) {
      setError(`You have reached the maximum of ${MAX_REVIEW_QUESTIONS_LIMIT} questions.`);
      return;
    }
    
    if (append) {
      setIsLoadingMoreQuestions(true);
    } else {
      setIsLoading(true);
      setGeneratedQuestions([]);
      setCurrentQuestionCount(0);
    }
    setError(null);

    try {
      const payload = {
        action: 'generate_review_questions',
        subjectField: subjectField.trim(),
        experienceLevel,
        preferredLanguage,
        requestedCount: REVIEW_QUESTIONS_PER_BATCH,
        currentTotalQuestions: currentQuestionCount,
        existingQuestions: generatedQuestions.map(q => q.question),
      };

      const res = await fetch('/api/topic-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        responseData = jsonMatch && jsonMatch[1] ? JSON.parse(jsonMatch[1]) : JSON.parse(rawTextResponse);
      } catch (parseError) {
        throw new Error(preferredLanguage === 'Arabic' ? "تلقينا استجابة غير قابلة للتحليل." : "Received an unparseable response.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || (preferredLanguage === 'Arabic' ? "فشل توليد أسئلة المراجعة." : "Failed to generate review questions."));
      }

      if (responseData?.questions?.every((q: any) => q.question && q.answer)) {
        const newQuestionsBatch: ReviewQuestion[] = responseData.questions
          .filter((q: ReviewQuestion) => !generatedQuestions.some(existing => existing.question === q.question))
          .slice(0, REVIEW_QUESTIONS_PER_BATCH);

        setGeneratedQuestions(prevQuestions => {
          const combined = [...prevQuestions, ...newQuestionsBatch];
          return combined.slice(0, MAX_REVIEW_QUESTIONS_LIMIT);
        });
        setCurrentQuestionCount(prevCount => Math.min(prevCount + newQuestionsBatch.length, MAX_REVIEW_QUESTIONS_LIMIT));
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? "تنسيق استجابة غير صالح من الخادم." : "Invalid response format from server.");
      }
    } catch (err: any) {
      console.error("Error generating review questions:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || 'An unexpected error occurred.'}`);
      if (!append) setCurrentPhase('form');
    } finally {
      setIsLoading(false);
      setIsLoadingMoreQuestions(false);
    }
  };

  const handleGenerateQuestionsButtonClick = (e: React.FormEvent) => {
    e.preventDefault();
    sendReviewRequestToN8n(false);
  };

  const handleGenerateMoreQuestions = () => {
    sendReviewRequestToN8n(true);
  };

  const handleStartNewSession = () => {
    setSubjectField('');
    setExperienceLevel('');
    setPreferredLanguage('English');
    setGeneratedQuestions([]);
    setCurrentQuestionCount(0);
    setCurrentPhase('form');
    setError(null);
  };

  const hasReachedMaxQuestions = currentQuestionCount >= MAX_REVIEW_QUESTIONS_LIMIT;

  return (
    <>
      <Head>
        <title>AI Quick Subject Review - Interview & Exam Prep | AskifyAI</title>
        <meta name="description" content="Get AI-powered rapid review questions with instant answers for any subject or specialization. Prepare efficiently for job interviews, exams, and knowledge retention with AskifyAI's smart Q&A format." />
        <meta name="keywords" content="quick review, subject review, AI questions, exam prep, interview prep, knowledge retention, Q&A format, study tool, AI learning, specialized review, rapid learning" />
        <link rel="canonical" href="https://www.askifyai.tech/topic-review" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Quick Subject Review - Interview & Exam Prep | AskifyAI" />
        <meta property="og:description" content="Get AI-powered rapid review questions with instant answers for any subject or specialization." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/topic-review" />
        <meta property="og:image" content="https://www.askifyai.tech/images/quick-review-og.svg" />
        <meta property="og:alt" content="AskifyAI Quick Subject Review icon: an open book with a lightbulb." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Quick Subject Review - Interview & Exam Prep | AskifyAI" />
        <meta property="twitter:description" content="Get AI-powered rapid review questions with instant answers for any subject or specialization." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/quick-review-twitter.svg" />
        <meta property="twitter:image:alt" content="An open book icon representing rapid subject review with AI Q&A." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="quick-review-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image src="/images/topic-review.svg" alt="AI Quick Subject Review icon: an open book with an AI brain." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="quick-review-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">AI Quick Subject Review</h1>
            <p className="text-lg text-gray-600 mb-4">
  Quickly review any subject or specialization with AI-generated questions and instant answers — designed to strengthen your understanding and memory.
</p>

<p className="text-lg text-gray-600 mb-8">
  Prepare effectively for exams, interviews, or skill refreshers with focused, high-impact AI-powered review sessions.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert" aria-atomic="true">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGenerateQuestionsButtonClick} className="space-y-6 text-left">
                <div>
                  <label htmlFor="subjectField" className="block text-gray-700 text-sm font-semibold mb-2">Subject Field or Specialization:</label>
                  <input type="text" id="subjectField" value={subjectField} onChange={(e) => setSubjectField(e.target.value)} placeholder="e.g., Frontend Development, Data Analysis" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="specialization-options" required />
                  <datalist id="specialization-options">{predefinedSpecializations.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>
                <div>
                  <label htmlFor="experienceLevel" className="block text-gray-700 text-sm font-semibold mb-2">Experience/Understanding Level:</label>
                  <select id="experienceLevel" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Question & Answer Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !subjectField.trim() || !experienceLevel ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || !subjectField.trim() || !experienceLevel}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>) : ('Generate Questions')}
                </button>
              </form>
            )}
            
            {(currentPhase === 'results' || currentPhase === 'limitReached') && generatedQuestions.length > 0 && (
              <div className={`text-left relative ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Review Questions ({currentQuestionCount} of {MAX_REVIEW_QUESTIONS_LIMIT})</h2>
                <div className="space-y-6">
                  {generatedQuestions.map((qa, index) => (
                    <div key={index} className="p-5 rounded-lg shadow-md border border-gray-100">
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        <span className={`text-indigo-600 ${preferredLanguage === 'Arabic' ? 'ml-2' : 'mr-2'}`}>{index + 1}.</span> {qa.question}
                      </p>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200 mt-2" dir="auto">
                        <p className="text-base text-gray-700">
                          <span className="font-semibold text-green-700">Answer:</span>{' '}
                          <span dangerouslySetInnerHTML={{ __html: qa.answer }} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  {hasReachedMaxQuestions ? (
                    <p className="text-gray-600 font-semibold text-lg p-3 bg-gray-100 rounded-lg">You have reached the maximum of {MAX_REVIEW_QUESTIONS_LIMIT} questions.</p>
                  ) : (
                    <button onClick={handleGenerateMoreQuestions} className={`px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingMoreQuestions ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} flex items-center justify-center gap-3 mx-auto`} disabled={isLoadingMoreQuestions || isLoading}>
                      {isLoadingMoreQuestions ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating More...</>) : ('Generate More Questions')}
                    </button>
                  )}
                </div>
                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoading || isLoadingMoreQuestions}>Start New Session</button>
              </div>
            )}

            {currentPhase === 'limitReached' && (
              <div className="text-center py-10" aria-live="polite">
                 <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">All Questions Generated!</h2>
                 <p className="text-xl text-gray-700 mb-6">You have generated the maximum of {MAX_REVIEW_QUESTIONS_LIMIT} review questions. Great job!</p>
                 <p className="text-lg text-gray-600 mb-8">Ready for more? Start a new session to explore more topics.</p>
                 <button onClick={handleStartNewSession} className={`px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center gap-3 mx-auto`} disabled={isLoading || isLoadingMoreQuestions}>Start New Session</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}