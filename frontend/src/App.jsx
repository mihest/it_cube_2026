import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeInfo, Search } from "lucide-react";

import { useAuthStore } from "./store/authStore.js";
import { refreshSession } from "./api/auth.api.js";
import { getRoutes } from "./api/routes.api.js";
import { createBooking } from "./api/bookings.api.js";
import {
  createAdminRoute,
  getAdminBookings,
  updateAdminBookingStatus,
} from "./api/admin.api.js";

import HeaderRoutes from "./components/routes/HeaderRoutes.jsx";
import HeroRoutes from "./components/routes/HeroRoutes.jsx";
import FilterPanel from "./components/routes/FilterPanel.jsx";
import RouteCard from "./components/routes/RouteCard.jsx";
import RouteSidebar from "./components/routes/RouteSidebar.jsx";
import BookingModal from "./components/routes/BookingModal.jsx";
import AuthModal from "./components/routes/AuthModal.jsx";
import AdminBookingsModal from "./components/routes/AdminBookingsModal.jsx";
import AddRouteModal from "./components/routes/AddRouteModal.jsx";
import FooterRoutes from "./components/routes/FooterRoutes.jsx";
import SectionTitle from "./components/routes/SectionTitle.jsx";
import { Card, CardContent, Button } from "./components/routes/ui.jsx";

function getRandomItem(items, currentId = null) {
  if (!items.length) return null;
  if (items.length === 1) return items[0];

  let next = items[Math.floor(Math.random() * items.length)];
  while (next.id === currentId) {
    next = items[Math.floor(Math.random() * items.length)];
  }
  return next;
}

function normalizeBooking(booking) {
  return {
    ...booking,
    createdAt: booking?.createdAt
        ? new Date(booking.createdAt).toLocaleString("ru-RU")
        : "",
  };
}

