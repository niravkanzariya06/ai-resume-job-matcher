import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <h1>AI Resume Analyzer + Job Matcher</h1>
        <p>3D intelligence cockpit for ATS performance and hiring strategy</p>
      </div>
      <div className="topbar-actions">
        <span>{user?.name}</span>
        <button type="button" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
