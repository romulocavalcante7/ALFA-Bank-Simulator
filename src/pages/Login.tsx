import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Landmark } from "lucide-react";
import { toast } from "sonner";
import { recordAccess } from "@/services/bankService";

const MOCK_EMAIL = "admin@alfabank.com";
const MOCK_PASSWORD = "alfa2026";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated API call
    await new Promise(r => setTimeout(r, 600));

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      await recordAccess();
      navigate("/dashboard");
    } else {
      toast.error(`Credenciais inválidas. Use ${MOCK_EMAIL} / ${MOCK_PASSWORD}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background w-full font-sans">
      {/* Left panel - Branding (Solid Orange) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 relative overflow-hidden text-primary-foreground shadow-2xl z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white opacity-5 rounded-full -mr-64 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-black opacity-[0.03] rounded-full -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
            <span className="logo-text text-3xl font-extrabold tracking-tight">ALFA Bank</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Transações rápidas.<br/>Controle total.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-medium">
            Abra sua conta em minutos e tenha uma experiência bancária fluida, minimalista e construída para você.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm font-semibold opacity-80">© 2026 ALFA Bank. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right panel - Login form (Clean White) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-card">
        <div className="w-full max-w-md animate-fade-in">
          
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Landmark className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="logo-text text-2xl font-bold tracking-tight text-foreground">ALFA Bank</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-foreground">Acesse sua conta</h2>
            <p className="text-muted-foreground font-medium">Insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">E-mail corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={MOCK_EMAIL}
                  className="w-full bg-muted/30 border-2 border-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold block text-foreground">Senha de acesso</label>
                <Link to="#" className="text-xs font-bold text-primary hover:text-primary/80 hover:underline">Esqueceu a senha?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted/30 border-2 border-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-primary/25 mt-6" disabled={loading}>
              {loading ? (
                <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground mb-6 font-medium">
              Ainda não é cliente?{" "}
              <Link to="/register" className="text-primary hover:underline font-bold">
                Abra sua conta
              </Link>
            </p>
            
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 inline-block text-left group">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-1">Credenciais de Acesso</p>
              <p className="text-foreground font-mono text-sm font-bold">{MOCK_EMAIL}</p>
              <p className="text-foreground font-mono text-sm font-bold mt-0.5">{MOCK_PASSWORD}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
