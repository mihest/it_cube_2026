import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock3,
    Wallet,
    Car,
    MapPin,
    Users,
    PawPrint,
    HeartHandshake,
    ShieldCheck,
    Shuffle,
} from "lucide-react";
import { Card, CardContent, Badge, Separator } from "./ui";
import Stars from "./Stars";

export default function RouteCard({ route, onBookClick, isAuth, onShuffle }) {
    if (!route) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, scale: 0.98, filter: "blur(8px)" }}
                transition={{ duration: 0.45, type: "spring", stiffness: 160, damping: 18 }}
            >
                <Card className="overflow-hidden border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                    <div className="relative h-72 w-full overflow-hidden sm:h-80 lg:h-[380px]">
                        <img src={route.image} alt={route.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.88)_100%)]" />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                            <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 backdrop-blur">
                                <div className="flex items-center gap-2">
                                    <Stars value={route.rating} />
                                    <span className="text-sm font-semibold">{route.rating}</span>
                                    <span className="text-sm text-white/55">({route.reviewsCount})</span>
                                </div>
                            </div>

                            <div className="rounded-full border border-[#ff3495]/40 bg-[#ff3495]/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                                {route.priceFrom}
                            </div>

                            {route.volunteer && (
                                <div className="rounded-full border border-[#ff3495]/35 bg-[#ff3495]/18 px-4 py-2 text-sm font-semibold text-[#ff7cbe] backdrop-blur">
                                    Волонтёрский тур
                                </div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.35 }}
                            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                        >
                            <div className="mb-3 md:flex flex-wrap gap-2 hidden">
                                {route.interests.map((tag) => (
                                    <Badge
                                        key={tag}
                                        className="border border-white/15 bg-white/10 text-white backdrop-blur"
                                    >
                                        {tag === "history" && "История"}
                                        {tag === "culture" && "Культура"}
                                        {tag === "nature" && "Природа"}
                                        {tag === "active" && "Активный отдых"}
                                        {tag === "gastronomy" && "Гастрономия"}
                                        {tag === "volunteer" && "Волонтёрство"}
                                    </Badge>
                                ))}
                            </div>

                            <h3 className="HalvarBold text-2xl font-black uppercase sm:text-3xl">{route.title}</h3>
                            <p className="mt-2 max-w-3xl md:flex hidden text-sm leading-6 text-white/75 sm:text-base RooftopRegular">
                                {route.shortDescription}
                            </p>

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => onBookClick(route)}
                                    className="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883]"
                                >
                                    {isAuth ? "Забронировать" : "Войти для брони"}
                                </button>

                                <button
                                    onClick={onShuffle}
                                    className="inline-flex h-12 items-center justify-center rounded-[18px] border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                    <Shuffle className="mr-2 h-4 w-4" />
                                    Ещё вариант
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <CardContent className="space-y-8 p-5 sm:p-6 lg:p-8">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-white/45">
                                    <Clock3 className="h-4 w-4" /> Длительность
                                </div>
                                <div className="font-semibold text-white break-all" >{route.duration} дн.</div>
                            </div>

                            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-white/45 ">
                                    <Car className="h-4 w-4 " /> Формат
                                </div>
                                <div className="font-semibold text-white break-all">{route.typeLabel}</div>
                            </div>

                            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-white/45">
                                    <Wallet className="h-4 w-4 break-words" /> Бюджет
                                </div>
                                <div className="font-semibold text-white break-all">
                                    {route.budget === "econom" ? "Эконом" : "Средний"}
                                </div>
                            </div>

                            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                <div className="mb-2 flex items-center gap-2 text-white/45">
                                    <MapPin className="h-4 w-4" /> Локация
                                </div>
                                <div className="font-semibold text-white" break-all>{route.place}</div>
                            </div>
                        </div>

                        {route.volunteer && (
                            <div className="rounded-[26px] border border-[#ff3495]/25 bg-[linear-gradient(135deg,rgba(255,52,149,0.14),rgba(255,52,149,0.04))] p-5">
                                <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                                    <ShieldCheck className="h-5 w-5 text-[#ff3495]" />
                                    Социально значимый вклад маршрута
                                </div>
                                <p className="leading-7 text-white/75">{route.volunteerImpact}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-white RooftopMedium">Описание маршрута</h4>
                                <p className="mt-3 leading-5 text-white/70 RooftopRegular">{route.fullDescription}</p>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-lg font-semibold text-white RooftopMedium">Особенности</h4>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Badge className="bg-white/10 text-white RooftopRegular">
                                        <Users className="mr-2 h-4 w-4" />
                                        {route.company.includes("family")
                                            ? "Подходит для семьи"
                                            : route.company.includes("friends")
                                                ? "Хорошо для компании"
                                                : "Можно одному"}
                                    </Badge>

                                    <Badge className="bg-white/10 text-white RooftopRegular">
                                        <PawPrint className="mr-2 h-4 w-4" />
                                        {route.petsAllowed ? "Можно с животными" : "Без животных"}
                                    </Badge>

                                    {route.volunteer && (
                                        <Badge className="bg-[#ff3495]/15 text-[#ff6ab3] RooftopRegular">
                                            <HeartHandshake className="mr-2 h-4 w-4" />
                                            Волонтёрский формат
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-lg font-semibold text-white RooftopMedium">Советы по поездке</h4>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {route.tips.map((tip, index) => (
                                        <motion.div
                                            key={tip}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            className="RooftopRegular rounded-[22px] border border-white/10 bg-white/5 p-4 text-[16px] text-white/70"
                                        >
                                            {tip}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-lg font-semibold text-white">Галерея</h4>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {route.gallery.map((src, index) => (
                                        <motion.div
                                            key={src}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.12 + index * 0.08 }}
                                            className={`${index === 0 ? "col-span-2" : "col-span-1"} overflow-hidden rounded-[22px] border border-white/10`}
                                        >
                                            <img
                                                src={src}
                                                alt="Маршрут"
                                                className="h-40 w-full object-cover transition duration-500 hover:scale-105"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}