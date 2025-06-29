'use client';

import { useState, useMemo, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
// Import Google Fonts for base and Arabic languages
import { Inter } from 'next/font/google';
import { Cairo, Amiri, Tajawal } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });


// --- Interfaces ---
interface SkillGapAnalysis {
  missingSkills: string[];
  learningPaths: string[];
  projectIdeas: string[];
}

export default function SkillGapAnalyzerPage() {
  // --- State Hooks ---

  // Form states
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency

  // Result states
  const [analysisResult, setAnalysisResult] = useState<SkillGapAnalysis | null>(null);

  // UI states
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredSkillSuggestions, setFilteredSkillSuggestions] = useState<string[]>([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // --- Refs ---
  const skillInputRef = useRef<HTMLInputElement>(null);

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

  const predefinedSkills = useMemo(() => {
    const skills = [
      'Adaptability', 'Adobe XD', 'Agile', 'AI/ML Development', 'Algorithms', 'Angular',
      'API Development', 'Auditing', 'AWS', 'Azure', 'Backend Development', 'Big Data',
      'Bilingual Communication', 'Business Intelligence', 'C#', 'C++', 'Calculus', 'Cassandra',
      'CI/CD', 'Cloud Computing', 'Cloud Security', 'Communication', 'Compliance', 'Confluence',
      'Content Marketing', 'Critical Thinking', 'CRM', 'Customer Service', 'Cybersecurity',
      'Data Analysis', 'Database Management', 'Data Structures', 'Data Visualization', 'Debugging',
      'Deep Learning', 'DevOps', 'Django', 'Docker', 'Dynamic Programming', 'Economics', 'ETL',
      'Express.js', 'Figma', 'Financial Modeling', 'Firebase', 'Flask', 'Frontend Development',
      'Full-stack Development', 'Game Development', 'Git', 'GitHub', 'GitLab', 'Go',
      'Google Cloud Platform (GCP)', 'Graphic Design', 'HTML', 'Human Resources', 'Illustrator',
      'Integration Testing', 'Investment Banking', 'Java', 'JavaScript', 'Jira', 'Journalism',
      'Kanban', 'Keras', 'Kotlin', 'Leadership', 'Legal Research', 'Linear Algebra', 'Linked Lists',
      'Machine Learning', 'Marketing', 'Matplotlib', 'Medical Research', 'Microservices',
      'Mobile Development', 'MongoDB', 'MySQL', 'Negotiation', 'Network Administration', 'Next.js',
      'NLTK', 'Node.js', 'NoSQL', 'NumPy', 'Object-Oriented Programming (OOP)', 'OpenCV',
      'Operations Management', 'Pandas', 'Payroll', 'Performance Management', 'PHP', 'Photoshop',
      'Plotly', 'PostgreSQL', 'Power BI', 'Problem Solving', 'Product Management', 'Programming Logic',
      'Project Management', 'Public Relations', 'Public Speaking', 'PyTorch', 'Python', 'QA',
      'React', 'Recruitment', 'Redis', 'Risk Management', 'Ruby', 'Ruby on Rails', 'Rust', 'Sales',
      'Scikit-learn', 'SciPy', 'Scrum', 'SEO', 'SEM', 'Sketch', 'Social Media Marketing',
      'Software Development Life Cycle (SDLC)', 'SQL', 'Spring Boot', 'Statistics',
      'Supply Chain Management', 'Swift', 'System Administration', 'System Design', 'Tableau',
      'Tax Accounting', 'Teamwork', 'Technical Writing', 'TensorFlow', 'Test Automation',
      'Test-Driven Development (TDD)', 'Training & Development', 'Trees', 'UI/UX Design',
      'Unit Testing', 'Vue.js', 'Web Development'
    ];
    return Array.from(new Set(skills)).sort();
  }, []);

  // --- Skill Input Handlers ---
  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInputValue(value);
    if (value.length > 0) {
      const filtered = predefinedSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) && !currentSkills.includes(skill)
      );
      setFilteredSkillSuggestions(filtered.slice(0, 10));
      setShowSkillSuggestions(true);
    } else {
      const topSkills = predefinedSkills.filter(skill => !currentSkills.includes(skill)).slice(0, 10);
      setFilteredSkillSuggestions(topSkills);
      setShowSkillSuggestions(true);
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
    if (skillInputRef.current) {
      skillInputRef.current.focus();
    }
  };

  const handleSkillInputBlur = () => {
    setTimeout(() => { setShowSkillSuggestions(false); }, 100);
  };

  const handleSkillInputFocus = () => {
    if (skillInputValue.length > 0) {
      handleSkillInputChange({ target: { value: skillInputValue } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      const topSkills = predefinedSkills.filter(skill => !currentSkills.includes(skill)).slice(0, 10);
      setFilteredSkillSuggestions(topSkills);
    }
    setShowSkillSuggestions(true);
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillInputValue.trim() !== '') {
        const exactMatch = predefinedSkills.find(skill => skill.toLowerCase() === skillInputValue.toLowerCase());
        if (exactMatch) {
          handleAddSkill(exactMatch);
        } else if (filteredSkillSuggestions.length > 0) {
          handleAddSkill(filteredSkillSuggestions[0]);
        } else {
          setError('Please select a skill from the suggested list.'); // UI Error: Always English
        }
      }
    }
    if (e.key === 'Backspace' && skillInputValue === '' && currentSkills.length > 0) {
      e.preventDefault();
      setCurrentSkills(prevSkills => prevSkills.slice(0, prevSkills.length - 1));
      handleSkillInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // --- Main Form Handler ---
  const handleAnalyzeGaps = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentSkills.length === 0) {
      setError('Please add at least one skill.'); // UI Error: Always English
      return;
    }
    if (!targetJobTitle.trim()) {
      setError('Please enter your target job title.'); // UI Error: Always English
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const payload = {
        currentSkills: currentSkills.join(', '),
        targetJobTitle: targetJobTitle.trim(),
        suggestionsLanguage: preferredLanguage, // Use the renamed state
      };

      const res = await fetch('/api/skill-gap-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData: SkillGapAnalysis | null = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse skill gap analysis response body:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? "تلقينا استجابة غير قابلة للتحليل. الرجاء المحاولة مرة أخرى." : "Received an unparseable response. Please try again.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || (preferredLanguage === 'Arabic' ? "فشل تحليل فجوة المهارات." : "Failed to analyze skill gaps."));
      }

      if (responseData &&
        Array.isArray(responseData.missingSkills) &&
        Array.isArray(responseData.learningPaths) &&
        Array.isArray(responseData.projectIdeas)) {
        setAnalysisResult(responseData);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? "تنسيق تحليل المهارات غير صالح من الخادم." : "Invalid skill gap analysis format from server.");
      }

    } catch (err: any) {
      console.error("Error analyzing skill gaps:", err);
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
    setPreferredLanguage('English');
    setAnalysisResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  // --- JSX Rendering ---
  return (
    <>
      <Head>
        <title>AI Skill Gap Analyzer - Personalized Career Growth | AskifyAI</title>
        <meta name="description" content="Identify crucial missing skills for your target job with AskifyAI's AI-powered skill gap analysis. Get personalized learning paths and practical project ideas to bridge your gaps and accelerate your career." />
        <meta name="keywords" content="skill gap analysis, AI career growth, personalized learning paths, project ideas, career development, job readiness, AI skill assessment, professional development" />
        <link rel="canonical" href="https://www.askifyai.tech/skill-gap-analyzer" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Skill Gap Analyzer - Personalized Career Growth | AskifyAI" />
        <meta property="og:description" content="Identify crucial missing skills for your target job with AskifyAI's AI-powered skill gap analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/skill-gap-analyzer" />
        <meta property="og:image" content="https://www.askifyai.tech/images/skill-gap-og.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AskifyAI Skill Gap Analyzer icon symbolizing bridging career skill gaps." />
        <meta property="og:site_name" content="AskifyAI" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Skill Gap Analyzer - Personalized Career Growth | AskifyAI" />
        <meta property="twitter:description" content="Identify crucial missing skills for your target job with AskifyAI's AI-powered skill gap analysis." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/skill-gap-twitter.webp" />
        <meta property="twitter:image:alt" content="An illustration representing AI-powered skill development and career progression." />
      </Head>

      <main className={`font-inter bg-white text-gray-800 min-h-screen flex flex-col ${inter.variable} ${cairo.variable} ${amiri.variable} ${tajawal.variable}`} role="main">
        <header className="flex justify-between items-center px-8 py-6 shadow-md" role="banner">
          <Link href="/" className="flex items-center space-x-2" aria-label="AskifyAI Home">
            <Image
              src="/icon0.svg"
              alt="AskifyAI Logo - AI tools for career advancement"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-semibold text-indigo-600">AskifyAI</span>
          </Link>
          <nav className="space-x-6 hidden md:flex" aria-label="Main Navigation">
            <Link href="/" className="hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/#features-section" className="hover:text-indigo-600 font-medium">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 font-medium">About Us</Link>
          </nav>
        </header>

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="skill-gap-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image
              src="/images/skill-gap.svg"
              alt="AI Skill Gap Analyzer icon: a puzzle piece connecting two sides of a gap."
              width={100}
              height={100}
              className="mb-6 mx-auto"
              priority
            />
            <h1 id="skill-gap-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
              AI Skill Gap Analyzer
            </h1>
            <p className="text-lg text-gray-600 mb-4">
  Discover the key skills you're missing for your target job with our AI-powered skill gap analysis — based on your resume and career goals.
</p>

<p className="text-lg text-gray-600 mb-8">
  Receive personalized learning paths and project ideas to close gaps, boost your qualifications, and advance your career with confidence.
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-xl font-semibold">Analyzing Skills...</p> {/* UI: Always English */}
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleAnalyzeGaps} className="space-y-6 text-left" role="form" aria-labelledby="skill-gap-heading">
                <div className="relative">
                  <label htmlFor="currentSkills" className="block text-gray-700 text-sm font-semibold mb-2">
                    Your Current Skills:
                  </label>
                  {currentSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-lg bg-gray-50" aria-label="Currently selected skills">
                      {currentSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 -mr-0.5 h-4 w-4 inline-flex items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={`Remove skill: ${skill}`}
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    id="currentSkills"
                    ref={skillInputRef}
                    value={skillInputValue}
                    onChange={handleSkillInputChange}
                    onBlur={handleSkillInputBlur}
                    onFocus={handleSkillInputFocus}
                    onKeyDown={handleSkillInputKeyDown}
                    placeholder="e.g., Python, React, AWS" // UI: Always English
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label="Enter a current skill"
                  />
                  {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto" role="listbox">
                      {filteredSkillSuggestions.map((suggestion) => (
                        <div
                          key={suggestion}
                          className="p-3 text-left text-gray-800 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleAddSkill(suggestion)}
                          role="option"
                          aria-selected={currentSkills.includes(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Start typing to see suggestions. You can add multiple skills.</p>
                </div>

                <div>
                  <label htmlFor="targetJobTitle" className="block text-gray-700 text-sm font-semibold mb-2">
                    Target Job Title/Role:
                  </label>
                  <input
                    type="text"
                    id="targetJobTitle"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g., Senior Data Scientist" // UI: Always English
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    list="job-titles-options"
                    aria-label="Enter your target job title"
                    required
                  />
                  <datalist id="job-titles-options">
                    {predefinedJobTitles.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">
                    Results Language:
                  </label>
                  <select
                    id="preferredLanguage"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    aria-label="Select language for results"
                    required
                  >
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || currentSkills.length === 0 || !targetJobTitle.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`}
                  disabled={isLoading || currentSkills.length === 0 || !targetJobTitle.trim()}
                  aria-label="Analyze Skill Gaps"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Skill Gaps' // UI: Always English
                  )}
                </button>
              </form>
            )}

            {currentPhase === 'results' && analysisResult && (
              <div dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'} aria-live="polite">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
                  Skill Gap Analysis Results {/* UI: Always English */}
                </h2>
                
                {/* Conditionally apply Arabic font class to results content */}
                <div className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>
                  {analysisResult.missingSkills.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-red-50 border border-red-200">
                      <h3 className="font-bold text-xl text-red-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚠️</span> Missing Key Skills {/* UI: Always English */}
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.missingSkills.map((skill, index) => (
                          <li key={`missing-${index}`}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.learningPaths.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-blue-200">
                      <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl">📚</span> Suggested Learning Paths {/* UI: Always English */}
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.learningPaths.map((path, index) => (
                          <li key={`path-${index}`}>{path}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.projectIdeas.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-green-50 border border-green-200">
                      <h3 className="font-bold text-xl text-green-700 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Project Ideas to Practice {/* UI: Always English */}
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        {analysisResult.projectIdeas.map((idea, index) => (
                          <li key={`idea-${index}`}>{idea}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.missingSkills.length === 0 && analysisResult.learningPaths.length === 0 && analysisResult.projectIdeas.length === 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-gray-50 border border-gray-200">
                      <p className="text-gray-700 text-lg">
                        {preferredLanguage === 'Arabic' ?
                          'لم يتم تحديد فجوات أو اقتراحات. قد يعني هذا أن مهاراتك تتوافق جيدًا مع الدور المستهدف.' :
                          'No specific skill gaps or suggestions identified. This might mean your skills align well with the target role.'
                        }
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartNewSession}
                  className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300"
                  disabled={isLoading}
                  aria-label="Start a new skill gap analysis"
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