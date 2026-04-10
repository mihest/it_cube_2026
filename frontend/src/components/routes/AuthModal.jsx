import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, LockKeyhole, User2, Mail } from "lucide-react";
import { login, register } from "../../api/auth.api";
import { Input, Label } from "./ui";

export default function AuthModal({
                                      isOpen,
                                      mode = "login",
                                      onClose,
                                      onSwitchMode,
                                  }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setError("");
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(loginForm.username, loginForm.password);
            onClose();
        } catch (err) {
            setError(
                err?.response?.data?.message || "Не удалось выполнить вход. Проверьте данные."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (registerForm.password !== registerForm.confirmPassword) {
            setError("Пароли не совпадают.");
            return;
        }

        setLoading(true);

        try {
            await register({
                fullName: registerForm.fullName,
                username: registerForm.username,
                email: registerForm.email,
                password: registerForm.password,
            });
            onClose();
        } catch (err) {
            setError(
                err?.response?.data?.message || "Не удалось выполнить регистрацию."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="relative w-full max-w-xl overflow-hidden rounded-[32px] border-[3px] border-[#ff3495] bg-[#080808] text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(255,52,149,0.22),rgba(255,52,149,0.04))] p-6 sm:p-8">
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-white/55">
                            Личный кабинет
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-none sm:text-3xl">
                            {mode === "login" ? "Вход" : "Регистрация"}
                        </h3>

                        <div className="mt-5 flex rounded-[18px] border border-white/10 bg-white/5 p-1">
                            <button
                                onClick={() => onSwitchMode("login")}
                                className={`flex-1 rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
                                    mode === "login"
                                        ? "bg-[#ff3495] text-white"
                                        : "text-white/60 hover:text-white"
                                }`}
                            >
                                Войти
                            </button>
                            <button
                                onClick={() => onSwitchMode("register")}
                                className={`flex-1 rounded-[14px] px-4 py-2 text-sm font-semibold transition ${
                                    mode === "register"
                                        ? "bg-[#ff3495] text-white"
                                        : "text-white/60 hover:text-white"
                                }`}
                            >
                                Регистрация
                            </button>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error ? (
                            <div className="mb-5 rounded-[18px] border border-[#ff3495]/25 bg-[#ff3495]/10 px-4 py-3 text-sm text-white/85">
                                {error}
                            </div>
                        ) : null}

                        {mode === "login" ? (
                            <form onSubmit={handleLoginSubmit} className="grid gap-5">
                                <div className="space-y-2">
                                    <Label>Логин</Label>
                                    <div className="relative">
                                        <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            value={loginForm.username}
                                            onChange={(e) =>
                                                setLoginForm((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                            placeholder="Введите логин"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Пароль</Label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm((prev) => ({
                                                    ...prev,
                                                    password: e.target.value,
                                                }))
                                            }
                                            placeholder="Введите пароль"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883] disabled:opacity-60"
                                >
                                    {loading ? "Входим..." : "Войти"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegisterSubmit} className="grid gap-5">
                                <div className="space-y-2">
                                    <Label>Имя</Label>
                                    <div className="relative">
                                        <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            value={registerForm.fullName}
                                            onChange={(e) =>
                                                setRegisterForm((prev) => ({
                                                    ...prev,
                                                    fullName: e.target.value,
                                                }))
                                            }
                                            placeholder="Ваше имя"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Логин</Label>
                                    <div className="relative">
                                        <User2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            value={registerForm.username}
                                            onChange={(e) =>
                                                setRegisterForm((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                            placeholder="Придумайте логин"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                        <Input
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(e) =>
                                                setRegisterForm((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            placeholder="example@mail.com"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Пароль</Label>
                                        <div className="relative">
                                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                            <Input
                                                type="password"
                                                value={registerForm.password}
                                                onChange={(e) =>
                                                    setRegisterForm((prev) => ({
                                                        ...prev,
                                                        password: e.target.value,
                                                    }))
                                                }
                                                placeholder="Введите пароль"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Повтор пароля</Label>
                                        <div className="relative">
                                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                                            <Input
                                                type="password"
                                                value={registerForm.confirmPassword}
                                                onChange={(e) =>
                                                    setRegisterForm((prev) => ({
                                                        ...prev,
                                                        confirmPassword: e.target.value,
                                                    }))
                                                }
                                                placeholder="Повторите пароль"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex h-12 items-center justify-center rounded-[18px] bg-[#ff3495] px-5 text-sm font-semibold text-white transition hover:bg-[#e52883] disabled:opacity-60"
                                >
                                    {loading ? "Регистрируем..." : "Зарегистрироваться"}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}