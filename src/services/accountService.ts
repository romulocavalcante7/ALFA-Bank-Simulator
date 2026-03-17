// Mock data layer - structured for easy replacement with real API calls

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  type: "pix_received" | "pix_sent" | "deposit" | "payment" | "transfer";
  description: string;
  amount: number; // positive = credit, negative = debit
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface AccountData {
  balance: number;
  user: User;
  transactions: Transaction[];
}

// Mock user
export const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao@email.com",
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "pix_received",
    description: "PIX recebido - Maria Santos",
    amount: 1500.0,
    date: "2026-03-06",
    status: "completed",
  },
  {
    id: "t2",
    type: "pix_sent",
    description: "PIX enviado - Pedro Lima",
    amount: -350.0,
    date: "2026-03-05",
    status: "completed",
  },
  {
    id: "t3",
    type: "deposit",
    description: "Depósito via boleto",
    amount: 2000.0,
    date: "2026-03-04",
    status: "completed",
  },
  {
    id: "t4",
    type: "payment",
    description: "Pagamento - Conta de luz",
    amount: -189.5,
    date: "2026-03-03",
    status: "completed",
  },
  {
    id: "t5",
    type: "pix_received",
    description: "PIX recebido - Ana Costa",
    amount: 750.0,
    date: "2026-03-02",
    status: "completed",
  },
  {
    id: "t6",
    type: "transfer",
    description: "Transferência enviada - Carlos Souza",
    amount: -1200.0,
    date: "2026-03-01",
    status: "completed",
  },
  {
    id: "t7",
    type: "payment",
    description: "Pagamento - Internet",
    amount: -99.9,
    date: "2026-02-28",
    status: "pending",
  },
  {
    id: "t8",
    type: "deposit",
    description: "Depósito em conta",
    amount: 5000.0,
    date: "2026-02-27",
    status: "completed",
  },
];

export const mockBalance = 12540.0;

// Service functions - replace internals with API calls later
export const accountService = {
  getBalance: async (): Promise<number> => {
    return mockBalance;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return mockTransactions;
  },

  getUser: async (): Promise<User> => {
    return mockUser;
  },

  sendTransfer: async (data: {
    recipient: string;
    pixKey: string;
    amount: number;
  }): Promise<{ success: boolean }> => {
    console.log("Transfer sent:", data);
    return { success: true };
  },
};
