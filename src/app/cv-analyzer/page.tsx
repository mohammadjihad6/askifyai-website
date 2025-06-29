'use client';

import { useState } from "react";
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google'; // Import Inter font
import { Cairo, Amiri, Tajawal } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });

export default function CvAnalyzePage() {
  // --- State Hooks ---
  const [file, setFile] = useState<File | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [analysisSections, setAnalysisSections] = useState<{ [key: string]: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB

      if (selectedFile.type === 'application/pdf' && selectedFile.size <= MAX_SIZE) {
        setFile(selectedFile);
        setError(null);
      } else if (selectedFile.type !== 'application/pdf') {
        setFile(null);
        setError('Please upload a PDF file only.');
      } else {
        setFile(null);
        setError('File size exceeds 5MB. Please upload a smaller file.');
      }
      setAtsScore(null);
      setAnalysisSections(null);
    } else {
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your PDF resume first to proceed.');
      return;
    }

    setAtsScore(null);
    setAnalysisSections(null);
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("cvFile", file);
    formData.append("preferredLanguage", preferredLanguage);

    try {
      const res = await fetch('/api/cv-analyzer', {
        method: 'POST',
        body: formData,
      });

      const rawTextResponse = await res.text();
      let responseData: any = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse analysis response body:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? 'استجابة غير قابلة للتحليل من الخادم.' : 'Received an unparseable response from the server.');
      }

      if (!res.ok) {
        throw new Error(responseData?.message || (preferredLanguage === 'Arabic' ? 'حدث خطأ من الخادم.' : "Server responded with an error."));
      }

      if (typeof responseData.ats_score === 'number' && responseData.formatted_analysis && typeof responseData.formatted_analysis === 'object') {
        setAtsScore(responseData.ats_score);
        setAnalysisSections(responseData.formatted_analysis);
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? 'تنسيق استجابة التحليل غير صالح.' : "Invalid analysis response format from AI.");
      }

    } catch (err: any) {
      console.error("Error analyzing CV:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'فشل تحليل السيرة الذاتية: ' : 'Failed to analyze your CV: '}${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI CV Analyzer & ATS Checker - Boost Your Resume | AskifyAI</title>
        <meta name="description" content="Upload your CV to get an instant AI-powered ATS compatibility score and personalized feedback. Optimize your resume sections to pass automated screenings and secure more job interviews with AskifyAI." />
        <meta name="keywords" content="CV analyzer, resume checker, ATS score, ATS compatibility, resume optimization, CV feedback, AI resume analysis, job application, interview preparation, PDF CV analyzer" />
        <link rel="canonical" href="https://www.askifyai.tech/cv-analyzer" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI CV Analyzer & ATS Checker - Boost Your Resume | AskifyAI" />
        <meta property="og:description" content="Get an instant AI-powered ATS score and personalized feedback to optimize your resume and secure more interviews." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/cv-analyzer" />
        <meta property="og:image" content="https://www.askifyai.tech/images/cv-analyzer-og.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AskifyAI CV Analyzer tool showing a resume being scanned for ATS compatibility." />
        <meta property="og:site_name" content="AskifyAI" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI CV Analyzer & ATS Checker - Boost Your Resume | AskifyAI" />
        <meta property="twitter:description" content="Get an instant AI-powered ATS score and personalized feedback to optimize your resume and secure more interviews." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/cv-analyzer-twitter.svg" />
        <meta property="twitter:image:alt" content="AskifyAI CV Analyzer dashboard with an ATS score and improvement suggestions." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="cv-analyzer-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full text-center">
            <Image src="/images/cv-analyzer.svg" alt="AI CV Analyzer icon: a document with a magnifying glass, symbolizing resume optimization." width={100} height={100} className="mb-6 mx-auto" priority />

            <h1 id="cv-analyzer-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">AI CV & Resume Analyzer</h1>
            <p className="text-lg text-gray-600 mb-4">
  Upload your PDF resume to instantly analyze your CV for ATS compatibility, keyword optimization, and AI-driven feedback.
</p>

<p className="text-lg text-gray-600 mb-8">
  Improve your chances of getting hired with a recruiter-friendly, professional CV — and stand out in today's competitive job market.
</p>

            
            <div className="flex flex-col items-center gap-4 mb-8">
              <div>
                <label htmlFor="cvFile" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Upload Your Resume (PDF only):</label>
                <input type="file" id="cvFile" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" aria-describedby="file-upload-help" required />
                {file && <p className="text-sm text-gray-600 mt-2 text-left" aria-live="polite">Selected file: <span className="font-medium">{file.name}</span></p>}
                {!file && <p id="file-upload-help" className="text-xs text-gray-500 mt-1 text-left">Max file size: 5MB. Ensure it's a clean PDF.</p>}
              </div>

              <div>
                <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2 text-left">Analysis Language:</label>
                <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" aria-label="Select preferred language for analysis results" required>
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>

              <button onClick={handleAnalyze} className={`w-full max-w-xs px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${!file || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3`} disabled={!file || isLoading}>
                {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Analyzing...</>) : ('Analyze My CV')}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {atsScore !== null && !isLoading && !error && (
              <div className={`mt-8 pt-8 border-t-2 border-gray-100 ${preferredLanguage === 'Arabic' ? 'text-right font-cairo' : 'text-left'}`} dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your ATS Analysis Results</h2>

                <div className="mb-8 p-6 bg-blue-50 rounded-xl shadow-md" aria-live="polite">
                  <h3 className="text-2xl font-bold mb-3 text-indigo-600">ATS Compatibility Score:</h3>
                  <p className="text-5xl font-extrabold text-green-600 text-center">{atsScore}<span className="text-3xl">/100</span></p>
                  <p className="mt-4 text-center text-gray-700">This score indicates how well your CV aligns with typical **Applicant Tracking Systems (ATS)**. A higher score means a better chance of passing the initial screening.</p>
                </div>

                {analysisSections && Object.entries(analysisSections).length > 0 ? (
                  Object.entries(analysisSections).map(([section, points], index) => (
                    <div key={index} className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold mb-3 text-indigo-600">{section}</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {Array.isArray(points) && points.length > 0 ? (
                          points.map((point, idx) => (<li key={idx}>{point}</li>))
                        ) : (
                          <li className="text-gray-500 italic">
                            {preferredLanguage === 'Arabic' ? 'لا توجد توصيات محددة لهذا القسم.' : 'No specific recommendations for this section.'}
                          </li>
                        )}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-center">
                    {preferredLanguage === 'Arabic' ? 'لا تتوفر بيانات تحليل مفصلة حالياً.' : 'No detailed analysis data available at the moment.'}
                  </p>
                )}

                <p className="mt-8 text-center text-gray-600 text-sm">*Disclaimer: This AI analysis provides guidance. Always tailor your CV to specific job descriptions.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}