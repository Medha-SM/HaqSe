import { motion } from "framer-motion";
import { FileText, ExternalLink, Download, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useClaim } from "@/context/ClaimContext";
import { useNavigate } from "react-router-dom";

const MOCK_USER_ASSETS = [
  { institution: "State Bank of India", type: "Fixed Deposit", amount: 500000 },
  { institution: "HDFC Bank", type: "Savings Account", amount: 230000 },
  { institution: "Post Office Scheme", type: "NSC", amount: 115000 },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-100/60 dark:bg-amber-950/30 dark:text-amber-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "text-primary bg-primary/10" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-destructive bg-destructive/10" },
  info_requested: { label: "Info Requested", icon: Info, className: "text-blue-600 bg-blue-100/60 dark:bg-blue-950/30 dark:text-blue-400" },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const UserDashboard = () => {
  const { userClaims, discoveredAssets, documentHash } = useClaim();
  const navigate = useNavigate();
  const assets = discoveredAssets.length > 0 ? discoveredAssets : MOCK_USER_ASSETS;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-6 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-foreground mb-1">My Dashboard</h1>
            <p className="text-muted-foreground">View your discovered assets and track claim status</p>
          </motion.div>

          {/* Discovered Assets */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <h2 className="text-lg font-bold text-foreground mb-3">Discovered Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {assets.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <Card className="border-border bg-card">
                    <CardContent className="p-5">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{"institution" in a ? a.institution : ""}</p>
                      <p className="text-2xl font-extrabold text-foreground mt-1">{fmt(a.amount)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{"type" in a ? a.type : ""}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* My Claims */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="text-lg font-bold text-foreground mb-3">My Claims</h2>
            <Card className="border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-bold">Claim ID</TableHead>
                    <TableHead className="font-bold">Bank</TableHead>
                    <TableHead className="font-bold text-right">Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        No claims submitted yet. Start a claim from the <span className="text-primary font-semibold cursor-pointer" onClick={() => navigate("/discover")}>Discover</span> page.
                      </TableCell>
                    </TableRow>
                  ) : (
                    userClaims.map((c) => {
                      const sc = STATUS_CONFIG[c.status];
                      const Icon = sc.icon;
                      return (
                        <TableRow key={c.id} className="border-border">
                          <TableCell className="font-mono text-xs font-bold">{c.id}</TableCell>
                          <TableCell className="text-sm">{c.bank}</TableCell>
                          <TableCell className="text-right font-bold text-sm">{fmt(c.amount)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.className}`}>
                              <Icon className="h-3 w-3" />
                              {sc.label}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.section>

          {/* Actions */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold text-foreground mb-3">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2"
                onClick={() => navigate("/discover")}
              >
                <FileText className="h-4 w-4" />
                Start New Claim
              </Button>
              <Button
                variant="outline"
                className="font-bold gap-2 border-border"
                disabled={!documentHash}
                onClick={() => {
                  const blob = new Blob(["HaqSe Claim Docket\nHash: " + (documentHash || "N/A")], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "claim-docket.txt";
                  a.click();
                }}
              >
                <Download className="h-4 w-4" />
                Download Claim Docket
              </Button>
              <Button
                variant="outline"
                className="font-bold gap-2 border-border"
                onClick={() => navigate("/blockchain-verification")}
              >
                <ExternalLink className="h-4 w-4" />
                View Blockchain Proof
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
