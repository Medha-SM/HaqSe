import { motion } from "framer-motion";
import { Building2, Landmark, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DiscoveredAsset } from "@/lib/services/panScanner";

const ICONS: Record<string, typeof Building2> = {
  "State Bank of India": Landmark,
  SBI: Landmark,
  LIC: Building2,
  "Post Office": Mail,
};

interface AssetRecoveryMapProps {
  assets: DiscoveredAsset[];
  totalAmount: number;
  onStartClaim: () => void;
}

const formatAmount = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const AssetRecoveryMap = ({ assets, totalAmount, onStartClaim }: AssetRecoveryMapProps) => {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          Discovered Dormant Assets
        </h2>
        <p className="text-muted-foreground">Assets linked to the provided PAN across financial institutions</p>
      </motion.div>

      <div className="space-y-4">
        {assets.map((asset, i) => {
          const Icon = ICONS[asset.institution] ?? Building2;
          return (
            <motion.div
              key={`${asset.institution}-${asset.type}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
            >
              <Card className="border-border bg-surface hover:border-primary/30 transition-colors dark:bg-card">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{asset.institution}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                  <p className="text-lg font-extrabold text-foreground whitespace-nowrap">
                    {formatAmount(asset.amount)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border-2 border-primary bg-primary/5 p-6 text-center"
      >
        <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">Total Recoverable Assets</p>
        <p className="text-4xl font-extrabold text-foreground">{formatAmount(totalAmount)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          onClick={onStartClaim}
          className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          Start AI Legal Claim Process
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AssetRecoveryMap;
