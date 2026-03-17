import { createContext, useContext, useState, type ReactNode } from "react";
import type { DiscoveredAsset } from "@/lib/services/panScanner";

export type AppRole = "user" | "bank" | null;
export type Institution = "SBI" | "HDFC" | "POST" | null;

export interface ClaimData {
  hasDeathCertificate: boolean;
  relationship: string;
  hasNominee: boolean;
  nomineeDetails?: string;
  heirs: number;
  heirNames?: string[];
  allHeirsAgree: boolean;
  assetValue: number;
}

export interface UserClaim {
  id: string;
  claimant: string;
  bank: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "info_requested";
  date: string;
  pan: string;
  claimType: "nominee" | "legal_heir";
}

interface ClaimState {
  role: AppRole;
  setRole: (role: AppRole) => void;
  institution: Institution;
  setInstitution: (inst: Institution) => void;
  resetRole: () => void;
  panNumber: string;
  setPanNumber: (pan: string) => void;
  discoveredAssets: DiscoveredAsset[];
  setDiscoveredAssets: (assets: DiscoveredAsset[]) => void;
  claimData: ClaimData | null;
  setClaimData: (data: ClaimData) => void;
  documentHash: string;
  setDocumentHash: (hash: string) => void;
  pdfUrl: string;
  setPdfUrl: (url: string) => void;
  transactionHash: string;
  setTransactionHash: (hash: string) => void;
  claimStatus: "idle" | "scanning" | "discovered" | "claiming" | "generated" | "verified";
  setClaimStatus: (s: ClaimState["claimStatus"]) => void;
  totalRecoverable: number;
  userClaims: UserClaim[];
  setUserClaims: (claims: UserClaim[]) => void;
  addUserClaim: (claim: UserClaim) => void;
  allClaims: UserClaim[];
  setAllClaims: (claims: UserClaim[]) => void;
  reset: () => void;
}

const ClaimContext = createContext<ClaimState | null>(null);

const INITIAL_ALL_CLAIMS: UserClaim[] = [
  // SBI
  { id: "HQ-2026-001", claimant: "Rajesh Kumar", bank: "State Bank of India", amount: 500000, status: "pending", date: "2026-03-14", pan: "ABCDE1234F", claimType: "legal_heir" },
  { id: "HQ-2026-002", claimant: "Anita Verma", bank: "State Bank of India", amount: 320000, status: "approved", date: "2026-03-12", pan: "BCDEG2345H", claimType: "nominee" },
  { id: "HQ-2026-003", claimant: "Suresh Iyer", bank: "State Bank of India", amount: 150000, status: "pending", date: "2026-03-10", pan: "CDEFH3456I", claimType: "legal_heir" },
  { id: "HQ-2026-004", claimant: "Kavita Singh", bank: "State Bank of India", amount: 275000, status: "rejected", date: "2026-03-08", pan: "DEFGI4567J", claimType: "legal_heir" },
  { id: "HQ-2026-005", claimant: "Mohan Reddy", bank: "State Bank of India", amount: 410000, status: "pending", date: "2026-03-06", pan: "EFGHJ5678K", claimType: "nominee" },
  // HDFC
  { id: "HQ-2026-006", claimant: "Priya Sharma", bank: "HDFC Bank", amount: 220000, status: "approved", date: "2026-03-13", pan: "FGHIJ6789L", claimType: "nominee" },
  { id: "HQ-2026-007", claimant: "Rohit Mehta", bank: "HDFC Bank", amount: 180000, status: "pending", date: "2026-03-11", pan: "GHIJK7890M", claimType: "legal_heir" },
  { id: "HQ-2026-008", claimant: "Neha Kapoor", bank: "HDFC Bank", amount: 310000, status: "info_requested", date: "2026-03-09", pan: "HIJKL8901N", claimType: "legal_heir" },
  { id: "HQ-2026-009", claimant: "Arjun Nair", bank: "HDFC Bank", amount: 95000, status: "pending", date: "2026-03-07", pan: "IJKLM9012O", claimType: "nominee" },
  { id: "HQ-2026-010", claimant: "Karan Malhotra", bank: "HDFC Bank", amount: 260000, status: "approved", date: "2026-03-05", pan: "JKLMN0123P", claimType: "legal_heir" },
  // Post Office
  { id: "HQ-2026-011", claimant: "Amit Patel", bank: "Post Office", amount: 80000, status: "rejected", date: "2026-03-12", pan: "KLMNO1234Q", claimType: "legal_heir" },
  { id: "HQ-2026-012", claimant: "Sunita Devi", bank: "Post Office", amount: 350000, status: "info_requested", date: "2026-03-10", pan: "LMNOP2345R", claimType: "nominee" },
  { id: "HQ-2026-013", claimant: "Vikram Singh", bank: "Post Office", amount: 175000, status: "pending", date: "2026-03-08", pan: "MNOPQ3456S", claimType: "legal_heir" },
  { id: "HQ-2026-014", claimant: "Meena Joshi", bank: "Post Office", amount: 240000, status: "approved", date: "2026-03-06", pan: "NOPQR4567T", claimType: "nominee" },
  { id: "HQ-2026-015", claimant: "Ramesh Gupta", bank: "Post Office", amount: 90000, status: "pending", date: "2026-03-04", pan: "OPQRS5678U", claimType: "legal_heir" },
];

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>(null);
  const [institution, setInstitution] = useState<Institution>(null);
  const [panNumber, setPanNumber] = useState("");
  const [discoveredAssets, setDiscoveredAssets] = useState<DiscoveredAsset[]>([]);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [documentHash, setDocumentHash] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [claimStatus, setClaimStatus] = useState<ClaimState["claimStatus"]>("idle");
  const [userClaims, setUserClaims] = useState<UserClaim[]>([]);
  const [allClaims, setAllClaims] = useState<UserClaim[]>(INITIAL_ALL_CLAIMS);

  const totalRecoverable = discoveredAssets.reduce((sum, a) => sum + a.amount, 0);

  const addUserClaim = (claim: UserClaim) => {
    setUserClaims((prev) => [...prev, claim]);
    setAllClaims((prev) => [...prev, claim]);
  };

  const resetRole = () => {
    setRole(null);
    setInstitution(null);
  };

  const reset = () => {
    setPanNumber("");
    setDiscoveredAssets([]);
    setClaimData(null);
    setDocumentHash("");
    setPdfUrl("");
    setTransactionHash("");
    setClaimStatus("idle");
  };

  return (
    <ClaimContext.Provider
      value={{
        role, setRole,
        institution, setInstitution,
        resetRole,
        panNumber, setPanNumber,
        discoveredAssets, setDiscoveredAssets,
        claimData, setClaimData,
        documentHash, setDocumentHash,
        pdfUrl, setPdfUrl,
        transactionHash, setTransactionHash,
        claimStatus, setClaimStatus,
        totalRecoverable,
        userClaims, setUserClaims, addUserClaim,
        allClaims, setAllClaims,
        reset,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaim() {
  const ctx = useContext(ClaimContext);
  if (!ctx) throw new Error("useClaim must be used within ClaimProvider");
  return ctx;
}
