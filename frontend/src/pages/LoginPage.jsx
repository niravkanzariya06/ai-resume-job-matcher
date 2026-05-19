import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data.data);
      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        {isRegister && <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit" disabled={loading}>{loading ? "Please wait..." : isRegister ? "Register" : "Login"}</button>
        <button type="button" className="link-btn" onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </button>
      </form>
    </main>
  );
}
