import React from "react";
import { ArrowUpRight } from "lucide-react";

function getMapBounds(lat, lng, delta = 0.18) {
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    return `${left},${bottom},${right},${top}`;
}

export default function MapBlock({ coordinates, place }) {
    if (!coordinates) {
        return (
            <div className="flex h-[320px] items-center justify-center rounded-[22px] border border-white/10 bg-white/5 text-sm text-white/55">
                Координаты не заданы
            </div>
        );
    }

    const { lat, lng } = coordinates;
    const bbox = getMapBounds(lat, lng);
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
        bbox
    )}&layer=mapnik&marker=${lat},${lng}`;

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-[22px] border border-[#ff3495]/40 bg-black">
                <iframe
                    title={place || "Карта маршрута"}
                    src={src}
                    className="h-[320px] w-full"
                    loading="lazy"
                />
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <div className="mb-2 font-semibold text-white">Координаты маршрута</div>
                <div>Широта: {lat}</div>
                <div>Долгота: {lng}</div>
                <a
                    href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-[#ff3495] hover:underline"
                >
                    Открыть карту отдельно
                    <ArrowUpRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}