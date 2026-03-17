import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LEGAL_TERMS } from "@/lib/mockData";

interface LegalTermHighlighterProps {
  text: string;
}

/**
 * Renders text with:
 * - **bold** markdown → <strong>
 * - Legal-term tooltips
 */
const LegalTermHighlighter = ({ text }: LegalTermHighlighterProps) => {
  const termKeys = Object.keys(LEGAL_TERMS);

  // Split by **bold** markers first, then apply legal-term highlighting
  const renderSegment = (segment: string, key: string) => {
    if (termKeys.length === 0) return <span key={key}>{segment}</span>;

    const pattern = new RegExp(
      `(${termKeys.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
      "gi"
    );
    const parts = segment.split(pattern);

    return (
      <span key={key}>
        {parts.map((part, i) => {
          const match = termKeys.find((t) => t.toLowerCase() === part.toLowerCase());
          if (match) {
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <span className="border-b border-dashed border-primary/60 text-primary cursor-help font-semibold">
                    {part}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-accent text-accent-foreground text-xs font-medium px-3 py-2 rounded-lg shadow-lg"
                >
                  {LEGAL_TERMS[match]}
                </TooltipContent>
              </Tooltip>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  // Split on **...**  patterns to render bold
  const boldPattern = /\*\*(.+?)\*\*/g;
  const tokens: { type: "text" | "bold"; value: string }[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = boldPattern.exec(text)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, m.index) });
    }
    tokens.push({ type: "bold", value: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return (
    <TooltipProvider delayDuration={200}>
      {tokens.map((token, i) =>
        token.type === "bold" ? (
          <strong key={i} className="font-bold text-foreground">
            {renderSegment(token.value, `b-${i}`)}
          </strong>
        ) : (
          renderSegment(token.value, `t-${i}`)
        )
      )}
    </TooltipProvider>
  );
};

export default LegalTermHighlighter;
