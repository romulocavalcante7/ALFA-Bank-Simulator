import { useNavigate, Link } from "react-router-dom";
import {
  Send, Download, CreditCard, LogOut, ArrowUpRight, ArrowDownLeft,
  Wallet, Receipt, Eye, EyeOff, QrCode, Smartphone, X, Landmark, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useBank } from "@/context/BankContext";
import { formatCurrency, formatDateShort } from "@/utils/format";
import { usePWA } from "@/hooks/usePWA";
import type { Transaction } from "@/services/database";

const transactionIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "pix_received": return <ArrowDownLeft className="h-4 w-4 text-success" />;
    case "pix_sent": return <ArrowUpRight className="h-4 w-4 text-destructive" />;
    case "transfer": return <ArrowUpRight className="h-4 w-4 text-destructive" />;
    case "deposit": return <Download className="h-4 w-4 text-success" />;
    case "payment":
    case "boleto": return <Receipt className="h-4 w-4 text-destructive" />;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, balance, transactions, loading } = useBank();
  const [showBalance, setShowBalance] = useState(true);
  const { showBanner, isIos, install, dismiss } = usePWA();

  const recent = transactions.slice(0, 5);

  const actions = [
    { label: "Área PIX", icon: QrCode, color: "primary", onClick: () => navigate("/pix") },
    { label: "Transferir", icon: Send, color: "primary", onClick: () => navigate("/transfer") },
    { label: "Depositar", icon: Download, color: "primary", onClick: () => navigate("/deposit") },
    { label: "Pagar Boleto", icon: Receipt, color: "primary", onClick: () => navigate("/payment") },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-12 font-sans">
      {/* PWA Banner */}
      {showBanner && (
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 min-w-0">
              <Smartphone className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-medium">Instale nosso app para acesso rápido e seguro.</p>
                {isIos && (
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Safari: Compartilhar (⬆) → Tela de Início
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isIos && (
                <button
                  onClick={install}
                  className="text-xs bg-background text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-background/90 transition shadow-sm"
                >
                  Instalar
                </button>
              )}
              <button onClick={dismiss} className="hover:opacity-75 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Orange Header Background */}
      <div className="bg-primary pt-4 pb-24 px-4 shadow-md rounded-b-[2.5rem]">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-primary-foreground">
              <div className="h-9 w-9 bg-background rounded-full flex items-center justify-center shadow-sm">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold tracking-tight text-xl">ALFA Bank</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-sm hover:bg-white/30 transition shadow-sm"
              >
                {user?.name.charAt(0) || "U"}
              </button>
              <button onClick={() => navigate("/")} className="text-primary-foreground/80 hover:text-white transition p-2" title="Sair do App">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Welcome & Balance Hero */}
          <div className="text-primary-foreground">
            <p className="text-sm font-medium opacity-90 mb-1">Olá, {user?.name.split(" ")[0]}!</p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm opacity-80">Saldo total disponível</span>
              <button onClick={() => setShowBalance(!showBalance)} className="opacity-80 hover:opacity-100 transition">
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            
            {loading ? (
              <div className="h-10 w-48 bg-white/20 rounded-lg animate-pulse mt-2" />
            ) : (
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                {showBalance ? formatCurrency(balance) : "R$ ••••••"}
              </h1>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-12 space-y-6 animate-fade-in relative z-10">
        
        {/* Quick Actions Strip */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl p-4 sm:p-6 flex justify-between sm:justify-around gap-2 sm:gap-6 backdrop-blur-xl">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex flex-col items-center gap-3 flex-1 hover:scale-105 transition-transform group"
            >
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground shadow-sm border border-border">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-center text-foreground/80 group-hover:text-primary transition-colors leading-tight">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Cards & Highlights */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 hover:border-primary/30 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Meus Cartões</h3>
                </div>
                <button onClick={() => navigate("/card")} className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="bg-foreground text-background p-4 rounded-xl shadow-inner relative z-10 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <Landmark className="h-4 w-4 opacity-50" />
                  <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">Virtual</span>
                </div>
                <p className="font-mono text-sm tracking-widest opacity-90 mb-1">•••• •••• •••• 4092</p>
                <p className="text-xs opacity-70">{user?.name.toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-xl transition-all group-hover:bg-warning/20" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Investimentos</h3>
                  <p className="text-xs text-muted-foreground">Conheça nossos CDBs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <h3 className="font-bold text-lg">Histórico Recente</h3>
                <Link to="/transactions" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  Ver extrato completa <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="flex-1 p-2 sm:p-5 flex flex-col justify-center">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-3 py-4 border-b border-border/40 last:border-0">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                         <div className="h-3.5 bg-muted rounded animate-pulse w-1/3" />
                         <div className="h-2.5 bg-muted/60 rounded animate-pulse w-1/4" />
                      </div>
                    </div>
                  ))
                ) : recent.length === 0 ? (
                  <div className="text-center py-10 opacity-60">
                    <Receipt className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Sua conta é nova!</p>
                    <p className="text-xs mt-1">Nenhuma transação feita ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recent.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default group">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            {transactionIcon(tx.type)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm sm:text-base font-bold text-foreground truncate">{tx.description}</p>
                            <p className="text-xs text-muted-foreground font-medium">{formatDateShort(tx.date)}</p>
                          </div>
                        </div>
                        <span className={`text-sm sm:text-base font-extrabold ml-3 whitespace-nowrap tracking-tight ${tx.amount >= 0 ? "text-success" : "text-foreground"}`}>
                          {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
