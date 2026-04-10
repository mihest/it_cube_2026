import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trees, HeartHandshake, Camera } from "lucide-react";
import { Badge, Card, CardContent } from "./ui";

const stats = [
    { label: "маршрутов в базе", value: "10+" },
    { label: "волонтёрских программ", value: "4+" },
    { label: "вариантов подбора", value: "100+" },
];

export default function HeroRoutes({ filteredCount }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="flex flex-col gap-6"
        >
            <div className="space-y-7 rounded-[32px] border-[3px] border-[#ff3495] bg-white/5 p-4 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 backdrop-blur">
                    <Sparkles className="h-4 w-4 text-[#ff3495]" />
                    Подбор маршрута по интересам, бюджету и формату поездки
                </div>

                <div className="space-y-5">
                    <h1 className="HalvarBold max-w-5xl text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                        Маршруты по Удмуртии
                        <br />
                        с акцентом на волонтёрский туризм
                    </h1>

                    <p className=" RooftopRegular max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
                        Сервис подбирает маршруты не только по отдыху и интересам, но и помогает
                        включать в поездку общественно полезные активности: помощь природе,
                        участие в локальных экологических акциях и взаимодействие с местными
                        сообществами.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Badge className="border border-white/10 bg-white/10 text-white backdrop-blur">
                        <Trees className="mr-2 h-4 w-4 text-[#ff3495]" />
                        Природа и маршруты
                    </Badge>
                    <Badge className="border border-[#ff3495]/30 bg-[#ff3495]/15 text-[#ff78bc]">
                        <HeartHandshake className="mr-2 h-4 w-4" />
                        Волонтёрские туры
                    </Badge>
                    <Badge className="border border-white/10 bg-white/10 text-white backdrop-blur">
                        <Camera className="mr-2 h-4 w-4 text-[#ff3495]" />
                        Современный интерфейс
                    </Badge>
                </div>

                <div className="grid max-w-3xl grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                    {stats.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
                        >
                            <Card className="border border-white/10 bg-white/5 text-white shadow-none backdrop-blur">
                                <CardContent className="p-5">
                                    <div className="text-2xl font-semibold">{item.value}</div>
                                    <div className="mt-1 text-sm text-white/60">{item.label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="space-y-5 rounded-[32px] border-[3px] border-[#ff3495] bg-[rgba(255,52,149,0.18)] p-4 backdrop-blur-2xl sm:p-6">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-white/65">
                    Подходящих вариантов
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={filteredCount}
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -8 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className=" HalvarBold text-[42px] font-black leading-none sm:text-[56px] xl:text-[72px]"
                    >
                        {filteredCount}
                    </motion.div>
                </AnimatePresence>

                <div className="text-sm text-white/70 RooftopRegular">
                    После нажатия будет выбран случайный маршрут из найденных.
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/75">
                    Особое внимание в подборе уделяется волонтёрским турам — поездкам с элементами помощи природе, благоустройства маршрутов и участия в социально значимых локальных инициативах.
                </div>
            </div>
        </motion.div>
    );
}