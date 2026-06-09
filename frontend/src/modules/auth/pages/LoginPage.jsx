

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authService } from "../../../core/auth/authService";
import { ROLE_THEMES } from "../../../core/theme/roleThemes";

export default function LoginPage() {
  const { state }    = useLocation();
  const role  = state?.role || null;
const theme = ROLE_THEMES[role] ?? { color: "#7fa9ae", light: "#eef6f7" };
  /*const role         = state?.role || "mother";
  const theme        = ROLE_THEMES[role];*/
  const { t, i18n } = useTranslation();
  const navigate     = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await authService.login(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // onAuthStateChange في AuthProvider سيتولى جلب الدور
    // RedirectPage ستنتظر isReady تلقائياً
    navigate("/redirect", { replace: true });
  };

  return (
    <div
      className="auth-wrapper "
      style={{ "--primary": theme.color, "--light": theme.light }}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="auth-box"    >
       <h1 className="logo" style={{  textAlign: "center"}}  >Journey of Motherhood</h1>
        <h2 style={{  textAlign: "center"}}  >{t("auth.loginTitle")}</h2>
        <p className="subtitle" style={{  textAlign: "center"}}>{t("auth.loginSubtitle")}</p>

        {error && (
          <div className="error-banner">{error}</div>
        )}

        <div style={{ maxWidth: 450, margin: "0 auto" }}>
          <form onSubmit={handleLogin}>
   {/*         <div className="input-group">
              <label>{t("auth.email")}</label>
              <input
                type="email"
                className="input"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
 
            <div className="input-group">
              <label>{t("auth.password")}</label>
              <input
                type="password"
                className="input"
                placeholder={t("auth.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>*/}
<div className="input-group">
  <label>
    <i className="fas fa-envelope" style={{ color: theme.color, fontSize: "0.85rem" }} />
    {t("auth.email")}
  </label>
  <input
    type="email"
    className="input"
    placeholder="example@mail.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</div>

<div className="input-group">
  <label>
    <i className="fas fa-lock" style={{ color: theme.color, fontSize: "0.85rem" }} />
    {t("auth.password")}
  </label>
  <input
    type="password"
    className="input"
    placeholder={t("auth.password")}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>
            <a  href="/forgot-password"
  className="forgot-password"
  onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}
>
  {t("auth.forgotPassword")}
</a>

            <button
              type="submit"
              className="btn-main"
              style={{ background: theme.color }}
              disabled={loading}
            >
              {loading ? "..." : t("auth.login")}
            </button>
          </form>

          <p className="register-link">
            {t("auth.noAccount")}{" "}
            <a href="/select-role">{t("auth.registerBtn")}</a>
          </p>
        </div>
      </div>
    </div>
  );
}