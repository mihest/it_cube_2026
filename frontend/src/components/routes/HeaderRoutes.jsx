import React, { useState } from "react";
import { Mountain, User2, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";
import { logout } from "../../api/auth.api.js";
import { Button } from "./ui.jsx";

const navItems = [
    { label: "Главная", target: "routes-hero" },
    { label: "Маршруты", target: "routes-result" },
    { label: "О проекте", target: "routes-footer" },
];

export default function HeaderRoutes({
                                         onOpenLogin,
                                         onOpenRegister,
                                         onOpenAdmin,
                                     }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAuth = useAuthStore((state) => state.isAuth);
    const user = useAuthStore((state) => state.user);

    const isAdmin = user?.role === "admin";

    const scrollToBlock = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setMobileOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setMobileOpen(false);
    };

    const userName =
        user?.username || user?.userName || user?.name || user?.fullName || "Профиль";

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 xl:px-16">
                <button
                    onClick={() => scrollToBlock("routes-hero")}
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/5 ring-1 ring-white/10">
                        <img src="/t2_Logo_White.png" alt='ico'/>
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-medium uppercase tracking-[0.25em] text-white/45 HalvarBold">
                            Udmurtia Routes
                        </div>
                        <div className="text-base font-semibold text-white RooftopMedium font-[10px]">
                            Туристический рандомайзер
                        </div>
                    </div>
                </button>

                <nav className="hidden items-center gap-6 lg:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.target}
                            onClick={() => scrollToBlock(item.target)}
                            className="text-sm font-medium text-white/65 transition hover:text-white"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {isAdmin ? (
                        <Button
                            variant="outline"
                            className="rounded-[18px]"
                            onClick={onOpenAdmin}
                        >
                            <ShieldCheck className="mr-2 h-4 w-4 text-[#ff3495]" />
                            Панель заявок
                        </Button>
                    ) : null}

                    {isAuth ? (
                        <>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                                <User2 className="h-4 w-4 text-[#ff3495]" />
                                {userName}
                            </div>

                            <Button
                                variant="outline"
                                className="rounded-[18px]"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                className="rounded-[18px]"
                                onClick={onOpenLogin}
                            >
                                Войти
                            </Button>
                            <Button className="rounded-[18px]" onClick={onOpenRegister}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-white/5 text-white lg:hidden"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-white/10 bg-[#080808] lg:hidden">
                    <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-10 xl:px-16">
                        {navItems.map((item) => (
                            <button
                                key={item.target}
                                onClick={() => scrollToBlock(item.target)}
                                className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-medium text-white/75"
                            >
                                {item.label}
                            </button>
                        ))}

                        {isAdmin ? (
                            <Button
                                variant="outline"
                                className="rounded-[18px]"
                                onClick={onOpenAdmin}
                            >
                                <ShieldCheck className="mr-2 h-4 w-4 text-[#ff3495]" />
                                Панель заявок
                            </Button>
                        ) : null}

                        {isAuth ? (
                            <>
                                <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                                    Пользователь: {userName}
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-[18px]"
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="rounded-[18px]"
                                    onClick={onOpenLogin}
                                >
                                    Войти
                                </Button>
                                <Button className="rounded-[18px]" onClick={onOpenRegister}>
                                    Регистрация
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}