import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendChatMessage } from "@/lib/services/aiChat";
import LegalTermHighlighter from "@/components/LegalTermHighlighter";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

interface LegalAssistantChatProps {
  onClaimReady: (data: {
    nominee: boolean;
    heirs: number;
    deathCertificate: boolean;
    claimantRelation: string;
  }) => void;
}

type Step =
  | "intro"
  | "death_cert"
  | "relationship"
  | "nominee_check"
  | "nominee_details"
  | "nominee_other_heirs"
  | "no_nominee_heirs_count"
  | "no_nominee_heirs_consent"
  | "asset_value"
  | "checklist"
  | "eligible"
  | "free_chat";

const LegalAssistantChat = ({ onClaimReady }: LegalAssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>("intro");
  const [userInput, setUserInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const data = useRef({
    hasDeathCertificate: false,
    relationship: "",
    hasNominee: false,
    nomineeDetails: "",
    heirs: 1,
    allHeirsAgree: false,
    assetValue: 0,
  });

  const addAi = (content: string) =>
    setMessages((p) => [...p, { id: `ai-${Date.now()}-${Math.random()}`, role: "ai", content }]);
  const addUser = (content: string) =>
    setMessages((p) => [...p, { id: `usr-${Date.now()}`, role: "user", content }]);

  const delayAi = (content: string, nextStep: Step, delay = 700) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addAi(content);
      setStep(nextStep);
    }, delay);
  };

  useEffect(() => {
    addAi("Hello, I will guide you through recovering financial assets of the deceased. Let's begin.\n\nDo you have the official **death certificate**?");
    setStep("death_cert");
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const handleYesNo = (yes: boolean) => {
    addUser(yes ? "Yes" : "No");

    switch (step) {
      case "death_cert":
        if (!yes) {
          delayAi("⚠️ A death certificate is mandatory to proceed with any claim. Please obtain one from the local municipal authority and return.", "intro");
          return;
        }
        data.current.hasDeathCertificate = true;
        delayAi("Great. What is your **relationship** to the deceased? (e.g., Son, Daughter, Spouse, Parent)", "relationship");
        break;

      case "nominee_check":
        data.current.hasNominee = yes;
        if (yes) {
          delayAi("Good — a nominee was registered. Funds are typically released to the nominee after verification.\n\nPlease provide the **nominee's name and relationship**.", "nominee_details");
        } else {
          delayAi("Since there is no nominee, we need to identify all **legal heirs**.\n\nHow many legal heirs (children/spouse/parents) are currently living?", "no_nominee_heirs_count");
        }
        break;

      case "nominee_other_heirs":
        if (yes) {
          delayAi("Noted — consent from other heirs may be required even when a nominee exists.\n\nLet me generate your **document checklist**.", "checklist");
          setTimeout(() => generateChecklist(), 1500);
        } else {
          delayAi("Let me generate your **document checklist**.", "checklist");
          setTimeout(() => generateChecklist(), 1500);
        }
        break;

      case "no_nominee_heirs_consent":
        data.current.allHeirsAgree = yes;
        if (!yes) {
          delayAi("⚠️ All legal heirs must provide consent. Please coordinate with them before proceeding.\n\nWhat is the **approximate asset value** (in ₹)?", "asset_value");
        } else {
          delayAi("What is the **approximate asset value** (in ₹)?", "asset_value");
        }
        break;

      default:
        break;
    }
  };

  const handleTextSubmit = () => {
    const val = userInput.trim();
    if (!val) return;
    setUserInput("");
    addUser(val);

    switch (step) {
      case "relationship":
        data.current.relationship = val;
        delayAi(`Thank you. Was a **nominee** registered for these assets?`, "nominee_check");
        break;

      case "nominee_details":
        data.current.nomineeDetails = val;
        delayAi("Are there other legal heirs besides the nominee?", "nominee_other_heirs");
        break;

      case "no_nominee_heirs_count":
        data.current.heirs = parseInt(val) || 1;
        delayAi(`${data.current.heirs} legal heir(s) noted. Do **all heirs consent** to this claim?`, "no_nominee_heirs_consent");
        break;

      case "asset_value": {
        const num = parseInt(val.replace(/[^0-9]/g, "")) || 0;
        data.current.assetValue = num;
        const highValue = num > 200000;
        const msg = highValue
          ? "This is a **high-value claim**. A **Succession Certificate** from the court will be required in addition to the standard documents."
          : "This claim can proceed with a standard **Indemnity Bond**.";
        delayAi(msg + "\n\nLet me generate your document checklist...", "checklist");
        setTimeout(() => generateChecklist(), 1500);
        break;
      }

      case "free_chat":
        handleFreeChat(val);
        break;

      default:
        break;
    }
  };

  const generateChecklist = () => {
    const d = data.current;
    let items = ["✅ Death Certificate", "✅ ID Proof of Claimant", "✅ Claim Form (Bank-specific)"];

    if (d.hasNominee) {
      items.push("✅ Nominee ID Proof");
    } else {
      items.push("✅ Legal Heir Declaration / Affidavit");
      items.push("✅ Indemnity Bond");
      if (d.assetValue > 200000) {
        items.push("✅ Succession Certificate (High-Value Claim)");
      }
    }

    const claimType = d.hasNominee ? "**Nominee Claim**" : "**Legal Heir Claim**";

    addAi(
      `📋 **Document Checklist:**\n\n${items.join("\n")}\n\n---\n\n🎯 **You are eligible to proceed.**\nClaim Type: ${claimType}\n\nClick **Generate Claim Documents** below to create your docket.`
    );
    setStep("eligible");
  };

  const handleFreeChat = async (msg: string) => {
    setTyping(true);
    const response = await sendChatMessage(msg);
    setTyping(false);
    addAi(response);
  };

  const handleGenerate = () => {
    const d = data.current;
    onClaimReady({
      nominee: d.hasNominee,
      heirs: d.heirs,
      deathCertificate: d.hasDeathCertificate,
      claimantRelation: d.relationship || "Legal Heir",
    });
  };

  // Determine input mode
  const showYesNo = ["death_cert", "nominee_check", "nominee_other_heirs", "no_nominee_heirs_consent"].includes(step);
  const showTextInput = ["relationship", "nominee_details", "no_nominee_heirs_count", "asset_value", "free_chat"].includes(step);
  const showGenerate = step === "eligible" || step === "free_chat";

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border shadow-lg overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">HaqSe AI Legal Assistant</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={msg.role === "user" ? "flex justify-end" : "flex items-start gap-3 max-w-[85%]"}
            >
              {msg.role === "ai" && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={
                  msg.role === "ai"
                    ? "bg-card rounded-2xl rounded-tl-sm px-4 py-3 border border-border"
                    : "bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]"
                }
              >
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  <LegalTermHighlighter text={msg.content} />
                </p>
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 ml-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 border border-border flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </motion.div>
        )}

        {/* Yes/No Controls */}
        {showYesNo && !typing && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pl-11 flex gap-3">
            <Button variant="outline" size="sm" onClick={() => handleYesNo(true)} className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              Yes
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleYesNo(false)} className="rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-semibold">
              No
            </Button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {(showTextInput || showGenerate) && (
        <div className="border-t border-border p-4 space-y-3">
          {showTextInput && (
            <div className="flex gap-2">
              <Input
                placeholder={step === "free_chat" ? "Ask any legal question..." : "Type your answer..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleTextSubmit(); }}
                className="flex-1 h-10 bg-card border-input"
              />
              <Button size="sm" onClick={handleTextSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
          {showGenerate && (
            <Button
              onClick={handleGenerate}
              className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Generate Claim Documents
            </Button>
          )}
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            This assistant provides guidance based on standard banking procedures and does not constitute legal advice.
          </p>
        </div>
      )}
    </div>
  );
};

export default LegalAssistantChat;
