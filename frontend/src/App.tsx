
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Skill = {
  id: number;
  name: string;
  trade: string;
};

type AccountType = "worker" | "customer" | "contractor" | "assessor";

type User = {
  id: number;
  full_name: string;
  email: string;
  account_type: AccountType;
  is_active: boolean;
};

type DemoAccount = {
  name: string;
  description: string;
  email: string;
  password: string;
  role: AccountType;
  icon: string;
};

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

// These are public demonstration accounts.
// Do not use these credentials for real user accounts.
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: "Worker",
    description: "Explore skills and opportunities",
    email: "worker.demo@kasiskill.test",
    password: "WorkerDemo2026!",
    role: "worker",
    icon: "🔧",
  },
  {
    name: "Customer",
    description: "Discover skilled service providers",
    email: "customer.demo@kasiskill.test",
    password: "CustomerDemo2026!",
    role: "customer",
    icon: "🏠",
  },
  {
    name: "Contractor",
    description: "Explore projects and workforce",
    email: "contractor.demo@kasiskill.test",
    password: "ContractorDemo2026!",
    role: "contractor",
    icon: "🏗️",
  },
  {
    name: "Assessor",
    description: "Explore skills assessment",
    email: "assessor.demo@kasiskill.test",
    password: "AssessorDemo2026!",
    role: "assessor",
    icon: "📋",
  },
];

