'use client';

import { useState, useMemo, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Inter } from 'next/font/google'; // Import Inter for consistency
import { Cairo, Amiri, Tajawal } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });

// --- Interfaces ---
interface GeneratedLetter {
  coverLetter: string;
}

export default function CoverLetterGeneratorPage() {
  // --- State Hooks ---
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [keyPointInputValue, setKeyPointInputValue] = useState('');
  const [tone, setTone] = useState('Professional');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // Renamed for consistency
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredKeyPointSuggestions, setFilteredKeyPointSuggestions] = useState<string[]>([]);
  const [showKeyPointSuggestions, setShowKeyPointSuggestions] = useState(false);

  // --- Refs ---
  const keyPointInputRef = useRef<HTMLInputElement>(null);

  // --- Memoized Data ---
  const predefinedKeyPoints = useMemo(() => [
    'Strong leadership skills', 'Excellent communication', 'Problem-solving ability',
    'Cross-functional collaboration', 'Agile methodologies', 'Project management expertise',
    'Data analysis skills', 'Machine learning experience', 'Cloud computing proficiency (AWS/Azure/GCP)',
    'Full-stack development', 'Frontend development', 'Backend development', 'Mobile app development',
    'UI/UX design principles', 'Customer-centric approach', 'Strategic thinking',
    'Budget management', 'Team leadership', 'Mentorship experience',
    'Successfully launched X project', 'Increased Y by Z%', 'Reduced costs by X%',
    'Improved efficiency by Y%', 'Developed innovative solutions', 'Strong technical skills',
    'Adaptability and resilience', 'Conflict resolution', 'Negotiation skills',
    'Public speaking', 'Presentation skills', 'Time management', 'Organizational skills',
    'Attention to detail', 'Creativity', 'Critical thinking', 'Initiative', 'Proactive approach',
    'Client relationship management', 'Vendor management', 'Market research', 'Digital marketing campaigns',
    'Content creation', 'SEO optimization', 'SEM strategies', 'Social media management',
    'Financial modeling', 'Budget forecasting', 'Risk assessment', 'Compliance knowledge',
    'Human resources management', 'Recruitment strategies', 'Employee development', 'Performance management systems',
    'SQL database management', 'NoSQL databases', 'API integration', 'System design', 'Software architecture',
    'Version control (Git)', 'Test-driven development (TDD)', 'Automated testing',
    'Cloud security', 'Network security', 'Data privacy', 'Cybersecurity frameworks'
  ], []);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (selectedFile.type === 'application/pdf' && selectedFile.size <= MAX_FILE_SIZE) {
        setCvFile(selectedFile);
        setError(null);
      } else if (selectedFile.type !== 'application/pdf') {
        setCvFile(null);
        setError('Please upload a PDF file only.');
      } else {
        setCvFile(null);
        setError('File size exceeds 5MB. Please upload a smaller file.');
      }
    } else {
      setCvFile(null);
    }
  };

  const handleKeyPointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyPointInputValue(value);
    if (value.length > 1) {
      const filtered = predefinedKeyPoints.filter(point => point.toLowerCase().includes(value.toLowerCase()) && !keyPoints.includes(point));
      setFilteredKeyPointSuggestions(filtered.slice(0, 10));
      setShowKeyPointSuggestions(true);
    } else {
      setShowKeyPointSuggestions(false);
    }
  };

  const handleAddKeyPoint = (pointToAdd: string) => {
    if (!keyPoints.includes(pointToAdd)) {
      setKeyPoints(prevPoints => [...prevPoints, pointToAdd]);
    }
    setKeyPointInputValue('');
    setShowKeyPointSuggestions(false);
    if (keyPointInputRef.current) {
      keyPointInputRef.current.focus();
    }
  };

  const handleRemoveKeyPoint = (pointToRemove: string) => {
    setKeyPoints(prevPoints => prevPoints.filter(point => point !== pointToRemove));
  };

  const handleKeyPointInputBlur = () => {
    setTimeout(() => { setShowKeyPointSuggestions(false); }, 150);
  };

  const handleKeyPointInputFocus = () => {
    if (keyPointInputValue.length > 1 && filteredKeyPointSuggestions.length > 0) {
      setShowKeyPointSuggestions(true);
    }
  };

  const handleKeyPointInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyPointInputValue.trim() !== '') {
      e.preventDefault();
      const exactMatch = predefinedKeyPoints.find(point => point.toLowerCase() === keyPointInputValue.toLowerCase());
      if (exactMatch) {
        handleAddKeyPoint(exactMatch);
      } else {
        setError('Please select a key point from the suggested list.');
      }
    }
    if (e.key === 'Backspace' && keyPointInputValue === '' && keyPoints.length > 0) {
      e.preventDefault();
      setKeyPoints(prevPoints => prevPoints.slice(0, prevPoints.length - 1));
    }
  };

  const handleGenerateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setError('Please upload your CV in PDF format first.');
      return;
    }
    if (!jobDescriptionText.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCoverLetter(null);

    try {
      const formData = new FormData();
      formData.append("cvFile", cvFile);
      formData.append("jobDescriptionText", jobDescriptionText.trim());
      formData.append("keyPoints", keyPoints.join(', '));
      formData.append("tone", tone);
      formData.append("letterLanguage", preferredLanguage);

      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        body: formData,
      });

      const rawTextResponse = await res.text();
      let responseData: GeneratedLetter | null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        responseData = jsonMatch && jsonMatch[1] ? JSON.parse(jsonMatch[1]) : JSON.parse(rawTextResponse);
      } catch (parseError) {
        throw new Error(preferredLanguage === 'Arabic' ? "تلقينا استجابة غير قابلة للتحليل من الخادم." : "Received an unparseable response from the server.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || (preferredLanguage === 'Arabic' ? "فشل توليد الخطاب." : "Failed to generate cover letter."));
      }

      if (responseData?.coverLetter) {
        setGeneratedCoverLetter(responseData.coverLetter);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? "تنسيق الاستجابة غير صالح." : "Invalid response format from AI.");
      }
    } catch (err: any) {
      console.error("Error generating cover letter:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || 'An unexpected error occurred.'}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLetter = () => {
    if (generatedCoverLetter) {
      navigator.clipboard.writeText(generatedCoverLetter).then(() => alert('Cover letter copied!'));
    }
  };

  const handleStartNewSession = () => {
    setCvFile(null);
    setJobDescriptionText('');
    setKeyPoints([]);
    setKeyPointInputValue('');
    setTone('Professional');
    setPreferredLanguage('English');
    setGeneratedCoverLetter(null);
    setCurrentPhase('form');
    setError(null);
  };

  return (
    <>
      <Head>
        <title>AI Cover Letter Generator - Personalized & Optimized | AskifyAI</title>
        <meta name="description" content="Generate personalized, AI-powered cover letters tailored to your CV and job description. Write compelling applications that stand out and impress hiring managers with AskifyAI." />
        <meta name="keywords" content="AI cover letter generator, personalized cover letter, resume matching, job application, cover letter writing, AI writing tool, job search, professional letter, ATS friendly cover letter" />
        <link rel="canonical" href="https://www.askifyai.tech/cover-letter-generator" />
        <meta property="og:title" content="AI Cover Letter Generator - Personalized & Optimized | AskifyAI" />
        <meta property="og:description" content="Generate personalized, AI-powered cover letters tailored to your CV and job description." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/cover-letter-generator" />
        <meta property="og:image" content="https://www.askifyai.tech/images/cover-letter-og.webp" />
        <meta property="og:alt" content="AskifyAI's AI Cover Letter Generator interface." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Cover Letter Generator - Personalized & Optimized | AskifyAI" />
        <meta property="twitter:description" content="Generate personalized, AI-powered cover letters tailored to your CV and job description." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/cover-letter-twitter.webp" />
        <meta property="twitter:image:alt" content="A snippet of an AI-generated cover letter from AskifyAI." />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="cover-letter-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative">
            <Image src="/images/cover-letter.svg" alt="AI Cover Letter Generator icon: a digital letter being drafted." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="cover-letter-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">AI Cover Letter Generator</h1>
                      <p className="text-lg text-gray-600 mb-4">
  Instantly generate professional cover letters tailored to your CV and the specific job description — designed to help you stand out to employers.
</p>

<p className="text-lg text-gray-600 mb-8">
  Boost your chances of landing interviews with customized, impactful cover letters that highlight your strengths and match the role.
</p>
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="flex flex-col items-center text-indigo-600">
                  <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  <p className="text-xl font-semibold">Generating Letter...</p>
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGenerateLetter} className="space-y-6 text-left">
                <div>
                  <label htmlFor="cvFile" className="block text-gray-700 text-sm font-semibold mb-2">Upload Your CV (PDF only):</label>
                  <input type="file" id="cvFile" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required aria-describedby="cv-file-hint" />
                  {cvFile ? (<p id="cv-file-hint" className="text-sm text-gray-600 mt-2">Selected file: {cvFile.name}</p>) : (<p id="cv-file-hint" className="text-xs text-gray-500 mt-1">Max file size: 5MB.</p>)}
                </div>
                <div>
                  <label htmlFor="jobDescriptionText" className="block text-gray-700 text-sm font-semibold mb-2">Paste Job Description:</label>
                  <textarea id="jobDescriptionText" value={jobDescriptionText} onChange={(e) => setJobDescriptionText(e.target.value)} placeholder="Paste the full job description here..." className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required></textarea>
                </div>
                <div className="relative">
                  <label htmlFor="keyPointsInput" className="block text-gray-700 text-sm font-semibold mb-2">Key Points to Highlight (Optional):</label>
                  {keyPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                      {keyPoints.map(point => (
                        <span key={point} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {point}
                          <button type="button" onClick={() => handleRemoveKeyPoint(point)} className="ml-2 -mr-0.5 h-4 w-4 inline-flex items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label={`Remove ${point}`}><svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input type="text" id="keyPointsInput" ref={keyPointInputRef} value={keyPointInputValue} onChange={handleKeyPointInputChange} onBlur={handleKeyPointInputBlur} onFocus={handleKeyPointInputFocus} onKeyDown={handleKeyPointInputKeyDown} placeholder="Type a skill and select from suggestions..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" aria-describedby="key-points-hint" />
                  {showKeyPointSuggestions && filteredKeyPointSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">{filteredKeyPointSuggestions.map((suggestion) => (<div key={suggestion} className="p-3 hover:bg-gray-100 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={() => handleAddKeyPoint(suggestion)}>{suggestion}</div>))}</div>
                  )}
                  <p id="key-points-hint" className="text-sm text-gray-500 mt-2">Start typing to see suggestions. Only predefined points can be added.</p>
                </div>
                <div>
                  <label htmlFor="tone" className="block text-gray-700 text-sm font-semibold mb-2">Desired Tone:</label>
                  <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="Professional">Professional</option>
                    <option value="Enthusiastic">Enthusiastic</option>
                    <option value="Formal">Formal</option>
                    <option value="Friendly">Friendly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Preferred Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !cvFile || !jobDescriptionText.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || !cvFile || !jobDescriptionText.trim()}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Generating...</>) : ('Generate Cover Letter')}
                </button>
              </form>
            )}

            {currentPhase === 'results' && generatedCoverLetter && (
              <div className={`relative ${preferredLanguage === 'Arabic' ? 'font-cairo' : ''}`}>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Your Custom Cover Letter</h2>
                <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6 prose max-w-none whitespace-pre-wrap leading-relaxed" dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                  {generatedCoverLetter}
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                  <button onClick={handleCopyLetter} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v2M9 17v-1.5a2.5 2.5 0 015 0V17m-5 0H9m5 0h2m-2 0h-2" /></svg>
                    Copy Letter
                  </button>
                  <button onClick={handleStartNewSession} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Letter
                  </button>
                </div>
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