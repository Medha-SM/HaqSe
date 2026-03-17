import { motion } from "framer-motion";
import { Printer, Building2, BadgeIndianRupee } from "lucide-react";

const STEPS = [
  {
    icon: Printer,
    title: "Print & Sign",
    description: "Get the Affidavit notarized at your nearest notary public.",
  },
  {
    icon: Building2,
    title: "Branch Visit",
    description: "Submit the complete claim packet to the deceased's home bank branch.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Funds Disbursed",
    description: "Expect the claimed amount in your linked account within 7–14 business days.",
  },
];

const NextStepsTimeline = () => (
  <div className="max-w-2xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="text-xl font-extrabold text-foreground text-center mb-8"
    >
      Next Steps for Asset Recovery
    </motion.h2>

    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

      <div className="space-y-8">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.15 }}
            className="relative flex items-start gap-5 pl-0"
          >
            <div className="relative z-10 h-12 w-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="pt-1.5">
              <h3 className="text-sm font-bold text-foreground">
                Step {i + 1}: {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default NextStepsTimeline;
