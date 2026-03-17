import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_ASSET, SCAN_LOADING_TEXTS } from "@/lib/mockData";
import { scanDatabases, type ScanResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

type Phase = "input" | "loading" | "result";

interface ScanCardProps {
  onStartRecovery?: (data: { panNumber: string; scanResult: ScanResult }) => void;
}

const ScanCard = ({ onStartRecovery }: ScanCardProps) => {
  const [phase, setPhase] = useState<Phase>("input");
  const [panValue, setPanValue] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Cycle loading texts while in loading phase
  useEffect(() => {
    if (phase !== "loading") return;
    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => Math.min(prev + 1, SCAN_LOADING_TEXTS.length - 1));
    }, 1000);
    return () => clearInterval(textInterval);
  }, [phase]);

  // Fire confetti when match found
  useEffect(() => {
    if (phase !== "result") return;
    const duration = 800;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#0d9488", "#059669", "#10b981", "#fbbf24", "#3b82f6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#0d9488", "#059669", "#10b981", "#fbbf24", "#3b82f6"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [phase]);

  const handleScan = async () => {
    if (!panValue.trim()) return;
    setLoadingTextIndex(0);
    setPhase("loading");

    try {
      abortRef.current = new AbortController();
      const result = await scanDatabases(panValue.trim());
      setScanResult(result);
    } catch {
      // Silently fall back to mock data
      setScanResult({
        asset_name: MOCK_ASSET.bankName,
        bank_name: MOCK_ASSET.bankName,
        asset_type: MOCK_ASSET.assetType,
        status: MOCK_ASSET.status,
        amount: MOCK_ASSET.amount,
      });
    } finally {
      setPhase("result");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-border bg-surface dark:bg-card">
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              <Input
                placeholder="Enter Deceased's PAN Number"
                value={panValue}
                onChange={(e) => setPanValue(e.target.value.toUpperCase())}
                className="h-14 text-base tracking-widest font-medium bg-background border-input placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-normal"
                maxLength={10}
              />
              <Button
                size="lg"
                onClick={handleScan}
                className="h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Search className="h-5 w-5" />
                Scan National Databases (UDGAM)
              </Button>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 text-center">
                Note: Please enter the PAN ID as ABCDE1234F as only this works for our current DEMO Model.
              </p>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-6 py-6"
            >
              <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin-slow" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingTextIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {SCAN_LOADING_TEXTS[loadingTextIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="rounded-xl border-2 border-primary bg-background w-full p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <span className="text-sm font-extrabold tracking-widest text-primary uppercase">
                    Match Found
                  </span>
                </div>

                <p className="text-center text-3xl font-extrabold text-accent mb-1">
                  {scanResult?.amount ?? MOCK_ASSET.amount}
                </p>
                <p className="text-center text-sm text-muted-foreground leading-relaxed">
                  found in <span className="font-semibold text-foreground">{scanResult?.bank_name ?? MOCK_ASSET.bankName}</span>
                  <br />
                  {scanResult?.asset_type ?? MOCK_ASSET.assetType} ({scanResult?.status ?? MOCK_ASSET.status})
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => onStartRecovery?.({ panNumber: panValue, scanResult: scanResult! })}
                className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                Start Legal Recovery Process
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ScanCard;
