import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock, Unlock, Shield, Eye, EyeOff, Loader2, CheckCircle , Landmark } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { toggleCardBlock } from "@/services/bankService";
import { toast } from "sonner";

const Card = () => {
    const navigate = useNavigate();
    const { cards, refresh, user } = useBank();
    const card = cards[0];
    const [showCvv, setShowCvv] = useState(false);
    const [showNumber, setShowNumber] = useState(false);
    const [blocking, setBlocking] = useState(false);

    const handleToggleBlock = async () => {
        if (!card) return;
        setBlocking(true);
        try {
            await toggleCardBlock(card.id);
            await refresh();
            toast.success(card.blocked ? "Cartão desbloqueado!" : "Cartão bloqueado com sucesso.");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setBlocking(false);
        }
    };

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
                <h1 className="text-xl sm:text-2xl font-bold">Meu Cartão</h1>

                {card ? (
                    <>
                        {/* Virtual Card */}
                        <div className={`relative rounded-2xl p-6 overflow-hidden transition-all duration-500 ${card.blocked ? "grayscale opacity-70" : ""}`}
                            style={{
                                background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #1e1b4b 100%)",
                                boxShadow: card.blocked ? "none" : "0 8px 48px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99,102,241,0.15)",
                            }}>
                            {/* Decorative circles */}
                            <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary/10 blur-xl" />
                            <div className="absolute -right-4 top-12 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />

                            {/* Card header */}
                            <div className="flex items-center justify-between mb-8 relative">
                                <Shield className="h-5 w-5 text-primary/60" />
                                <div className="flex gap-1">
                                    <div className="h-8 w-8 rounded-full bg-red-500/80" />
                                    <div className="h-8 w-8 rounded-full bg-yellow-500/80 -ml-4" />
                                </div>
                            </div>

                            {/* Chip */}
                            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-400/80 to-yellow-600/80 mb-4 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-0.5">
                                    {[0, 1, 2, 3].map(i => <div key={i} className="h-1.5 w-2 bg-yellow-900/40 rounded-[1px]" />)}
                                </div>
                            </div>

                            {/* Card number */}
                            <div className="flex items-center gap-2 mb-4">
                                <p className="text-sm sm:text-base font-mono tracking-widest text-white/90">
                                    {showNumber ? "5374 8291 3764 4892" : card.number}
                                </p>
                                <button onClick={() => setShowNumber(!showNumber)} className="text-white/50 hover:text-white/80 transition">
                                    {showNumber ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                </button>
                            </div>

                            {/* Card footer */}
                            <div className="flex items-end justify-between relative">
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Titular</p>
                                    <p className="text-sm font-semibold text-white tracking-wide">{card.holder}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Validade</p>
                                    <p className="text-sm font-semibold text-white">{card.expiry}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">CVV</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-semibold text-white">
                                            {showCvv ? "742" : card.cvv}
                                        </p>
                                        <button onClick={() => setShowCvv(!showCvv)} className="text-white/50 hover:text-white/80 transition">
                                            {showCvv ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Blocked overlay */}
                            {card.blocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                    <div className="flex flex-col items-center gap-1">
                                        <Lock className="h-8 w-8 text-white" />
                                        <span className="text-white text-sm font-bold">Cartão Bloqueado</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card details */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-border">
                                <h3 className="text-sm font-semibold">Detalhes do cartão</h3>
                            </div>
                            <div className="divide-y divide-border">
                                <div className="flex items-center justify-between px-5 py-3.5">
                                    <span className="text-xs text-muted-foreground">Tipo</span>
                                    <span className="text-xs font-medium">Virtual · Mastercard</span>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3.5">
                                    <span className="text-xs text-muted-foreground">Limite disponível</span>
                                    <span className="text-xs font-medium text-success">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(card.limit)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3.5">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${card.blocked ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                                        {card.blocked ? "Bloqueado" : "Ativo"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Block / Unblock button */}
                        <button
                            onClick={handleToggleBlock}
                            disabled={blocking}
                            className={`w-full glass-card p-4 flex items-center justify-center gap-2 font-semibold text-sm transition active:scale-[0.98] ${card.blocked ? "text-success hover:bg-success/10 border-success/20" : "text-destructive hover:bg-destructive/10 border-destructive/20"}`}
                        >
                            {blocking ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : card.blocked ? (
                                <Unlock className="h-4 w-4" />
                            ) : (
                                <Lock className="h-4 w-4" />
                            )}
                            {blocking ? "Processando..." : card.blocked ? "Desbloquear cartão" : "Bloquear cartão"}
                        </button>
                    </>
                ) : (
                    <div className="glass-card p-8 text-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nenhum cartão encontrado.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Card;
