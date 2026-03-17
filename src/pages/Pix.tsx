import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Send, User, Key, DollarSign, CheckCircle,
    QrCode, ArrowDownLeft, Copy, Check, Loader2,
  Landmark
} from "lucide-react";
import { useBank } from "@/context/BankContext";
import { sendPix, receivePix, payQrCode } from "@/services/bankService";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

type Tab = "send" | "receive" | "qrcode";

const MOCK_PIX_CODE =
    "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-1234567890ab5204000053039865802BR5925ALFA BANK SA6009SAO PAULO62140510ngb1234567";

const Pix = () => {
    const navigate = useNavigate();
    const { balance, refresh, user } = useBank();

    const [tab, setTab] = useState<Tab>("send");
    const [form, setForm] = useState({ recipient: "", pixKey: "", amount: "" });
    const [receiveForm, setReceiveForm] = useState({ sender: "", amount: "" });
    const [qrForm, setQrForm] = useState({ value: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<{ type: Tab; amount: number } | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    // Build my PIX keys from context user
    const myPixKeys = useMemo(
        () =>
            [
                user?.cpf && `CPF: ${user.cpf}`,
                user?.email && `E-mail: ${user.email}`,
                user?.phone && `Telefone: ${user.phone}`,
            ].filter(Boolean) as string[],
        [user]
    );

    const updateForm = (setter: React.Dispatch<React.SetStateAction<any>>) =>
        (field: string, value: string) => setter((p: any) => ({ ...p, [field]: value }));

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const amount = parseFloat(form.amount);
        if (!form.pixKey.trim()) { setError("Informe a chave PIX."); return; }
        if (!amount || amount <= 0) { setError("Informe um valor válido."); return; }
        if (amount > balance) { setError("Saldo insuficiente para esta transferência."); return; }

        setLoading(true);
        try {
            await sendPix({ recipient: form.pixKey, pixKey: form.pixKey, amount });
            await refresh();
            setSuccess({ type: "send", amount });
            toast.success("PIX enviado com sucesso!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReceive = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const amount = parseFloat(receiveForm.amount);
        if (!amount || amount <= 0) { setError("Informe um valor válido."); return; }

        setLoading(true);
        try {
            await receivePix({ sender: "Remetente Externo", amount });
            await refresh();
            setSuccess({ type: "receive", amount });
            toast.success("PIX recebido com sucesso!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSimulateQr = async () => {
        const value = parseFloat(qrForm.value);
        if (!value || value <= 0) { toast.error("Informe um valor válido."); return; }
        setLoading(true);
        try {
            await payQrCode({ value, description: qrForm.description || "Cobrança" });
            await refresh();
            setSuccess({ type: "receive", amount: value });
            toast.success("Pagamento simulado com sucesso!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="text-center animate-fade-in space-y-4 max-w-sm w-full">
                    <div className={`h-16 w-16 rounded-full ${success.type !== "send" ? "bg-success/20" : "bg-primary/20"} flex items-center justify-center mx-auto`}>
                        <CheckCircle className={`h-8 w-8 ${success.type !== "send" ? "text-success" : "text-primary"}`} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">
                            {success.type === "send" ? "PIX enviado!" : "PIX recebido!"}
                        </h2>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(success.amount)}</p>
                    </div>
                    <button onClick={() => navigate("/dashboard")} className="btn-primary">
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "send", label: "Enviar", icon: Send },
        { id: "receive", label: "Receber", icon: ArrowDownLeft },
        { id: "qrcode", label: "QR Code", icon: QrCode },
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
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-2xl font-bold">PIX</h1>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                        Saldo: {formatCurrency(balance)}
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex bg-muted/40 rounded-xl p-1 gap-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setTab(id); setError(""); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${tab === id ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* ── SEND ── */}
                {tab === "send" && (
                    <div className="glass-card p-5 sm:p-8 space-y-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Enviar PIX</h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Chave PIX</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input type="text" value={form.pixKey} onChange={(e) => updateForm(setForm)("pixKey", e.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Valor</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => updateForm(setForm)("amount", e.target.value)} placeholder="0,00" className="input-field" />
                                </div>
                            </div>
                            {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                {loading ? "Enviando..." : "Enviar PIX"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── RECEIVE ── */}
                {tab === "receive" && (
                    <div className="space-y-4">
                        <div className="glass-card p-5">
                            <h2 className="text-sm font-semibold mb-3">Minhas chaves PIX</h2>
                            <div className="space-y-2">
                                {myPixKeys.map((key) => (
                                    <div key={key} className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5">
                                        <span className="text-xs font-medium">{key}</span>
                                        <button onClick={() => handleCopy(key)} className="text-primary hover:text-primary/80 transition">
                                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-5 sm:p-8 space-y-4">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Simular recebimento</h2>
                            <form onSubmit={handleReceive} className="space-y-4">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Valor a receber</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input type="number" step="0.01" min="0.01" value={receiveForm.amount} onChange={(e) => updateForm(setReceiveForm)("amount", e.target.value)} placeholder="0,00" className="input-field" />
                                    </div>
                                </div>
                                {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDownLeft className="h-4 w-4" />}
                                    {loading ? "Processando..." : "Simular PIX recebido"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── QR CODE ── */}
                {tab === "qrcode" && (
                    <div className="glass-card p-5 sm:p-8 space-y-5">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Gerar QR Code</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Valor</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input type="number" step="0.01" min="0.01" value={qrForm.value} onChange={(e) => updateForm(setQrForm)("value", e.target.value)} placeholder="0,00" className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Descrição</label>
                                <input type="text" value={qrForm.description} onChange={(e) => updateForm(setQrForm)("description", e.target.value)} placeholder="Ex: Pagamento coffee" className="input-field" />
                            </div>
                        </div>

                        {qrForm.value && parseFloat(qrForm.value) > 0 && (
                            <div className="bg-muted/30 rounded-xl p-6 space-y-4 text-center animate-fade-in">
                                {/* Simulated QR */}
                                <div className="w-36 h-36 mx-auto bg-white rounded-xl flex items-center justify-center p-2">
                                    <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                                        {Array.from({ length: 49 }, (_, i) => (
                                            <div key={i} className={`rounded-[2px] ${[0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 29, 30, 31, 32, 33, 34, 41, 42, 43, 44, 45, 46, 47, 48].includes(i) ? "bg-black" : Math.floor(i / 7) > 0 && i % 7 > 0 && Math.floor(i / 7) < 6 && i % 7 < 6 ? (i % 3 === 0 ? "bg-black" : "bg-transparent") : "bg-transparent"}`} />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{qrForm.description || "Cobrança ALFA Bank"}</p>
                                    <p className="text-lg font-bold">{formatCurrency(parseFloat(qrForm.value))}</p>
                                </div>
                                <div className="relative">
                                    <p className="text-[10px] text-muted-foreground break-all bg-muted/60 rounded-lg p-3 pr-10 font-mono">
                                        {MOCK_PIX_CODE.slice(0, 60)}...
                                    </p>
                                    <button onClick={() => handleCopy(MOCK_PIX_CODE)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition">
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                                <button
                                    onClick={handleSimulateQr}
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl border border-success/30 bg-success/10 text-success text-sm font-semibold hover:bg-success/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "✓"}
                                    Simular pagamento deste QR Code
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Pix;
