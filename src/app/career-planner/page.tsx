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
interface CareerPlan {
  careerVisionSummary: string;
  keyMilestones: string[];
  requiredSkillsRoadmap: string[];
  learningResources: string[];
  networkingMentorshipAdvice: string[];
  transitionRoles: string[];
  industryTrends: string[];
  fallbackMessage?: string;
}

export default function CareerPlannerPage() {
  // --- State Hooks ---

  // Form states
  const [currentRole, setCurrentRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [desiredRoleInYears, setDesiredRoleInYears] = useState('');
  const [desiredIndustrySector, setDesiredIndustrySector] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English'); // RENAMED for consistency

  // Result states
  const [planResult, setPlanResult] = useState<CareerPlan | null>(null);

  // UI states
  const [currentPhase, setCurrentPhase] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredSkillSuggestions, setFilteredSkillSuggestions] = useState<string[]>([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // --- Refs ---
  const skillInputRef = useRef<HTMLInputElement>(null);

  // --- Memoized Data ---
  const predefinedRoles = useMemo(() => [
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
    ];
    return Array.from(new Set(skills)).sort(); // Sort for better UX
  }, []);

  const predefinedIndustries = useMemo(() => [
    'Technology', 'Financial Services', 'Healthcare', 'Education', 'E-commerce', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Biotechnology', 'Retail', 'Telecommunications', 'Consulting', 'Media & Entertainment', 'FinTech', 'EdTech', 'HealthTech'
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
    if (skillInputValue.length > 1 && filteredSkillSuggestions.length > 0) {
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
  const handleGetPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentRole.trim() || currentSkills.length === 0 || !desiredRoleInYears.trim()) {
      setError('Please fill in current role, skills, and desired role.'); // UI Error: Always English
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlanResult(null);

    try {
      const payload = {
        currentRole: currentRole.trim(),
        currentSkills: currentSkills.join(', '),
        desiredRoleInYears: desiredRoleInYears.trim(),
        desiredIndustrySector: desiredIndustrySector.trim(),
        planLanguage: preferredLanguage, // Use renamed state
      };

      const res = await fetch('/api/career-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawTextResponse = await res.text();
      let responseData: CareerPlan | null = null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          responseData = JSON.parse(jsonMatch[1]);
        } else {
          responseData = JSON.parse(rawTextResponse);
        }
      } catch (parseError) {
        console.error("Failed to parse career plan response body:", parseError);
        throw new Error(preferredLanguage === 'Arabic' ? 'تلقينا استجابة غير قابلة للتحليل.' : 'Received an unparseable response.');
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.fallbackMessage || (preferredLanguage === 'Arabic' ? 'فشل توليد الخطة المهنية.' : 'Failed to generate career plan.'));
      }

      if (
        responseData && typeof responseData.careerVisionSummary === 'string' &&
        Array.isArray(responseData.keyMilestones) &&
        Array.isArray(responseData.requiredSkillsRoadmap) &&
        Array.isArray(responseData.learningResources) &&
        Array.isArray(responseData.networkingMentorshipAdvice) &&
        Array.isArray(responseData.transitionRoles) &&
        Array.isArray(responseData.industryTrends)
      ) {
        setPlanResult(responseData);
        setCurrentPhase('results');
      } else {
        throw new Error(preferredLanguage === 'Arabic' ? 'تنسيق استجابة الخطة المهنية غير صالح.' : 'Invalid career plan response format from AI.');
      }

    } catch (err: any) {
      console.error("Error generating career plan:", err);
      setError(`${preferredLanguage === 'Arabic' ? 'خطأ: ' : 'Error: '}${err.message || (preferredLanguage === 'Arabic' ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.')}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = () => {
    setCurrentRole('');
    setCurrentSkills([]);
    setSkillInputValue('');
    setDesiredRoleInYears('');
    setDesiredIndustrySector('');
    setPreferredLanguage('English');
    setPlanResult(null);
    setCurrentPhase('form');
    setError(null);
  };

  // --- JSX Rendering ---
  return (
    <>
      <Head>
        <title>AI Career Progression Planner | AskifyAI</title>
        <meta name="description" content="Plan your career path with AI. Identify future roles, required skills, learning resources, and networking strategies for long-term professional growth with AskifyAI." />
        <meta name="keywords" content="career planner, AI career advice, career path, professional growth, skill roadmap, career development plan, long-term career goals" />
        <link rel="canonical" href="https://www.askifyai.tech/career-planner" />
        <meta property="og:title" content="AI Career Progression Planner | AskifyAI" />
        <meta property="og:description" content="Plan your long-term career path with AI. Identify future roles, required skills, and learning resources." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/career-planner" />
        <meta property="og:image" content="https://www.askifyai.tech/images/career-planner-og.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Career Progression Planner | AskifyAI" />
        <meta property="twitter:description" content="Plan your long-term career path with AI. Identify future roles, required skills, and learning resources." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/career-planner-twitter.webp" />
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="career-planner-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative">
            <Image
              src="/images/career-planner.svg"
              alt="AI Career Planner icon: a person looking at a branching path towards a future goal."
              width={100}
              height={100}
              className="mb-6 mx-auto"
              priority
            />
            <h1 id="career-planner-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">
              AI Career Progression Planner
            </h1>
            <p className="text-lg text-gray-600 mb-4">
  Plan your career growth with an AI-powered roadmap — tailored to your goals, current skill set, and industry trends.
</p>

<p className="text-lg text-gray-600 mb-8">
  Discover essential skills, strategic learning paths, and actionable steps to achieve sustainable, long-term professional success.
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
                  <p className="text-xl font-semibold">Building Your Career Plan...</p> {/* UI: Always English */}
                </div>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={handleGetPlan} className="space-y-6 text-left">
                <div>
                  <label htmlFor="currentRole" className="block text-gray-700 text-sm font-semibold mb-2">Your Current Role/Specialization:</label>
                  <input type="text" id="currentRole" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="e.g., Junior Frontend Developer" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="current-role-options" required />
                  <datalist id="current-role-options">{predefinedRoles.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div className="relative">
                  <label htmlFor="currentSkills" className="block text-gray-700 text-sm font-semibold mb-2">Your Current Key Skills:</label>
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
                      {filteredSkillSuggestions.map((suggestion) => (<div key={suggestion} className="p-3 text-left text-gray-800 hover:bg-gray-100 cursor-pointer" onMouseDown={(e) => e.preventDefault()} onClick={() => handleAddSkill(suggestion)}>{suggestion}</div>))}
                    </div>
                  )}
                   <p className="text-sm text-gray-500 mt-2">Start typing a skill and select from the list. Add your key skills.</p>
                </div>

                <div>
                  <label htmlFor="desiredRoleInYears" className="block text-gray-700 text-sm font-semibold mb-2">Desired Role in X Years:</label>
                  <input type="text" id="desiredRoleInYears" value={desiredRoleInYears} onChange={(e) => setDesiredRoleInYears(e.target.value)} placeholder="e.g., Senior Software Engineer in 5 years" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
                </div>

                <div>
                  <label htmlFor="desiredIndustrySector" className="block text-gray-700 text-sm font-semibold mb-2">Desired Industry/Sector (Optional):</label>
                  <input type="text" id="desiredIndustrySector" value={desiredIndustrySector} onChange={(e) => setDesiredIndustrySector(e.target.value)} placeholder="e.g., FinTech, AI in Healthcare" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" list="industry-sector-options" />
                  <datalist id="industry-sector-options">{predefinedIndustries.map((option) => (<option key={option} value={option} />))}</datalist>
                </div>

                <div>
                  <label htmlFor="preferredLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Plan Language:</label>
                  <select id="preferredLanguage" value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || !currentRole.trim() || currentSkills.length === 0 || !desiredRoleInYears.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || !currentRole.trim() || currentSkills.length === 0 || !desiredRoleInYears.trim()}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Building Plan...</>) : ('Get My Career Plan')}
                </button>
              </form>
            )}

            {currentPhase === 'results' && planResult && (
              <div dir={preferredLanguage === 'Arabic' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">Your Career Progression Plan</h2>

                {planResult.fallbackMessage && (
                  <div className="mb-8 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm">
                    <p className="font-bold">Note:</p> {/* UI: Always English */}
                    <p className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>{planResult.fallbackMessage}</p>
                  </div>
                )}
                
                <div className={preferredLanguage === 'Arabic' ? 'font-cairo' : ''}>
                  {planResult.careerVisionSummary && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-blue-50 border border-blue-200">
                      <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2"><span className="text-2xl">📝</span> Career Vision Summary</h3>
                      <p className="text-gray-800">{planResult.careerVisionSummary}</p>
                    </div>
                  )}
                  {planResult.keyMilestones.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-purple-50 border border-purple-200">
                      <h3 className="font-bold text-xl text-purple-700 mb-3 flex items-center gap-2"><span className="text-2xl">✨</span> Key Milestones</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.keyMilestones.map((milestone, index) => (<li key={`milestone-${index}`}>{milestone}</li>))}</ul>
                    </div>
                  )}
                  {planResult.requiredSkillsRoadmap.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-green-50 border border-green-200">
                      <h3 className="font-bold text-xl text-green-700 mb-3 flex items-center gap-2"><span className="text-2xl">📚</span> Required Skills Roadmap</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.requiredSkillsRoadmap.map((skill, index) => (<li key={`skill-${index}`}>{skill}</li>))}</ul>
                    </div>
                  )}
                  {planResult.learningResources.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-red-50 border border-red-200">
                      <h3 className="font-bold text-xl text-red-700 mb-3 flex items-center gap-2"><span className="text-2xl">💡</span> Learning Resources</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.learningResources.map((resource, index) => (<li key={`resource-${index}`}>{resource}</li>))}</ul>
                    </div>
                  )}
                  {planResult.networkingMentorshipAdvice.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-teal-50 border border-teal-200">
                      <h3 className="font-bold text-xl text-teal-700 mb-3 flex items-center gap-2"><span className="text-2xl">🤝</span> Networking & Mentorship</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.networkingMentorshipAdvice.map((advice, index) => (<li key={`advice-${index}`}>{advice}</li>))}</ul>
                    </div>
                  )}
                  {planResult.transitionRoles.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-orange-50 border border-orange-200">
                      <h3 className="font-bold text-xl text-orange-700 mb-3 flex items-center gap-2"><span className="text-2xl">➡️</span> Potential Transition Roles</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.transitionRoles.map((role, index) => (<li key={`role-${index}`}>{role}</li>))}</ul>
                    </div>
                  )}
                  {planResult.industryTrends.length > 0 && (
                    <div className="mb-8 p-6 rounded-lg shadow-md bg-indigo-50 border border-indigo-200">
                      <h3 className="font-bold text-xl text-indigo-700 mb-3 flex items-center gap-2"><span className="text-2xl">📈</span> Relevant Industry Trends</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">{planResult.industryTrends.map((trend, index) => (<li key={`trend-${index}`}>{trend}</li>))}</ul>
                    </div>
                  )}
                </div>

                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoading}>
                  Start New Plan
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