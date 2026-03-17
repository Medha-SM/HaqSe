import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BlockchainAuditModalProps {
  open: boolean;
  onClose: () => void;
  documentHash?: string;
}

const STEPS = [
  { text: "Generating SHA-256 Document Hash...", duration: 1000 },
  { text: "Connecting to Web3 Node...", duration: 2000 },
  { text: "Minting Immutable Smart Contract...", duration: 2000 },
];

const MOCK_BLOCK = "18492011";
const MOCK_HASH = "0x8fB3c94E7a2D6F1bC08E3A9D5c7F2B4e6A8d0C1f3E5b7D9a1C3e5F7b9D1a142B";

const BlockchainAuditModal = ({ open, onClose, documentHash }: BlockchainAuditModalProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const txHash = documentHash || MOCK_HASH;
  const shortHash = `${txHash.slice(0, 8)}...${txHash.slice(-5)}`;

  const reset = useCallback(() => {
    setStepIndex(0);
    setLogs([]);
    setDone(false);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    let elapsed = 0;

    const runStep = (i: number) => {
      if (i >= STEPS.length) {
        setDone(true);
        return;
      }
      setStepIndex(i);
      setLogs((prev) => [...prev, `> ${STEPS[i].text}`]);
      elapsed += STEPS[i].duration;
      timeout = setTimeout(() => runStep(i + 1), STEPS[i].duration);
    };

    timeout = setTimeout(() => runStep(0), 300);
    return () => clearTimeout(timeout);
  }, [open, reset]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg border-border bg-card p-0 overflow-hidden">
        <div className="bg-[hsl(222,47%,6%)] text-[hsl(210,40%,92%)] p-6 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[hsl(210,40%,92%)] text-lg font-bold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {done ? "Verification Complete" : "Securing Document on Polygon Network..."}
            </DialogTitle>
          </DialogHeader>

          {/* Terminal */}
          <div className="mt-5 rounded-lg bg-[hsl(222,47%,4%)] border border-[hsl(217,33%,17%)] p-4 font-mono text-sm min-h-[120px]">
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[hsl(142,71%,45%)] leading-relaxed"
                >
                  {log}
                  {i === logs.length - 1 && !done && (
                    <span className="inline-block w-2 h-4 ml-1 bg-[hsl(142,71%,45%)] animate-pulse align-middle" />
                  )}
                </motion.p>
              ))}
            </AnimatePresence>

            {done && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[hsl(142,71%,45%)] mt-1 font-bold"
              >
                ✓ Transaction confirmed.
              </motion.p>
            )}
          </div>
        </div>

        {/* Success state */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-6 space-y-5"
            >
              {/* Checkmark */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="h-9 w-9 text-primary" />
                </motion.div>
              </div>

              <p className="text-center text-sm font-semibold text-foreground">
                Document integrity verified on-chain
              </p>

              {/* Data rows */}
              <div className="space-y-3">
                <DataRow
                  label="Block"
                  value={MOCK_BLOCK}
                  onCopy={() => copyToClipboard(MOCK_BLOCK, "Block number")}
                />
                <DataRow
                  label="TxHash"
                  value={shortHash}
                  fullValue={txHash}
                  onCopy={() => copyToClipboard(txHash, "Transaction hash")}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => {
                    onClose();
                    navigate("/blockchain-verification");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Block Explorer
                </Button>
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const DataRow = ({
  label,
  value,
  fullValue,
  onCopy,
}: {
  label: string;
  value: string;
  fullValue?: string;
  onCopy: () => void;
}) => (
  <div className="flex items-center justify-between rounded-md bg-muted px-4 py-2.5 font-mono text-sm">
    <span>
      <span className="text-muted-foreground mr-2">{label}:</span>
      <span className="text-foreground font-semibold" title={fullValue}>{value}</span>
    </span>
    <button onClick={onCopy} className="text-muted-foreground hover:text-foreground transition-colors">
      <Copy className="h-3.5 w-3.5" />
    </button>
  </div>
);

export default BlockchainAuditModal;
