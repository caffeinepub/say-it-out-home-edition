import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useSubmitApplication } from "../hooks/useQueries";

export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    socialHandle: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useSubmitApplication();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Required";
    if (!formData.age || Number(formData.age) < 18 || Number(formData.age) > 99)
      e.age = "Enter a valid age (18+)";
    if (!formData.city.trim()) e.city = "Required";
    if (!formData.socialHandle.trim()) e.socialHandle = "Required";
    if (!formData.q1) e.q1 = "Required";
    if (!formData.q2) e.q2 = "Required";
    if (!formData.q3) e.q3 = "Required";
    if (!formData.q4.trim()) e.q4 = "Required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const personalityAnswers = JSON.stringify({
      roomEntry: formData.q1,
      midnightEnergy: formData.q2,
      socialSelf: formData.q3,
      unforgettableNight: formData.q4,
    });
    mutate(
      {
        name: formData.name,
        age: BigInt(formData.age),
        city: formData.city,
        socialHandle: formData.socialHandle,
        personalityAnswers,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  };

  const inputClass =
    "bg-[#1A1A1A] border border-[#333333] text-[#EAEAEA] placeholder:text-[#BDBDBD] focus-visible:ring-1 focus-visible:ring-[#F5C518] focus-visible:border-[#F5C518] rounded-none h-12";
  const labelClass =
    "text-[#BDBDBD] text-xs uppercase tracking-widest mb-2 block";

  const whatHappensItems = [
    {
      emoji: "🎤",
      title: "Open Mic",
      desc: "Say what you've never said out loud.",
    },
    { emoji: "🕯", title: "Confession Room", desc: "No judgement. Just truth." },
    {
      emoji: "🎧",
      title: "Midnight Radio",
      desc: "Real conversations with strangers.",
    },
    {
      emoji: "💌",
      title: "Secret Match",
      desc: "You might meet someone unexpected.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      {/* Hero Section */}
      <section
        className="noise-texture relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #1A1A1A, #121212)" }}
      >
        {/* Ambient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(245, 197, 24, 0.08) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase mb-8"
            style={{ color: "#F5C518" }}
          >
            An invitation you didn&apos;t expect.
          </motion.p>

          {/* Title image */}
          <img
            src="/assets/uploads/say_it_out_home_edition-019d2d97-f9b6-716b-bab2-6f685492ce17-1.png"
            alt="Say It Out – Home Edition"
            className="w-full max-w-2xl mx-auto mb-10"
          />

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="font-display text-[clamp(1.4rem,3vw,2.2rem)] leading-snug mb-4"
            style={{ color: "#EAEAEA" }}
          >
            40 strangers. One night. No one knows who&apos;s coming.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-sm tracking-widest mb-12"
            style={{ color: "#BDBDBD" }}
          >
            This isn&apos;t a party. It&apos;s a curated experience.
          </motion.p>

          {/* CTA */}
          <Button
            onClick={scrollToForm}
            className="bg-[#F5C518] text-black hover:bg-[#D4A373] amber-glow px-10 py-6 text-sm tracking-[0.25em] uppercase rounded-none font-medium transition-all duration-300 hover:scale-105"
            data-ocid="hero.primary_button"
          >
            👉 Unlock Your Entry
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hover:text-amber transition-colors flex flex-col items-center gap-2"
          style={{ color: "#BDBDBD" }}
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </section>

      {/* Concept Section */}
      <section className="py-32 px-6" style={{ backgroundColor: "#121212" }}>
        {/* Warm tint overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(42, 31, 27, 0.5) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-2xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-16 text-center"
              style={{ color: "#F5C518" }}
            >
              The Concept
            </p>

            <div className="space-y-12">
              <div className="border-l border-amber-subtle pl-8">
                <p
                  className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-snug"
                  style={{ color: "#EAEAEA" }}
                >
                  This is not a party. It&apos;s an experiment in human
                  connection.
                </p>
              </div>
              <div className="border-l border-amber-subtle pl-8">
                <p
                  className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-snug"
                  style={{ color: "#EAEAEA" }}
                >
                  You won&apos;t know who&apos;s attending.{" "}
                  <span className="italic" style={{ color: "#F5C518" }}>
                    We match you on vibe
                  </span>{" "}
                  — not your profile.
                </p>
              </div>
              <div className="border-l border-amber-subtle pl-8">
                <p
                  className="font-display text-[clamp(1.4rem,2.5vw,1.8rem)] leading-snug"
                  style={{ color: "#EAEAEA" }}
                >
                  Only 40 seats. Curated strangers. The location is revealed
                  only to those selected.
                </p>
              </div>
            </div>

            <div className="mt-20 pt-12 border-t border-border">
              <p
                className="text-sm leading-relaxed tracking-wide text-center italic"
                style={{ color: "#BDBDBD" }}
              >
                We understand your vibe before you enter, and match you with
                someone you&apos;ve never met.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-amber to-transparent opacity-30" />
      </div>

      {/* What Happens Inside Section */}
      <section className="py-32 px-6" style={{ backgroundColor: "#121212" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-16 text-center"
              style={{ color: "#F5C518" }}
            >
              What Happens Inside
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whatHappensItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="group p-8 border transition-all duration-300 cursor-default"
                  style={{
                    backgroundColor: "#1A1A1A",
                    borderColor: "#2A2A2A",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#F5C518";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#2A2A2A";
                  }}
                >
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3
                    className="font-display text-xl mb-3"
                    style={{ color: "#EAEAEA" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#BDBDBD" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-amber to-transparent opacity-30" />
      </div>

      {/* Glimpse Section */}
      <section className="py-32 px-6" style={{ backgroundColor: "#121212" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-16"
              style={{ color: "#F5C518" }}
            >
              A glimpse of the night
            </p>

            <div className="space-y-4">
              <p
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-snug"
                style={{ color: "#EAEAEA" }}
              >
                Moments you don&apos;t plan.
              </p>
              <p
                className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-snug"
                style={{ color: "#EAEAEA" }}
              >
                Conversations you don&apos;t forget.
              </p>
            </div>

            <div
              className="mt-16 w-16 h-px mx-auto"
              style={{ backgroundColor: "#F5C518", opacity: 0.4 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-amber to-transparent opacity-30" />
      </div>

      {/* Application Form Section */}
      <section
        ref={formRef}
        className="py-32 px-6"
        style={{ backgroundColor: "#121212" }}
      >
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-3 text-center"
              style={{ color: "#F5C518" }}
            >
              Before you enter, we need to understand your vibe.
            </p>
            <p
              className="text-xs text-center tracking-widest mb-6"
              style={{ color: "#BDBDBD" }}
            >
              Step 1 of 3
            </p>
            <h2
              className="font-display text-[clamp(2rem,5vw,3rem)] text-center mb-3"
              style={{ color: "#EAEAEA" }}
            >
              Request Your Seat
            </h2>
            <p
              className="text-sm text-center tracking-wide mb-16"
              style={{ color: "#BDBDBD" }}
            >
              Every answer tells us something. Fill this in honestly.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-20 px-6 border border-border"
                  data-ocid="form.success_state"
                >
                  <div className="w-12 h-px bg-amber mx-auto mb-8" />
                  <p
                    className="font-display text-xl leading-relaxed mb-4"
                    style={{ color: "#EAEAEA" }}
                  >
                    Your application is in.
                  </p>
                  <p
                    className="text-sm leading-loose tracking-wide"
                    style={{ color: "#BDBDBD" }}
                  >
                    We&apos;re reading between the lines.
                    <br />
                    If you&apos;re selected, you&apos;ll receive a code.
                    <br />
                    <span className="italic" style={{ color: "#F5C518" }}>
                      The rest reveals itself.
                    </span>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-10"
                  data-ocid="form.panel"
                >
                  {/* Personal Details */}
                  <div className="space-y-6">
                    <p
                      className="text-xs tracking-[0.3em] uppercase"
                      style={{ color: "#BDBDBD" }}
                    >
                      About You
                    </p>

                    <div>
                      <Label htmlFor="name" className={labelClass}>
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        data-ocid="form.input"
                        placeholder="Your full name"
                        className={inputClass}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                      {errors.name && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="form.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className={labelClass}>
                          Age
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          min={18}
                          max={99}
                          placeholder="25"
                          className={inputClass}
                          value={formData.age}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, age: e.target.value }))
                          }
                        />
                        {errors.age && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.age}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city" className={labelClass}>
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="Mumbai"
                          className={inputClass}
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, city: e.target.value }))
                          }
                        />
                        {errors.city && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="social" className={labelClass}>
                        Instagram / Contact Handle
                      </Label>
                      <Input
                        id="social"
                        placeholder="@yourhandle"
                        className={inputClass}
                        value={formData.socialHandle}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            socialHandle: e.target.value,
                          }))
                        }
                      />
                      {errors.socialHandle && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.socialHandle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Personality Questions */}
                  <div className="space-y-8">
                    <p
                      className="text-xs tracking-[0.3em] uppercase"
                      style={{ color: "#BDBDBD" }}
                    >
                      Your Vibe
                    </p>

                    <div>
                      <Label className={labelClass}>
                        When you walk into a room full of strangers, you
                        usually&hellip;
                      </Label>
                      <Select
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, q1: v }))
                        }
                        value={formData.q1}
                      >
                        <SelectTrigger
                          className={`${inputClass} w-full`}
                          data-ocid="form.select"
                        >
                          <SelectValue placeholder="Choose your answer" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border rounded-none">
                          <SelectItem value="Find the quietest corner">
                            Find the quietest corner
                          </SelectItem>
                          <SelectItem value="Start talking to someone immediately">
                            Start talking to someone immediately
                          </SelectItem>
                          <SelectItem value="Observe first, then engage">
                            Observe first, then engage
                          </SelectItem>
                          <SelectItem value="Head straight to the drinks">
                            Head straight to the drinks
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.q1 && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.q1}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className={labelClass}>
                        Your energy after midnight is&hellip;
                      </Label>
                      <Select
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, q2: v }))
                        }
                        value={formData.q2}
                      >
                        <SelectTrigger
                          className={`${inputClass} w-full`}
                          data-ocid="form.select"
                        >
                          <SelectValue placeholder="Choose your answer" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border rounded-none">
                          <SelectItem value="Still going strong">
                            Still going strong
                          </SelectItem>
                          <SelectItem value="Winding down slowly">
                            Winding down slowly
                          </SelectItem>
                          <SelectItem value="Depends on the vibe">
                            Depends on the vibe
                          </SelectItem>
                          <SelectItem value="Already asleep lol">
                            Already asleep lol
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.q2 && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.q2}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className={labelClass}>
                        Pick one word that describes your social self:
                      </Label>
                      <Select
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, q3: v }))
                        }
                        value={formData.q3}
                      >
                        <SelectTrigger
                          className={`${inputClass} w-full`}
                          data-ocid="form.select"
                        >
                          <SelectValue placeholder="Choose your word" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border rounded-none">
                          <SelectItem value="Magnetic">Magnetic</SelectItem>
                          <SelectItem value="Chill">Chill</SelectItem>
                          <SelectItem value="Intense">Intense</SelectItem>
                          <SelectItem value="Mysterious">Mysterious</SelectItem>
                          <SelectItem value="Warm">Warm</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.q3 && (
                        <p className="text-destructive text-xs mt-1">
                          {errors.q3}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="q4" className={labelClass}>
                        What would make a night unforgettable for you?
                      </Label>
                      <Textarea
                        id="q4"
                        maxLength={200}
                        rows={3}
                        placeholder="Tell us in your own words..."
                        className="bg-[#1A1A1A] border border-[#333333] text-[#EAEAEA] placeholder:text-[#BDBDBD] focus-visible:ring-1 focus-visible:ring-[#F5C518] focus-visible:border-[#F5C518] rounded-none resize-none"
                        value={formData.q4}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, q4: e.target.value }))
                        }
                        data-ocid="form.textarea"
                      />
                      <div className="flex justify-between mt-1">
                        {errors.q4 ? (
                          <p className="text-destructive text-xs">
                            {errors.q4}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p className="text-xs" style={{ color: "#BDBDBD" }}>
                          {formData.q4.length}/200
                        </p>
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-sm italic text-center"
                    style={{ color: "#BDBDBD" }}
                  >
                    Be real. This is how we match you.
                  </p>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-none py-6 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 bg-[#F5C518] text-black hover:bg-[#D4A373] amber-glow"
                    data-ocid="form.submit_button"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "👉 Enter The Experience"
                    )}
                  </Button>

                  {isPending && (
                    <p
                      className="text-xs text-center tracking-wide"
                      style={{ color: "#BDBDBD" }}
                      data-ocid="form.loading_state"
                    >
                      Processing your application...
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-border py-12 px-6"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="max-w-xl mx-auto text-center space-y-3">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "#BDBDBD" }}
          >
            Say It Out &copy; 2026
          </p>
          <p className="text-xs italic" style={{ color: "#BDBDBD" }}>
            A private experience. Not open to the public.
          </p>
          <p className="text-xs mt-6" style={{ color: "#BDBDBD" }}>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
