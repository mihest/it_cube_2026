import React from "react";
import { Search, ChevronRight } from "lucide-react";
import { Card, CardContent, Input, Label, Button } from "./ui";
import { interestOptions } from "../../utils/routesData";
import { motion } from "framer-motion";

export default function FilterPanel({
                                        filters,
                                        setFilters,
                                        onInterestToggle,
                                        onSearch,
                                        onReset,
                                    }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-6 flex items-center align-center justify-center"
        >
            <Card className="overflow-hidden text-white">
                <div className="rounded-t-[32px] border border-[3px] border-[#ff3495] border-b-0 bg-[rgba(255,52,149,0.22)] px-4 py-5 backdrop-blur-2xl sm:px-6 lg:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="left-[28%] sticky flex flex-col">
                            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/55 HalvarBold" >
                                Фильтр маршрута
                            </div>
                            <h2 className="mt-2 text-2xl font-black uppercase leading-none sm:text-3xl HalvarBold">
                                Подобрать маршрут
                            </h2>
                        </div>
                        <div className="hidden h-12 w-12 rounded-[14px] border border-white/15 bg-black/15 sm:block justify-center content-center p-2">
                            <img src="/t2_Logo_MonoWhite.png" alt="Фото" />
                        </div>
                    </div>
                </div>

                <CardContent className="space-y-6 border-[3px] border-[#ff3495] bg-[#080808] p-4 sm:p-6 lg:p-8 mt-[-2px] RooftopRegular">
                    <div className="space-y-2">
                        <Label>Поиск по названию или месту</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff3495]" />
                            <Input
                                value={filters.search}
                                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                                placeholder="Например, Ижевск или эко-маршрут"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Компания</Label>
                        <select
                            value={filters.company}
                            onChange={(e) => setFilters((prev) => ({ ...prev, company: e.target.value }))}
                            className="h-[50px] w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-white outline-none focus:border-[#ff3495]"
                        >
                            <option value="any" className="text-black">Любая</option>
                            <option value="solo" className="text-black">Один</option>
                            <option value="family" className="text-black">С семьёй</option>
                            <option value="friends" className="text-black">С друзьями</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label>Интересы</Label>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {interestOptions.map((option) => {
                                const checked = filters.interests.includes(option.value);

                                return (
                                    <motion.label
                                        key={option.value}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-3 transition ${
                                            checked
                                                ? "border-[#ff3495] bg-[#ff3495]/12"
                                                : "border-white/10 bg-white/5 hover:border-[#ff3495]/50 hover:bg-white/10"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => onInterestToggle(option.value)}
                                            className="h-4 w-4 accent-[#ff3495]"
                                        />
                                        <span className="text-sm font-semibold text-white/85">{option.label}</span>
                                    </motion.label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-3 xl:grid-cols-2">
                        <div className="space-y-3">
                            <Label>Транспорт</Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    ["any", "Не важно"],
                                    ["walking", "Пеший"],
                                    ["car", "Авто"],
                                    ["bus", "Автобус"],
                                ].map(([value, label]) => (
                                    <motion.label
                                        key={value}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-3 transition ${
                                            filters.transport === value
                                                ? "border-[#ff3495] bg-[#ff3495]/12"
                                                : "border-white/10 bg-white/5 hover:border-[#ff3495]/50 hover:bg-white/10"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="transport"
                                            value={value}
                                            checked={filters.transport === value}
                                            onChange={(e) =>
                                                setFilters((prev) => ({ ...prev, transport: e.target.value }))
                                            }
                                            className="accent-[#ff3495]"
                                        />
                                        <span className="text-sm font-semibold text-white/85">{label}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Бюджет</Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {[
                                    ["any", "Не важно"],
                                    ["econom", "Эконом"],
                                    ["medium", "Средний"],
                                ].map(([value, label]) => (
                                    <motion.label
                                        key={value}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-3 transition ${
                                            filters.budget === value
                                                ? "border-[#ff3495] bg-[#ff3495]/12"
                                                : "border-white/10 bg-white/5 hover:border-[#ff3495]/50 hover:bg-white/10"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="budget"
                                            value={value}
                                            checked={filters.budget === value}
                                            onChange={(e) =>
                                                setFilters((prev) => ({ ...prev, budget: e.target.value }))
                                            }
                                            className="accent-[#ff3495]"
                                        />
                                        <span className="text-sm font-semibold text-white/85">{label}</span>
                                    </motion.label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <motion.label
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-4 transition ${
                                filters.withPets
                                    ? "border-[#ff3495] bg-[#ff3495]/12"
                                    : "border-white/10 bg-white/5 hover:border-[#ff3495]/50 hover:bg-white/10"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={filters.withPets}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, withPets: e.target.checked }))
                                }
                                className="h-4 w-4 accent-[#ff3495]"
                            />
                            <div>
                                <div className="text-sm font-semibold text-white">Можно с животными</div>
                                <div className="text-xs text-white/45">Только pet-friendly маршруты</div>
                            </div>
                        </motion.label>

                        <motion.label
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer items-center gap-3 rounded-[18px] border px-4 py-4 transition ${
                                filters.volunteerOnly
                                    ? "border-[#ff3495] bg-[#ff3495]/12"
                                    : "border-white/10 bg-white/5 hover:border-[#ff3495]/50 hover:bg-white/10"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={filters.volunteerOnly}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, volunteerOnly: e.target.checked }))
                                }
                                className="h-4 w-4 accent-[#ff3495]"
                            />
                            <div>
                                <div className="text-sm font-semibold text-white">Только волонтёрские</div>
                                <div className="text-xs text-white/45">Социально значимые поездки</div>
                            </div>
                        </motion.label>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row">
                        <Button onClick={onSearch} className="h-12 flex-1 rounded-[18px]">
                            Найти маршрут
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>

                        <Button variant="outline" onClick={onReset} className="h-12 rounded-[18px]">
                            Сбросить
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}