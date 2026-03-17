import { scanPan, type DiscoveredAsset } from "./panScanner";
import { generateClaimDocuments, type ClaimInput, type ClaimResult } from "./claimGenerator";
import { registerClaimOnBlockchain } from "./blockchain";

export interface OrchestrationResult {
  assets: DiscoveredAsset[];
  claim: ClaimResult;
  transactionHash: string;
}

export async function processFullClaim(
  pan: string,
  claimInput: Omit<ClaimInput, "bank" | "amount">
): Promise<OrchestrationResult> {
  // Step 1: Discover assets
  const assets = await scanPan(pan);
  const primary = assets[0];

  // Step 2: Generate claim documents
  const claim = await generateClaimDocuments({
    ...claimInput,
    bank: primary.institution,
    amount: primary.amount,
  });

  // Step 3: Register on blockchain
  const panHash = "0x" + Array.from(new TextEncoder().encode(pan))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  const { transactionHash } = await registerClaimOnBlockchain({
    panHash,
    documentHash: claim.documentHash,
    bank: primary.institution,
    amount: primary.amount,
  });

  return { assets, claim, transactionHash };
}
