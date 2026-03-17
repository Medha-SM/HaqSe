import { Briefcase, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useClaim } from "@/context/ClaimContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const AssetSummary = () => {
  const { discoveredAssets, totalRecoverable } = useClaim();

  return (
    <div className="lg:sticky lg:top-24">
      <Card className="border-border bg-surface shadow-lg">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-extrabold text-accent uppercase tracking-wider">
              Total Dormant Assets
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Assets</p>
              <p className="text-sm font-bold text-foreground">
                Across {discoveredAssets.length} institution{discoveredAssets.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Amount</p>
              <p className="text-2xl font-extrabold text-accent">{fmt(totalRecoverable)}</p>
            </div>
            {discoveredAssets.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Breakdown</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {discoveredAssets.map((a, i) => (
                    <span key={i}>
                      {i > 0 && " • "}
                      {a.institution} {fmt(a.amount)}
                    </span>
                  ))}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  Drafting Legal Docket
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetSummary;
