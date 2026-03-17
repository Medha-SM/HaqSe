const API_BASE = "http://localhost:8000";

export interface ClaimInput {
  nominee: boolean;
  heirs: number;
  deathCertificate: boolean;
  claimantRelation: string;
  bank: string;
  amount: number;
}

export interface ClaimResult {
  pdfUrl: string;
  documentHash: string;
}

export async function generateClaimDocuments(input: ClaimInput): Promise<ClaimResult> {
  try {
    const res = await fetch(`${API_BASE}/api/generate-claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Claim generation failed");
    const data = await res.json();
    return {
      pdfUrl: data.pdfUrl ?? data.document_url ?? "",
      documentHash: data.documentHash ?? data.transaction_hash ?? "",
    };
  } catch {
    // Mock response
    const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return {
      pdfUrl: "/generated/HaqSe_Claim_Demo.pdf",
      documentHash: mockHash,
    };
  }
}
