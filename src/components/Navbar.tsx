import { useState, useRef, useEffect } from "react";
import { Shield, X, Phone, Sun, Moon, CheckCircle2, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage, type AppLanguage } from "@/context/LanguageContext";
import { useClaim } from "@/context/ClaimContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModalStep = "phone" | "otp";

const USER_LINKS = [
  { to: "/", label: "Home" },
];

const BANK_LINKS = [
  { to: "/bank-dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, resetRole } = useClaim();
  const [loginOpen, setLoginOpen] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [dark, setDark] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const { setLanguage } = useLanguage();

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleSendOtp = () => {
    setOtp(["", "", "", ""]);
    setOtpSuccess(false);
    setModalStep("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const full = next.join("");
    if (full.length === 4) {
      if (full === "1234") {
        setOtpSuccess(true);
        setTimeout(() => {
          setLoginOpen(false);
          setAuthenticated(true);
          setModalStep("phone");
          toast({
            title: "Authenticated successfully",
            description: "Welcome to HaqSe. Your session is secured.",
          });
        }, 1200);
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please enter 1234 for the demo.",
          variant: "destructive",
        });
        setOtp(["", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const closeModal = () => {
    setLoginOpen(false);
    setModalStep("phone");
    setOtp(["", "", "", ""]);
    setOtpSuccess(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-colors duration-300">
        <div className="container mx-auto grid grid-cols-3 items-center h-16 px-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-extrabold tracking-tight text-accent">
              HaqSe
            </span>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center justify-center gap-1.5">
            {(role === "bank" ? BANK_LINKS : USER_LINKS).map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
                      : "bg-primary text-primary-foreground border-primary/80 hover:brightness-110 hover:shadow-[0_0_10px_hsl(var(--primary)/0.4)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3">
            {/* Switch Role */}
            {role && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { resetRole(); navigate("/roles"); }}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Switch Role
              </Button>
            )}
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Select language"
                >
                  <Globe className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => { setLanguage("en"); toast({ title: "Language: English", description: "Interface is already in English." }); }}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLanguage("hi"); toast({ title: "हिंदी Selected", description: "AI Localization Engine switching language interface..." }); }}>
                  हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLanguage("kn"); toast({ title: "ಕನ್ನಡ Selected", description: "AI Localization Engine switching language interface..." }); }}>
                  ಕನ್ನಡ (Kannada)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {authenticated ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">Welcome, User</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLoginOpen(true)}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold"
              >
                Secure Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {loginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-accent/60 backdrop-blur-sm dark:bg-black/70"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl p-8 dark:bg-background/90"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-extrabold text-accent">
                  Login via Account Aggregator
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Secured by RBI AA Framework
                </p>
              </div>

              <AnimatePresence mode="wait">
                {modalStep === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Enter Phone Number"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 h-12 bg-surface border-input text-base dark:bg-card"
                      />
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      className="w-full h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Send OTP
                    </Button>
                  </motion.div>
                )}

                {modalStep === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <p className="text-sm text-center text-muted-foreground">
                      Enter the 4-digit OTP sent to your phone
                    </p>

                    {otpSuccess ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="flex justify-center py-4"
                      >
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle2 className="h-10 w-10 text-primary" />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="h-14 w-14 text-center text-2xl font-bold rounded-xl border-2 border-input bg-surface dark:bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-ring focus:outline-none transition-all"
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-center text-muted-foreground">
                      Hint: Enter <span className="font-bold text-primary">1234</span> for the demo
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
