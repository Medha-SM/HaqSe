const API_BASE = "http://localhost:8000";

export interface DiscoveredAsset {
  institution: string;
  type: string;
  amount: number;
}

const MOCK_DATABASE: Record<string, DiscoveredAsset[]> = {
  DEFAULT: [
    { institution: "State Bank of India", type: "Fixed Deposit", amount: 500000 },
    { institution: "LIC", type: "Insurance Policy", amount: 220000 },
    { institution: "Post Office", type: "Savings Account", amount: 80000 },
  ],
};

export async function scanPan(pan: string): Promise<DiscoveredAsset[]> {
  try {
    const res = await fetch(`${API_BASE}/api/scan-pan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pan }),
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json();
    return data.assets ?? data;
  } catch {
    // Silent fallback to mock data
    return MOCK_DATABASE[pan] ?? MOCK_DATABASE.DEFAULT;
  }
}
