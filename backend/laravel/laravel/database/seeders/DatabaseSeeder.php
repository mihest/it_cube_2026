<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\RouteComment;
use App\Models\RouteSlot;
use App\Models\TravelRoute;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'username' => 'admin',
                'full_name' => 'Администратор',
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        $user = User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'username' => 'user',
                'full_name' => 'Тестовый пользователь',
                'password' => Hash::make('123456'),
                'role' => 'user',
            ]
        );

        $createRoute = function (array $routeData, array $slots = [], array $comments = []) {
            $route = TravelRoute::create($routeData);

            $createdSlots = [];
            foreach ($slots as $slot) {
                $createdSlots[] = RouteSlot::create([
                    'travel_route_id' => $route->id,
                    'date' => $slot['date'],
                    'capacity' => $slot['capacity'],
                    'booked_count' => $slot['booked_count'] ?? 0,
                    'is_active' => $slot['is_active'] ?? true,
                ]);
            }

            foreach ($comments as $index => $comment) {
                RouteComment::create([
                    'travel_route_id' => $route->id,
                    'author' => $comment['author'],
                    'rating' => $comment['rating'],
                    'text' => $comment['text'],
                    'commented_at' => $comment['commented_at'] ?? now()->subDays(($index + 1) * 2),
                ]);
            }

            return [
                'route' => $route,
                'slots' => $createdSlots,
            ];
        };

        // 1. «В Игру на выходные»
        $route1Data = $createRoute([
            'title' => '«В Игру на выходные»',
            'short_description' => 'Автомобильный маршрут из Ижевска в Игринский район с акцентом на историю Сибирского тракта, культуру удмуртского народа и современные арт-объекты.',
            'full_description' => 'Маршрут выходного дня начинается в Ижевске и ведёт на север республики, в Игринский район. Подходит для спокойного автопутешествия, знакомства с историей края и локальной культурой.',
            'duration' => '2',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'car',
            'budget' => 'medium',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автомобильный',
            'place' => 'Ижевск — Игра',
            'rating' => 4.7,
            'reviews_count' => 36,
            'price_from' => 'от 3 500 ₽',
            'image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Лучше ехать утром', 'Подходит для семьи', 'Возьмите наличные на небольшие точки'],
            'coordinates' => ['lat' => 57.5564, 'lng' => 53.0691],
        ], [
            ['date' => '2026-07-18', 'capacity' => 6],
            ['date' => '2026-07-25', 'capacity' => 4],
            ['date' => '2026-08-01', 'capacity' => 5],
        ], [
            ['author' => 'Марина', 'rating' => 5, 'text' => 'Очень удобный маршрут на выходные, понравилось сочетание дороги и культурных остановок.'],
            ['author' => 'Денис', 'rating' => 4, 'text' => 'Хороший вариант для семейной поездки, особенно если хочется уехать из города на два дня.'],
        ]);

        // 2. «Ожерелье Камы»
        $route2Data = $createRoute([
            'title' => '«Ожерелье Камы»',
            'short_description' => 'Межрегиональный автомаршрут по Удмуртии и Башкортостану вдоль Камы с посещением ключевых культурных и исторических точек.',
            'full_description' => 'Крупный межрегиональный маршрут объединяет города и достопримечательности вдоль живописных берегов Камы. Подходит для насыщенного путешествия на несколько дней.',
            'duration' => '4',
            'company' => ['friends', 'family'],
            'transport' => 'car',
            'budget' => 'medium',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автомобильный',
            'place' => 'Воткинск — Сарапул — Башкортостан',
            'rating' => 4.8,
            'reviews_count' => 52,
            'price_from' => 'от 6 900 ₽',
            'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Лучше ехать с ночёвкой', 'Подойдёт для нескольких дней', 'Заранее бронируйте остановки'],
            'coordinates' => ['lat' => 56.4666, 'lng' => 53.8001],
        ], [
            ['date' => '2026-07-10', 'capacity' => 8],
            ['date' => '2026-08-07', 'capacity' => 8],
        ], [
            ['author' => 'Игорь', 'rating' => 5, 'text' => 'Очень красивый маршрут, особенно вдоль воды. Хорошо подходит для длинной поездки на машине.'],
            ['author' => 'Елена', 'rating' => 4, 'text' => 'Понравился масштаб путешествия и сочетание двух регионов в одном маршруте.'],
        ]);

        // 3. «Влюбиться в Удмуртию!»
        $route3Data = $createRoute([
            'title' => '«Влюбиться в Удмуртию!»',
            'short_description' => 'Трёхдневный гастрономический тур по главным городам республики с мастер-классами по национальной кухне.',
            'full_description' => 'Маршрут знакомит с городами Удмуртии и местной гастрономией. В программе — национальные блюда, кулинарные мастер-классы и культурные остановки.',
            'duration' => '3',
            'company' => ['friends', 'family'],
            'transport' => 'bus',
            'budget' => 'medium',
            'interests' => ['gastronomy', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => false,
            'kids_allowed' => true,
            'type_label' => 'Автобусный',
            'place' => 'Ижевск — Сарапул — Воткинск',
            'rating' => 4.9,
            'reviews_count' => 74,
            'price_from' => 'от 8 500 ₽',
            'image' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит с 7 лет', 'Лучше бронировать заранее', 'Возьмите место для сувениров и местных продуктов'],
            'coordinates' => ['lat' => 56.8528, 'lng' => 53.2119],
        ], [
            ['date' => '2026-07-15', 'capacity' => 20],
            ['date' => '2026-08-12', 'capacity' => 20],
        ], [
            ['author' => 'Светлана', 'rating' => 5, 'text' => 'Очень вкусный и атмосферный тур, мастер-классы запомнились больше всего.'],
            ['author' => 'Павел', 'rating' => 5, 'text' => 'Отличный вариант для знакомства с кухней и городами Удмуртии за несколько дней.'],
        ]);

        // 4. Иднакар
        $route4Data = $createRoute([
            'title' => 'Древнее городище «Иднакар»',
            'short_description' => 'Археологический комплекс IX–XIII веков на горе Солдырь с панорамным видом и реконструкцией быта древних жителей.',
            'full_description' => 'Экскурсионный маршрут по Глазову с посещением одного из ключевых археологических объектов региона. Подходит для школьников, семей и любителей истории.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'walking',
            'budget' => 'econom',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Пеший',
            'place' => 'Глазов',
            'rating' => 4.8,
            'reviews_count' => 48,
            'price_from' => 'от 700 ₽',
            'image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1465310477141-6fb93167a273?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Лучше идти в удобной обуви', 'Подходит для школьников', 'Отличный вариант на 1 день'],
            'coordinates' => ['lat' => 58.1553, 'lng' => 52.6323],
        ], [
            ['date' => '2026-07-12', 'capacity' => 12],
            ['date' => '2026-07-26', 'capacity' => 12],
            ['date' => '2026-08-09', 'capacity' => 12],
        ], [
            ['author' => 'Анна', 'rating' => 5, 'text' => 'Очень интересное место, особенно если нравится история и археология.'],
            ['author' => 'Роман', 'rating' => 4, 'text' => 'Панорама с высоты понравилась, экскурсионный формат очень спокойный и понятный.'],
        ]);

        // 5. Лудорвай
        $route5Data = $createRoute([
            'title' => 'Архитектурно-этнографический музей «Лудорвай»',
            'short_description' => 'Музей удмуртского быта и зодчества под открытым небом рядом с Ижевском.',
            'full_description' => 'Маршрут в музей «Лудорвай» позволяет погрузиться в традиционную деревенскую жизнь, увидеть памятники удмуртской архитектуры и познакомиться с национальной кухней.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'car',
            'budget' => 'econom',
            'interests' => ['culture', 'history'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автомобильный',
            'place' => 'Лудорвай',
            'rating' => 4.9,
            'reviews_count' => 81,
            'price_from' => 'от 900 ₽',
            'image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит для семьи', 'Можно поехать из Ижевска на день', 'Удобный спокойный маршрут'],
            'coordinates' => ['lat' => 56.8226, 'lng' => 53.3683],
        ], [
            ['date' => '2026-07-11', 'capacity' => 15],
            ['date' => '2026-07-18', 'capacity' => 15],
            ['date' => '2026-07-25', 'capacity' => 15],
        ], [
            ['author' => 'Марина', 'rating' => 5, 'text' => 'Очень атмосферное место, хорошо подходит для семейной прогулки.'],
            ['author' => 'Николай', 'rating' => 5, 'text' => 'Понравилось сочетание быта, архитектуры и национальной кухни.'],
        ]);

        // 6. Наедине с лесом
        $route6Data = $createRoute([
            'title' => 'Интерактивная экотропа «Наедине с лесом»',
            'short_description' => 'Инклюзивный экологический маршрут в Нечкинском парке с настилами и информационными стендами.',
            'full_description' => 'Маршрут по национальному парку «Нечкинский», оборудованный для широкого круга посетителей, включая людей с ОВЗ. Хорошо подходит для спокойной прогулки на природе.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'walking',
            'budget' => 'econom',
            'interests' => ['nature', 'active'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Пеший',
            'place' => 'Нечкинский парк',
            'rating' => 4.8,
            'reviews_count' => 45,
            'price_from' => 'от 500 ₽',
            'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит для детей', 'Спокойный формат прогулки', 'Хорошо для первого знакомства с парком'],
            'coordinates' => ['lat' => 56.6858, 'lng' => 53.7869],
        ], [
            ['date' => '2026-07-13', 'capacity' => 18],
            ['date' => '2026-07-20', 'capacity' => 18],
            ['date' => '2026-07-27', 'capacity' => 18],
        ], [
            ['author' => 'Лилия', 'rating' => 5, 'text' => 'Очень комфортная экотропа, понравилась доступность и спокойный темп.'],
            ['author' => 'Олег', 'rating' => 4, 'text' => 'Хороший вариант для семейной прогулки и выезда на природу.'],
        ]);

        // 7. Книга природы
        $route7Data = $createRoute([
            'title' => 'Экотропа «Книга природы»',
            'short_description' => 'Пятикилометровый маршрут по Кокманскому заказнику с редкими растениями верховых болот и древними лиственницами.',
            'full_description' => 'Пеший маршрут по охраняемой природной территории в Красногорском районе. Подходит тем, кто хочет провести день на природе и увидеть уникальные природные объекты.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'walking',
            'budget' => 'econom',
            'interests' => ['nature', 'active'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => false,
            'kids_allowed' => true,
            'type_label' => 'Пеший',
            'place' => 'Кокманский заказник',
            'rating' => 4.7,
            'reviews_count' => 29,
            'price_from' => 'от 600 ₽',
            'image' => 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1465310477141-6fb93167a273?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Нужна удобная обувь', 'Лучше идти в сухую погоду', 'Животных лучше не брать'],
            'coordinates' => ['lat' => 57.5730, 'lng' => 52.3423],
        ], [
            ['date' => '2026-07-16', 'capacity' => 10],
            ['date' => '2026-08-06', 'capacity' => 10],
        ], [
            ['author' => 'Сергей', 'rating' => 5, 'text' => 'Очень красивый маршрут, особенно если любишь тихую природу и долгие прогулки.'],
            ['author' => 'Тамара', 'rating' => 4, 'text' => 'Маршрут интересный, но лучше планировать поездку в хорошую погоду.'],
        ]);

        // 8. Купеческий Сарапул
        $route8Data = $createRoute([
            'title' => 'Купеческий Сарапул',
            'short_description' => 'Путешествие в город на Каме с архитектурой XIX века, набережной и историко-краеведческим музеем.',
            'full_description' => 'Маршрут по Сарапулу знакомит с купеческой историей города, прогулочными зонами и архитектурой. Удобен как для пешего, так и для автобусного экскурсионного формата.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'bus',
            'budget' => 'econom',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автобусный',
            'place' => 'Сарапул',
            'rating' => 4.8,
            'reviews_count' => 63,
            'price_from' => 'от 1 100 ₽',
            'image' => 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Хорошо подходит для 1 дня', 'Можно с детьми', 'Удобно ехать автобусом'],
            'coordinates' => ['lat' => 56.4666, 'lng' => 53.8001],
        ], [
            ['date' => '2026-07-14', 'capacity' => 16],
            ['date' => '2026-07-28', 'capacity' => 16],
        ], [
            ['author' => 'Алексей', 'rating' => 5, 'text' => 'Очень понравилась архитектура и прогулка по набережной.'],
            ['author' => 'Вера', 'rating' => 4, 'text' => 'Хороший городской маршрут, удобно для спокойной экскурсии.'],
        ]);

        // 9. Музей-усадьба Чайковского
        $route9Data = $createRoute([
            'title' => 'Музей-усадьба П. И. Чайковского',
            'short_description' => 'Мемориальный комплекс в Воткинске, где родился великий композитор, с атмосферой дворянского быта XIX века.',
            'full_description' => 'Маршрут в Воткинск с посещением музея-усадьбы П. И. Чайковского. Подходит для культурного выезда на один день и спокойной прогулки по историческому месту.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'bus',
            'budget' => 'econom',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автобусный',
            'place' => 'Воткинск',
            'rating' => 4.9,
            'reviews_count' => 88,
            'price_from' => 'от 1 200 ₽',
            'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит для школьников', 'Хороший культурный выезд на день', 'Можно сочетать с прогулкой по городу'],
            'coordinates' => ['lat' => 57.0546, 'lng' => 54.0078],
        ], [
            ['date' => '2026-07-19', 'capacity' => 14],
            ['date' => '2026-08-02', 'capacity' => 14],
        ], [
            ['author' => 'Ольга', 'rating' => 5, 'text' => 'Очень красивое и тихое место, понравилась атмосфера усадьбы.'],
            ['author' => 'Виктор', 'rating' => 5, 'text' => 'Отличный маршрут для любителей музыки, истории и спокойных прогулок.'],
        ]);

        // 10. Северная столица — Глазов
        $route10Data = $createRoute([
            'title' => '«Северная столица» — город Глазов',
            'short_description' => 'Пешеходный маршрут по северному городу Удмуртии с историческими и архитектурными точками.',
            'full_description' => 'Маршрут по Глазову включает прогулку по историческому центру, посещение знаковых объектов и знакомство с архитектурой северной части республики.',
            'duration' => '1',
            'company' => ['solo', 'friends', 'family'],
            'transport' => 'walking',
            'budget' => 'econom',
            'interests' => ['history', 'culture'],
            'volunteer' => false,
            'volunteer_impact' => null,
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Пеший',
            'place' => 'Глазов',
            'rating' => 4.7,
            'reviews_count' => 33,
            'price_from' => 'от 700 ₽',
            'image' => 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Хорошо подходит на 1 день', 'Удобно для пешей прогулки', 'Можно брать детей'],
            'coordinates' => ['lat' => 58.1356, 'lng' => 52.6514],
        ], [
            ['date' => '2026-07-17', 'capacity' => 15],
            ['date' => '2026-07-31', 'capacity' => 15],
        ], [
            ['author' => 'Юлия', 'rating' => 4, 'text' => 'Спокойный и приятный маршрут по городу, хорошо подходит для прогулки.'],
            ['author' => 'Максим', 'rating' => 5, 'text' => 'Понравилось сочетание истории, архитектуры и северной атмосферы города.'],
        ]);

        // 11. Помощь в деревне Сеп
        $route11Data = $createRoute([
            'title' => '«Помощь в деревне Сеп»',
            'short_description' => 'Волонтёрская поездка в деревню Сеп с участием в благоустройстве и сохранении культурного наследия.',
            'full_description' => 'Маршрут для тех, кто хочет не только увидеть необычное место, но и реально помочь деревне Сеп: в поддержке культурного центра, благоустройстве и сохранении локальной идентичности.',
            'duration' => '3',
            'company' => ['friends', 'family'],
            'transport' => 'car',
            'budget' => 'econom',
            'interests' => ['culture', 'volunteer'],
            'volunteer' => true,
            'volunteer_impact' => 'Помощь в развитии местного культурного центра, благоустройстве территории и сохранении культурного наследия деревни.',
            'pets_allowed' => true,
            'kids_allowed' => true,
            'type_label' => 'Автомобильный',
            'place' => 'Деревня Сеп',
            'rating' => 4.9,
            'reviews_count' => 27,
            'price_from' => 'от 1 500 ₽',
            'image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит с 14 лет', 'Лучше ехать подготовленной группой', 'Полезно заранее узнать задачи на выезд'],
            'coordinates' => ['lat' => 57.4840, 'lng' => 53.3742],
        ], [
            ['date' => '2026-07-24', 'capacity' => 8],
            ['date' => '2026-08-14', 'capacity' => 8],
        ], [
            ['author' => 'Алина', 'rating' => 5, 'text' => 'Очень тёплый маршрут, чувствуется, что помощь действительно нужна и важна.'],
            ['author' => 'Степан', 'rating' => 5, 'text' => 'Понравилось, что это не просто поездка, а реальное участие в жизни деревни.'],
        ]);

        // 12. Посади лес в Нечкинском парке
        $route12Data = $createRoute([
            'title' => '«Посади лес в Нечкинском парке»',
            'short_description' => 'Волонтёрский экологический маршрут с участием в восстановлении лесов на территории национального парка.',
            'full_description' => 'Участники маршрута помогают высаживать саженцы и участвуют в природоохранных акциях на территории Нечкинского парка, внося реальный вклад в восстановление лесных участков.',
            'duration' => '1',
            'company' => ['friends', 'family'],
            'transport' => 'walking',
            'budget' => 'econom',
            'interests' => ['nature', 'volunteer', 'active'],
            'volunteer' => true,
            'volunteer_impact' => 'Высадка саженцев, участие в восстановлении лесных территорий и экологических акциях.',
            'pets_allowed' => false,
            'kids_allowed' => true,
            'type_label' => 'Пеший',
            'place' => 'Нечкинский парк',
            'rating' => 4.9,
            'reviews_count' => 31,
            'price_from' => 'бесплатно',
            'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Подходит с 14 лет', 'Берите перчатки и удобную одежду', 'Животных лучше не брать'],
            'coordinates' => ['lat' => 56.6858, 'lng' => 53.7869],
        ], [
            ['date' => '2026-07-22', 'capacity' => 20],
            ['date' => '2026-08-05', 'capacity' => 20],
        ], [
            ['author' => 'Никита', 'rating' => 5, 'text' => 'Отличный формат экологической помощи, всё было организовано понятно и спокойно.'],
            ['author' => 'Дарья', 'rating' => 5, 'text' => 'Очень понравилось, что поездка даёт реальный вклад в восстановление природы.'],
        ]);

        // 13. Дополнительный маршрут
        $route13Data = $createRoute([
            'title' => 'Волонтёрский выезд «Лес и берег»',
            'short_description' => 'Трёхдневная социально значимая поездка с уборкой береговой линии и восстановлением экотропы.',
            'full_description' => 'Маршрут объединяет отдых на природе и реальную помощь территории: участники помогают очистить берег, укрепить туристическую тропу и участвуют в экологическом просвещении для местных жителей.',
            'duration' => '3',
            'company' => ['friends', 'solo'],
            'transport' => 'car',
            'budget' => 'econom',
            'interests' => ['nature', 'active', 'volunteer'],
            'volunteer' => true,
            'volunteer_impact' => 'Уборка береговой линии, сортировка отходов, помощь в благоустройстве тропы.',
            'pets_allowed' => false,
            'kids_allowed' => false,
            'type_label' => 'Автомобильный',
            'place' => 'Воткинский район',
            'rating' => 4.9,
            'reviews_count' => 58,
            'price_from' => 'от 2 900 ₽',
            'image' => 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Спальник и фонарь', 'Перчатки и ветровка', 'Подготовьте аптечку'],
            'coordinates' => ['lat' => 57.0486, 'lng' => 53.9872],
        ], [
            ['date' => '2026-07-18', 'capacity' => 10],
            ['date' => '2026-08-08', 'capacity' => 10],
        ], [
            ['author' => 'Екатерина', 'rating' => 5, 'text' => 'Очень сильное впечатление: не просто поездка, а реально полезное дело.'],
            ['author' => 'Роман', 'rating' => 5, 'text' => 'Хорошая организация, комфортный темп и классная команда.'],
        ]);

        // 14. Дополнительный маршрут
        $route14Data = $createRoute([
            'title' => 'Эко-маршрут «Чепца и сосновый бор»',
            'short_description' => 'Двухдневная поездка по природным локациям с лёгким волонтёрским блоком.',
            'full_description' => 'Маршрут сочетает прогулки по сосновому бору, обзорные точки у реки Чепцы и участие в локальной экологической акции. Подходит тем, кто хочет совместить отдых и полезную активность.',
            'duration' => '2',
            'company' => ['friends', 'solo', 'family'],
            'transport' => 'car',
            'budget' => 'medium',
            'interests' => ['nature', 'active', 'volunteer'],
            'volunteer' => true,
            'volunteer_impact' => 'Очистка тропы, установка навигационных меток и мини-акция по восстановлению мест отдыха.',
            'pets_allowed' => false,
            'kids_allowed' => true,
            'type_label' => 'Автомобильный',
            'place' => 'Глазовский район',
            'rating' => 4.8,
            'reviews_count' => 49,
            'price_from' => 'от 3 900 ₽',
            'image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
            'gallery' => [
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
            ],
            'tips' => ['Удобная обувь', 'Перчатки для эко-акции', 'Вода и дождевик'],
            'coordinates' => ['lat' => 58.1394, 'lng' => 52.6747],
        ], [
            ['date' => '2026-07-20', 'capacity' => 6],
            ['date' => '2026-08-03', 'capacity' => 6],
            ['date' => '2026-08-17', 'capacity' => 6],
        ], [
            ['author' => 'Анна', 'rating' => 5, 'text' => 'Очень красивый маршрут, особенно утром. Формат с эко-акцией делает поездку более осмысленной.'],
            ['author' => 'Игорь', 'rating' => 4, 'text' => 'Подходит для выходных. Лучше брать непромокаемую обувь и запас воды.'],
        ]);

        // Бронирования
        $route11Slot1 = $route11Data['slots'][0];
        $route3Slot1 = $route3Data['slots'][0];
        $route14Slot1 = $route14Data['slots'][0];

        Booking::create([
            'travel_route_id' => $route11Data['route']->id,
            'route_slot_id' => $route11Slot1->id,
            'user_id' => $user->id,
            'status' => 'pending',
            'people' => 2,
            'phone' => '+7 (912) 111-22-33',
            'comment' => 'Хотим поехать вдвоём и помочь в благоустройстве.',
        ]);
        $route11Slot1->increment('booked_count', 2);

        Booking::create([
            'travel_route_id' => $route3Data['route']->id,
            'route_slot_id' => $route3Slot1->id,
            'user_id' => $user->id,
            'status' => 'approved',
            'people' => 3,
            'phone' => '+7 (999) 555-44-33',
            'comment' => 'Планируем гастрономическую поездку на три дня.',
        ]);
        $route3Slot1->increment('booked_count', 3);

        Booking::create([
            'travel_route_id' => $route14Data['route']->id,
            'route_slot_id' => $route14Slot1->id,
            'user_id' => $user->id,
            'status' => 'cancelled',
            'people' => 1,
            'phone' => '+7 (950) 777-12-12',
            'comment' => 'Даты изменились, пришлось отменить поездку.',
        ]);
    }
}
