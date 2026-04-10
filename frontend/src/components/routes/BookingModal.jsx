import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    CalendarDays,
    Phone,
    User2,
    Ticket,
    Clock3,
    MapPin,
    Users,
    AlertTriangle,
} from "lucide-react";
import { Label, Input } from "./ui.jsx";

export default function BookingModal({
                                         route,
                                         isOpen,
                                         onClose,
                                         onSubmitBooking,
                                     }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        slotId: "",
        people: 1,
        comment: "",
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";

            const firstAvailableSlot =
                route?.slots?.find((slot) => slot.isAvailable) || null;

            setForm({
                name: "",
                phone: "",
                slotId: firstAvailableSlot ? String(firstAvailableSlot.id) : "",
                people: firstAvailableSlot ? 1 : 1,
                comment: "",
            });
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, route]);

    const selectedSlot = useMemo(() => {
        if (!route?.slots?.length || !form.slotId) return null;

        return (
            route.slots.find((slot) => String(slot.id) === String(form.slotId)) || null
        );
    }, [route, form.slotId]);

    const maxPeople = selectedSlot?.availablePlaces || 0;
    const isSlotAvailable = !!selectedSlot?.isAvailable && maxPeople > 0;
    const hasAvailableSlots = !!route?.slots?.some((slot) => slot.isAvailable);

    useEffect(() => {
        if (!selectedSlot) return;

        setForm((prev) => {
            const nextPeople = Math.min(
                Math.max(Number(prev.people) || 1, 1),
                Math.max(maxPeople, 1)
            );

            if (nextPeople === prev.people) {
                return prev;
            }

            return {
                ...prev,
                people: nextPeople,
            };
        });
    }, [selectedSlot, maxPeople]);

    if (!isOpen || !route) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            alert("Выберите дату маршрута");
            return;
        }

        if (!selectedSlot.isAvailable || maxPeople <= 0) {
            alert("На выбранную дату свободных мест нет");
            return;
        }

        const peopleCount = Number(form.people);

        if (peopleCount > maxPeople) {
            alert(`Можно забронировать максимум ${maxPeople} мест`);
            return;
        }

        onSubmitBooking({
            route,
            form: {
                name: form.name,
                phone: form.phone,
                slotId: Number(form.slotId),
                people: peopleCount,
                comment: form.comment,
            },
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
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, name: e.target.value }))
                                        }
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
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, phone: e.target.value }))
                                        }
                                        placeholder="+7 (___) ___-__-__"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Дата маршрута</Label>
                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <select
                                        value={form.slotId}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                slotId: e.target.value,
                                                people: 1,
                                            }))
                                        }
                                        className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 pl-10 pr-4 text-white outline-none focus:border-[#ff3495]"
                                        required
                                        disabled={!route?.slots?.length}
                                    >
                                        <option value="" className="text-black">
                                            Выберите дату
                                        </option>

                                        {(route.slots || []).map((slot) => (
                                            <option
                                                key={slot.id}
                                                value={slot.id}
                                                disabled={!slot.isAvailable}
                                                className="text-black"
                                            >
                                                {slot.label} — мест: {slot.availablePlaces}
                                                {!slot.isAvailable ? " (нет мест)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Количество человек</Label>
                                <div className="relative">
                                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                    <input
                                        type="number"
                                        min="1"
                                        max={Math.max(maxPeople, 1)}
                                        value={form.people}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                people: Number(e.target.value),
                                            }))
                                        }
                                        disabled={!selectedSlot || !isSlotAvailable}
                                        className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 pl-10 pr-4 text-white outline-none focus:border-[#ff3495] disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedSlot ? (
                            <div
                                className={`rounded-[22px] border p-4 text-sm ${
                                    isSlotAvailable
                                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                        : "border-red-400/20 bg-red-400/10 text-red-200"
                                }`}
                            >
                                <div className="font-semibold">
                                    Дата: {selectedSlot.label}
                                </div>
                                <div className="mt-1">
                                    Всего мест: {selectedSlot.capacity}
                                </div>
                                <div className="mt-1">
                                    Уже занято: {selectedSlot.bookedCount}
                                </div>
                                <div className="mt-1">
                                    Свободно: {selectedSlot.availablePlaces}
                                </div>
                            </div>
                        ) : null}

                        {!hasAvailableSlots ? (
                            <div className="rounded-[22px] border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <div>
                                        <div className="font-semibold">Свободных дат нет</div>
                                        <div className="mt-1 text-red-100/80">
                                            Для этого маршрута пока нет доступных мест. Вы можете выбрать
                                            другой маршрут или дождаться обновления дат.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            <Label>Комментарий</Label>
                            <textarea
                                rows={4}
                                value={form.comment}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, comment: e.target.value }))
                                }
                                placeholder="Например: еду с ребёнком, нужен ранний выезд, интересует волонтёрская программа"
                                className="w-full rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#ff3495]"
                            />
                        </div>


                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                            <button
                                type="submit"
                                disabled={!selectedSlot || !isSlotAvailable}
                                className="inline-flex h-12 flex-1 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883] disabled:cursor-not-allowed disabled:opacity-50"
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