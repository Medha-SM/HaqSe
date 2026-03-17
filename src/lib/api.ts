const API_BASE = "http://localhost:8000";

export interface ScanResult {
  asset_name: string;
  bank_name: string;
  asset_type: string;
  status: string;
  amount: string;
}

export async function scanDatabases(panNumber: string): Promise<ScanResult> {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pan_number: panNumber }),
  });
  if (!res.ok) throw new Error(`Scan failed: ${res.statusText}`);
  return res.json();
}

export interface ClaimResponse {
  status: string;
  message: string;
  document_url: string;
  transaction_hash: string;
}

export async function generateClaim(params: {
  pan_number: string;
  has_nominee: boolean;
  num_heirs: number;
}): Promise<ClaimResponse> {
  const res = await fetch(`${API_BASE}/api/generate-claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Claim generation failed: ${res.statusText}`);

  const data: ClaimResponse = await res.json();

  // Auto-download the PDF
  const link = document.createElement("a");
  link.href = `${API_BASE}${data.document_url}`;
  link.download = "HaqSe_Claim_Docket.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  return data;
}
