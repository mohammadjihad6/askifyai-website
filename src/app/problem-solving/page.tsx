'use client';

import { useState } from "react";
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// --- Constants ---
const MAX_CHALLENGES_LIMIT = 10;

// --- Interfaces ---
interface Challenge {
  id: string;
  description: string;
  language: string;
}

interface EvaluationResult {
  isCorrect: boolean;
  scorePercentage: number;
  feedback: string;
  recommendations: string;
}

export default function ProblemSolvingChallengesPage() {
  // --- State Hooks ---
  const [challengeType, setChallengeType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'form' | 'challenge' | 'evaluation' | 'limitReached'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false);
  const [isLoadingNextChallenge, setIsLoadingNextChallenge] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Handlers ---
  const requestAndSetChallenge = async (challengeIndexToFetch: number) => {
    setError(null);
    setEvaluationResult(null);
    setUserCode('');

    if (challengeIndexToFetch >= MAX_CHALLENGES_LIMIT) {
      setCurrentPhase('limitReached');
      return;
    }

    if (challengeIndexToFetch === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingNextChallenge(true);
    }

    try {
      const payload = {
        action: 'generate_challenge',
        challengeType,
        experienceLevel,
        // BUG FIX: Send the selected programming language under the key the server expects.
        preferredLanguage: programmingLanguage, 
        challengeIndex: challengeIndexToFetch,
      };

      const res = await fetch('/api/problem-solving', {
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
        throw new Error("Received an unparseable response for challenge generation.");
      }

      if (!res.ok) {
        throw new Error((responseData as any)?.message || "Failed to generate challenge.");
      }
      if (responseData?.id && responseData.description && responseData.language) {
        setCurrentChallenge(responseData as Challenge);
        setCurrentChallengeIndex(challengeIndexToFetch);
        setCurrentPhase('challenge');
      } else {
        throw new Error("Invalid challenge response format from AI.");
      }
    } catch (err: any) {
      console.error("Error starting challenge:", err);
      setError(`Error: ${err.message || 'An unexpected error occurred.'}`);
      setCurrentPhase('form');
    } finally {
      setIsLoading(false);
      setIsLoadingNextChallenge(false);
    }
  };

  const submitSolution = async () => {
    if (!currentChallenge || !userCode.trim()) {
      setError("Please write your code solution before submitting.");
      return;
    }
    setError(null);
    setIsSubmittingSolution(true);

    try {
      const payload = {
        action: 'submit_solution',
        challengeId: currentChallenge.id,
        questionDescription: currentChallenge.description,
        userCode,
        // BUG FIX: Send the programming language for evaluation context.
        preferredLanguage: programmingLanguage, 
      };

      const res = await fetch('/api/problem-solving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const rawTextResponse = await res.text();
      let parsedResponseData: EvaluationResult | null;
      try {
        const jsonMatch = rawTextResponse.match(/```json\n([\s\S]*?)\n```/);
        parsedResponseData = jsonMatch && jsonMatch[1] ? JSON.parse(jsonMatch[1]) : JSON.parse(rawTextResponse);
      } catch (parseError) {
        throw new Error("Received an unparseable evaluation response from the AI.");
      }

      if (!res.ok) {
        throw new Error((parsedResponseData as any)?.message || "Server responded with an evaluation error.");
      }

      if (parsedResponseData && typeof parsedResponseData.isCorrect === 'boolean' && typeof parsedResponseData.scorePercentage === 'number' && parsedResponseData.feedback && parsedResponseData.recommendations) {
        setEvaluationResult(parsedResponseData);
        setCurrentPhase('evaluation');
      } else {
        throw new Error("Invalid evaluation response format from AI.");
      }
    } catch (err: any) {
      console.error("Error submitting solution:", err);
      setError(`Error: ${err.message || 'Failed to submit solution.'}`);
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  const handleStartChallengeButtonClick = () => {
    if (!challengeType || !experienceLevel || !programmingLanguage) {
      setError("Please fill in all fields to start the challenge.");
      return;
    }
    requestAndSetChallenge(0);
  };

  const handleNextOrSkipQuestion = () => {
    requestAndSetChallenge(currentChallengeIndex + 1);
  };

  const handleStartNewSession = () => {
    setChallengeType('');
    setExperienceLevel('');
    setProgrammingLanguage('');
    setCurrentChallenge(null);
    setUserCode('');
    setEvaluationResult(null);
    setCurrentChallengeIndex(0);
    setCurrentPhase('form');
    setError(null);
  };
  
  const isFormIncomplete = !challengeType || !experienceLevel || !programmingLanguage;

  return (
    <>
      <Head>
        <title>AI Coding Challenges - Problem Solving Practice | AskifyAI</title>
        <meta name="description" content="Master coding interviews with AskifyAI's interactive, AI-powered problem-solving challenges. Practice algorithms, data structures, and system design with instant feedback." />
        <meta name="keywords" content="coding challenges, problem-solving, AI coding practice, technical interview prep, algorithms, data structures, system design, programming challenges, online coding editor, AI code feedback" />
        <link rel="canonical" href="https://www.askifyai.tech/problem-solving" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AI Coding Challenges - Problem Solving Practice | AskifyAI" />
        <meta property="og:description" content="Master coding interviews with interactive AI-powered challenges in algorithms, data structures, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askifyai.tech/problem-solving" />
        <meta property="og:image" content="https://www.askifyai.tech/images/problem-solving-og.svg" />
        <meta property="og:alt" content="AskifyAI's problem-solving interface showing a code editor and a coding challenge." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Coding Challenges - Problem Solving Practice | AskifyAI" />
        <meta property="twitter:description" content="Master coding interviews with interactive AI-powered challenges in algorithms, data structures, and more." />
        <meta property="twitter:image" content="https://www.askifyai.tech/images/problem-solving-twitter.svg" />
        <meta property="twitter:image:alt" content="A laptop screen displaying a coding challenge on the AskifyAI platform." />
      </Head>

      <main className={`font-inter bg-white text-gray-800 min-h-screen flex flex-col ${inter.variable}`} role="main">
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

        <section className="flex flex-col items-center justify-center flex-grow p-8 md:p-12 bg-gradient-to-r from-white to-blue-50" aria-labelledby="problem-solving-heading">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 max-w-4xl w-full text-center relative" role="region" aria-live="polite">
            <Image src="/images/problem-solving.svg" alt="Interactive Problem-Solving icon: a screen with code and a problem statement." width={100} height={100} className="mb-6 mx-auto" priority />
            <h1 id="problem-solving-heading" className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 leading-tight">Interactive AI Coding Challenges</h1>
            <p className="text-lg text-gray-600 mb-4">
  Practice with interactive, AI-powered coding challenges customized to your experience level, focus area, and preferred programming language.
</p>

<p className="text-lg text-gray-600 mb-8">
  Improve your coding skills and prepare for technical interviews with real-time feedback, helping you learn faster and code more effectively.
</p>


            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-left" role="alert" aria-atomic="true">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {currentPhase === 'form' && (
              <form onSubmit={(e) => { e.preventDefault(); handleStartChallengeButtonClick(); }} className="space-y-6 text-left">
                <div>
                  <label htmlFor="challengeType" className="block text-gray-700 text-sm font-semibold mb-2">Challenge Type:</label>
                  <select id="challengeType" value={challengeType} onChange={(e) => setChallengeType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="">Choose a challenge type</option>
                    <option value="Algorithms">Algorithms (e.g., sorting, searching)</option>
                    <option value="Data Structures">Data Structures (e.g., linked lists, trees)</option>
                    <option value="Debugging">Debugging (Identify and fix code errors)</option>
                    <option value="System Design">System Design (Conceptual problems)</option>
                    <option value="Object-Oriented Programming">Object-Oriented Programming (OOP)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="experienceLevel" className="block text-gray-700 text-sm font-semibold mb-2">Experience Level:</label>
                  <select id="experienceLevel" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="">Choose your experience level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="programmingLanguage" className="block text-gray-700 text-sm font-semibold mb-2">Programming Language:</label>
                  <select id="programmingLanguage" value={programmingLanguage} onChange={(e) => setProgrammingLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" required>
                    <option value="">Select a language</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                    <option value="Go">Go</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                </div>
                <button type="submit" className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoading || isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"} flex items-center justify-center gap-3 mt-8`} disabled={isLoading || isFormIncomplete}>
                  {isLoading ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Preparing Challenge...</>) : ('Start Challenge')}
                </button>
              </form>
            )}

            {(currentPhase === 'challenge' || currentPhase === 'evaluation') && currentChallenge && (
              <div className="text-left relative" dir="ltr">
                {isLoadingNextChallenge && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center text-indigo-600">
                      <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      <p className="text-xl font-semibold">Loading Next Challenge...</p>
                    </div>
                  </div>
                )}
                <p className="text-sm text-indigo-600 font-semibold mb-4">Challenge {currentChallengeIndex + 1} of {MAX_CHALLENGES_LIMIT}</p>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Problem Description:</h2>
                <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6 prose max-w-none">
                  <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: currentChallenge.description }} />
                </div>

                {currentPhase === 'challenge' && (
                  <>
                    <h3 className="text-xl font-bold text-indigo-700 mb-3">Your Solution ({currentChallenge.language}):</h3>
                    <textarea className="w-full h-64 p-4 mb-6 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder={`Write your ${currentChallenge.language} code here...`} value={userCode} onChange={(e) => setUserCode(e.target.value)} disabled={isSubmittingSolution} spellCheck="false" aria-label={`Code editor for ${currentChallenge.language} challenge`} />
                    <button onClick={submitSolution} className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isSubmittingSolution || !userCode.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} flex items-center justify-center gap-3`} disabled={isSubmittingSolution || !userCode.trim()}>
                      {isSubmittingSolution ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</>) : ('Submit Solution')}
                    </button>
                  </>
                )}

                {currentPhase === 'evaluation' && evaluationResult && (
                  <>
                    <h3 className="text-xl font-bold text-indigo-700 mb-3">Your Submitted Solution:</h3>
                    <pre className="w-full h-40 p-4 mb-6 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 overflow-auto" tabIndex={0}>{userCode}</pre>
                    <h3 className="text-xl font-bold text-indigo-700 mb-3">AI Evaluation:</h3>
                    <div className={`p-6 rounded-lg shadow-md mb-6 ${evaluationResult.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <p className={`font-bold text-lg mb-2 ${evaluationResult.isCorrect ? 'text-green-800' : 'text-red-800'}`}>Status: {evaluationResult.isCorrect ? 'Correct' : 'Incorrect'} ({evaluationResult.scorePercentage}%)</p>
                      <div className="text-gray-800 space-y-2">
                        <div><span className="font-semibold">Feedback:</span> <span dangerouslySetInnerHTML={{ __html: evaluationResult.feedback }} /></div>
                        <div><span className="font-semibold">Recommendations:</span> <span dangerouslySetInnerHTML={{ __html: evaluationResult.recommendations }} /></div>
                      </div>
                    </div>
                  </>
                )}

                {currentChallengeIndex < MAX_CHALLENGES_LIMIT - 1 && (
                  <button onClick={handleNextOrSkipQuestion} className={`w-full px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isLoadingNextChallenge ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} flex items-center justify-center gap-3 mt-4`} disabled={isLoadingNextChallenge || isSubmittingSolution}>
                    {isLoadingNextChallenge ? (<><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Loading...</>) : ('Next Question')}
                  </button>
                )}
                <button onClick={handleStartNewSession} className="w-full px-8 py-4 rounded-full text-gray-700 font-bold text-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 flex items-center justify-center gap-3 mt-4 border border-gray-300" disabled={isLoadingNextChallenge || isSubmittingSolution}>Start New Session</button>
              </div>
            )}

            {currentPhase === 'limitReached' && (
              <div className="text-center py-10">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-4">Congratulations!</h2>
                <p className="text-xl text-gray-700 mb-6">You have completed all {MAX_CHALLENGES_LIMIT} challenges. Great job!</p>
                <p className="text-lg text-gray-600 mb-8">Ready for more? Start a new session to continue practicing.</p>
                <button onClick={handleStartNewSession} className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center gap-3 mx-auto">Start New Session</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}