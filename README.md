# AskifyAI - AI-Powered Career Development Platform

![AskifyAI Logo](public/icon0.svg) **AskifyAI is a comprehensive suite of AI-powered tools to help job seekers master interviews and accelerate their career growth. Built with Next.js, TypeScript, and n8n for intelligent automation.**

---

### **Live Demo**

**[https://www.askifyai.tech](https://www.askifyai.tech)**

---

### **✨ Features & Tools**

This platform includes a wide range of tools to cover every aspect of the job preparation process:

* **AI CV/Resume Analyzer:** Get an instant ATS score and detailed feedback to optimize your resume.
* **Personalized Interview Question Generator:** Generate tailored interview questions based on your specific role and experience.
* **Interactive Coding Challenges:** Practice real-time coding problems with AI-powered evaluation.
* **Behavioral Question Analyzer:** Master the STAR method with AI analysis of your interview answers.
* **AI Cover Letter Generator:** Create personalized cover letters from your CV and a job description.
* **AI Skill Gap Analyzer:** Identify missing skills for your target job and get a personalized learning roadmap.
* **AI Company Insights:** Research company culture, values, and common interview questions.
* **AI Job Search Strategist:** Build a tailored, effective job search plan.
* **AI Salary Negotiator:** Analyze salary offers and get data-driven negotiation tips.
* **AI Career Planner:** Map out your long-term career progression and milestones.
* **Quick Subject Review:** Rapidly review key concepts for any subject with AI-generated Q&A.

---

### **🛠️ Tech Stack**

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Automation/AI Backend:** Self-hosted [n8n.io](https://n8n.io/)
* **Deployment:** [Vercel](https://vercel.com/)

---

### **🚀 Getting Started**

To run this project locally, follow these steps:

**Prerequisites:**
* Node.js (v18 or later)
* npm or yarn

**Installation:**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/mohammadjihad6/askifyai-website.git](https://github.com/mohammadjihad6/askifyai-website.git)
    cd askifyai-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    # yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the necessary environment variables. These include your n8n webhook URLs and any secret keys.
    ```env
    N8N_WEBHOOK_URL_COVER_LETTER=...
    N8N_WEBHOOK_URL_SKILL_GAP=...
    N8N_SECRET_KEY=...
    # Add all other necessary variables
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

### **🚢 Deployment**

This project is optimized for deployment on [Vercel](https://vercel.com/). Simply connect your GitHub repository to Vercel for continuous deployment. Remember to add your environment variables to the Vercel project settings before deploying.