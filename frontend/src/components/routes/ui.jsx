import React from "react";
import { motion } from "framer-motion";

export const adaptiveRadius = "clamp(24px, 2vw, 40px)";

export function Card({ className = "", children, style = {} }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            style={{ borderRadius: adaptiveRadius, ...style }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function CardContent({ className = "", children }) {
    return <div className={className}>{children}</div>;
}

export function Button({ className = "", children, variant = "default", ...props }) {
    const base =
        "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition focus:outline-none";
    const styles =
        variant === "outline"
            ? "border border-white/15 bg-white/5 text-white hover:bg-white/10"
            : "bg-[#ff3495] text-white hover:bg-[#e52883]";

    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className={`${base} ${styles} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495] ${className}`}
            {...props}
        />
    );
}

export function Badge({ className = "", children }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}>
      {children}
    </span>
    );
}

export function Label({ className = "", children, ...props }) {
    return (
        <label className={`text-sm font-medium text-white/80 ${className}`} {...props}>
            {children}
        </label>
    );
}

export function Separator({ className = "" }) {
    return <div className={`h-px w-full bg-white/10 ${className}`} />;
}