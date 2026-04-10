import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    MapPin,
    Sparkles,
    Image as ImageIcon,
    CalendarDays,
    Plus,
    Trash2,
} from "lucide-react";
import { Input, Label } from "./ui.jsx";

const emptyForm = {
    title: "",
    shortDescription: "",
    fullDescription: "",
    place: "",
    duration: "1",
    transport: "car",
    budget: "econom",
    priceFrom: "от 2 900 ₽",
    interests: "nature,volunteer",
    tips: "Удобная обувь,Вода,Хорошее настроение",
    volunteer: true,
    volunteerImpact: "",
    image: null,
    gallery: [],
    slots: [{ date: "", capacity: 1 }],
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

    const today = new Date().toISOString().split("T")[0];

    const addSlot = () => {
        setForm((prev) => ({
            ...prev,
            slots: [...prev.slots, { date: "", capacity: 1 }],
        }));
    };

    const updateSlot = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            slots: prev.slots.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            ),
        }));
    };

    const removeSlot = (index) => {
        setForm((prev) => ({
            ...prev,
            slots:
                prev.slots.length === 1
                    ? [{ date: "", capacity: 1 }]
                    : prev.slots.filter((_, i) => i !== index),
        }));
    };

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

        const slots = form.slots
            .filter((slot) => slot.date && slot.date >= today && Number(slot.capacity) > 0)
            .map((slot) => ({
                date: slot.date,
                capacity: Number(slot.capacity),
            }));

        if (!form.image) {
            alert("Выбери главное фото маршрута");
            return;
        }

        if (slots.length === 0) {
            alert("Добавь хотя бы одну будущую дату и количество мест");
            return;
        }

        const route = {
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
            rating: 0,
            reviewsCount: 0,
            priceFrom: form.priceFrom,
            image: form.image,
            gallery: form.gallery,
            tips: tips.length ? tips : ["Уточнить детали поездки"],
            coordinates: {
                lat: 56.85,
                lng: 53.2,
            },
            slots,
        };

        onCreateRoute(route);
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[130] overflow-y-auto bg-black/75 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="flex min-h-full items-start justify-center p-2 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className="relative my-2 flex w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] sm:my-6 sm:rounded-[32px] max-h-[calc(100vh-16px)] sm:max-h-[calc(100vh-48px)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/65 transition hover:bg-white/10 hover:text-white sm:right-5 sm:top-5"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="shrink-0 border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,52,149,0.22),rgba(255,52,149,0.04))] p-4 pr-14 sm:p-8 sm:pr-16">
                            <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/55 sm:text-xs">
                                Панель администратора
                            </div>
                            <h3 className="text-xl font-black uppercase leading-none sm:text-3xl">
                                Добавить маршрут
                            </h3>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                                Здесь загружаются изображения, задаются даты маршрута и количество мест на каждую дату.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-8"
                        >
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Название маршрута</Label>
                                    <div className="relative">
                                        <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            value={form.title}
                                            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                            placeholder="Название маршрута"
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
                                            placeholder="Например: Ижевск"
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
                                    className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                                        <option value="4" className="text-black">4 дня</option>
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
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Интересы через запятую</Label>
                                    <Input
                                        value={form.interests}
                                        onChange={(e) => setForm((prev) => ({ ...prev, interests: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Советы через запятую</Label>
                                    <Input
                                        value={form.tips}
                                        onChange={(e) => setForm((prev) => ({ ...prev, tips: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Главное фото</Label>
                                    <div className="relative">
                                        <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    image: e.target.files?.[0] || null,
                                                }))
                                            }
                                            className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white file:mr-3 file:rounded-[12px] file:border-0 file:bg-[#ff3495] file:px-3 file:py-2 file:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Галерея</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                gallery: Array.from(e.target.files || []),
                                            }))
                                        }
                                        className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-3 file:rounded-[12px] file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white"
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
                                        className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                                    />
                                </div>
                            ) : null}

                            <div className="space-y-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <Label>Даты маршрута и места</Label>
                                    <button
                                        type="button"
                                        onClick={addSlot}
                                        className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#ff3495] px-4 py-2 text-sm font-semibold text-[#ff3495] transition hover:bg-[#ff3495]/10"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Добавить дату
                                    </button>
                                </div>

                                <div className="grid gap-3">
                                    {form.slots.map((slot, index) => (
                                        <div
                                            key={index}
                                            className="grid gap-3 rounded-[18px] border border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_180px_56px]"
                                        >
                                            <div className="space-y-2">
                                                <Label>Дата</Label>
                                                <div className="relative">
                                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                                    <input
                                                        type="date"
                                                        min={today}
                                                        value={slot.date}
                                                        onChange={(e) => updateSlot(index, "date", e.target.value)}
                                                        className="h-[50px] w-full rounded-[18px] border border-white/10 bg-[#0f0f0f] pl-10 pr-4 text-white outline-none focus:border-[#ff3495]"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Мест</Label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={slot.capacity}
                                                    onChange={(e) => updateSlot(index, "capacity", e.target.value)}
                                                    className="h-[50px] w-full rounded-[18px] border border-white/10 bg-[#0f0f0f] px-4 text-white outline-none focus:border-[#ff3495]"
                                                    required
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSlot(index)}
                                                    className="flex h-[50px] w-full items-center justify-center rounded-[18px] border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="sticky bottom-0 -mx-4 mt-1 border-t border-white/10 bg-[#080808] px-4 pb-1 pt-4 sm:-mx-8 sm:px-8">
                                <div className="flex flex-col gap-3 sm:flex-row">
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
                            </div>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}