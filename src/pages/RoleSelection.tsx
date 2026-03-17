import { motion } from "framer-motion";
import { User, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClaim } from "@/context/ClaimContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RoleSelection = () => {
  const { setRole } = useClaim();
  const navigate = useNavigate();

  const handleSelect = (role: "user" | "bank") => {
    setRole(role);
    navigate(role === "user" ? "/" : "/institution-select");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-16 pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center mb-12"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Welcome to HaqSe
            </h1>
            <p className="text-muted-foreground text-lg">
              Dormant Asset Recovery Platform — Select your role to continue
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card
                className="border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleSelect("user")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Continue as Citizen</h2>
                  <p className="text-sm text-muted-foreground">
                    Discover dormant assets linked to a PAN, initiate claims, and track their status
                  </p>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    Enter as User
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card
                className="border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleSelect("bank")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
                    <Building2 className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Continue as Bank</h2>
                  <p className="text-sm text-muted-foreground">
                    Review and process submitted claims, approve or reject requests, manage compliance
                  </p>
                  <Button variant="outline" className="w-full font-bold border-border hover:bg-accent hover:text-accent-foreground">
                    Enter as Institution
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoleSelection;
