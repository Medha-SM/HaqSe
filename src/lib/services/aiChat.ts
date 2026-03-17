const API_BASE = "http://localhost:8000";

export interface ChatResponse {
  response: string;
}

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Chat API error");
    const data: ChatResponse = await res.json();
    return data.response;
  } catch {
    // Fallback AI responses for demo
    const lower = message.toLowerCase();
    if (lower.includes("nominee"))
      return "If there is no nominee, the legal heirs must submit an indemnity bond along with a legal heir certificate or succession certificate to claim the dormant assets.";
    if (lower.includes("document"))
      return "You will need: 1) Death Certificate, 2) Legal Heir Certificate, 3) Indemnity Bond, 4) PAN Card of deceased, 5) Identity proof of claimant.";
    if (lower.includes("time") || lower.includes("long"))
      return "The typical claim processing time is 30-45 days from the date of submission of all required documents to the bank branch.";
    return "I can help you understand the legal process for claiming dormant assets. Ask me about nominees, required documents, timelines, or the claim process.";
  }
}
