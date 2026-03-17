import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LegalTermHighlighter from "@/components/LegalTermHighlighter";

interface DocumentPreviewModalProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const DocumentPreviewModal = ({ open, title, content, onClose }: DocumentPreviewModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-accent/60 backdrop-blur-sm dark:bg-black/70"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl dark:bg-background/90 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-base font-extrabold text-foreground">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 overflow-y-auto max-h-[60vh]">
            <div className="px-6 py-5">
              <div className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap font-mono space-y-2">
                <LegalTermHighlighter text={content} />
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border shrink-0">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full font-semibold"
            >
              Close Preview
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DocumentPreviewModal;
