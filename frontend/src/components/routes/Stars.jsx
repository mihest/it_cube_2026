import React from "react";
import { Star } from "lucide-react";

export default function Stars({ value = 5, size = "h-4 w-4" }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(value);
                return (
                    <Star
                        key={i}
                        className={`${size} ${filled ? "text-[#ff3495]" : "text-white/15"}`}
                        fill={filled ? "#ff3495" : "transparent"}
                    />
                );
            })}
        </div>
    );
}