'use client';

import { useState, useMemo, useRef } from "react";
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
interface JobSearchStrategy {
  strategyOverview: string;
  jobSearchPlatforms: string[];
  networkingStrategies: string[];
  personalBrandingTips: string[];
  applicationTips: string[];
  suggestedCompanies: string[];
  fallbackMessage?: string;
}

export default function JobSearchStrategistPage() {
  // --- State Hooks ---

  // Form states
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [preferredIndustriesCompanies, setPreferredIndustriesCompanies] = useState('');
  const [locationPreference, setLocationPreference] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency

  // Result states
  const [strategyResult, setStrategyResult] = useState<JobSearchStrategy | null>(null);

  // UI states
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredSkillSuggestions, setFilteredSkillSuggestions] = useState<string[]>([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  
  // --- Refs ---
  const skillInputRef = useRef<HTMLInputElement>(null);

  // --- Memoized Data ---
  const predefinedSkills = useMemo(() => {
    const skills = [
      'Strong leadership skills', 'Excellent communication', 'Problem-solving ability',
    'Cross-functional collaboration', 'Agile methodologies', 'Project management expertise',
    'Data analysis skills', 'Machine learning experience', 'Cloud computing proficiency (AWS/Azure/GCP)',
    'Full-stack development', 'Frontend development', 'Backend development', 'Mobile app development',
    'UI/UX design principles', 'Customer-centric approach', 'Strategic thinking',
    'Budget management', 'Team leadership', 'Mentorship experience',
    'Successfully launched X project', 'Increased Y by Z%', 'Reduced costs by X%',
    'Improved efficiency', 'Developed innovative solutions', 'Strong technical skills',
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
    ];
    return Array.from(new Set(skills)).sort(); // Sort for better UX
  }, []);

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
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'IBM', 'Oracle', 'SAP', 'Cisco', 'Adobe', 'NVIDIA', 'Intel', 'Salesforce', 'ServiceNow', 'Shopify', 'Uber', 'Airbnb', 'Stripe', 'Zoom', 'Slack', 'Atlassian', 'Twilio', 'NextTwo', 'Estarta Solutions', 'Zain Jordan', 'Orange Jordan', 'Umniah', 'Mawdoo3.com', 'HyperPay', 'Bayt.com', 'MadfooatCom', 'ProgressSoft', 'Arab Bank', 'Hikma Pharmaceuticals', 'Aramex', 'MenaITech', 'Coca-Cola', 'PepsiCo', 'Nike'
  ], []);

  const predefinedLocations = useMemo(() => [
    'Remote', 'Amman, Jordan', 'Irbid, Jordan', 'Dubai, UAE', 'Riyadh, Saudi Arabia', 'Cairo, Egypt', 'New York, USA', 'London, UK', 'Berlin, Germany'
  ], []);

  // --- Skill Input Handlers ---
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInputValue(value);
    if (value.length > 1) {
      const filtered = predefinedSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) && !currentSkills.includes(skill)
      );
      setFilteredSkillSuggestions(filtered.slice(0, 10));
      setShowSkillSuggestions(true);
    } else {
      setShowSkillSuggestions(false);
      setFilteredSkillSuggestions([]);
    }
  };

  const handleAddSkill = (skillToAdd: string) => {
    if (!currentSkills.includes(skillToAdd)) {
      setCurrentSkills(prevSkills => [...prevSkills, skillToAdd]);
    }
    setSkillInputValue('');
    setShowSkillSuggestions(false);
    setFilteredSkillSuggestions([]);
    if (skillInputRef.current) {
      skillInputRef.current.focus();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(prevSkills => prevSkills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSkillInputBlur = () => {
    setTimeout(() => { setShowSkillSuggestions(false); }, 150);
  };
  
  const handleSkillInputFocus = () => {
    const value = skillInputRef.current ? skillInputRef.current.value : '';
    if (value.length > 1 && filteredSkillSuggestions.length > 0) {
      setShowSkillSuggestions(true);
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInputValue.trim() !== '') {
      e.preventDefault();
      const exactMatch = predefinedSkills.find(skill => skill.toLowerCase() === skillInputValue.toLowerCase());
      if (exactMatch) {
        handleAddSkill(exactMatch);
      } else {
        setError('Please select a skill from the suggested list.'); // UI Error: Always English
      }
    }
    if (e.key === 'Backspace' && skillInputValue === '' && currentSkills.length > 0) {
      e.preventDefault();
      setCurrentSkills(prevSkills => prevSkills.slice(0, prevSkills.length - 1));
    }
  };

  // --- Main Form Handler ---
  const handleGetStrategy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSkills.length === 0 || !targetJobTitle.trim()) {
      setError('Please fill in at least your current skills and target job title.'); // UI Error: Always English
      return;
    }

    setIsLoading(true);
    setError(null);
    setStrategyResult(null);

    try {
      const payload = {
        currentSkills: currentSkills.join(', '),
        targetJobTitle: targetJobTitle.trim(),
        preferredIndustriesCompanies: preferredIndustriesCompanies.trim(),
        locationPreference: locationPreference.trim(),
        strategyLanguage: preferredLanguage, // Use renamed state
      };

      const res = await fetch('/api/job-search-strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData: JobSearchStrategy | null = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse strategy response body as JSON:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? 'تلقينا استجابة غير قابلة للتحليل.' : 'Received an unparseable response.');
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.fallbackMessage || (preferredLanguage === 'Arabic' ? 'فشل توليد الاستراتيجية.' : 'Failed to generate strategy.'));
      }

      if (
        responseData && typeof responseData.strategyOverview === 'string' &&
        Array.isArray(responseData.jobSearchPlatforms) &&
        Array.isArray(responseData.networkingStrategies) &&
        Array.isArray(responseData.personalBrandingTips) &&
        Array.isArray(responseData.applicationTips) &&
        Array.isArray(responseData.suggestedCompanies)
      ) {
        setStrategyResult(responseData);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? 'تنسيق استجابة الاستراتيجية غير صالح.' : 'Invalid strategy response format from AI.');
      }

    } catch (err: any) {
      console.error("Error generating strategy:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || (preferredLanguage === 'Arabic' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.')}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setCurrentSkills([]);
    setSkillInputValue('');
    setTargetJobTitle('');
    setPreferredIndustriesCompanies('');
    setLocationPreference('');
    setPreferredLanguage('English');
    setStrategyResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  // --- JSX Rendering ---
  return (
    <>
      <Head>
        <title>AI Job Search Strategist - Personalized Action Plan | AskifyAI</title>
        <meta name="description" content="Get a personalized job search strategy with AI. Analyze skills and roles to build an effective plan covering platforms, networking, branding, and company suggestions." />
        <meta name="keywords" content="AI job search, job search strategy, career plan, networking tips, personal branding, job platforms, career advice, job application tips" />
        <link rel="canonical" href="https://www.askifyai.tech/job-search-strategist" />
        <meta property="og:title" content="AI Job Search Strategist - Personalized Action Plan | AskifyAI" />
        <meta property="og:description" content="Get a personalized job search strategy with AI to build an effective plan for finding your dream job." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/job-search-strategist" />
        <meta property="og:image" content="https://www.askifyai.tech/images/job-strategist-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Job Search Strategist - Personalized Action Plan | AskifyAI" />
        <meta property="twitter:description" content="Get a personalized job search strategy with AI to build an effective plan for finding your dream job." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/job-strategist-twitter.webp" />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="strategy-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative">
            <Image
              src="/images/job-search-strategist.svg"
              alt="AI Job Search Strategist icon: a chessboard with pieces representing a strategic career move."
              width={100}
              height={100}
              className="mb-6 mx-auto"
              priority
            />
            <h1 id="strategy-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
              AI Job Search Strategist
            </h1>
           <p className="text-lg text-gray-600 mb-4">
  Transform your job search with a personalized, AI-driven strategy — including the best platforms to use, effective networking techniques, and personal branding tips.
</p>

<p className="text-lg text-gray-600 mb-8">
  Take control of your career journey with targeted insights designed to help you stand out and land your dream job faster.
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
                  <p className="text-xl font-semibold">Building Your Strategy...</p> {/* UI: Always English */}
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGetStrategy} className="space-y-6 text-left">
                <div className="relative">
                  <label htmlFor="currentSkills" className="block text-gray-700 text-sm font-semibold mb-2">Your Current Skills:</label>
                  {currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                      {currentSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 -mr-0.5 h-4 w-4 inline-flex items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label={`Remove ${skill}`}>
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input type="text" id="currentSkills" ref={skillInputRef} value={skillInputValue} onChange={handleSkillInputChange} onBlur={handleSkillInputBlur} onFocus={handleSkillInputFocus} onKeyDown={handleSkillInputKeyDown} placeholder="e.g., Python, React, Project Management" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                      {filteredSkillSuggestions.map((suggestion) => (
                        <div key={suggestion} className="p-3 text-left text-gray-800 hover:bg-gray-100 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={() => handleAddSkill(suggestion)}>{suggestion}</div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Start typing a skill and select from the list. Add your key skills.</p>
                </div>

                <div>
                  <label htmlFor="targetJobTitle" className="block text-gray-700 text-sm font-semibold mb-2">Target Job Title:</label>
                  <input type="text" id="targetJobTitle" value={targetJobTitle} onChange={(e) => setTargetJobTitle(e.target.value)} placeholder="e.g., Senior Data Scientist" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="job-titles-options" required />
                  <datalist id="job-titles-options">{predefinedJobTitles.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="preferredIndustriesCompanies" className="block text-gray-700 text-sm font-semibold mb-2">Preferred Industries/Companies (Optional):</label>
                  <input type="text" id="preferredIndustriesCompanies" value={preferredIndustriesCompanies} onChange={(e) => setPreferredIndustriesCompanies(e.target.value)} placeholder="e.g., AI, E-commerce, Google" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="company-names-options" />
                  <datalist id="company-names-options">{predefinedCompanies.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="locationPreference" className="block text-gray-700 text-sm font-semibold mb-2">Location Preference (Optional):</label>
                  <input type="text" id="locationPreference" value={locationPreference} onChange={(e) => setLocationPreference(e.target.value)} placeholder="e.g., Amman, Jordan; Remote" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="location-options" />
                  <datalist id="location-options">{predefinedLocations.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Strategy Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || currentSkills.length === 0 || !targetJobTitle.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || currentSkills.length === 0 || !targetJobTitle.trim()}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Building...</>) : ('Build My Strategy')}
                </button>
              </form>
            )}

            {currentPhase === 'results' && strategyResult && (
              <div dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your Job Search Strategy</h2>
                
                {strategyResult.fallbackMessage && (
                  <div className="mb-8 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm">
                    <p className="font-bold">Note:</p> {/* UI: Always English */}
                    <p className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>{strategyResult.fallbackMessage}</p>
                  </div>
                )}

                <div className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>
                    {strategyResult.strategyOverview && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-blue-200">
                        <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2"><span className="text-2xl">📝</span> Strategy Overview</h3>
                        <p className="text-gray-800">{strategyResult.strategyOverview}</p>
                    </div>
                    )}
                    {strategyResult.jobSearchPlatforms.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-purple-50 border border-purple-200">
                        <h3 className="font-bold text-xl text-purple-700 mb-3 flex items-center gap-2"><span className="text-2xl">🌐</span> Top Job Search Platforms</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.jobSearchPlatforms.map((platform, index) => (<li key={`platform-${index}`}>{platform}</li>))}</ul>
                    </div>
                    )}
                    {strategyResult.suggestedCompanies.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-orange-50 border border-orange-200">
                        <h3 className="font-bold text-xl text-orange-700 mb-3 flex items-center gap-2"><span className="text-2xl">🏢</span> Suggested Companies</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.suggestedCompanies.map((company, index) => (<li key={`company-${index}`}>{company}</li>))}</ul>
                    </div>
                    )}
                    {strategyResult.networkingStrategies.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-green-50 border border-green-200">
                        <h3 className="font-bold text-xl text-green-700 mb-3 flex items-center gap-2"><span className="text-2xl">🤝</span> Networking Strategies</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.networkingStrategies.map((strategy, index) => (<li key={`strategy-${index}`}>{strategy}</li>))}</ul>
                    </div>
                    )}
                    {strategyResult.personalBrandingTips.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-red-50 border border-red-200">
                        <h3 className="font-bold text-xl text-red-700 mb-3 flex items-center gap-2"><span className="text-2xl">✨</span> Personal Branding Tips</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.personalBrandingTips.map((tip, index) => (<li key={`branding-${index}`}>{tip}</li>))}</ul>
                    </div>
                    )}
                    {strategyResult.applicationTips.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-yellow-50 border border-yellow-200">
                        <h3 className="font-bold text-xl text-yellow-700 mb-3 flex items-center gap-2"><span className="text-2xl">✅</span> Application Tips</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-800">{strategyResult.applicationTips.map((tip, index) => (<li key={`app-tip-${index}`}>{tip}</li>))}</ul>
                    </div>
                    )}
                </div>

                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoading}>
                  Start New Strategy
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