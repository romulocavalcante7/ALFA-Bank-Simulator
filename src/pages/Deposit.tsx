import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, QrCode, Barcode, Copy, Check, Loader2, RefreshCw , Landmark } from "lucide-react";
import { useBank } from "@/context/BankContext";
import { simulateDeposit } from "@/services/bankService";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

const mockPixCode = "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-1234567890ab5204000053039865802BR5925ALFA BANK SA6009SAO PAULO62140510ngb1234567";
const mockBoletoCode = "23793.38128 60000.000003 00000.000400 1 84340000012540";

const Deposit = () => {
  const navigate = useNavigate();
  const { user, balance, refresh } = useBank();
  const [method, setMethod] = useState<"pix" | "boleto" | "dados" | null>(null);
  const [amount, setAmount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [credited, setCredited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const methods = [
    { id: "pix" as const, label: "PIX", desc: "Instantâneo, 24h", icon: QrCode, glow: "glow-primary", isNew: false },
    { id: "boleto" as const, label: "Boleto", desc: "1-3 dias úteis", icon: Barcode, glow: "", isNew: false },
    { id: "dados" as const, label: "Dados bancários", desc: "Receber de outros", icon: Download, glow: "", isNew: true },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError("Informe um valor válido."); return; }
    setGenerated(true);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSimulate = async () => {
    if (!method) return;
    setSimulating(true);
    try {
      await simulateDeposit({ amount: parseFloat(amount), method });
      await refresh();
      setCredited(true);
      toast.success(`Depósito de ${formatCurrency(parseFloat(amount))} creditado!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSimulating(false);
    }
  };

  if (credited) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center animate-fade-in space-y-4">
          <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Depósito creditado!</h2>
            <p className="text-2xl font-bold text-success">+ {formatCurrency(parseFloat(amount))}</p>
          </div>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">Voltar ao início</button>
        </div>
      </div>
    );
  }

  if (generated) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => { setGenerated(false); }} className="text-muted-foreground hover:text-foreground transition p-1">
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
          <div className="glass-card p-6 sm:p-8 text-center space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">
                {method === "pix" ? "QR Code para pagamento" : "Boleto gerado"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Valor: <span className="font-semibold text-foreground">{formatCurrency(parseFloat(amount))}</span>
              </p>
            </div>

            {method === "pix" && (
              <div className="bg-muted/40 rounded-xl p-6 space-y-4">
                <div className="w-40 h-40 mx-auto bg-foreground rounded-xl flex items-center justify-center">
                  <QrCode className="h-20 w-20 text-background" />
                </div>
                <div className="relative">
                  <p className="text-[10px] sm:text-xs text-muted-foreground break-all bg-muted/60 rounded-lg p-3 pr-10 font-mono">
                    {mockPixCode.slice(0, 60)}...
                  </p>
                  <button onClick={() => handleCopy(mockPixCode)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {method === "boleto" && (
              <div className="bg-muted/40 rounded-xl p-6 space-y-4">
                <Barcode className="h-16 w-full text-muted-foreground" />
                <div className="relative">
                  <p className="text-[10px] sm:text-xs text-muted-foreground break-all bg-muted/60 rounded-lg p-3 pr-10 font-mono tracking-wider">
                    {mockBoletoCode}
                  </p>
                  <button onClick={() => handleCopy(mockBoletoCode)} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Simulate payment button */}
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full py-3 rounded-xl border border-success/30 bg-success/10 text-success text-sm font-semibold hover:bg-success/20 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {simulating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {simulating ? "Creditando..." : "Simular pagamento recebido"}
            </button>

            <button onClick={() => navigate("/dashboard")} className="w-full text-sm text-muted-foreground hover:text-foreground transition py-2">
              Voltar sem confirmar
            </button>
          </div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-xl sm:text-2xl font-bold">Depositar</h1>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
            Saldo: {formatCurrency(balance)}
          </span>
        </div>

        {!method && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Escolha o método de depósito:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {methods.map(({ id, label, desc, icon: Icon, glow, isNew }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`glass-card p-5 sm:p-6 flex flex-col items-center gap-3 hover:border-primary/30 transition-all active:scale-[0.97] ${glow} relative overflow-hidden`}
                >
                  {isNew && (
                     <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wide">
                        Novo
                     </div>
                  )}
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
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

        {method === "dados" && (
          <div className="glass-card p-5 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setMethod(null)} className="text-muted-foreground hover:text-foreground transition">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-sm font-semibold">Meus dados bancários</h2>
            </div>
            
            <div className="divide-y divide-border">
              {[
                { label: "Banco", value: "305 - ALFA Bank S.A." },
                { label: "Agência", value: "0001" },
                { label: "Conta", value: "125489-0" },
                { label: "Nome", value: user?.name },
                { label: "CPF", value: user?.cpf },
              ].map((item) => (
                <div key={item.label} className="py-4 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                  <button onClick={() => handleCopy(item.value || "")} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use esses dados para receber transferências TED ou DOC de outros bancos em sua conta ALFA Bank.
              </p>
            </div>
          </div>
        )}

        {method && method !== "dados" && (
          <div className="glass-card p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <button onClick={() => setMethod(null)} className="text-muted-foreground hover:text-foreground transition">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-sm font-semibold">
                Depósito via {method === "pix" ? "PIX" : "Boleto"}
              </h2>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Valor do depósito</label>
                <div className="relative">
                  <Download className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="input-field"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" className="btn-primary">
                <Download className="h-4 w-4" />
                Gerar {method === "pix" ? "QR Code" : "Boleto"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Deposit;
