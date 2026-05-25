import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email kiritilishi shart";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Email noto'g'ri formatda";
    if (!form.password) errs.password = "Parol kiritilishi shart";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      
      // Response structure har xil bo'lishi mumkinligini hisobga olamiz
      const accessToken = data.tokens?.accessToken || data.accessToken || data.token;
      const refreshToken = data.tokens?.refreshToken || data.refreshToken;
      const user = data.data || data.user || data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        setServerError("Token olinmadi");
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-600/30">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            TaskFlow
          </h1>
          <p className="text-slate-500 text-sm mt-1">Akkauntingizga kiring</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {serverError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="ali@gmail.com"
                className={`w-full bg-slate-800 border ${
                  errors.email ? "border-red-500" : "border-slate-700"
                } rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-1.5">
                Parol
              </label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Parolingiz"
                className={`w-full bg-slate-800 border ${
                  errors.password ? "border-red-500" : "border-slate-700"
                } rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all mt-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Akkauntingiz yo'qmi?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
