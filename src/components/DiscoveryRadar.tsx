import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

const SCAN_STEPS = [
  "Connecting to RBI UDGAM registry...",
  "Scanning dormant bank accounts...",
  "Checking insurance registries...",
  "Cross-referencing PAN records...",
  "Analyzing matches...",
];

interface DiscoveryRadarProps {
  onComplete: () => void;
  assetCount: number;
  totalAmount: number;
}

const DiscoveryRadar = ({ onComplete, assetCount, totalAmount }: DiscoveryRadarProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (stepIndex < SCAN_STEPS.length) {
      const timer = setTimeout(() => setStepIndex((p) => p + 1), 1200);
      return () => clearTimeout(timer);
    }
    setDone(true);
  }, [stepIndex, done]);

  useEffect(() => {
    if (!done) return;
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#0d9488", "#059669", "#10b981", "#fbbf24"] });
  }, [done]);

  const formatAmount = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col items-center gap-8 py-12 max-w-lg mx-auto">
      {/* Radar animation */}
      <div className="relative h-48 w-48 flex items-center justify-center">
        {!done && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.4 }}
            />
          </>
        )}
        <motion.div
          className="relative z-10 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"
          animate={done ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {done ? (
            <CheckCircle2 className="h-10 w-10 text-primary" />
          ) : (
            <Radio className="h-10 w-10 text-primary animate-pulse" />
          )}
        </motion.div>
      </div>

      {/* Steps */}
      <div className="w-full space-y-2 min-h-[180px]">
        <AnimatePresence>
          {SCAN_STEPS.slice(0, stepIndex).map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-muted-foreground">{step}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {!done && stepIndex < SCAN_STEPS.length && (
          <motion.div
            key="current"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-sm"
          >
            <div className="h-4 w-4 rounded-full border-2 border-muted border-t-primary animate-spin-slow shrink-0" />
            <span className="text-foreground font-medium">{SCAN_STEPS[stepIndex]}</span>
          </motion.div>
        )}
      </div>

      {/* Result */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center space-y-4"
        >
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-6">
            <p className="text-xs font-extrabold tracking-widest text-primary uppercase mb-2">
              {assetCount} Asset{assetCount > 1 ? "s" : ""} Found
            </p>
            <p className="text-3xl font-extrabold text-foreground">{formatAmount(totalAmount)}</p>
            <p className="text-sm text-muted-foreground mt-1">Total recoverable across institutions</p>
          </div>
          <Button
            size="lg"
            onClick={onComplete}
            className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View Discovered Assets
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DiscoveryRadar;
