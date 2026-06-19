"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("app-service");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  // Fetch live API data from /api/info
  const fetchApiInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/info");
      const data = await res.json();
      setApiData(data);
    } catch (err) {
      console.error("Error fetching API:", err);
      setApiData({ error: "Failed to connect to API endpoint." });
    } finally {
      setLoading(false);
    }
  };

  // Load checklist progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("azure-deploy-steps");
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading checklist", e);
      }
    }
  }, []);

  // Toggle step completion
  const toggleStep = (tab, stepId) => {
    const updated = {
      ...completedSteps,
      [`${tab}-${stepId}`]: !completedSteps[`${tab}-${stepId}`],
    };
    setCompletedSteps(updated);
    localStorage.setItem("azure-deploy-steps", JSON.stringify(updated));
  };

  const appServiceSteps = [
    { id: 1, title: "Create Azure App Service", desc: "Go to Azure Portal, create a Web App. Choose Node 18 LTS or 20 LTS as the runtime stack and Linux as the OS." },
    { id: 2, title: "Configure Startup Command", desc: "Under Configuration > General Settings, set Startup Command to: 'node node_modules/.bin/next start'." },
    { id: 3, title: "Set Port environment variable", desc: "Azure App Service injects PORT automatically. Next.js reads this to bind to the correct port." },
    { id: 4, title: "Deploy your code", desc: "Deploy via Local Git, GitHub Actions, or VS Code extension. The App Service build engine (Kudu) will run 'npm run build' automatically." },
  ];

  const staticWebAppSteps = [
    { id: 1, title: "Push to GitHub / GitLab", desc: "Azure Static Web Apps (SWA) uses CI/CD pipelines to build and deploy. Push your boilerplate to a Git repository." },
    { id: 2, title: "Create Azure Static Web App", desc: "In the Azure Portal, create a Static Web App. Link it to your GitHub repository and branch." },
    { id: 3, title: "Configure Build Presets", desc: "Select 'Next.js' as the Build Preset. Azure will auto-detect the configuration and create a GitHub Actions workflow." },
    { id: 4, title: "Verify Hybrid Deployment", desc: "Azure SWA automatically hosts the static assets on its CDN, and boots up Azure Functions for the API routes (/api/info)." },
  ];

  const currentSteps = activeTab === "app-service" ? appServiceSteps : staticWebAppSteps;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <span className={styles.brand}>Next<span className={styles.dot}>.</span>js</span>
          <span className={styles.badge}>AZURE READY</span>
        </div>
        <nav className={styles.nav}>
          <a href="https://learn.microsoft.com/en-us/azure/" target="_blank" rel="noopener noreferrer" className={styles.navLink} id="nav-link-azure">Azure Docs</a>
          <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className={styles.navLink} id="nav-link-next">Next.js Docs</a>
        </nav>
      </header>

      {/* Main Hero */}
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.glow} />
          <h1 className={styles.title} id="main-title">
            Deploy Next.js on <span className={styles.gradientText}>Azure</span>
          </h1>
          <p className={styles.subtitle}>
            A highly optimized boilerplate with Server Components, API route handlers, and deployment-ready settings for Azure App Service & Static Web Apps.
          </p>
          <div className={styles.heroCtas}>
            <a href="#deploy-planner" className={styles.primaryCta} id="cta-start-deploying">Start Deploying Guide</a>
            <button onClick={fetchApiInfo} className={styles.secondaryCta} id="cta-test-api">
              {loading ? "Checking API..." : "Test Live API Endpoint"}
            </button>
          </div>
        </section>

        {/* Live API Status Section */}
        {apiData && (
          <section className={styles.apiSection} id="live-api-status">
            <div className={styles.sectionHeader}>
              <div className={styles.statusDot} style={{ backgroundColor: apiData.error ? "#ef4444" : "#10b981" }} />
              <h3>Live API Diagnostics (/api/info)</h3>
            </div>
            <div className={styles.codeBlock}>
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          </section>
        )}

        {/* Planner Section */}
        <section className={styles.plannerSection} id="deploy-planner">
          <div className={styles.sectionHeading}>
            <h2>Choose Your Deployment Route</h2>
            <p>Azure offers multiple methods to deploy Node.js/Next.js apps. Follow the step-by-step checklist below.</p>
          </div>

          {/* Tabs */}
          <div className={styles.tabs} role="tablist">
            <button
              id="tab-btn-app-service"
              role="tab"
              aria-selected={activeTab === "app-service"}
              className={`${styles.tabBtn} ${activeTab === "app-service" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("app-service")}
            >
              Option 1: Azure App Service (RSC & API Server)
            </button>
            <button
              id="tab-btn-swa"
              role="tab"
              aria-selected={activeTab === "swa"}
              className={`${styles.tabBtn} ${activeTab === "swa" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("swa")}
            >
              Option 2: Azure Static Web Apps (Hybrid CDN)
            </button>
          </div>

          {/* Checklist */}
          <div className={styles.checklist}>
            {currentSteps.map((step) => {
              const stepKey = `${activeTab}-${step.id}`;
              const isDone = !!completedSteps[stepKey];
              return (
                <div
                  key={step.id}
                  className={`${styles.checkItem} ${isDone ? styles.checkItemCompleted : ""}`}
                  onClick={() => toggleStep(activeTab, step.id)}
                  id={`step-container-${activeTab}-${step.id}`}
                >
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // Handled by container click
                      className={styles.checkbox}
                      id={`checkbox-${activeTab}-${step.id}`}
                    />
                    <span className={styles.checkmark}></span>
                  </div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>
                      Step {step.id}: {step.title}
                    </h4>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cloud Benefits Grid */}
        <section className={styles.featuresSection}>
          <h2>Why Next.js on Azure?</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚡</div>
              <h4>Production Scalability</h4>
              <p>Azure automatically scales memory, CPU, and instances up or down depending on traffic to maintain sub-second response times.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔒</div>
              <h4>Enterprise Security</h4>
              <p>Bind custom domains, set up Azure Active Directory (Entra ID) authentication, and enforce SSL/TLS with zero config.</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📦</div>
              <h4>CI/CD Integrated</h4>
              <p>Deploy automatically on every Git commit using GitHub Actions workflows natively created by Azure.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Next.js Azure Boilerplate. Built for Azure Deployment Practice.</p>
      </footer>
    </div>
  );
}