export default function App() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.isLoading);

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routesError, setRoutesError] = useState("");

  const [filters, setFilters] = useState({
    company: "any",
    transport: "any",
    budget: "any",
    withPets: false,
    volunteerOnly: false,
    interests: [],
    search: "",
  });

  const [currentRoute, setCurrentRoute] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoute, setBookingRoute] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const resultSectionRef = useRef(null);

  useEffect(() => {
    refreshSession();
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setRoutesLoading(true);
    setRoutesError("");

    try {
      const data = await getRoutes();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setRoutesError("Не удалось загрузить маршруты.");
    } finally {
      setRoutesLoading(false);
    }
  };

  const loadAdminBookings = async () => {
    setAdminLoading(true);

    try {
      const data = await getAdminBookings();
      setBookings((data || []).map(normalizeBooking));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Не удалось загрузить бронирования.");
    } finally {
      setAdminLoading(false);
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const matchCompany =
          filters.company === "any" || route.company.includes(filters.company);

      const matchTransport =
          filters.transport === "any" || route.transport === filters.transport;

      const matchBudget =
          filters.budget === "any" || route.budget === filters.budget;

      const matchPets = !filters.withPets || route.petsAllowed;
      const matchVolunteer = !filters.volunteerOnly || route.volunteer;

      const search = filters.search.trim().toLowerCase();

      const matchSearch =
          !search ||
          route.title.toLowerCase().includes(search) ||
          route.shortDescription.toLowerCase().includes(search) ||
          route.place.toLowerCase().includes(search) ||
          route.fullDescription.toLowerCase().includes(search);

      const matchInterests =
          filters.interests.length === 0 ||
          filters.interests.some((item) => route.interests.includes(item));

      return (
          matchCompany &&
          matchTransport &&
          matchBudget &&
          matchPets &&
          matchVolunteer &&
          matchSearch &&
          matchInterests
      );
    });
  }, [routes, filters]);

  const handleInterestToggle = (value) => {
    setFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
          ? prev.interests.filter((item) => item !== value)
          : [...prev.interests, value],
    }));
  };

  const handleSearch = () => {
    const next = getRandomItem(filteredRoutes);
    setCurrentRoute(next);
    setHasSearched(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 180);
    });
  };

  const handleShuffle = () => {
    const next = getRandomItem(filteredRoutes, currentRoute?.id);
    setCurrentRoute(next);
  };

  const resetFilters = () => {
    setFilters({
      company: "any",
      transport: "any",
      budget: "any",
      withPets: false,
      volunteerOnly: false,
      interests: [],
      search: "",
    });
    setCurrentRoute(null);
    setHasSearched(false);
  };

  const openBookingModal = (route) => {
    if (!route) return;
    setBookingRoute(route);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setBookingRoute(null);
  };

  const openLoginModal = () => {
    setAuthMode("login");
    setIsAuthOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
  };

  const handleBookClick = (route) => {
    if (!route) return;

    if (!isAuth) {
      setAuthMode("login");
      setIsAuthOpen(true);
      return;
    }

    openBookingModal(route);
  };

  const handleSubmitBooking = async ({ route, form }) => {
    try {
      const created = await createBooking({
        routeId: route.id,
        slotId: form.slotId,
        people: form.people,
        phone: form.phone,
        comment: form.comment,
      });

      setBookings((prev) => [normalizeBooking(created), ...prev]);
      await loadRoutes();
      alert("Заявка на бронирование отправлена");
    } catch (e) {
      console.error(e);
      alert(
          e?.response?.data?.message || "Не удалось отправить заявку."
      );
    }
  };

  const handleOpenAdmin = async () => {
    if (!isAuth) {
      setAuthMode("login");
      setIsAuthOpen(true);
      return;
    }

    if (user?.role !== "admin") {
      alert("Доступ только для администратора.");
      return;
    }

    setIsAdminOpen(true);
    await loadAdminBookings();
  };

  const handleUpdateBookingStatus = async (bookingId, nextStatus) => {
    try {
      const updated = await updateAdminBookingStatus(bookingId, nextStatus);
      const normalized = normalizeBooking(updated);

      setBookings((prev) =>
          prev.map((item) => (item.id === bookingId ? normalized : item))
      );
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Не удалось обновить статус брони.");
    }
  };

  const handleCreateRoute = async (newRoute) => {
    try {
      const created = await createAdminRoute(newRoute);
      setRoutes((prev) => [created, ...prev]);
      setIsAddRouteOpen(false);
      alert("Маршрут добавлен");
    } catch (e) {
      console.error("CREATE ROUTE ERROR:", e?.response?.data || e);

      const errors = e?.response?.data?.errors;

      if (errors) {
        const text = Object.entries(errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n");

        alert(text);
      } else {
        alert(e?.response?.data?.message || "Не удалось добавить маршрут.");
      }
    }
  };

  return (
      <div className="min-h-screen bg-[#050505] text-white">
        <HeaderRoutes
            onOpenLogin={openLoginModal}
            onOpenRegister={openRegisterModal}
            onOpenAdmin={handleOpenAdmin}
        />

        <section
            id="routes-hero"
            className="relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#050505_100%)] text-white"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,52,149,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,52,149,0.12),transparent_25%)]" />

          <div className="relative mx-auto max-w-[1700px] px-4 pb-12 pt-8 sm:px-6 lg:px-10 xl:px-16">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <HeroRoutes filteredCount={filteredRoutes.length} />

              <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  onInterestToggle={handleInterestToggle}
                  onSearch={handleSearch}
                  onReset={resetFilters}
              />
            </div>
          </div>
        </section>

        <section
            id="routes-result"
            ref={resultSectionRef}
            className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20 xl:px-16 flex flex-col justify-center items-center"
        >
          <SectionTitle
              eyebrow="Результат"
              title="Маршрут, карта, отзывы и бронирование"
              text="После нажатия на кнопку сайт фильтрует данные и показывает один случайный маршрут. Волонтёрские поездки визуально выделены и содержат блок с общественно полезным вкладом."
              dark
          />

          <div className="mt-10">
            {routesLoading || isLoadingAuth ? (
                <Card className="border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-center text-white/65">
                    Загрузка данных...
                  </CardContent>
                </Card>
            ) : routesError ? (
                <Card className="border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                  <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
                    <div className="text-white/70">{routesError}</div>
                    <Button onClick={loadRoutes} className="mt-5 rounded-[18px]">
                      Повторить загрузку
                    </Button>
                  </CardContent>
                </Card>
            ) : !hasSearched ? (
                <AnimatePresence mode="wait">
                  <motion.div
                      key="placeholder"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                  >
                    <Card className="border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                      <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center sm:min-h-[520px] sm:p-8">
                        <div className="max-w-md">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-[#ff3495]">
                            <BadgeInfo className="h-8 w-8" />
                          </div>
                          <h3 className="text-2xl font-semibold text-white">
                            Маршрут пока не выбран
                          </h3>
                          <p className="mt-3 leading-7 text-white/60">
                            Заполните фильтры и нажмите кнопку поиска. После этого
                            появится карточка маршрута, карта, отзывы и модальное
                            окно бронирования.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
            ) : currentRoute ? (
                <div className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
                  <RouteCard
                      route={currentRoute}
                      isAuth={isAuth}
                      onBookClick={handleBookClick}
                      onShuffle={handleShuffle}
                  />

                  <RouteSidebar
                      route={currentRoute}
                      isAuth={isAuth}
                      onBookClick={handleBookClick}
                  />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                  >
                    <Card className="border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                      <CardContent className="flex min-h-[420px] flex-col items-center justify-center p-6 text-center sm:min-h-[520px] sm:p-8">
                        <div className="max-w-md">
                          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-[#ff3495]">
                            <Search className="h-8 w-8" />
                          </div>
                          <h3 className="text-2xl font-semibold text-white">
                            Ничего не найдено
                          </h3>
                          <p className="mt-3 leading-7 text-white/60">
                            По выбранным критериям подходящих маршрутов нет.
                            Попробуйте убрать часть ограничений или изменить
                            интересы.
                          </p>
                          <Button
                              onClick={resetFilters}
                              className="mt-6 rounded-[18px]"
                          >
                            Сбросить фильтры
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
            )}
          </div>
        </section>

        <div id="routes-footer">
          <FooterRoutes />
        </div>

        <BookingModal
            route={bookingRoute}
            isOpen={isBookingOpen}
            onClose={closeBookingModal}
            onSubmitBooking={handleSubmitBooking}
        />

        <AuthModal
            isOpen={isAuthOpen}
            mode={authMode}
            onClose={closeAuthModal}
            onSwitchMode={setAuthMode}
        />

        <AdminBookingsModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onOpenAddRoute={() => setIsAddRouteOpen(true)}
        />

        <AddRouteModal
            isOpen={isAddRouteOpen}
            onClose={() => setIsAddRouteOpen(false)}
            onCreateRoute={handleCreateRoute}
        />

        {isAdminOpen && adminLoading ? (
            <div className="fixed bottom-5 right-5 rounded-[18px] border border-white/10 bg-black/70 px-4 py-3 text-sm text-white/75 backdrop-blur">
              Обновление заявок...
            </div>
        ) : null}
      </div>
  );
}