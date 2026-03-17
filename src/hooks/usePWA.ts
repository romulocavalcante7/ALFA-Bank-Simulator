import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
    const [isMobile, setIsMobile] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isInstallable, setIsInstallable] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(() =>
        localStorage.getItem("pwa_dismissed") === "true"
    );

    useEffect(() => {
        const ua = navigator.userAgent;
        const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
        const ios = /iPhone|iPad|iPod/i.test(ua) && !(window as any).MSStream;

        // Detecta se já está rodando como PWA (instalado)
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as any).standalone === true;

        setIsMobile(mobile);
        setIsIos(ios);
        setIsStandalone(standalone);

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") setIsInstallable(false);
        setDeferredPrompt(null);
    };

    const dismiss = () => {
        setDismissed(true);
        localStorage.setItem("pwa_dismissed", "true");
    };

    // Mostra banner se: é mobile E não descartou E NÃO ESTEJA INSTALADO E (Android com prompt OU iOS)
    const showBanner = isMobile && !dismissed && !isStandalone && (isInstallable || isIos);

    return { isMobile, isIos, isStandalone, isInstallable, showBanner, install, dismiss };
}
