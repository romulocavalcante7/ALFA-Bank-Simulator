import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Bell, Moon, ChevronRight, LogOut, Lock, CreditCard, FileText , Landmark } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { formatCurrency } from "@/utils/format";

const Profile = () => {
  const navigate = useNavigate();
  const { user, balance } = useBank();
  const [notifications, setNotifications] = useState(true);
  const [isDark, setIsDark] = useState(() => document.body.classList.contains("dark"));

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const personalInfo = [
    { label: "Nome completo", value: user?.name ?? "—", icon: User },
    { label: "E-mail", value: user?.email ?? "—", icon: Mail },
    { label: "Telefone", value: user?.phone ?? "—", icon: Phone },
    { label: "Endereço", value: user?.address ?? "—", icon: MapPin },
    { label: "CPF", value: user?.cpf ?? "—", icon: FileText },
  ];

  const menuItems = [
    { label: "Histórico de acesso", desc: "Ver registros de login", icon: Shield, onClick: () => navigate("/access-history"), isNew: true },
    { label: "Cartões", desc: "Gerenciar cartões", icon: CreditCard, onClick: () => navigate("/card"), isNew: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Landmark className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="logo-text  font-bold tracking-tight text-foreground">ALFA Bank</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in space-y-5">
        {/* Avatar & name */}
        <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
            {user?.name.charAt(0) ?? "?"}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">{user?.name}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <span className="text-[10px] sm:text-xs bg-success/10 text-success px-3 py-1 rounded-full font-medium">
            Conta verificada
          </span>
          <div className="mt-1 text-center">
            <p className="text-[11px] text-muted-foreground">Saldo disponível</p>
            <p className="text-xl font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Personal info */}
        <div className="glass-card overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold">Dados pessoais</h3>
          </div>
          <div className="divide-y divide-border">
            {personalInfo.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                  <p className="text-xs sm:text-sm font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold">Configurações</h3>
          </div>
          <div className="divide-y divide-border">
            {/* Notifications */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Notificações</p>
                  <p className="text-[11px] text-muted-foreground">Push e e-mail</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform duration-200 ${notifications ? "translate-x-5" : ""}`} />
              </button>
            </div>

            {/* Dark mode indicator */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">Tema escuro</p>
                  <p className="text-[11px] text-muted-foreground">{isDark ? "Ativo" : "Inativo"}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${isDark ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-foreground transition-transform duration-200 ${isDark ? "translate-x-5" : ""}`} />
              </button>
            </div>

            {/* Menu items */}
            {menuItems.map(({ label, desc, icon: Icon, onClick, isNew }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center justify-between w-full px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-medium">{label}</p>
                      {isNew && <span className="text-[9px] font-bold text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Novo</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/")}
          className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-semibold">Sair da conta</span>
        </button>
      </main>
    </div>
  );
};

export default Profile;
