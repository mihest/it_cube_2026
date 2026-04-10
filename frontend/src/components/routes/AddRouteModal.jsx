import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Image as ImageIcon, Sparkles, CalendarDays } from "lucide-react";
import { Input, Label } from "./ui";

const emptyForm = {
    title: "",
    shortDescription: "",
    fullDescription: "",
    place: "",
    duration: "1",
    transport: "car",
    budget: "econom",
    priceFrom: "от 2 900 ₽",
    bookingDate: "",
    image: "",
    interests: "nature,volunteer",
    tips: "Удобная обувь,Вода,Хорошее настроение",
    volunteer: true,
    volunteerImpact: "",
};

export default function AddRouteModal({ isOpen, onClose, onCreateRoute }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setForm(emptyForm);
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const interests = form.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const tips = form.tips
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const route = {
            id: Date.now(),
            title: form.title,
            shortDescription: form.shortDescription,
            fullDescription: form.fullDescription,
            duration: form.duration,
            company: ["solo", "friends"],
            transport: form.transport,
            budget: form.budget,
            interests: interests.length ? interests : ["nature"],
            volunteer: form.volunteer,
            volunteerImpact: form.volunteer ? form.volunteerImpact : "",
            petsAllowed: false,
            kidsAllowed: true,
            typeLabel:
                form.transport === "car"
                    ? "Автомобильный"
                    : form.transport === "bus"
                        ? "Автобусный"
                        : "Пеший",
            place: form.place,
            rating: 4.8,
            reviewsCount: 0,
            priceFrom: form.priceFrom,
            bookingDates: form.bookingDate ? [form.bookingDate] : ["Дата уточняется"],
            image:
                form.image ||
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
            gallery: [
                form.image ||
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
            ],
            tips: tips.length ? tips : ["Уточнить детали поездки"],
            coordinates: {
                lat: 56.85,
                lng: 53.2,
            },
            comments: [],
        };

        onCreateRoute(route);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[130] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,52,149,0.22),rgba(255,52,149,0.04))] p-6 sm:p-8">
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-white/55">
                            Панель администратора
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-none sm:text-3xl">
                            Добавить маршрут
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:p-8">
                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Название маршрута</Label>
                                <div className="relative">
                                    <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Например: Волонтёрский тур «Чистый берег»"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Локация</Label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        value={form.place}
                                        onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value }))}
                                        placeholder="Например: Воткинский район"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Краткое описание</Label>
                            <textarea
                                rows={3}
                                value={form.shortDescription}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, shortDescription: e.target.value }))
                                }
                                placeholder="Короткий текст для карточки маршрута"
                                className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Полное описание</Label>
                            <textarea
                                rows={4}
                                value={form.fullDescription}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, fullDescription: e.target.value }))
                                }
                                placeholder="Подробное описание маршрута"
                                className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                                required
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label>Длительность</Label>
                                <select
                                    value={form.duration}
                                    onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                                    className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-[#ff3495]"
                                >
                                    <option value="1" className="text-black">1 день</option>
                                    <option value="2" className="text-black">2 дня</option>
                                    <option value="3" className="text-black">3 дня</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Транспорт</Label>
                                <select
                                    value={form.transport}
                                    onChange={(e) => setForm((prev) => ({ ...prev, transport: e.target.value }))}
                                    className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-[#ff3495]"
                                >
                                    <option value="car" className="text-black">Авто</option>
                                    <option value="bus" className="text-black">Автобус</option>
                                    <option value="walking" className="text-black">Пеший</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Бюджет</Label>
                                <select
                                    value={form.budget}
                                    onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                                    className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-[#ff3495]"
                                >
                                    <option value="econom" className="text-black">Эконом</option>
                                    <option value="medium" className="text-black">Средний</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Цена</Label>
                                <Input
                                    value={form.priceFrom}
                                    onChange={(e) => setForm((prev) => ({ ...prev, priceFrom: e.target.value }))}
                                    placeholder="от 2 900 ₽"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Дата бронирования</Label>
                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        value={form.bookingDate}
                                        onChange={(e) => setForm((prev) => ({ ...prev, bookingDate: e.target.value }))}
                                        placeholder="Например: 22–24 июля"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Ссылка на изображение</Label>
                                <div className="relative">
                                    <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        value={form.image}
                                        onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Интересы через запятую</Label>
                                <Input
                                    value={form.interests}
                                    onChange={(e) => setForm((prev) => ({ ...prev, interests: e.target.value }))}
                                    placeholder="nature,volunteer,active"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Советы через запятую</Label>
                                <Input
                                    value={form.tips}
                                    onChange={(e) => setForm((prev) => ({ ...prev, tips: e.target.value }))}
                                    placeholder="Вода,Удобная обувь,Дождевик"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                            <input
                                type="checkbox"
                                checked={form.volunteer}
                                onChange={(e) => setForm((prev) => ({ ...prev, volunteer: e.target.checked }))}
                                className="h-4 w-4 accent-[#ff3495]"
                            />
                            <div>
                                <div className="text-sm font-semibold text-white">Волонтёрский маршрут</div>
                                <div className="text-xs text-white/45">
                                    Отметить как социально значимую поездку
                                </div>
                            </div>
                        </label>

                        {form.volunteer ? (
                            <div className="space-y-2">
                                <Label>Социально значимый вклад</Label>
                                <textarea
                                    rows={3}
                                    value={form.volunteerImpact}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, volunteerImpact: e.target.value }))
                                    }
                                    placeholder="Например: уборка троп, помощь природе, работа с местным сообществом"
                                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                                />
                            </div>
                        ) : null}


                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                            <button
                                type="submit"
                                className="inline-flex h-12 flex-1 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883]"
                            >
                                Добавить маршрут
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}