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

// --- Interfaces ---
interface BehavioralQuestion {
  id: string;
  text: string;
}

interface AnalysisResult {
  starBreakdown: {
    S: string; // Situation
    T: string; // Task
    A: string; // Action
    R: string; // Result
  };
  tipsForImprovement: string;
  overallEvaluation: string;
}

export default function BehavioralQuestionAnalyzerPage() {
  // --- State Hooks ---
  const [specialization, setSpecialization] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currentQuestion, setCurrentQuestion] = useState<BehavioralQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'form' | 'question' | 'analysis'>('form');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
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
  const requestAndSetQuestion = async () => {
    setError(null);
    setCurrentQuestion(null);
    setUserAnswer('');
    setAnalysisResult(null);
    setIsLoadingQuestion(true);

    try {
      const payload = {
        action: 'generate_behavioral_question',
        specialization: specialization.trim(),
        preferredLanguage,
        previousQuestionId: currentQuestion ? currentQuestion.id : null,
      };
      const res = await fetch('/api/behavioral-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData?.message || "Failed to generate question.");
      }
      if (responseData?.id && responseData.text) {
        setCurrentQuestion(responseData);
        setCurrentPhase('question');
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (err: any) {
      console.error("Error generating question:", err);
      setError(`Error: ${err.message || 'An unexpected error occurred.'}`);
      setCurrentPhase('form');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const analyzeAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) {
      setError("Please write your answer before analyzing.");
      return;
    }
    setError(null);
    setIsLoadingAnalysis(true);

    try {
      const payload = {
        action: 'analyze_behavioral_answer',
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        userAnswer,
        specialization: specialization.trim(),
        preferredLanguage,
      };
      const res = await fetch('/api/behavioral-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData?.message || "Failed to analyze answer.");
      }
      if (responseData?.starBreakdown?.S && responseData.tipsForImprovement && responseData.overallEvaluation) {
        setAnalysisResult(responseData);
        setCurrentPhase('analysis');
      } else {
        throw new Error("Invalid analysis response format from AI.");
      }
    } catch (err: any) {
      console.error("Error analyzing answer:", err);
      setError(`Error: ${err.message || 'Failed to analyze answer.'}`);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };
  
  const handleStartQuestionFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialization.trim()) {
      setError("Please enter your specialization to start.");
      return;
    }
    requestAndSetQuestion();
  };

  const handleStartNewSession = () => {
    setSpecialization('');
    setPreferredLanguage('English');
    setCurrentQuestion(null);
    setUserAnswer('');
    setAnalysisResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  return (
    <>
      <Head>
        <title>AI Behavioral Question Analyzer - STAR Method Mastery | AskifyAI</title>
        <meta name="description" content="Master behavioral interview questions with AskifyAI's AI-powered STAR method analysis. Get personalized feedback on your answers and actionable tips to improve your responses for any specialization." />
        <meta name="keywords" content="behavioral interview questions, STAR method, AI interview analysis, interview practice, job interview prep, soft skills interview, career coaching, personalized feedback" />
        <link rel="canonical" href="https://www.askifyai.tech/behavioral-analysis" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="AI Behavioral Question Analyzer - STAR Method Mastery | AskifyAI" />
        <meta property="og:description" content="Master behavioral interviews with AI-powered STAR method analysis and personalized feedback on your answers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/behavioral-analysis" />
        <meta property="og:image" content="https://www.askifyai.tech/images/behavioral-analysis-og.svg" />
        <meta property="og:alt" content="AskifyAI Behavioral Question Analyzer icon: a brain analyzing data." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Behavioral Question Analyzer - STAR Method Mastery | AskifyAI" />
        <meta property="twitter:description" content="Master behavioral interviews with AI-powered STAR method analysis and personalized feedback on your answers." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/behavioral-analysis-twitter.svg" />
        <meta property="twitter:image:alt" content="An illustration representing AI insights for improving behavioral interview answers." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="behavioral-analysis-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image src="/images/behavioral-analysis.svg" alt="AI Behavioral Question Analyzer icon: a chart with an AI brain." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="behavioral-analysis-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">AI Behavioral Question Analyzer</h1>
            <p className="text-lg text-gray-600 mb-4">
  Master behavioral interview questions with AI-powered STAR method analysis — craft clear, structured, and impactful answers tailored to your real-life experiences.
</p>

<p className="text-lg text-gray-600 mb-8">
  Practice your responses, receive instant personalized feedback, and refine your answers to impress recruiters and confidently ace your next interview.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert" aria-atomic="true">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            {(isLoadingQuestion || isLoadingAnalysis) && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="flex flex-col items-center text-indigo-600">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  <p className="text-xl font-semibold">{isLoadingQuestion ? 'Generating Question...' : 'Analyzing Answer...'}</p>
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleStartQuestionFlow} className="space-y-6 text-left">
                <div>
                  <label htmlFor="specialization" className="block text-gray-700 text-sm font-semibold mb-2">Your Field or Specialization:</label>
                  <input type="text" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g., Project Manager, Data Scientist" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="specialization-options" required />
                  <datalist id="specialization-options">{predefinedSpecializations.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Question & Analysis Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingQuestion || !specialization.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoadingQuestion || !specialization.trim()}>
                  {isLoadingQuestion ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>) : ('Start Analysis')}
                </button>
              </form>
            )}

            {currentPhase === 'question' && currentQuestion && (
              <div className={`text-left relative ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Behavioral Question:</h2>
                <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6 prose max-w-none"><p className="text-gray-800 font-semibold">{currentQuestion.text}</p></div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Your Answer:</h3>
                <textarea className="w-full h-48 p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Write your answer here, ideally using the STAR method (Situation, Task, Action, Result)..." value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} disabled={isLoadingAnalysis}></textarea>
                <button onClick={analyzeAnswer} className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingAnalysis || !userAnswer.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} flex items-center justify-center gap-3`} disabled={isLoadingAnalysis || !userAnswer.trim()}>
                  {isLoadingAnalysis ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Analyzing...</>) : ('Analyze My Answer')}
                </button>
                <button onClick={requestAndSetQuestion} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoadingQuestion || isLoadingAnalysis}>Next Question</button>
              </div>
            )}

            {currentPhase === 'analysis' && currentQuestion && analysisResult && (
              <div className={`text-left relative ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Behavioral Question:</h2>
                <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6 prose max-w-none"><p className="text-gray-800 font-semibold">{currentQuestion.text}</p></div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Your Submitted Answer:</h3>
                <pre className="w-full p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 overflow-auto whitespace-pre-wrap" tabIndex={0}>{userAnswer}</pre>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">STAR Method Analysis:</h3>
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200"><p className="font-semibold text-indigo-700">Situation:</p><p className="text-gray-800" dir="auto">{analysisResult.starBreakdown.S}</p></div>
                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-200"><p className="font-semibold text-purple-700">Task:</p><p className="text-gray-800" dir="auto">{analysisResult.starBreakdown.T}</p></div>
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200"><p className="font-semibold text-orange-700">Action:</p><p className="text-gray-800" dir="auto">{analysisResult.starBreakdown.A}</p></div>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200"><p className="font-semibold text-green-700">Result:</p><p className="text-gray-800" dir="auto">{analysisResult.starBreakdown.R}</p></div>
                </div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Tips for Improvement:</h3>
                <div className="p-4 rounded-lg shadow-md mb-6 bg-yellow-50 border border-yellow-200"><p className="text-gray-800" dir="auto" dangerouslySetInnerHTML={{ __html: analysisResult.tipsForImprovement }} /></div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Overall Evaluation:</h3>
                <div className="p-4 rounded-lg shadow-md mb-6 bg-blue-50 border border-blue-200"><p className="text-gray-800" dir="auto" dangerouslySetInnerHTML={{ __html: analysisResult.overallEvaluation }} /></div>
                <button onClick={requestAndSetQuestion} className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingQuestion ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} flex items-center justify-center gap-3`} disabled={isLoadingQuestion || isLoadingAnalysis}>Next Question</button>
                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoadingQuestion || isLoadingAnalysis}>Start New Session</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}