import React from "react";
import { MapPin, MessageCircleMore } from "lucide-react";
import { Card, CardContent } from "./ui";
import MapBlock from "./MapBlock";
import Stars from "./Stars";
import { motion } from "framer-motion";

export default function RouteSidebar({ route, onBookClick, isAuth }) {
    return (
        <div className="space-y-5 xl:sticky xl:top-6">
            <Card className="border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <MapPin className="h-5 w-5 text-[#ff3495]" />
                        Карта маршрута
                    </div>
                    <MapBlock coordinates={route.coordinates} place={route.place} />
                </CardContent>
            </Card>

            <Card className="border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <CardContent className="p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <MessageCircleMore className="h-5 w-5 text-[#ff3495]" />
                            Отзывы
                        </div>
                        <div className="flex items-center gap-2">
                            <Stars value={route.rating} />
                            <span className="text-sm font-semibold">{route.rating}</span>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {route.comments.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 + index * 0.06 }}
                                className="rounded-[22px] border border-white/10 bg-white/5 p-4"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-white">{comment.author}</div>
                                        <div className="text-xs text-white/35">{comment.date}</div>
                                    </div>
                                    <Stars value={comment.rating} size="h-3.5 w-3.5" />
                                </div>
                                <div className="text-sm leading-6 text-white/70">{comment.text}</div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-[3px] border-[#ff3495] bg-[linear-gradient(135deg,rgba(255,52,149,0.18),rgba(255,52,149,0.04))] text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <CardContent className="p-5">
                    <div className="text-sm uppercase tracking-[0.18em] text-white/45">Бронирование</div>
                    <div className="mt-2 text-3xl font-black">{route.priceFrom}</div>
                    <div className="mt-2 text-sm text-white/70">
                        Быстрый выбор даты и заявка через модальное окно.
                    </div>

                    <div className="mt-4 grid gap-2">
                        {route.bookingDates.map((date) => (
                            <div
                                key={date}
                                className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/78"
                            >
                                {date}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => onBookClick(route)}
                        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[18px] bg-[#ff3495] px-4 text-sm font-semibold text-white transition hover:bg-[#e52883]"
                    >
                        {isAuth ? "Забронировать маршрут" : "Войти для брони"}
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}