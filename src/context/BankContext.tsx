// ============================================================
// ALFA Bank – BankContext
// Global state: user, balance, transactions, cards.
// All pages read from here; operations call bankService.
// ============================================================

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import {
    getBalance,
    getTransactions,
    getCards,
    getUser,
} from "@/services/bankService";
import { loadDatabase } from "@/services/database";
import type { Transaction, Card, User } from "@/services/database";

// ── Context shape ────────────────────────────────────────────

interface BankContextType {
    user: User | null;
    balance: number;
    transactions: Transaction[];
    cards: Card[];
    loading: boolean;
    refresh: () => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────

export function BankProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        // Re-read synchronously from the LocalStorage DB so the UI
        // updates instantly after any bankService mutation.
        const db = loadDatabase();
        setBalance(db.balance);
        setTransactions(db.transactions);
        setCards(db.cards);
        setUser(db.user);
    }, []);

    // Initial async load
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [u, b, txs, cds] = await Promise.all([
                    getUser(),
                    getBalance(),
                    getTransactions(),
                    getCards(),
                ]);
                setUser(u);
                setBalance(b);
                setTransactions(txs);
                setCards(cds);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <BankContext.Provider value={{ user, balance, transactions, cards, loading, refresh }}>
            {children}
        </BankContext.Provider>
    );
}

// ── Hook ─────────────────────────────────────────────────────

export function useBank() {
    const ctx = useContext(BankContext);
    if (!ctx) throw new Error("useBank must be used inside <BankProvider>");
    return ctx;
}
