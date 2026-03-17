import { motion } from "framer-motion";
import { CheckCircle2, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TIERS = [
  {
    name: "Discovery",
    price: "Free",
    description: "Find dormant assets linked to any PAN",
    features: [
      "Scan RBI UDGAM registry",
      "Insurance registry lookup",
      "Post Office savings check",
      "Multi-institution scan",
    ],
    cta: "Start Free Scan",
    highlighted: false,
  },
  {
    name: "Claim Processing",
    price: "5%",
    priceSuffix: "success fee",
    description: "AI-powered legal documentation and claim filing",
    features: [
      "Everything in Discovery",
      "AI Legal Assistant (RAG)",
      "Auto-generated claim docket",
      "Blockchain claim verification",
      "Bank submission ready docs",
    ],
    cta: "Start Recovery",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For banks and financial institutions",
    features: [
      "Claims management dashboard",
      "Bulk claim processing API",
      "Custom workflow integration",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const STATS = [
  { value: "₹1,200 Cr+", label: "Assets Discovered" },
  { value: "15,000+", label: "Families Helped" },
  { value: "98%", label: "Success Rate" },
  { value: "45 Days", label: "Avg. Resolution" },
];

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-16 pt-8"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Recovery-as-a-Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Helping families recover dormant wealth with AI-powered legal automation.
              Pay only when you successfully recover assets.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-16">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Card className={`h-full border-border ${tier.highlighted ? "border-2 border-primary shadow-xl ring-1 ring-primary/20" : "bg-surface dark:bg-card"}`}>
                  <CardContent className="p-7 flex flex-col h-full">
                    {tier.highlighted && (
                      <span className="inline-block text-xs font-bold tracking-wider text-primary uppercase mb-3">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-lg font-extrabold text-foreground mb-1">{tier.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-extrabold text-foreground">{tier.price}</span>
                      {tier.priceSuffix && (
                        <span className="text-sm text-muted-foreground ml-1">{tier.priceSuffix}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate("/discover")}
                      className={`w-full h-12 font-bold gap-2 ${tier.highlighted ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-xl font-extrabold text-foreground">Why HaqSe?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Shield, label: "Bank-Grade Security", desc: "256-bit encryption, DPDP compliant" },
                { icon: Zap, label: "AI-Powered", desc: "RAG-based legal assistant with 98% accuracy" },
                { icon: CheckCircle2, label: "Blockchain Verified", desc: "Immutable claim proof on Polygon" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
