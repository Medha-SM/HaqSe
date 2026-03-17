import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, FileText, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClaimInfoModal from "@/components/ClaimInfoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Claim {
  id: string;
  claimant: string;
  bank: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "info_requested";
  date: string;
  pan: string;
}

const MOCK_CLAIMS: Claim[] = [
  { id: "HQ-2026-001", claimant: "Rajesh Kumar", bank: "State Bank of India", amount: 500000, status: "pending", date: "2026-03-14", pan: "ABCDE1234F" },
  { id: "HQ-2026-002", claimant: "Priya Sharma", bank: "LIC", amount: 220000, status: "approved", date: "2026-03-12", pan: "FGHIJ5678K" },
  { id: "HQ-2026-003", claimant: "Amit Patel", bank: "Post Office", amount: 80000, status: "rejected", date: "2026-03-10", pan: "KLMNO9012P" },
  { id: "HQ-2026-004", claimant: "Sunita Devi", bank: "Punjab National Bank", amount: 350000, status: "info_requested", date: "2026-03-08", pan: "PQRST3456U" },
  { id: "HQ-2026-005", claimant: "Vikram Singh", bank: "Bank of Baroda", amount: 175000, status: "pending", date: "2026-03-06", pan: "UVWXY7890Z" },
];

const MOCK_DISCOVERED_ASSETS = [
  { institution: "State Bank of India", type: "Fixed Deposit", amount: 500000 },
  { institution: "HDFC Bank", type: "Savings Account", amount: 230000 },
  { institution: "Post Office Scheme", type: "NSC", amount: 115000 },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "text-primary bg-primary/10" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-destructive bg-destructive/10" },
  info_requested: { label: "Info Requested", icon: FileText, className: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
};

const formatAmount = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const AdminDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [infoModalClaim, setInfoModalClaim] = useState<Claim | null>(null);
  const { toast } = useToast();

  const filtered = claims.filter((c) =>
    c.claimant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    totalAmount: claims.reduce((s, c) => s + c.amount, 0),
  };

  const updateStatus = (id: string, status: Claim["status"]) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    const labels = { approved: "Claim Approved", rejected: "Claim Rejected", info_requested: "Additional Info Requested", pending: "Status Reset" };
    toast({ title: labels[status], description: `Claim ${id} has been updated.` });
  };

  const handleReject = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this claim request?")) {
      setClaims((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Claim Removed", description: `Claim ${id} has been permanently deleted.` });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">Bank Claims Dashboard</h1>
            <p className="text-muted-foreground">Review and process submitted dormant asset claims</p>
          </motion.div>

          {/* Discovered Assets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">Claimed Assets Discovery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MOCK_DISCOVERED_ASSETS.map((asset, i) => (
                <motion.div key={asset.institution} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  <Card className="border-border bg-surface dark:bg-card">
                    <CardContent className="p-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{asset.institution}</p>
                      <p className="text-xl font-extrabold text-foreground mt-1">{formatAmount(asset.amount)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{asset.type}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Claims", value: stats.total, color: "text-foreground" },
              { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
              { label: "Approved", value: stats.approved, color: "text-primary" },
              { label: "Total Value", value: formatAmount(stats.totalAmount), color: "text-foreground" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="border-border bg-surface dark:bg-card">
                  <CardContent className="p-5 text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-surface border-input"
            />
          </div>

          {/* Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="border-border bg-surface dark:bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-bold">Claim ID</TableHead>
                    <TableHead className="font-bold">Claimant</TableHead>
                    <TableHead className="font-bold">Bank</TableHead>
                    <TableHead className="font-bold text-right">Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((claim) => {
                    const sc = STATUS_CONFIG[claim.status];
                    const Icon = sc.icon;
                    return (
                      <TableRow key={claim.id} className="border-border">
                        <TableCell className="font-mono text-xs font-bold">{claim.id}</TableCell>
                        <TableCell>
                          <p className="font-semibold text-sm">{claim.claimant}</p>
                          <p className="text-xs text-muted-foreground">{claim.pan}</p>
                        </TableCell>
                        <TableCell className="text-sm">{claim.bank}</TableCell>
                        <TableCell className="text-right font-bold text-sm">{formatAmount(claim.amount)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${sc.className}`}>
                            <Icon className="h-3 w-3" />
                            {sc.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => updateStatus(claim.id, "approved")} className="h-7 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleReject(claim.id)} className="h-7 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                              Reject
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setInfoModalClaim(claim)} className="h-7 text-xs gap-1">
                              <Info className="h-3 w-3" />
                              Request Info
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No claims found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />

      <ClaimInfoModal
        open={!!infoModalClaim}
        onClose={() => setInfoModalClaim(null)}
        claim={infoModalClaim}
      />
    </div>
  );
};

export default AdminDashboard;
