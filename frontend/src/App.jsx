import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeInfo, Search } from "lucide-react";

import { useAuthStore } from "./store/authStore.js";
import { routesData } from "./utils/routesData.js";
import { mockBookings } from "./utils/mockBookings.js";

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

export default function App() {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);

  const [routes, setRoutes] = useState(routesData);

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
  const [bookings, setBookings] = useState(mockBookings);

  const resultSectionRef = useRef(null);

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

      const matchSearch =
          !filters.search ||
          route.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          route.shortDescription
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
          route.place.toLowerCase().includes(filters.search.toLowerCase()) ||
          route.fullDescription
              .toLowerCase()
              .includes(filters.search.toLowerCase());

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

  const handleSubmitBooking = ({ route, form }) => {
    const booking = {
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toLocaleString("ru-RU"),
      route: {
        id: route.id,
        title: route.title,
        place: route.place,
        duration: route.duration,
        date: form.date,
        priceFrom: route.priceFrom,
      },
      user: {
        fullName:
            user?.fullName ||
            user?.name ||
            user?.username ||
            form.name ||
            "Пользователь",
        username: user?.username || "user",
        email: user?.email || "email@example.com",
        phone: form.phone,
      },
      people: form.people,
      comment: form.comment,
    };

    setBookings((prev) => [booking, ...prev]);
    alert("Заявка на бронирование отправлена");
  };

  const handleUpdateBookingStatus = (bookingId, nextStatus) => {
    setBookings((prev) =>
        prev.map((item) =>
            item.id === bookingId ? { ...item, status: nextStatus } : item
        )
    );
  };

  const handleCreateRoute = (newRoute) => {
    setRoutes((prev) => [newRoute, ...prev]);
    setIsAddRouteOpen(false);
    alert("Маршрут добавлен локально");
  };

  return (
      <div className="min-h-screen bg-[#050505] text-white">
        <HeaderRoutes
            onOpenLogin={openLoginModal}
            onOpenRegister={openRegisterModal}
            onOpenAdmin={() => setIsAdminOpen(true)}
        />

        <section
            id="routes-hero"
            className="relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#050505_100%)] text-white"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,52,149,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,52,149,0.12),transparent_25%)]" />

          <div className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-8 sm:px-6 lg:px-10 xl:px-16">
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
            className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20 xl:px-16"
        >
          <SectionTitle
              eyebrow="Результат"
              title="Маршрут, карта, отзывы и бронирование"
              text="После нажатия на кнопку сайт фильтрует данные и показывает один случайный маршрут. Волонтёрские поездки визуально выделены и содержат блок с общественно полезным вкладом."
              dark
          />

          <div className="mt-10">
            {!hasSearched ? (
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
      </div>
  );
}