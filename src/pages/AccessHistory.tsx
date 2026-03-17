import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Smartphone, Monitor, Globe, MapPin, Clock , Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessHistory } from "@/services/bankService";
import { formatDate } from "@/utils/format";
import type { AccessEvent } from "@/services/database";

const AccessHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<AccessEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAccessHistory();
        setHistory(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="text-muted-foreground hover:text-foreground transition p-1">
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

      <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h1 className="text-xl sm:text-2xl font-bold">Histórico de Acesso</h1>
                <p className="text-xs text-muted-foreground">Monitore os acessos recentes à sua conta</p>
            </div>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4">
                  <div className="h-10 w-10 rounded-lg bg-muted/50 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
                    <div className="h-2.5 bg-muted/30 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Nenhum registro encontrado.</p>
          ) : (
            <div className="divide-y divide-border">
              {history.map((event) => (
                <div key={event.id} className="p-4 sm:p-5 hover:bg-muted/30 transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            {event.device.toLowerCase().includes("mobile") ? (
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Monitor className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{event.device}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Globe className="h-3 w-3" /> {event.browser} • {event.ip}
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                        Ativo
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <div className="space-y-1">
                <p className="text-sm font-semibold">Segurança da conta</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Se você não reconhece algum destes acessos, recomendamos que altere sua senha imediatamente e entre em contato com nosso suporte.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AccessHistory;
