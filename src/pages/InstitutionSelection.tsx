import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClaim, type Institution } from "@/context/ClaimContext";
import { useNavigate } from "react-router-dom";

const INSTITUTIONS: { id: Institution; name: string; desc: string }[] = [
  { id: "SBI", name: "State Bank of India", desc: "View and process SBI dormant asset claims" },
  { id: "HDFC", name: "HDFC Bank", desc: "Manage HDFC savings & deposit claims" },
  { id: "POST", name: "Post Office", desc: "Handle postal scheme & NSC claims" },
];

const InstitutionSelection = () => {
  const { setInstitution, resetRole } = useClaim();
  const navigate = useNavigate();

  const handleSelect = (inst: Institution) => {
    setInstitution(inst);
    navigate("/bank-dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl w-full text-center mb-10">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Select Your Institution</h1>
        <p className="text-muted-foreground">Choose the bank or institution you represent</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl w-full">
        {INSTITUTIONS.map((inst, i) => (
          <motion.div key={inst.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card
              className="border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full"
              onClick={() => handleSelect(inst.id)}
            >
              <CardContent className="p-6 text-center space-y-3 flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{inst.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{inst.desc}</p>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold mt-3">
                  Select
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button variant="ghost" className="mt-8 gap-2 text-muted-foreground" onClick={() => { resetRole(); navigate("/roles"); }}>
        <ArrowLeft className="h-4 w-4" /> Back to Role Selection
      </Button>
    </div>
  );
};

export default InstitutionSelection;
