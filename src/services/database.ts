// ============================================================
// ALFA Bank - Mini Database (LocalStorage-backed)
// Structured for easy replacement with a real backend/API
// ============================================================

export interface AccessEvent {
    id: string;
    date: string;
    device: string;
    browser: string;
    location: string;
    ip: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    cpf: string;
    avatarUrl?: string;
}

export interface Transaction {
    id: string;
    type: "pix_received" | "pix_sent" | "deposit" | "payment" | "transfer" | "boleto";
    description: string;
    amount: number; // positive = credit, negative = debit
    date: string;
    status: "completed" | "pending" | "failed";
}

export interface Card {
    id: string;
    number: string;
    holder: string;
    expiry: string;
    cvv: string;
    blocked: boolean;
    limit: number;
}

export interface PixKey {
    id: string;
    type: "cpf" | "email" | "phone" | "random";
    value: string;
}

export interface Database {
    user: User;
    balance: number;
    transactions: Transaction[];
    cards: Card[];
    pixKeys: PixKey[];
    accessHistory: AccessEvent[];
}

// ── Default seed data ──────────────────────────────────────

const DEFAULT_DB: Database = {
    user: {
        id: "usr-001",
        name: "João Silva",
        email: "joao.silva@email.com",
        phone: "(11) 99999-8888",
        address: "São Paulo, SP",
        cpf: "123.456.789-00",
    },
    balance: 12540.0,
    accessHistory: [
        {
            id: "acc-1",
            date: new Date().toISOString(),
            device: "iPhone 15 Pro",
            browser: "Safari",
            location: "São Paulo, BR",
            ip: "189.121.45.102"
        },
        {
            id: "acc-2",
            date: new Date(Date.now() - 86400000).toISOString(),
            device: "MacBook Pro",
            browser: "Chrome",
            location: "Osasco, BR",
            ip: "187.56.12.89"
        }
    ],
    transactions: [
        {
            id: "t1",
            type: "pix_received",
            description: "PIX recebido · Maria Santos",
            amount: 1500.0,
            date: new Date("2026-03-06").toISOString(),
            status: "completed",
        },
        {
            id: "t2",
            type: "pix_sent",
            description: "PIX enviado · Pedro Lima",
            amount: -350.0,
            date: new Date("2026-03-05").toISOString(),
            status: "completed",
        },
        {
            id: "t3",
            type: "deposit",
            description: "Depósito via boleto",
            amount: 2000.0,
            date: new Date("2026-03-04").toISOString(),
            status: "completed",
        },
        {
            id: "t4",
            type: "payment",
            description: "Pagamento · Conta de luz",
            amount: -189.5,
            date: new Date("2026-03-03").toISOString(),
            status: "completed",
        },
        {
            id: "t5",
            type: "pix_received",
            description: "PIX recebido · Ana Costa",
            amount: 750.0,
            date: new Date("2026-03-02").toISOString(),
            status: "completed",
        },
        {
            id: "t6",
            type: "transfer",
            description: "Transferência enviada · Carlos Souza",
            amount: -1200.0,
            date: new Date("2026-03-01").toISOString(),
            status: "completed",
        },
        {
            id: "t7",
            type: "payment",
            description: "Pagamento · Internet banda larga",
            amount: -99.9,
            date: new Date("2026-02-28").toISOString(),
            status: "completed",
        },
        {
            id: "t8",
            type: "deposit",
            description: "Depósito em conta",
            amount: 5000.0,
            date: new Date("2026-02-27").toISOString(),
            status: "completed",
        },
    ],
    cards: [
        {
            id: "card-001",
            number: "5374 •••• •••• 4892",
            holder: "JOAO SILVA",
            expiry: "09/29",
            cvv: "•••",
            blocked: false,
            limit: 8000,
        },
    ],
    pixKeys: [
        { id: "pix-1", type: "cpf", value: "123.456.789-00" },
        { id: "pix-2", type: "email", value: "joao.silva@email.com" },
        { id: "pix-3", type: "phone", value: "(11) 99999-8888" },
    ],
};

const STORAGE_KEY = "ngb_bank_db";

// ── Persistence helpers ────────────────────────────────────

export function loadDatabase(): Database {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Database;
    } catch {
        // corrupted data – fall through to seed
    }
    saveDatabase(DEFAULT_DB);
    return DEFAULT_DB;
}

export function saveDatabase(db: Database): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDatabase(): void {
    saveDatabase(DEFAULT_DB);
}

// ── Utility ────────────────────────────────────────────────

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
