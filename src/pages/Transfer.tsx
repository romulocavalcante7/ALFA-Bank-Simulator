import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, User, Key, DollarSign, CheckCircle, Loader2 , Landmark } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { sendTransfer } from "@/services/bankService";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

const Transfer = () => {
  const navigate = useNavigate();
  const { balance, refresh } = useBank();
  const [type, setType] = useState<"pix" | "ted">("pix");
  const [form, setForm] = useState({ 
    recipient: "", 
    pixKey: "", 
    amount: "",
    bank: "",
    agency: "",
    account: ""
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(form.amount);
    
    if (type === "pix" && !form.pixKey.trim()) { setError("Informe a chave PIX ou e-mail."); return; }
    if (type === "ted" && !form.account.trim()) { setError("Informe os dados da conta."); return; }
    if (!amount || amount <= 0) { setError("Informe um valor válido."); return; }
    if (amount > balance) { setError("Saldo insuficiente para esta transferência."); return; }

    setLoading(true);
    try {
      const recipientStr = type === "pix" ? form.pixKey : form.account;
      await sendTransfer({ recipient: recipientStr, pixKey: recipientStr, amount });
      await refresh();
      setSent(amount);
      toast.success("Transferência enviada com sucesso!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center animate-fade-in space-y-4">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Transferência enviada!</h2>
            <p className="text-2xl font-bold text-destructive">- {formatCurrency(sent)}</p>
            <p className="text-sm text-muted-foreground mt-2">Para: {type === "pix" ? form.pixKey : form.account}</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Nome do destinatário", field: "recipient", type: "text", icon: User, placeholder: "Nome completo" },
    { label: "Chave PIX ou Email", field: "pixKey", type: "text", icon: Key, placeholder: "CPF, email ou chave aleatória" },
    { label: "Valor", field: "amount", type: "number", icon: DollarSign, placeholder: "0,00" },
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

      <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl sm:text-2xl font-bold">Transferir</h1>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
            Saldo: {formatCurrency(balance)}
          </span>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-border">
            <button 
              onClick={() => setType("pix")}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${type === "pix" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
            >
              PIX
            </button>
            <button 
              onClick={() => setType("ted")}
              className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${type === "ted" ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
            >
              Transferência
              <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-md uppercase tracking-wide">Novo</span>
            </button>
          </div>

          <div className="p-5 sm:p-8">
            <form onSubmit={handleSend} className="space-y-4">
              {type === "pix" ? (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Chave PIX ou Email</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.pixKey}
                      onChange={(e) => update("pixKey", e.target.value)}
                      placeholder="CPF, email ou chave aleatória"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Dados da conta (Banco, Agência, Conta)</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.account}
                      onChange={(e) => update("account", e.target.value)}
                      placeholder="Ex: 305 - Ag 0001 - Cc 12345-6"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Valor</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    placeholder="0,00"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
              
              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? "Processando..." : `Transferir (${type.toUpperCase()})`}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transfer;
