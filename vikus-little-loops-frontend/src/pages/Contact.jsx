import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Button from "@/components/ui/Button";
import Seo from "@/components/Seo";
import { fadeUp, stagger, reveal } from "@/lib/motion";
import { useFaqs } from "@/lib/hooks";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Tell us a little more"),
});

/* Fallback until FAQs are added in Admin → Site Content. */
const DEFAULT_FAQS = [
  ["How long does a custom order take?", "Usually 1–2 weeks depending on complexity. We'll always share a timeline before starting."],
  ["Do you ship worldwide?", "Yes! Shipping is calculated at checkout, with free gift wrapping on every order."],
  ["Can I request a specific colour?", "Absolutely — use the Custom Order page or message us on Instagram."],
];

export default function Contact() {
  const { data: apiFaqs } = useFaqs();
  const faqs = apiFaqs?.length ? apiFaqs.map((f) => [f.question, f.answer]) : DEFAULT_FAQS;
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } =
    useForm({ resolver: zodResolver(schema) });

  return (
    <main className="container-lux pb-16 pt-28 sm:pb-28 sm:pt-36">
      <Seo title="Contact" description="Questions, custom ideas, or just want to say hi? Reach Viku's Little Loops via Instagram, WhatsApp, or email." />
      <header className="text-center">
        <span className="text-[0.72rem] uppercase tracking-[0.2em] text-olive-deep">Say Hello</span>
        <h1 className="heading-display mt-3 text-[clamp(2.4rem,5.5vw,4rem)]">Let's Chat</h1>
        <p className="mx-auto mt-4 max-w-lg font-serif text-xl text-ink-soft">
          Questions, custom ideas, or just want to say hi? We'd love to hear from you.
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Form */}
        <motion.form
          variants={stagger}
          {...reveal}
          onSubmit={handleSubmit((d) => { console.log(d); reset(); })}
          noValidate
          className="rounded-xl2 border border-blush-200/50 bg-ivory/80 p-8 shadow-soft md:p-10"
        >
          {[
            { name: "name", label: "Your name", type: "text" },
            { name: "email", label: "Email", type: "email" },
          ].map((f) => (
            <motion.div key={f.name} variants={fadeUp} className="mb-5">
              <label className="mb-2 block text-sm font-medium">{f.label}</label>
              <input
                type={f.type}
                {...register(f.name)}
                className="w-full rounded-2xl border border-blush-300/50 bg-white/80 px-5 py-3.5 text-sm outline-none transition-shadow focus:border-blush-500 focus:shadow-glow"
              />
              {errors[f.name] && <p className="mt-1 text-xs text-blush-700">{errors[f.name].message}</p>}
            </motion.div>
          ))}
          <motion.div variants={fadeUp} className="mb-6">
            <label className="mb-2 block text-sm font-medium">Message</label>
            <textarea
              rows={5}
              {...register("message")}
              className="w-full rounded-2xl border border-blush-300/50 bg-white/80 px-5 py-3.5 text-sm outline-none transition-shadow focus:border-blush-500 focus:shadow-glow"
            />
            {errors.message && <p className="mt-1 text-xs text-blush-700">{errors.message.message}</p>}
          </motion.div>
          <Button type="submit">Send Message</Button>
          {isSubmitSuccessful && <p className="mt-3 text-sm text-olive-deep">Thank you! We'll reply soon. 🌸</p>}
        </motion.form>

        {/* Contact info + FAQ */}
        <div>
          <div className="flex flex-col gap-3">
            {[
              { icon: <FaInstagram />, label: "@vikuslittleloops", href: "https://www.instagram.com/vikuslittleloops" },
              { icon: <FaWhatsapp />, label: "Chat on WhatsApp", href: "https://wa.me/918979011405" },
              { icon: <FaEnvelope />, label: "hello@vikuslittleloops.com", href: "mailto:hello@vikuslittleloops.com" },
            ].map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-blush-200/50 bg-white/60 p-5 shadow-soft transition-transform hover:-translate-y-1">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blush-200 to-peach text-lg">{c.icon}</span>
                <span className="font-medium">{c.label}</span>
              </a>
            ))}
          </div>

          <h3 className="heading-display mt-10 text-2xl">Little FAQs</h3>
          <div className="mt-4 space-y-4">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-2xl border border-blush-200/50 bg-white/60 p-5">
                <summary className="cursor-pointer list-none font-medium marker:hidden">{q}</summary>
                <p className="mt-2 font-serif text-base text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
