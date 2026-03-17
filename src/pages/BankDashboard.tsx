import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, FileText, Search, Info, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClaimInfoModal from "@/components/ClaimInfoModal";
import { useClaim, type UserClaim } from "@/context/ClaimContext";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, className: "text-amber-600 bg-amber-100/60 dark:bg-amber-950/30 dark:text-amber-400" },
  approved: { label: "Approved", icon: CheckCircle2, className: "text-primary bg-primary/10" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-destructive bg-destructive/10" },
  info_requested: { label: "Info Requested", icon: FileText, className: "text-blue-600 bg-blue-100/60 dark:bg-blue-950/30 dark:text-blue-400" },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const INSTITUTION_BANK_MAP: Record<string, string[]> = {
  SBI: ["State Bank of India"],
  HDFC: ["HDFC Bank"],
  POST: ["Post Office"],
};

const BankDashboard = () => {
  const { allClaims, setAllClaims, institution, role, resetRole } = useClaim();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [infoModalClaim, setInfoModalClaim] = useState<UserClaim | null>(null);
  const { toast } = useToast();

  // Guard: must be bank with institution selected
  if (!role || role !== "bank") { navigate("/roles", { replace: true }); return null; }
  if (!institution) { navigate("/institution-select", { replace: true }); return null; }

  const institutionBanks = institution ? INSTITUTION_BANK_MAP[institution] ?? [] : [];
  const institutionClaims = allClaims.filter((c) => institutionBanks.includes(c.bank));

  const filtered = institutionClaims.filter((c) => {
    const matchesSearch =
      c.claimant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: institutionClaims.length,
    pending: institutionClaims.filter((c) => c.status === "pending").length,
    approved: institutionClaims.filter((c) => c.status === "approved").length,
    totalAmount: institutionClaims.reduce((s, c) => s + c.amount, 0),
  };

  const updateStatus = (id: string, status: UserClaim["status"]) => {
    setAllClaims(allClaims.map((c) => (c.id === id ? { ...c, status } : c)));
    const labels: Record<string, string> = { approved: "Claim Approved", rejected: "Claim Rejected", info_requested: "Additional Info Requested" };
    toast({ title: labels[status] ?? "Updated", description: `Claim ${id} has been updated.` });
  };

  const handleReject = (id: string) => {
    if (window.confirm("Are you sure you want to permanently reject this claim request?")) {
      setAllClaims(allClaims.filter((c) => c.id !== id));
      toast({ title: "Claim Rejected & Removed", description: `Claim ${id} has been permanently removed.` });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-6 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground mb-1">
                {institution ? `${institutionBanks[0]} — Claims Dashboard` : "Bank Claims Dashboard"}
              </h1>
              <p className="text-muted-foreground">Review and process submitted dormant asset claims</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => { resetRole(); navigate("/roles"); }}>
              <ArrowLeft className="h-4 w-4" /> Switch Role
            </Button>
          </motion.div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Claims", value: stats.total, color: "text-foreground" },
              { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
              { label: "Approved", value: stats.approved, color: "text-primary" },
              { label: "Total Claim Value", value: fmt(stats.totalAmount), color: "text-foreground" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className="border-border bg-card">
                  <CardContent className="p-5 text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by claimant, PAN, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-card border-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-10 bg-card border-input">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="info_requested">Info Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims Table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-bold">Claim ID</TableHead>
                    <TableHead className="font-bold">Claimant</TableHead>
                    <TableHead className="font-bold">PAN</TableHead>
                    <TableHead className="font-bold">Institution</TableHead>
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
                        <TableCell className="text-sm font-semibold">{claim.claimant}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{claim.pan}</TableCell>
                        <TableCell className="text-sm">{claim.bank}</TableCell>
                        <TableCell className="text-right font-bold text-sm">{fmt(claim.amount)}</TableCell>
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
                              <Info className="h-3 w-3" /> Request Info
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No claims found</TableCell>
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

export default BankDashboard;
