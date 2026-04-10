import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    ShieldCheck,
    CalendarDays,
    User2,
    Phone,
    Mail,
    MapPin,
    Ticket,
    Clock3,
    CheckCircle2,
    Ban,
    AlertCircle,
    Plus,
} from "lucide-react";

const statusMap = {
    pending: {
        label: "На рассмотрении",
        className: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
        icon: AlertCircle,
    },
    approved: {
        label: "Принята",
        className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        icon: CheckCircle2,
    },
    cancelled: {
        label: "Отменена",
        className: "border-red-400/20 bg-red-400/10 text-red-300",
        icon: Ban,
    },
};

export default function AdminBookingsModal({
                                               isOpen,
                                               onClose,
                                               bookings,
                                               onUpdateStatus,
                                               onOpenAddRoute,
                                           }) {
    if (!isOpen) return null;

    const pendingCount = bookings.filter((item) => item.status === "pending").length;
    const approvedCount = bookings.filter((item) => item.status === "approved").length;
    const cancelledCount = bookings.filter((item) => item.status === "cancelled").length;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[120] bg-[#030303] text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="flex h-full flex-col">
                    <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,52,149,0.18),rgba(255,52,149,0.04))] px-4 py-5 sm:px-6 lg:px-10 xl:px-16">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                                <div className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-white/45">
                                    Панель администратора
                                </div>
                                <h2 className="text-2xl font-black uppercase sm:text-3xl">
                                    Бронирования маршрутов
                                </h2>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onOpenAddRoute}
                                    className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883]"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Добавить маршрут
                                </button>

                                <button
                                    onClick={onClose}
                                    className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:max-w-3xl">
                            <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                                <div className="text-sm text-white/50">На рассмотрении</div>
                                <div className="mt-1 text-3xl font-black text-yellow-300">{pendingCount}</div>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                                <div className="text-sm text-white/50">Приняты</div>
                                <div className="mt-1 text-3xl font-black text-emerald-300">{approvedCount}</div>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                                <div className="text-sm text-white/50">Отменены</div>
                                <div className="mt-1 text-3xl font-black text-red-300">{cancelledCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 xl:px-16">
                        <div className="grid gap-5">
                            {bookings.length === 0 ? (
                                <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-white/60">
                                    Пока нет бронирований.
                                </div>
                            ) : (
                                bookings.map((booking, index) => {
                                    const statusInfo = statusMap[booking.status];
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className="rounded-[28px] border border-white/10 bg-[#080808] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.35)]"
                                        >
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                                <div className="space-y-4 xl:flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                                                            <ShieldCheck className="h-4 w-4 text-[#ff3495]" />
                                                            Бронь #{booking.id}
                                                        </div>

                                                        <div
                                                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusInfo.className}`}
                                                        >
                                                            <StatusIcon className="h-4 w-4" />
                                                            {statusInfo.label}
                                                        </div>

                                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/55">
                                                            <CalendarDays className="h-4 w-4 text-[#ff3495]" />
                                                            Создано: {booking.createdAt}
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                                                        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                                            <div className="mb-3 text-sm font-semibold text-white">
                                                                Информация о маршруте
                                                            </div>
                                                            <div className="space-y-2 text-sm text-white/70">
                                                                <div className="font-semibold text-white">{booking.route.title}</div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.route.place}
                                                                </div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <Clock3 className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.route.duration} дн.
                                                                </div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <CalendarDays className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.route.date}
                                                                </div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <Ticket className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.route.priceFrom}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                                            <div className="mb-3 text-sm font-semibold text-white">
                                                                Информация о пользователе
                                                            </div>
                                                            <div className="space-y-2 text-sm text-white/70">
                                                                <div className="inline-flex items-center gap-2">
                                                                    <User2 className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.user.fullName}
                                                                </div>
                                                                <div className="text-white/50">@{booking.user.username}</div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <Mail className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.user.email}
                                                                </div>
                                                                <div className="inline-flex items-center gap-2">
                                                                    <Phone className="h-4 w-4 text-[#ff3495]" />
                                                                    {booking.user.phone}
                                                                </div>
                                                                <div className="text-white/60">
                                                                    Количество человек: {booking.people}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                                                        <div className="mb-2 text-sm font-semibold text-white">
                                                            Комментарий к бронированию
                                                        </div>
                                                        <div className="text-sm leading-6 text-white/70">
                                                            {booking.comment || "Без комментария"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex min-w-[220px] flex-col gap-3 xl:pl-4">
                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, "approved")}
                                                        className="inline-flex h-12 items-center justify-center rounded-[18px] bg-emerald-500/15 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                                                    >
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Принять бронь
                                                    </button>

                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, "cancelled")}
                                                        className="inline-flex h-12 items-center justify-center rounded-[18px] bg-red-500/15 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                                                    >
                                                        <Ban className="mr-2 h-4 w-4" />
                                                        Отменить бронь
                                                    </button>

                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, "pending")}
                                                        className="inline-flex h-12 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10"
                                                    >
                                                        Вернуть в ожидание
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}