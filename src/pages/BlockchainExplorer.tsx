import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MOCK_TX = "0x8fB3c94E7a2D6F1bC08E3A9D5c7F2B4e6A8d0C1f3E5b7D9a1C3e5F7b9D1a142B";
const MOCK_BLOCK = "18492011";

const DetailRow = ({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) => {
  const { toast } = useToast();
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground font-mono">{value}</span>
        {copyable && (
          <button
            onClick={() => { navigator.clipboard.writeText(value); toast({ title: `${label} copied` }); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

const BlockchainExplorer = () => {
  const navigate = useNavigate();
  const shortHash = `${MOCK_TX.slice(0, 10)}...${MOCK_TX.slice(-6)}`;

  return (
    <div className="min-h-screen bg-[hsl(222,47%,4%)] text-[hsl(210,40%,92%)]">
      {/* Header */}
      <header className="border-b border-[hsl(217,33%,17%)] bg-[hsl(222,47%,6%)]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-extrabold tracking-tight">HaqSe Web3 Audit Trail</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 border-[hsl(217,33%,17%)] text-[hsl(210,40%,92%)] hover:bg-[hsl(217,33%,14%)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl space-y-8">
        {/* Status banner */}
        <div className="flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/30 px-5 py-3">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-primary">Transaction Confirmed — Immutable Record</span>
        </div>

        {/* Transaction Details */}
        <Card className="bg-[hsl(222,47%,7%)] border-[hsl(217,33%,17%)] text-[hsl(210,40%,92%)]">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[hsl(210,40%,92%)]">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <DetailRow label="Status" value="✅ Success" />
            <DetailRow label="Block Height" value={MOCK_BLOCK} copyable />
            <DetailRow label="Network" value="Polygon PoS" />
            <DetailRow label="Document Hash" value={shortHash} copyable />
            <DetailRow label="Timestamp" value={new Date().toLocaleString("en-IN")} />
            <DetailRow label="Gas Used" value="42,391" />
            <DetailRow label="Confirmations" value="847" />
          </CardContent>
        </Card>

        {/* Raw hash */}
        <Card className="bg-[hsl(222,47%,7%)] border-[hsl(217,33%,17%)] text-[hsl(210,40%,92%)]">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[hsl(210,40%,92%)]">Full Transaction Hash</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block text-xs font-mono text-primary break-all bg-[hsl(222,47%,4%)] rounded-md p-4 border border-[hsl(217,33%,17%)]">
              {MOCK_TX}
            </code>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlockchainExplorer;
