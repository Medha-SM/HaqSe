import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHAT_SCRIPT } from "@/lib/mockData";
import { generateClaim } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LegalTermHighlighter from "@/components/LegalTermHighlighter";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
}

type ChatStep = "initial" | "nominee-asked" | "heirs-asked" | "submitting" | "submitted";

interface ChatInterfaceProps {
  panNumber: string;
  onSubmit: (documentHash?: string) => void;
}

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3"
  >
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    <div className="bg-surface rounded-2xl rounded-tl-sm px-4 py-3">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  </motion.div>
);

const AiBubble = ({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-start gap-3 max-w-[85%]"
  >
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Bot className="h-4 w-4 text-primary" />
    </div>
    <div className="bg-surface rounded-2xl rounded-tl-sm px-4 py-3">
      <p className="text-sm text-foreground leading-relaxed">
        <LegalTermHighlighter text={content} />
      </p>
    </div>
  </motion.div>
);

const UserBubble = ({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-end"
  >
    <div className="flex items-start gap-3 max-w-[85%] flex-row-reverse">
      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
        <User className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="bg-accent rounded-2xl rounded-tr-sm px-4 py-3">
        <p className="text-sm text-accent-foreground leading-relaxed">{content}</p>
      </div>
    </div>
  </motion.div>
);

const ChatInterface = ({ panNumber, onSubmit }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>("initial");
  const [typing, setTyping] = useState(false);
  const [heirsCount, setHeirsCount] = useState("");
  const hasNomineeRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    setMessages([
      { id: "1", role: "ai", content: CHAT_SCRIPT.initialMessage },
    ]);
    setStep("nominee-asked");
  }, []);

  const handleNomineeReply = (hasNominee: boolean) => {
    hasNomineeRef.current = hasNominee;
    const reply = hasNominee ? CHAT_SCRIPT.nomineeYes : CHAT_SCRIPT.nomineeNo;
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: reply }]);
    setStep("initial");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", content: CHAT_SCRIPT.heirsQuestion },
      ]);
      setStep("heirs-asked");
    }, 1000);
  };

  const handleHeirsSubmit = async () => {
    if (!heirsCount) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: `${heirsCount} legal heir(s)` },
    ]);
    setStep("submitting");
    setTyping(true);

    let docHash: string | undefined;
    try {
      const result = await generateClaim({
        pan_number: panNumber,
        has_nominee: hasNomineeRef.current,
        num_heirs: parseInt(heirsCount, 10),
      });
      docHash = result.transaction_hash;
      toast({ title: "Claim docket downloaded!", description: "Check your downloads folder." });
    } catch {
      // Silently proceed with demo flow
    } finally {
      setTyping(false);
      setStep("submitted");
      onSubmit(docHash);
    }
  };

  const showPills = step === "nominee-asked" && messages.length === 1;
  const showHeirsInput = step === "heirs-asked";

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border shadow-lg overflow-hidden min-h-[400px] lg:min-h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">HaqSe AI</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        <AnimatePresence>
          {messages.map((msg) =>
            msg.role === "ai" ? (
              <AiBubble key={msg.id} content={msg.content} />
            ) : (
              <UserBubble key={msg.id} content={msg.content} />
            )
          )}
        </AnimatePresence>

        {typing && <TypingIndicator />}

        {/* Quick-reply pills */}
        {showPills && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 pl-11"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNomineeReply(true)}
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
            >
              {CHAT_SCRIPT.nomineeYes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNomineeReply(false)}
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
            >
              {CHAT_SCRIPT.nomineeNo}
            </Button>
          </motion.div>
        )}

        {/* Heirs input */}
        {showHeirsInput && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 pl-11 items-center"
          >
            <Input
              type="number"
              min={1}
              max={20}
              placeholder="Number of heirs"
              value={heirsCount}
              onChange={(e) => setHeirsCount(e.target.value)}
              className="w-36 h-10 bg-surface border-input"
            />
            <Button
              size="sm"
              onClick={handleHeirsSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-1.5"
            >
              <Send className="h-4 w-4" />
              Submit to AI
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
