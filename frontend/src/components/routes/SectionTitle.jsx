import React from "react";
import { motion } from "framer-motion";

export default function SectionTitle({ eyebrow, title, text, dark = false }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl space-y-3"
        >
            <div
                className={`inline-flex border px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${
                    dark ? "border-white/15 bg-white/5 text-white" : "border-black bg-white text-black"
                }`}
            >
                {eyebrow}
            </div>
            <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>
                {title}
            </h2>
            <p className={`text-base leading-7 ${dark ? "text-white/70" : "text-slate-600"}`}>{text}</p>
        </motion.div>
    );
}