export default function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [status, setStatus] = useState("Connecting to KasiSkill API...");
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [page, setPage] = useState<"login" | "register">("login");
  const [role, setRole] = useState<AccountType>("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load skills from the backend.
  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        const response = await fetch(`${API_URL}/api/skills`);

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data: Skill[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid skills response.");
        }

        if (!cancelled) {
          setSkills(data);
          setStatus("Connected to KasiSkill API successfully.");
        }
      } catch (error) {
        console.error("KasiSkill API error:", error);

        if (!cancelled) {
          setStatus(
            "Unable to connect to KasiSkill. Please try again later."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSkills(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  // Authenticate a user and retrieve their profile.
  async function loginUser(
    userEmail: string,
    userPassword: string
  ) {
    setLoadingAuth(true);
    setAuthMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed. Please check your credentials."
        );
      }

      const token = data.access_token;

      if (!token) {
        throw new Error("The server did not return an access token.");
      }

      sessionStorage.setItem("kasiskill_token", token);

      const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const profile = await profileResponse.json();

      if (!profileResponse.ok) {
        sessionStorage.removeItem("kasiskill_token");
        throw new Error(
          profile.detail || "Unable to retrieve your account profile."
        );
      }

      setCurrentUser(profile as User);
      setPassword("");
      setAuthMessage("Welcome to KasiSkill!");

    } catch (error) {
      console.error("Authentication error:", error);

      setAuthMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoadingAuth(false);
    }
  }

  // One-click demo login.
  async function handleDemoLogin(account: DemoAccount) {
    setEmail(account.email);
    setRole(account.role);

    await loginUser(account.email, account.password);
  }

  // Normal registration and login.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (page === "login") {
      await loginUser(email, password);
      return;
    }

    setLoadingAuth(true);
    setAuthMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: name,
          email,
          password,
          account_type: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed. Please try again."
        );
      }

      setAuthMessage("Account created successfully! Please sign in.");
      setPage("login");
      setName("");
      setPassword("");

    } catch (error) {
      console.error("Registration error:", error);

      setAuthMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoadingAuth(false);
    }
  }

  // Log out.
  function handleLogout() {
    sessionStorage.removeItem("kasiskill_token");
    setCurrentUser(null);
    setEmail("");
    setPassword("");
    setAuthMessage("You have successfully signed out.");
  }

  return (
    <main className="page">

      {/* NAVIGATION */}
      <header className="navbar">
        <div>
          <h1>KasiSkill</h1>
          <p>Skills • Trust • Opportunity</p>
        </div>

        {currentUser ? (
          <button className="nav-button" onClick={handleLogout}>
            Sign Out
          </button>
        ) : (
          <button
            className="nav-button"
            onClick={() => {
              setPage(page === "login" ? "register" : "login");
              setAuthMessage("");
            }}
          >
            {page === "login" ? "Create Account" : "Sign In"}
          </button>
        )}
      </header>

      {/* HERO */}
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR SKILLS. YOUR OPPORTUNITIES.</p>
          <h2>Connecting Skills to Opportunity</h2>
          <p>
            KasiSkill connects skilled workers, households and
            contractors through skills verification and employment.
          </p>
        </div>
      </section>

      {/* AUTHENTICATED ACCOUNT */}
      {currentUser ? (
        <section className="auth-panel">
          <p className="eyebrow">ACCOUNT CONNECTED</p>
          <h2>Welcome, {currentUser.full_name}!</h2>

          <p>
            You are signed in to KasiSkill.
          </p>

          <div className="profile-details">
            <p><strong>Name:</strong> {currentUser.full_name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Account type:</strong> {currentUser.account_type}</p>
            <p>
              <strong>Account status:</strong>{" "}
              {currentUser.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          <p className="status">
            Your authentication was successful.
          </p>

          <button className="submit-button" onClick={handleLogout}>
            Sign Out
          </button>
        </section>
      ) : (
        <>
          {/* AUTHENTICATION FORM */}
          <section className="auth-panel">
            <h2>
              {page === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>

            <p>
              {page === "login"
                ? "Sign in to access your KasiSkill account."
                : "Join the KasiSkill community today."}
            </p>

            {authMessage && (
              <div className="auth-message" role="status">
                {authMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {page === "register" && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={2}
                    maxLength={150}
                    required
                  />
                </>
              )}

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                required
              />

              <label>Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AccountType)}
              >
                <option value="worker">Worker</option>
                <option value="customer">Customer / Household</option>
                <option value="contractor">Contractor / Business</option>
                <option value="assessor">Assessor</option>
              </select>

              <button
                className="submit-button"
                type="submit"
                disabled={loadingAuth}
              >
                {loadingAuth
                  ? "Please wait..."
                  : page === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <p className="switch-text">
              {page === "login"
                ? "New to KasiSkill?"
                : "Already have an account?"}

              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setPage(page === "login" ? "register" : "login");
                  setAuthMessage("");
                }}
              >
                {page === "login" ? "Register here" : "Sign in here"}
              </button>
            </p>
          </section>

          {/* ONE-CLICK DEMO ACCOUNTS */}
          {page === "login" && (
            <section className="demo-section">
              <div className="demo-heading">
                <p className="eyebrow">EXPLORE KASISKILL</p>
                <h2>Try a Demo Account</h2>
                <p>
                  Choose an account type and enter the platform
                  instantly. No manual login details required.
                </p>
              </div>

              <div className="demo-grid">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    className="demo-card"
                    onClick={() => handleDemoLogin(account)}
                    disabled={loadingAuth}
                  >
                    <span className="demo-icon">{account.icon}</span>

                    <span className="demo-card-content">
                      <strong>{account.name}</strong>
                      <small>{account.description}</small>
                      <span className="demo-action">
                        {loadingAuth ? "Please wait..." : "Enter Demo →"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <p className="demo-note">
                Demonstration accounts contain sample information
                and are intended for platform exploration.
              </p>
            </section>
          )}
        </>
      )}

      {/* SKILLS */}
      <section className="panel">
        <h2>Explore Skills</h2>
        <p className="status">{status}</p>

        {loadingSkills ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p>Skills are currently unavailable. Please try again later.</p>
        ) : (
          <ul className="skills">
            {skills.map((skill) => (
              <li key={skill.id}>
                <strong>{skill.name}</strong>
                <span>{skill.trade}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        KasiSkill • Building opportunities through verified skills
      </footer>
    </main>
  );
}
