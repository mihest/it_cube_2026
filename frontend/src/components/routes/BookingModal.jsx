import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarDays, Phone, User2, Ticket, Clock3, MapPin } from "lucide-react";
import { Label, Input } from "./ui";

export default function BookingModal({
                                         route,
                                         isOpen,
                                         onClose,
                                         onSubmitBooking,
                                     }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        date: "",
        people: "1",
        comment: "",
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setForm({
                name: "",
                phone: "",
                date: route?.bookingDates?.[0] || "",
                people: "1",
                comment: "",
            });
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, route]);

    if (!isOpen || !route) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmitBooking({
            route,
            form,
        });

        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,52,149,0.22),rgba(255,52,149,0.04))] p-6 sm:p-8">
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-white/55">
                            Бронирование маршрута
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-none sm:text-3xl">
                            {route.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                                <Ticket className="h-4 w-4 text-[#ff3495]" />
                                {route.priceFrom}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                                <Clock3 className="h-4 w-4 text-[#ff3495]" />
                                {route.duration} дн.
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                                <MapPin className="h-4 w-4 text-[#ff3495]" />
                                {route.place}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:p-8">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Имя</Label>
                                <div className="relative">
                                    <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ваше имя"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Телефон</Label>
                                <div className="relative">
                                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <Input
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+7 (___) ___-__-__"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Дата выезда</Label>
                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <select
                                        value={form.date}
                                        onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                                        className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 pl-10 pr-4 text-white outline-none focus:border-[#ff3495]"
                                    >
                                        {route.bookingDates.map((date) => (
                                            <option key={date} value={date} className="text-black">
                                                {date}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Количество человек</Label>
                                <select
                                    value={form.people}
                                    onChange={(e) => setForm((prev) => ({ ...prev, people: e.target.value }))}
                                    className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-[#ff3495]"
                                >
                                    <option value="1" className="text-black">1 человек</option>
                                    <option value="2" className="text-black">2 человека</option>
                                    <option value="3" className="text-black">3 человека</option>
                                    <option value="4+" className="text-black">4 и более</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Комментарий</Label>
                            <textarea
                                rows={4}
                                value={form.comment}
                                onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                                placeholder="Например: еду с ребёнком, нужен ранний выезд, интересует волонтёрская программа"
                                className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                            />
                        </div>

                        <div className="rounded-[22px] border border-[#ff3495]/25 bg-[#ff3495]/10 p-4 text-sm text-white/75">
                            Заявка пока сохраняется только локально во фронтенде и отображается в демо-панели администратора.
                        </div>

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                            <button
                                type="submit"
                                className="inline-flex h-12 flex-1 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883]"
                            >
                                Отправить заявку
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