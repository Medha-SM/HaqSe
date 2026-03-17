import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Banknote, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalAssistantChat from "@/components/LegalAssistantChat";
import AssetSummary from "@/components/AssetSummary";
import ResolutionView from "@/components/ResolutionView";
import { useClaim } from "@/context/ClaimContext";
import { generateClaimDocuments } from "@/lib/services/claimGenerator";
import { useNavigate } from "react-router-dom";

type FlowStep = "breakdown" | "chat" | "resolution";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const ICON_MAP: Record<string, typeof Building2> = {
  "Fixed Deposit": Banknote,
  "Insurance Policy": FileText,
  "Savings Account": Building2,
};

const DiscoverPage = () => {
  const [step, setStep] = useState<FlowStep>("breakdown");
  const ctx = useClaim();
  const navigate = useNavigate();

  // If no assets discovered yet, redirect to home to enter PAN
  useEffect(() => {
    if (ctx.discoveredAssets.length === 0) navigate("/", { replace: true });
  }, [ctx.discoveredAssets, navigate]);

  const handleClaimGeneration = async (data: { nominee: boolean; heirs: number; deathCertificate: boolean; claimantRelation: string }) => {
    ctx.setClaimData({
      hasDeathCertificate: data.deathCertificate,
      relationship: data.claimantRelation,
      hasNominee: data.nominee,
      heirs: data.heirs,
      allHeirsAgree: true,
      assetValue: ctx.totalRecoverable,
    });
    ctx.setClaimStatus("claiming");

    const primary = ctx.discoveredAssets[0];
    const result = await generateClaimDocuments({
      ...data,
      bank: primary?.institution ?? "SBI",
      amount: primary?.amount ?? 500000,
    });
    ctx.setDocumentHash(result.documentHash);
    ctx.setPdfUrl(result.pdfUrl);
    ctx.setClaimStatus("generated");
    setStep("resolution");
  };

  if (step === "resolution") {
    return (
      <ResolutionView
        onReset={() => { ctx.reset(); navigate("/"); }}
        documentHash={ctx.documentHash}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            {step === "breakdown" && (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                {/* Total header */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                    Asset Breakdown
                  </h1>
                  <p className="text-muted-foreground">
                    PAN: <span className="font-mono font-bold text-foreground">{ctx.panNumber}</span>
                  </p>
                  <p className="text-4xl font-extrabold text-primary mt-4">
                    {fmt(ctx.totalRecoverable)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total recoverable across {ctx.discoveredAssets.length} institutions</p>
                </div>

                {/* Asset cards */}
                <div className="grid gap-4">
                  {ctx.discoveredAssets.map((asset, i) => {
                    const Icon = ICON_MAP[asset.type] ?? Building2;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="border-border bg-card hover:border-primary/30 transition-colors">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{asset.institution}</p>
                                <p className="text-xs text-muted-foreground">{asset.type}</p>
                              </div>
                            </div>
                            <p className="text-lg font-extrabold text-foreground">{fmt(asset.amount)}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Action */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep("chat")}
                    className="flex-1 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    Start Claim Process
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="ghost" size="sm" onClick={() => setStep("breakdown")} className="gap-1 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Breakdown
                  </Button>
                  <h2 className="text-xl font-extrabold text-foreground">AI Legal Claim Assistant</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
                  <AssetSummary />
                  <div className="min-h-[500px]">
                    <LegalAssistantChat onClaimReady={handleClaimGeneration} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DiscoverPage;
