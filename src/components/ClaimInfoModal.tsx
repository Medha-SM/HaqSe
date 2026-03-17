import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Clock, AlertTriangle } from "lucide-react";

interface ClaimInfoModalProps {
  open: boolean;
  onClose: () => void;
  claim: {
    id: string;
    claimant: string;
    bank: string;
    amount: number;
  } | null;
}

const CLAIM_DETAILS: Record<string, { status: string; note: string; icon: typeof Clock }> = {
  "HQ-2026-001": { status: "Under Review", note: "Documents received. Verification in progress with SBI branch office.", icon: Clock },
  "HQ-2026-002": { status: "Approved — Awaiting Disbursement", note: "All documents verified. Fund transfer initiated to nominee account.", icon: FileText },
  "HQ-2026-003": { status: "Rejected — Insufficient Documents", note: "Death certificate copy was illegible. Please resubmit notarized copy.", icon: AlertTriangle },
  "HQ-2026-004": { status: "Pending Manager Approval", note: "Claim exceeds ₹3,00,000 threshold. Requires branch manager sign-off.", icon: Clock },
  "HQ-2026-005": { status: "Awaiting Notarization", note: "Indemnity bond requires notary seal before processing can continue.", icon: FileText },
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ClaimInfoModal = ({ open, onClose, claim }: ClaimInfoModalProps) => {
  if (!claim) return null;

  const details = CLAIM_DETAILS[claim.id] ?? { status: "Processing", note: "No additional details available.", icon: Clock };
  const Icon = details.icon;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            Claim Details — {claim.id}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs font-medium">Claimant</p>
              <p className="font-semibold text-foreground">{claim.claimant}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Bank</p>
              <p className="font-semibold text-foreground">{claim.bank}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Amount</p>
              <p className="font-semibold text-foreground">{formatAmount(claim.amount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">Internal Status</p>
              <p className="font-semibold text-primary">{details.status}</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Processing Note</p>
            <p className="text-sm text-foreground">{details.note}</p>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimInfoModal;
