import { FOOTER_TEXT } from "@/lib/mockData";
import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="bg-accent py-8 mt-auto">
    <div className="container mx-auto px-6 text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Shield className="h-4 w-4 text-accent-foreground/40" />
        <p className="text-xs text-accent-foreground/50 font-medium">
          {FOOTER_TEXT}
        </p>
      </div>
      <p className="text-xs text-accent-foreground/30">
        © 2026 HaqSe Technologies Pvt. Ltd. · All rights reserved
      </p>
    </div>
  </footer>
);

export default Footer;
