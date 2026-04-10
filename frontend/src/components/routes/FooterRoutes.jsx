import React from "react";
import { Leaf } from "lucide-react";

export default function FooterRoutes() {
    return (
        <footer className="border-t border-white/10 bg-[#040404]">
            <div className="mx-auto max-w-[1600px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 xl:px-16 flex justify-evently">
                <div className="space-y-4 flex">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/5 ring-1 ring-white/10">
                            <Leaf className="h-5 w-5 text-[#ff3495]" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white">Udmurtia Routes</div>
                            <div className="text-sm text-white/45">
                                Туристический подбор маршрутов с волонтёрским акцентом
                            </div>
                        </div>
                    </div>

                    <p className="max-w-2xl text-sm leading-7 text-white/55 RooftopRegular">
                        Сервис помогает выбрать поездку по Удмуртии и отдельно выделяет социально значимые
                        волонтёрские туры — форматы, где отдых сочетается с реальной помощью природе и
                        местным сообществам.
                    </p>
                </div>
            </div>
        </footer>
    );
}