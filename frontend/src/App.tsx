
import { useEffect, useState } from "react";

type Skill = {
  id: number;
  name: string;
  trade: string;
};

type AccountType = "worker" | "customer" | "contractor" | "assessor";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export default function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [status, setStatus] = useState("Connecting to KasiSkill API...");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState<"login" | "register">("login");
  const [role, setRole] = useState<AccountType>("worker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

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
          setLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    alert(
      `${page === "login" ? "Login" : "Registration"} demonstration\n` +
        `Name: ${name || "Not provided"}\n` +
        `Email: ${email}\n` +
        `Account type: ${role}\n\n` +
        "Authentication is not implemented yet."
    );
  }

  return (
    <main className="page">
      <header className="navbar">
        <div>
          <h1>KasiSkill</h1>
          <p>Skills • Trust • Opportunity</p>
        </div>

        <button
          className="nav-button"
          onClick={() => setPage(page === "login" ? "register" : "login")}
        >
          {page === "login" ? "Create Account" : "Sign In"}
        </button>
      </header>

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

      <section className="auth-panel">
        <h2>{page === "login" ? "Welcome Back" : "Create Your Account"}</h2>

        <p>
          {page === "login"
            ? "Sign in to access your KasiSkill account."
            : "Join the KasiSkill community today."}
        </p>

        <form onSubmit={handleSubmit}>
          {page === "register" && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          <button className="submit-button" type="submit">
            {page === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="switch-text">
          {page === "login"
            ? "New to KasiSkill?"
            : "Already have an account?"}

          <button
            className="text-button"
            type="button"
            onClick={() => setPage(page === "login" ? "register" : "login")}
          >
            {page === "login" ? "Register here" : "Sign in here"}
          </button>
        </p>
      </section>

      <section className="panel">
        <h2>Explore Skills</h2>
        <p className="status">{status}</p>

        {loading ? (
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

      <footer>
        KasiSkill • Building opportunities through verified skills
      </footer>
    </main>
  );
}
