import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, FileText, Eye, Download, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentPreviewModal from "@/components/DocumentPreviewModal";
import NextStepsTimeline from "@/components/NextStepsTimeline";
import BlockchainAuditModal from "@/components/BlockchainAuditModal";
import { DOCUMENTS, DOCKET_FILE_CONTENT } from "@/lib/mockData";

type Phase = "generating" | "done";

interface ResolutionViewProps {
  onReset?: () => void;
  documentHash?: string;
}

const ResolutionView = ({ onReset, documentHash }: ResolutionViewProps) => {
  const [phase, setPhase] = useState<Phase>("generating");
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; content: string } | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 200);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "done") {
      toast({
        title: "Documents ready for bank submission",
        description: "Your complete claim packet has been generated.",
      });
    }
  }, [phase, toast]);

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    toast({
      title: "Downloading HaqSe_Claim_Docket.txt...",
      description: "Please wait while we package your documents.",
    });

    setTimeout(() => {
      // Real file download via Blob API
      const blob = new Blob([DOCKET_FILE_CONTENT], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "HaqSe_Claim_Docket.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      toast({
        title: "Download Complete!",
        description: "Your claim packet is ready for submission.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <AnimatePresence mode="wait">
        {phase === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8 px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FileText className="h-16 w-16 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-accent text-center">
              Generating Legal Documents...
            </h2>
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-3 [&>div]:bg-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.main
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 pt-20 pb-16"
          >
            <div className="container mx-auto px-6">
              {/* Success Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center mb-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6"
                >
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-accent mb-2">
                  Legal Docket Generated Successfully
                </h1>
                <p className="text-muted-foreground">
                  All documents are ready for review and submission
                </p>
              </motion.div>

              {/* Document Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                {DOCUMENTS.map((doc, i) => (
                  <motion.div
                    key={doc.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                  >
                    <Card className="group border-border bg-surface hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer hover:-translate-y-1 dark:bg-card dark:hover:shadow-primary/5">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-primary/30 transition-colors">
                          <FileText className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground mb-2">{doc.title}</h3>
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${doc.tagColor}`}>
                            {doc.tag}
                          </span>
                        </div>
                        <button
                          onClick={() => setPreviewDoc({ title: doc.title, content: doc.previewContent })}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Next Steps Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="mb-12"
              >
                <NextStepsTimeline />
              </motion.div>

              {/* Download + Reset Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="max-w-4xl mx-auto space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex-1 h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 gap-3 shadow-lg disabled:opacity-80"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-6 w-6" />
                        Download Claim Packet
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => setAuditOpen(true)}
                    className="flex-1 h-16 text-lg font-bold gap-3 shadow-lg bg-[hsl(250,40%,25%)] text-[hsl(0,0%,100%)] hover:bg-[hsl(250,45%,32%)] hover:shadow-[0_0_20px_hsl(250,50%,40%,0.3)] transition-all duration-300"
                  >
                    <ShieldCheck className="h-6 w-6" />
                    Verify via Blockchain Audit
                  </Button>
                </div>

                {onReset && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onReset}
                    className="w-full h-12 text-sm font-semibold gap-2 border-border hover:bg-muted"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Start New Search
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {phase === "done" && <Footer />}

      <DocumentPreviewModal
        open={!!previewDoc}
        title={previewDoc?.title ?? ""}
        content={previewDoc?.content ?? ""}
        onClose={() => setPreviewDoc(null)}
      />

      <BlockchainAuditModal
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        documentHash={documentHash}
      />
    </div>
  );
};

export default ResolutionView;
