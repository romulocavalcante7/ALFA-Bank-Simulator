import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Download, Receipt, Filter , Landmark } from "lucide-react";
import { useState } from "react";
import { useBank } from "@/context/BankContext";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Transaction } from "@/services/database";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const statusLabel = (status: Transaction["status"]) => {
  const map = {
    completed: { label: "Concluído", cls: "bg-success/10 text-success" },
    pending: { label: "Pendente", cls: "bg-warning/10 text-warning" },
    failed: { label: "Falhou", cls: "bg-destructive/10 text-destructive" },
  };
  const s = map[status];
  return <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>;
};

const TYPE_LABELS: Record<string, string> = {
  all: "Todas",
  pix_received: "PIX recebido",
  pix_sent: "PIX enviado",
  deposit: "Depósito",
  payment: "Pagamento",
  boleto: "Boleto",
  transfer: "Transferência",
};

const Transactions = () => {
  const navigate = useNavigate();
  const { user, balance, transactions, loading } = useBank();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Primary Brand Color
    const primaryColor = [16, 185, 129]; // Emerald (Success/Primary in the theme)

    // Header
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text("ALFA Bank", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Extrato Bancário Detalhado", 14, 28);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - 14, 28, { align: "right" });

    // User Info Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(249, 249, 249);
    doc.rect(14, 35, pageWidth - 28, 25, "F");
    
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("TITULAR", 18, 42);
    doc.text("CPF", 80, 42);
    doc.text("SALDO ATUAL", pageWidth - 18, 42, { align: "right" });
    
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text(user?.name || "---", 18, 48);
    doc.text(user?.cpf || "---", 80, 48);
    doc.setFont(undefined, "bold");
    doc.text(formatCurrency(balance), pageWidth - 18, 48, { align: "right" });
    doc.setFont(undefined, "normal");

    // Table
    const tableData = filtered.map((tx) => [
      formatDate(tx.date),
      tx.description,
      TYPE_LABELS[tx.type] || tx.type,
      tx.amount >= 0 ? `+ ${formatCurrency(tx.amount)}` : formatCurrency(tx.amount),
      tx.status === "completed" ? "Concluído" : tx.status === "pending" ? "Pendente" : "Falhou"
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Data", "Descrição", "Tipo", "Valor", "Status"]],
      body: tableData,
      headStyles: { 
        fillColor: [30, 41, 59], // Slate 800
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "left"
      },
      bodyStyles: { 
        fontSize: 9,
        textColor: [50, 50, 50]
      },
      columnStyles: {
        3: { halign: "right", fontStyle: "bold" },
        4: { halign: "center" }
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { top: 70 },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
           const val = data.cell.text[0];
           if (val.startsWith("+")) {
             data.cell.styles.textColor = [5, 150, 105]; // Success Emerald
           } else {
             data.cell.styles.textColor = [220, 38, 38]; // Destructive Red
           }
        }
      }
    });

    // Footer
    const totalTransactions = filtered.length;
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Total de transações: ${totalTransactions}`, 14, finalY);
    doc.text("Documento gerado eletronicamente pelo app ALFA Bank.", pageWidth / 2, pageWidth === 210 ? 285 : 285, { align: "center" });

    doc.save(`extrato-ngb-bank-${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
            <span className="text-[8px] font-bold text-blue-500 bg-blue-500/10 px-1 py-0.5 rounded uppercase tracking-wide ml-1">Novo</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">Extrato</h1>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 mt-1.5" />
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${filter === key ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="h-9 w-9 rounded-lg bg-muted/50 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-40" />
                    <div className="h-2.5 bg-muted/30 rounded animate-pulse w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Nenhuma transação encontrada.</p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {transactionIcon(tx.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 ml-3 shrink-0">
                    <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${tx.amount >= 0 ? "text-success" : "text-destructive"}`}>
                      {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                    </span>
                    {statusLabel(tx.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {!loading && filtered.length > 0 && (
          <div className="glass-card p-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Entradas</p>
              <p className="text-sm font-bold text-success">
                + {formatCurrency(filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Saídas</p>
              <p className="text-sm font-bold text-destructive">
                - {formatCurrency(Math.abs(filtered.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)))}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Transações</p>
              <p className="text-sm font-bold">{filtered.length}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transactions;
