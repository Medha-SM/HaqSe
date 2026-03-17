import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useClaim } from "@/context/ClaimContext";
import { scanPan } from "@/lib/services/panScanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Database, CheckCircle2, ArrowRight, IndianRupee } from "lucide-react";
import confetti from "canvas-confetti";

const TRUST_ITEMS = [
  { icon: Shield, label: "Bank-Grade Security", desc: "256-bit encryption on all data" },
  { icon: Database, label: "RBI UDGAM Linked", desc: "Official unclaimed deposits database" },
  { icon: Lock, label: "DPDP Compliant", desc: "Your data stays private, always" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Index = () => {
  const { role, discoveredAssets, setDiscoveredAssets, setPanNumber, totalRecoverable } = useClaim();
  const navigate = useNavigate();
  const [panInput, setPanInput] = useState("");
  const [phase, setPhase] = useState<"input" | "result">("input");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role) navigate("/roles", { replace: true });
    else if (role === "bank") navigate("/institution-select", { replace: true });
  }, [role, navigate]);

  // If assets already discovered, show result
  useEffect(() => {
    if (discoveredAssets.length > 0) setPhase("result");
  }, [discoveredAssets]);

  // Confetti on result
  useEffect(() => {
    if (phase !== "result" || discoveredAssets.length === 0) return;
    const end = Date.now() + 600;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ["#0d9488", "#059669", "#10b981", "#fbbf24"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ["#0d9488", "#059669", "#10b981", "#fbbf24"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [phase, discoveredAssets]);

  const handleScan = async () => {
    if (!panInput.trim()) return;
    setLoading(true);
    setPanNumber(panInput.trim());
    const assets = await scanPan(panInput.trim());
    setDiscoveredAssets(assets);
    setLoading(false);
    setPhase("result");
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-accent" />

          <div className="relative container mx-auto px-6 pt-20 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-accent-foreground leading-tight mb-4">
                Reclaim Your Family's
                <br />
                Forgotten Wealth
              </h1>
              <p className="text-lg text-accent-foreground/70 font-medium">
                India's first AI Legal-FinTech for unclaimed assets
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="w-full max-w-lg mx-auto shadow-xl border-border bg-card">
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    {phase === "input" && (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col gap-5"
                      >
                        <Input
                          placeholder="Enter Deceased's PAN Number"
                          value={panInput}
                          onChange={(e) => setPanInput(e.target.value.toUpperCase())}
                          className="h-14 text-base tracking-widest font-medium bg-background border-input text-center"
                          maxLength={10}
                        />
                        <Button
                          size="lg"
                          onClick={handleScan}
                          disabled={loading}
                          className="h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        >
                          {loading ? (
                            <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          ) : (
                            <IndianRupee className="h-5 w-5" />
                          )}
                          {loading ? "Discovering Assets..." : "Discover Dormant Assets"}
                        </Button>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 text-center">
                          Note: Please enter the PAN ID as ABCDE1234F as only this works for our current DEMO Model.
                        </p>
                      </motion.div>
                    )}

                    {phase === "result" && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-5"
                      >
                        <div className="rounded-xl border-2 border-primary bg-background w-full p-6">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                            <span className="text-sm font-extrabold tracking-widest text-primary uppercase">
                              Total Dormant Assets
                            </span>
                          </div>

                          <p className="text-center text-3xl font-extrabold text-foreground mb-1">
                            {fmt(totalRecoverable)}
                          </p>
                          <p className="text-center text-sm text-muted-foreground">
                            Across {discoveredAssets.length} institutions
                          </p>
                          {discoveredAssets.length > 0 && (
                            <p className="text-center text-xs text-muted-foreground mt-2">
                              {discoveredAssets.map((a, i) => (
                                <span key={i}>
                                  {i > 0 && " • "}
                                  {a.institution} {fmt(a.amount)}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>

                        <Button
                          size="lg"
                          onClick={() => navigate("/discover")}
                          className="w-full h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        >
                          View Asset Breakdown
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
