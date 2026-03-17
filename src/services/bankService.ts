// ============================================================
// ALFA Bank – bankService
// Simulates async API calls backed by the local database.
// Swap the internals for real fetch() calls when adding a backend.
// ============================================================

import {
    loadDatabase,
    saveDatabase,
    generateId,
    type Transaction,
    type Card,
    type AccessEvent,
} from "./database";

// ── helpers ─────────────────────────────────────────────────

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ── Access History ──────────────────────────────────────────

export async function getAccessHistory(): Promise<AccessEvent[]> {
    await delay();
    return loadDatabase().accessHistory;
}

export async function recordAccess(): Promise<void> {
    const db = loadDatabase();
    // Simulate detecting device/ip
    const newAccess: AccessEvent = {
        id: generateId(),
        date: new Date().toISOString(),
        device: window.innerWidth < 768 ? "Mobile Device" : "Desktop Browser",
        browser: navigator.userAgent.includes("Chrome") ? "Chrome" : "Safari",
        location: "São Paulo, BR",
        ip: "189.121." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255)
    };
    db.accessHistory = [newAccess, ...db.accessHistory].slice(0, 10);
    saveDatabase(db);
}

// ── Balance ─────────────────────────────────────────────────

export async function getBalance(): Promise<number> {
    await delay();
    return loadDatabase().balance;
}

// ── Transactions ─────────────────────────────────────────────

export async function getTransactions(): Promise<Transaction[]> {
    await delay();
    return loadDatabase().transactions;
}

function addTransaction(tx: Omit<Transaction, "id" | "date" | "status">): Transaction {
    const db = loadDatabase();
    const newTx: Transaction = {
        ...tx,
        id: generateId(),
        date: new Date().toISOString(),
        status: "completed",
    };
    db.transactions = [newTx, ...db.transactions];
    db.balance += tx.amount;
    saveDatabase(db);
    return newTx;
}

// ── PIX ─────────────────────────────────────────────────────

export async function sendPix(data: {
    recipient: string;
    pixKey: string;
    amount: number;
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(600);
    const db = loadDatabase();

    if (data.amount <= 0) throw new Error("Valor inválido.");
    if (data.amount > db.balance) throw new Error("Saldo insuficiente.");

    const tx = addTransaction({
        type: "pix_sent",
        description: `PIX enviado · ${data.recipient}`,
        amount: -data.amount,
    });

    return { success: true, transaction: tx };
}

export async function receivePix(data: {
    sender: string;
    amount: number;
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(600);
    if (data.amount <= 0) throw new Error("Valor inválido.");

    const tx = addTransaction({
        type: "pix_received",
        description: `PIX recebido · ${data.sender}`,
        amount: data.amount,
    });

    return { success: true, transaction: tx };
}

// ── QR Code payment ─────────────────────────────────────────

export async function payQrCode(data: {
    value: number;
    description: string;
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(500);
    if (data.value <= 0) throw new Error("Valor inválido.");

    const tx = addTransaction({
        type: "pix_received",
        description: `QR Code recebido · ${data.description}`,
        amount: data.value,
    });

    return { success: true, transaction: tx };
}

// ── Boleto payment ───────────────────────────────────────────

export async function payBoleto(data: {
    code: string;
    description: string;
    amount: number;
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(700);
    const db = loadDatabase();

    if (data.amount <= 0) throw new Error("Valor inválido.");
    if (data.amount > db.balance) throw new Error("Saldo insuficiente.");

    const tx = addTransaction({
        type: "boleto",
        description: `Boleto pago · ${data.description || data.code.slice(0, 20)}`,
        amount: -data.amount,
    });

    return { success: true, transaction: tx };
}

// ── Transfer ─────────────────────────────────────────────────

export async function sendTransfer(data: {
    recipient: string;
    pixKey: string;
    amount: number;
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(700);
    const db = loadDatabase();

    if (data.amount <= 0) throw new Error("Valor inválido.");
    if (data.amount > db.balance) throw new Error("Saldo insuficiente.");

    const tx = addTransaction({
        type: "transfer",
        description: `Transferência enviada · ${data.recipient}`,
        amount: -data.amount,
    });

    return { success: true, transaction: tx };
}

// ── Deposit (simulate receiving) ─────────────────────────────

export async function simulateDeposit(data: {
    amount: number;
    method: "pix" | "boleto" | "dados";
}): Promise<{ success: boolean; transaction: Transaction }> {
    await delay(500);
    if (data.amount <= 0) throw new Error("Valor inválido.");

    const tx = addTransaction({
        type: "deposit",
        description: `Depósito via ${data.method === "pix" ? "PIX" : "Boleto"}`,
        amount: data.amount,
    });

    return { success: true, transaction: tx };
}

// ── Cards ────────────────────────────────────────────────────

export async function getCards(): Promise<Card[]> {
    await delay();
    return loadDatabase().cards;
}

export async function toggleCardBlock(cardId: string): Promise<Card> {
    await delay(400);
    const db = loadDatabase();
    const card = db.cards.find((c) => c.id === cardId);
    if (!card) throw new Error("Cartão não encontrado.");
    card.blocked = !card.blocked;
    saveDatabase(db);
    return card;
}

// ── PIX keys ─────────────────────────────────────────────────

export async function getPixKeys() {
    await delay();
    return loadDatabase().pixKeys;
}

// ── User ─────────────────────────────────────────────────────

export async function getUser() {
    await delay();
    return loadDatabase().user;
}
