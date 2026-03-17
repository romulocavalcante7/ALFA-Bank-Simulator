import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Barcode, Zap, FileText, CheckCircle, DollarSign, Loader2 , Landmark } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { payBoleto } from "@/services/bankService";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

type PaymentType = "boleto" | "utility" | null;

const Payment = () => {
  const navigate = useNavigate();
  const { balance, refresh } = useBank();
  const [paymentType, setPaymentType] = useState<PaymentType>(null);
  const [form, setForm] = useState({ code: "", description: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState<number | null>(null);
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(form.amount);
    if (!form.code.trim()) { setError("Informe o código de barras."); return; }
    if (!amount || amount <= 0) { setError("Informe um valor válido."); return; }
    if (amount > balance) { setError("Saldo insuficiente para este pagamento."); return; }

    setLoading(true);
    try {
      await payBoleto({ code: form.code, description: form.description || (paymentType === "utility" ? "Conta de consumo" : "Boleto"), amount });
      await refresh();
      setPaid(amount);
      toast.success("Pagamento realizado com sucesso!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: "boleto" as const, label: "Boleto", desc: "Código de barras", icon: Barcode },
    { id: "utility" as const, label: "Conta de consumo", desc: "Luz, água, gás", icon: Zap },
  ];

  if (paid !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center animate-fade-in space-y-4">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Pagamento realizado!</h2>
            <p className="text-2xl font-bold text-destructive">- {formatCurrency(paid)}</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">Voltar ao início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => paymentType ? setPaymentType(null) : navigate("/dashboard")} className="text-muted-foreground hover:text-foreground transition p-1">
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
          <h1 className="text-xl sm:text-2xl font-bold">Pagar</h1>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
            Saldo: {formatCurrency(balance)}
          </span>
        </div>

        {!paymentType && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Escolha o tipo de pagamento:</p>
            <div className="grid grid-cols-2 gap-3">
              {types.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentType(id)}
                  className="glass-card p-5 sm:p-6 flex flex-col items-center gap-3 hover:border-primary/30 transition-all active:scale-[0.97]"
                >
                  <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-warning" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {paymentType && (
          <div className="glass-card p-5 sm:p-8">
            <h2 className="text-sm font-semibold mb-5">
              {paymentType === "boleto" ? "Pagar boleto" : "Pagar conta de consumo"}
            </h2>
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                  {paymentType === "boleto" ? "Código de barras" : "Código da conta"}
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => update("code", e.target.value)}
                    placeholder="Cole ou digite o código"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Descrição (opcional)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder={paymentType === "utility" ? "Ex: Conta de luz março" : "Ex: Aluguel"}
                    className="input-field"
                  />
                </div>
              </div>
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
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {loading ? "Processando..." : "Pagar agora"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;
