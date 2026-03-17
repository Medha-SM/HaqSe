import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssetSummary from "@/components/AssetSummary";
import ChatInterface from "@/components/ChatInterface";

interface LegalGuideViewProps {
  panNumber: string;
  onDocumentsGenerate: (documentHash?: string) => void;
}

const LegalGuideView = ({ panNumber, onDocumentsGenerate }: LegalGuideViewProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8"
          >
            <AssetSummary />
            <div className="min-h-[400px] lg:min-h-[500px]">
              <ChatInterface panNumber={panNumber} onSubmit={(hash) => onDocumentsGenerate(hash)} />
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalGuideView;
