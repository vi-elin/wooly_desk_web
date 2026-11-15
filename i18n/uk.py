# Ukrainian translation of the Woolly Desk website.
#
# PAGES: (English, Ukrainian) pairs for each page. The English side must match the page exactly.
# Long text pages (guide, FAQ, support, privacy) are translated as a whole in i18n/uk/<page>;
# here they only need their <title> and description.
#
# Names of the app's menus, buttons and settings stay in English (in bold), because the app itself is in English.
# Wool is counted in "клубки" (balls of wool), like the wool balls in the game.

# Words that may stay in English on the Ukrainian pages.
KEEP_ENGLISH = """
Woolly Desk Mac macOS App Store Apple silicon Intel Finder Dock Sonoma WeatherKit Open-Meteo GitHub Pages Google Fonts
IP IP- cookie txt todo English Overview Umami Windows
Settings Desktop Weather Sound Farm life Time Day Always Night Memories Sheep Home Tools Mow Sweep Move Remove
Fir Eucalyptus Orange Holiday Build Animals Care Decoration Trading Post Store Refill Add hay Trade Status Apply
Relaxed Normal Quick Shop Start new farm
""".split()

COMMON = [
    # Grandstander has no Cyrillic letters: the Ukrainian pages also load Balsamiq Sans (see site.css)
    ("family=Grandstander:wght@500;700;800&family=Nunito", "family=Grandstander:wght@500;700;800&family=Balsamiq+Sans:wght@400;700&family=Nunito"),
    # the clock in the hero shows the Ukrainian day name
    ("d.toLocaleDateString(undefined, { weekday: \"short\" })", "d.toLocaleDateString(\"uk\", { weekday: \"short\" })"),
]

PAGES = {
    "guide.html": [
        ("<title>Woolly Desk Guide</title>", "<title>Woolly Desk — посібник</title>"),
        ('content="How to play Woolly Desk: the menu bar, desktop buttons, sheep care, shearing, the shop and unlocks, tools, buildings, seasons and all settings."',
         'content="Як грати у Woolly Desk: меню, кнопки на робочому столі, догляд за вівцями, стрижка, магазин і відкриття, інструменти, будівлі, сезони і всі налаштування."'),
    ],
    "faq.html": [
        ("<title>Woolly Desk FAQ</title>", "<title>Woolly Desk — часті питання</title>"),
        ('content="Answers to common questions about Woolly Desk: system needs, performance, privacy, sheep care and the shop."',
         'content="Відповіді на часті питання про Woolly Desk: вимоги, швидкодія, конфіденційність, догляд за вівцями і магазин."'),
    ],
    "support.html": [
        ("<title>Woolly Desk Support</title>", "<title>Woolly Desk — підтримка</title>"),
        ('content="Get help with Woolly Desk. Write to vielindevelopment@gmail.com."',
         'content="Допомога з Woolly Desk. Пишіть на vielindevelopment@gmail.com."'),
    ],
    "privacy.html": [
        ("<title>Woolly Desk Privacy</title>", "<title>Woolly Desk — конфіденційність</title>"),
        ('content="Woolly Desk privacy policy: no accounts, no ads, no tracking. Your farm stays on your Mac."',
         'content="Політика конфіденційності Woolly Desk: без облікових записів, реклами і стеження. Ваша ферма залишається на вашому Mac."'),
    ],
    "index.html": [
        # head
        ("<title>Woolly Desk</title>", "<title>Woolly Desk — овеча ферма на робочому столі Mac</title>"),
        ('content="Woolly Desk is a cozy desktop game for macOS: hand-painted sheep live on your desktop behind your windows. Shear them, trade wool and build a tiny village."',
         'content="Woolly Desk — затишна гра для macOS: намальовані вручну вівці живуть на робочому столі за вашими вікнами. Стрижіть їх, продавайте вовну і будуйте маленьке село."'),

        # hero
        ('<span class="eyebrow">a cozy desktop game for macOS</span>', '<span class="eyebrow">затишна гра для робочого столу macOS</span>'),
        ('<h1>A little sheep farm that lives on your <span class="squiggle">desktop<svg',
         '<h1>Маленька овеча ферма, яка живе на вашому <span class="squiggle">робочому столі<svg'),
        ("Hand-painted sheep graze, play, sleep and grow wool behind your app windows. You look after them between emails, shear them, trade the wool and build a tiny village.",
         "Намальовані вручну вівці пасуться, граються, сплять і обростають вовною за вікнами ваших застосунків. Ви доглядаєте за ними між листами, стрижете їх, продаєте вовну і будуєте маленьке село."),
        ("<span><small>Mac App Store</small>Get Woolly Desk</span>", "<span><small>Mac App Store</small>Завантажити Woolly Desk</span>"),
        ('<a class="btn ghost" href="#watch">Watch the farm</a>', '<a class="btn ghost" href="#watch">Подивитися ферму</a>'),
        ("<span>macOS 14 or later</span><span>Lives in the menu bar</span><span>Real weather &amp; seasons</span>",
         "<span>macOS 14 або новіша</span><span>Живе в рядку меню</span><span>Справжня погода і сезони</span>"),
        ('<div class="note note-a">click the cloud for night', '<div class="note note-a">клацніть хмаринку — і настане ніч'),
        ('aria-label="A Mac desktop: the farm is the wallpaper, sheep walk behind open windows"',
         'aria-label="Робочий стіл Mac: ферма на шпалерах, вівці ходять за відкритими вікнами"'),
        ("<b>Notes</b><span>File</span><span>Edit</span><span>View</span><span>Window</span>",
         "<b>Нотатки</b><span>Файл</span><span>Редагувати</span><span>Перегляд</span><span>Вікно</span>"),
        ('title="Woolly Desk menu: switch day and night"', 'title="Меню Woolly Desk: перемкнути день і ніч"'),
        ("<span>Farm</span>", "<span>Ферма</span>"),
        ("</svg>Projects</div>", "</svg>Проєкти</div>"),
        ("</svg>Recipes</div>", "</svg>Рецепти</div>"),
        ("<span>Saturday</span>", "<span>Субота</span>"),
        ("<s>answer emails</s><br>buy hay for Clover<br>shear Biscuit<br><s>fix the fence</s><br>make tea",
         "<s>відповісти на листи</s><br>купити сіна для Конюшинки<br>постригти Печеньку<br><s>полагодити паркан</s><br>заварити чай"),
        ("<span>Woolly Desk · Shop</span>", "<span>Woolly Desk · Магазин</span>"),
        ('alt="">Pink Cottage<b>new</b>', 'alt="">Рожевий котедж<b>новинка</b>'),
        ('alt="">Forest Cottage<b>new</b>', 'alt="">Лісовий будиночок<b>новинка</b>'),
        ('alt="">Lantern<b>new</b>', 'alt="">Ліхтар<b>новинка</b>'),
        ('<div class="note note-b">sheep wander behind your windows. click one!', '<div class="note note-b">вівці гуляють за вашими вікнами. клацніть одну!'),

        # watch
        ('<span class="eyebrow">watch it live</span>', '<span class="eyebrow">дивіться наживо</span>'),
        ("<h2>Your desktop, but with grass</h2>", "<h2>Ваш робочий стіл, але з травою</h2>"),
        ("This little window runs the farm with the game's own sprites. Make it rain, turn the night on, or click a sheep to say hello.",
         "У цьому віконці працює ферма з рисунками самої гри. Увімкніть дощ чи ніч або клацніть вівцю, щоб привітатися."),
        ('aria-pressed="false">Night</button>', 'aria-pressed="false">Ніч</button>'),
        ('aria-pressed="false">Rain</button>', 'aria-pressed="false">Дощ</button>'),
        ('aria-pressed="false">Pause</button>', 'aria-pressed="false">Пауза</button>'),
        ('btnPause.textContent = liveFlock.paused ? "Play" : "Pause";', 'btnPause.textContent = liveFlock.paused ? "Далі" : "Пауза";'),
        ("sheep graze, wander and nap · at night they sleep and the lanterns come on",
         "вівці пасуться, гуляють і дрімають · уночі вони сплять, а ліхтарі світяться"),

        # features
        ('<span class="eyebrow">what happens on the farm</span>', '<span class="eyebrow">що відбувається на фермі</span>'),
        ("<h2>Small lives, slow days</h2>", "<h2>Маленькі життя, повільні дні</h2>"),
        ("<h3>Sheep with their own lives</h3>", "<h3>Вівці з власним життям</h3>"),
        ("They get hungry and thirsty, play tag, make friends, pair up, have lambs and grow old. Each one has a personality: playful, shy, curious, calm, social or independent.",
         "Вони голоднішають і хочуть пити, граються в квача, дружать, створюють пари, мають ягнят і старіють. У кожної свій характер: грайлива, сором'язлива, допитлива, спокійна, компанійська чи незалежна."),
        ("<h3>Real weather and seasons</h3>", "<h3>Справжня погода і сезони</h3>"),
        ("Rain fills the troughs, storms send the flock to the barn, autumn leaves pile up and snow drifts in winter. The farm follows the weather where you live.",
         "Дощ наповнює напувалки, гроза жене отару до хліва, восени збирається листя, а взимку — замети. Ферма живе за погодою там, де живете ви."),
        ("<h3>Day and night with your clock</h3>", "<h3>День і ніч за вашим годинником</h3>"),
        ("Dusk fades in around your real sunset. Lanterns and windows glow, fireflies come out and the sheep go to sleep.",
         "Сутінки приходять разом зі справжнім заходом сонця. Світяться ліхтарі та вікна, вилітають світлячки, а вівці лягають спати."),
        ("<h3>Shear, trade, build</h3>", "<h3>Стрижіть, торгуйте, будуйте</h3>"),
        ("Shear full fleeces, sell the wool at the trading post, mow hay with a scythe and fence in your pens. Gates open with a click.",
         "Стрижіть пухнастих овець, продавайте вовну в крамничці, косіть сіно косою і обгороджуйте загони. Ворота відчиняються одним клацанням."),
        ("<h3>Tidy up with real tools</h3>", "<h3>Прибирайте справжніми інструментами</h3>"),
        ("Your pointer turns into a broom or a snow shovel. Sweep leaves away with a whoosh and watch them fly.",
         "Курсор перетворюється на мітлу або лопату для снігу. Змітайте листя зі свистом і дивіться, як воно летить."),
        ("<h3>Never in your way</h3>", "<h3>Ніколи не заважає</h3>"),
        ("The farm sits below your windows. Clicks pass through to your files and icons, except on sheep, gates and buildings.",
         "Ферма лежить під вашими вікнами. Клацання проходять до файлів і значків, окрім клацань по вівцях, воротах і будівлях."),

        # compare
        ('<span class="eyebrow">drag the lamp</span>', '<span class="eyebrow">потягніть ліхтарик</span>'),
        ("<h2>Sunset happens when yours does</h2>", "<h2>Захід сонця — тоді ж, коли й у вас</h2>"),
        ('alt="The farm by day"', 'alt="Ферма вдень"'),
        ('alt="The same farm at night, with lit windows and fireflies"', 'alt="Та сама ферма вночі, з освітленими вікнами і світлячками"'),
        ('<span class="tag d">day</span><span class="tag n">night</span>', '<span class="tag d">день</span><span class="tag n">ніч</span>'),
        ('aria-label="Move between day and night"', 'aria-label="Перемикання між днем і ніччю"'),

        # flock
        ('<span class="eyebrow">meet the flock</span>', '<span class="eyebrow">знайомтеся з отарою</span>'),
        ("<h2>Five fleeces, one lamb, lots of opinions</h2>", "<h2>П'ять кольорів вовни, одне ягня і безліч думок</h2>"),
        ("Buy young sheep in the colour you like. Dark fleeces give dark wool, and dark wool sells for more.",
         "Купуйте молодих овець улюбленого кольору. Темні вівці дають темну вовну, а вона дорожча."),
        ('aria-label="Wool grows back after shearing"', 'aria-label="Вовна відростає після стрижки"'),
        ('alt="">just sheared</div>', 'alt="">щойно пострижена</div>'),
        ('transform-origin:50% 80%">growing back</div>', 'transform-origin:50% 80%">відростає</div>'),
        ('alt="">full and fluffy, ready to shear</div>', 'alt="">пухнаста — час стригти</div>'),
        ('["white", "Clover", "baa!"]', '["white", "Конюшинка", "бе-е!"]'),
        ('["cream", "Biscuit", "more hay?"]', '["cream", "Печенька", "ще сінця?"]'),
        ('["grey", "Pebble", "hmm."]', '["grey", "Камінчик", "хм-м."]'),
        ('["brown", "Toffee", "tag! you\'re it"]', '["brown", "Ірисочка", "квач! ти водиш"]'),
        ('["black", "Rooibos", "I\'m the ram here"]', '["black", "Ройбуш", "тут я баран"]'),
        ('["lamb", "Button", "mama?"]', '["lamb", "Ґудзик", "мамо?"]'),
        ('["white", "Cloud", "zzz…"]', '["white", "Хмаринка", "хр-р…"]'),
        ('`${name}, a ${look === "lamb" ? "lamb" : look + " sheep"}. Pet ${name}.`',
         '`${name}, ${look === "lamb" ? "ягня" : "вівця"}. Погладити.`'),

        # seasons
        ('<span class="eyebrow">four seasons</span>', '<span class="eyebrow">чотири пори року</span>'),
        ("<h2>The farm changes with the calendar</h2>", "<h2>Ферма змінюється разом із календарем</h2>"),
        ('aria-label="Seasons"', 'aria-label="Пори року"'),
        ('data-s="spring" aria-pressed="false">Spring</button>', 'data-s="spring" aria-pressed="false">Весна</button>'),
        ('data-s="summer" aria-pressed="true">Summer</button>', 'data-s="summer" aria-pressed="true">Літо</button>'),
        ('data-s="autumn" aria-pressed="false">Autumn</button>', 'data-s="autumn" aria-pressed="false">Осінь</button>'),
        ('data-s="winter" aria-pressed="false">Winter</button>', 'data-s="winter" aria-pressed="false">Зима</button>'),
        ('spring: "apple trees blossom, lambs are born and the grass grows fast"', 'spring: "яблуні цвітуть, народжуються ягнята, а трава росте швидко"'),
        ('summer: "long days, full fleeces and the best time to shear"', 'summer: "довгі дні, пухнасті вівці і найкращий час для стрижки"'),
        ('autumn: "leaves pile up by the fences: grab the broom"', 'autumn: "листя збирається біля парканів: беріть мітлу"'),
        ('winter: "snow on the roofs, ice on the troughs, hay in the feeders"', 'winter: "сніг на дахах, лід на напувалках, сіно в годівницях"'),

        # tidy
        ('<span class="eyebrow">grab the broom</span>', '<span class="eyebrow">беріть мітлу</span>'),
        ("<h2>Leaves pile up. Snow drifts in.</h2>", "<h2>Листя збирається. Сніг замітає.</h2>"),
        ("In autumn and winter the farm gets messy, and grass under leaves or snow cannot grow. Your pointer turns into a broom or a snow shovel: hold and drag across the farm to clean it.",
         "Восени й узимку на фермі безлад, а трава під листям чи снігом не росте. Курсор перетворюється на мітлу або лопату для снігу: затисніть і ведіть по фермі, щоб прибрати."),
        ('aria-pressed="true">Autumn leaves</button>', 'aria-pressed="true">Осіннє листя</button>'),
        ('aria-pressed="false">Winter snow</button>', 'aria-pressed="false">Зимовий сніг</button>'),
        ('id="tidyReset">Make a mess again</button>', 'id="tidyReset">Знову насмітити</button>'),
        ('<b id="tidyLeft">0</b> piles left', 'залишилося купок: <b id="tidyLeft">0</b>'),
        ('aria-label="A farm covered with leaf piles. Hold and drag to sweep them away."',
         'aria-label="Ферма, вкрита купками листя. Затисніть і ведіть, щоб змести їх."'),
        ("All clean! Clover is happy.", "Чистота! Конюшинка щаслива."),
        ('id="tidyHint">hold and drag to sweep</p>', 'id="tidyHint">затисніть і ведіть, щоб підмести</p>'),
        ('m === "autumn" ? "hold and drag to sweep" : "hold and drag to shovel the snow"',
         'm === "autumn" ? "затисніть і ведіть, щоб підмести" : "затисніть і ведіть, щоб відкинути сніг"'),
        ('m === "autumn" ? "A farm covered with leaf piles. Hold and drag to sweep them away." : "A farm with snow drifts. Hold and drag to shovel them away."',
         'm === "autumn" ? "Ферма, вкрита купками листя. Затисніть і ведіть, щоб змести їх." : "Ферма із заметами. Затисніть і ведіть, щоб відкинути сніг."'),

        # village
        ('<span class="eyebrow">grow a tiny village</span>', '<span class="eyebrow">виростіть маленьке село</span>'),
        ("<h2>Every bag of wool brings a new house closer</h2>", "<h2>Кожен клубок вовни наближає новий будиночок</h2>"),
        ("Collect wool to unlock new buildings in the shop. Some are useful, some are just lovely. All of them light up at night: try it.",
         "Збирайте вовну, щоб відкривати нові будівлі в магазині. Одні корисні, інші просто гарні. Уночі світяться всі: спробуйте."),
        ('<span id="villageLabel">Day</span>', '<span id="villageLabel">День</span>'),
        ('on ? "Night" : "Day";', 'on ? "Ніч" : "День";'),
        ('["barn", "Barn", "Shelter for 4 sheep in rain, snow and at night. Stores 30 more hay.", 110, 15]',
         '["barn", "Хлів", "Укриття для 4 овець у дощ, сніг і вночі. Ще 30 порцій сіна.", 110, 15]'),
        ('["tradingPost", "Trading Post", "A little wool stall. A better deal for your wool.", 45, 8]',
         '["tradingPost", "Крамничка", "Маленька лавка для вовни. Вигідніша угода за вовну.", 45, 8]'),
        ('["woolStorage", "Wool Storage", "Room for 40 more wool.", 60, 20]',
         '["woolStorage", "Комора для вовни", "Місце ще для 40 клубків.", 60, 20]'),
        ('["gardenShed", "Garden Shed", "A cosy blue shed with flower pots.", 90, 35]',
         '["gardenShed", "Садовий сарайчик", "Затишний блакитний сарайчик із вазонами.", 90, 35]'),
        ('["lineHouse", "Little White House", "A small white house with a young tree beside it.", 100, 40]',
         '["lineHouse", "Маленький білий будиночок", "Біленький будиночок із молодим деревцем.", 100, 40]'),
        ('["pinkCottage", "Pink Cottage", "A scalloped roof and daisies at the door.", 120, 45]',
         '["pinkCottage", "Рожевий котедж", "Дах із лусочками і ромашки біля дверей.", 120, 45]'),
        ('["lavenderCottage", "Lavender Cottage", "Slate roof, green walls, lavender by the door.", 120, 50]',
         '["lavenderCottage", "Лавандовий котедж", "Шиферний дах, зелені стіни, лаванда біля дверей.", 120, 50]'),
        ('["whiteCottage", "Wooden Cabin", "Round window, red arched door, skis by the wall and lights under the roof.", 130, 55]',
         '["whiteCottage", "Дерев\'яна хатинка", "Кругле віконце, червоні двері-арка, лижі під стіною і вогники під дахом.", 130, 55]'),
        ('["forestCottage", "Forest Cottage", "Sage-green walls, a steep black roof and firs on both sides.", 150, 65]',
         '["forestCottage", "Лісовий будиночок", "Шавлієво-зелені стіни, крутий чорний дах і ялинки з обох боків.", 150, 65]'),
        ('["logCabin", "Red Door Cottage", "A red door, a dormer window and lamps that glow at night.", 160, 70]',
         '["logCabin", "Котедж із червоними дверима", "Червоні двері, віконце в даху і лампи, що світяться вночі.", 160, 70]'),
        ('<span>unlocks at ${w} wool</span>', '<span>з ${w} клубків вовни</span>'),

        # holidays
        ('<span class="eyebrow">winter holidays</span>', '<span class="eyebrow">зимові свята</span>'),
        ("<h2>Deck the farm</h2>", "<h2>Прикрасьте ферму</h2>"),
        ("The shop has a Holiday tab: a Christmas tree with presents, light garlands, knitted stockings, door wreaths, cosy sweaters for your sheep and stars that hang under your menu bar. Everything glows at night. Turn the lights on.",
         "У магазині є святкова вкладка: ялинка з подарунками, гірлянди, в'язані шкарпетки, вінки на двері, теплі светри для овець і зірочки, що висять під рядком меню. Уночі світиться все. Увімкніть вогники."),
        ('<span id="holidayLabel">Lights off</span>', '<span id="holidayLabel">Вогники вимкнено</span>'),
        ('on ? "Lights on" : "Lights off";', 'on ? "Вогники ввімкнено" : "Вогники вимкнено";'),
        ('aria-label="A snowy yard with a Christmas tree, light garlands, a stocking line and three houses with wreaths on their doors"',
         'aria-label="Засніжене подвір\'я з ялинкою, гірляндами, мотузкою зі шкарпетками і трьома будиночками з вінками на дверях"'),
        ("three wreaths for the doors: fir, eucalyptus and orange", "три вінки на двері: ялиновий, евкаліптовий і апельсиновий"),
        ('.holiday-cap::before { content: "swipe the yard · "; }', '.holiday-cap::before { content: "гортайте подвір\'я · "; }'),
        ("<h3>A sweater for every sheep</h3>", "<h3>Светр для кожної вівці</h3>"),
        ("<p>Six knitted colours. Click a sheep to try the next one.</p>", "<p>Шість в'язаних кольорів. Клацніть вівцю, щоб приміряти наступний.</p>"),
        ('[["red", "Red"], ["green", "Fir Green"], ["cream", "Cream"], ["blue", "Blue"], ["mustard", "Mustard"], ["pink", "Pink"]]',
         '[["red", "Червоний"], ["green", "Ялиновий"], ["cream", "Кремовий"], ["blue", "Синій"], ["mustard", "Гірчичний"], ["pink", "Рожевий"]]'),
        ('nm.textContent = COLORS[k][1] + " Sweater";', 'nm.textContent = COLORS[k][1] + " светр";'),
        ('img.alt = `A sheep in a ${COLORS[k][1].toLowerCase()} knitted sweater`;', 'img.alt = `Вівця у светрі, колір: ${COLORS[k][1].toLowerCase()}`;'),
        ('["so cosy!", "baa!", "fits perfectly", "warm!", "new look!"]', '["як затишно!", "бе-е!", "якраз по мені", "тепло!", "новий образ!"]'),


        # decorate your desktop
        ("<h3>Decorate your desktop too</h3>", "<h3>Прикрасьте і робочий стіл</h3>"),
        ("Two touches that live outside the farm: stars on threads under your menu bar, and farm-style icons for the folders on your desktop.",
         "Дві дрібниці поза фермою: зірочки на нитках під рядком меню і фермерські значки для папок на робочому столі."),
        ('aria-label="A Mac desktop with hanging stars under the menu bar and farm-style folder icons"',
         'aria-label="Робочий стіл Mac із зірочками під рядком меню і фермерськими значками папок"'),
        ("<b>Finder</b><span>File</span><span>Edit</span><span>View</span>", "<b>Finder</b><span>Файл</span><span>Редагувати</span><span>Перегляд</span>"),
        ("<span>Notes</span></div><div class=\"body\">hang the stars<br><s>wrap presents</s><br>knit a sweater for Clover",
         "<span>Нотатки</span></div><div class=\"body\">повісити зірочки<br><s>загорнути подарунки</s><br>сплести светр Конюшинці"),
        ('style="transform:scale(2.3)">Hanging stars</h4>', 'style="transform:scale(2.3)">Зірочки на нитках</h4>'),
        ("<p>On the Holiday tab of the shop. They sway a little and glow at night.</p>", "<p>На вкладці Holiday у магазині. Вони легенько гойдаються і світяться вночі.</p>"),
        ('aria-label="Where the stars hang"', 'aria-label="Де висять зірочки"'),
        ('id="starsBehind" aria-pressed="false">Behind windows</button>', 'id="starsBehind" aria-pressed="false">За вікнами</button>'),
        ('id="starsOver" aria-pressed="true">Over all windows</button>', 'id="starsOver" aria-pressed="true">Над усіма вікнами</button>'),
        ('alt="">Farm folders</h4>', 'alt="">Фермерські папки</h4>'),
        ("<p>Turn them on in Settings → Desktop. Folders with their own custom icon stay as they are.</p>",
         "<p>Увімкніть їх у Settings → Desktop. Папки з власними значками залишаються як є.</p>"),
        ('aria-label="Folder colours"', 'aria-label="Кольори папок"'),
        ('id="folderSeason" aria-pressed="true">With the season</button>', 'id="folderSeason" aria-pressed="true">За сезоном</button>'),
        ('id="folderMixed" aria-pressed="false">Mixed colours</button>', 'id="folderMixed" aria-pressed="false">Різні кольори</button>'),
        ('aria-label="Season"', 'aria-label="Сезон"'),
        ('aria-label="One colour for all folders"', 'aria-label="Один колір для всіх папок"'),
        ('["Projects", "Photos", "Recipes", "Invoices", "Music", "Garden"]', '["Проєкти", "Фото", "Рецепти", "Рахунки", "Музика", "Город"]'),
        ('[["Meadow green", "#93B784"], ["Sage", "#B9C995"], ["Sky blue", "#8FB0CF"], ["Wool cream", "#EFE3CC"], ["Cottage pink", "#EFB3BE"],',
         '[["Лучна зелень", "#93B784"], ["Шавлія", "#B9C995"], ["Небесно-блакитний", "#8FB0CF"], ["Кремова вовна", "#EFE3CC"], ["Рожевий котедж", "#EFB3BE"],'),
        ('["Lavender", "#BBA9D6"], ["Hay yellow", "#F2D27A"], ["Pumpkin", "#D98A5E"], ["Barn red", "#C9645B"], ["Kraft brown", "#C9A47A"], ["Snow grey", "#D9DFE6"]]',
         '["Лаванда", "#BBA9D6"], ["Жовте сіно", "#F2D27A"], ["Гарбуз", "#D98A5E"], ["Червоний хлів", "#C9645B"], ["Крафтовий", "#C9A47A"], ["Сніжно-сірий", "#D9DFE6"]]'),
        ('[["spring", "Spring"], ["summer", "Summer"], ["autumn", "Autumn"], ["winter", "Winter"]]', '[["spring", "Весна"], ["summer", "Літо"], ["autumn", "Осінь"], ["winter", "Зима"]]'),
        # Windows request
        ('data-done="Thank you! We counted your request."', 'data-done="Дякуємо! Ми врахували ваш запит."'),
        ("<span>Using Windows? Ask for a Windows version</span>", "<span>Маєте Windows? Попросіть версію для Windows</span>"),
        # a whole life
        ('<span class="eyebrow">a whole life</span>', '<span class="eyebrow">ціле життя</span>'),
        ("<h2>From a wobbly lamb to an old friend</h2>", "<h2>Від маленького ягняти до старого друга</h2>"),
        ('<p class="lede">Every sheep lives its own story, at the pace you choose.</p>', '<p class="lede">Кожна вівця проживає свою історію — у темпі, який обираєте ви.</p>'),
        ("<h3>A lamb is born</h3>", "<h3>Народжується ягня</h3>"),
        ("<p>Tiny and a little wobbly, it stays close to its mum.</p>", "<p>Крихітне й трохи незграбне, воно тримається біля мами.</p>"),
        ("<h3>It grows up and plays</h3>", "<h3>Росте і грається</h3>"),
        ("<p>In one sheep year it is grown up. It plays tag, makes friends and shows its personality: playful, shy, curious, calm, social or independent.</p>",
         "<p>За один овечий рік воно стає дорослим. Грається в квача, заводить друзів і показує свій характер: грайливий, сором'язливий, допитливий, спокійний, компанійський чи незалежний.</p>"),
        ("<h3>It finds a pair</h3>", "<h3>Знаходить пару</h3>"),
        ("<p>Two grown sheep that like to be close become a pair.</p>", "<p>Дві дорослі вівці, яким добре разом, стають парою.</p>"),
        ("<h3>New lambs arrive</h3>", "<h3>З'являються ягнята</h3>"),
        ("<p>After five farm months a new lamb is born, and the flock grows.</p>", "<p>Через п'ять фермерських місяців народжується ягня, і отара росте.</p>"),
        ("<h3>A long, calm old age</h3>", "<h3>Довга спокійна старість</h3>"),
        ("<p>Old sheep rest more. When a very old sheep's time comes, it becomes a soft little cloud that floats up over the farm. Its name stays in your Memories.</p>",
         "<p>Старі вівці більше відпочивають. Коли приходить час дуже старої вівці, вона стає м'якою хмаринкою і злітає над фермою. Її ім'я залишається в Memories.</p>"),
        ("<p><b>Gentle by design.</b> Sheep never fall ill while your Mac is closed, and health drops only after long neglect, so a busy week is fine. In Settings you choose: lambs on or off, the size of the flock, and whether sheep can pass away at all.</p>",
         "<p><b>Лагідна за задумом.</b> Поки ваш Mac закритий, вівці ніколи не хворіють, а здоров'я зменшується лише після довгої занедбаності, тож зайнятий тиждень — не біда. У Settings ви вирішуєте: чи народжуються ягнята, яка велика отара і чи можуть вівці взагалі піти з життя.</p>"),

        # final
        ('aria-label="The farm at night with glowing windows"', 'aria-label="Ферма вночі зі світлими вікнами"'),
        ('>ready when you are</span>', '>коли будете готові</span>'),
        ("<h2>Bring the flock home</h2>", "<h2>Заберіть отару додому</h2>"),
        ("Woolly Desk is a menu bar app for macOS. Install it, close your windows for a second, and say hello.",
         "Woolly Desk — застосунок у рядку меню для macOS. Установіть його, на мить закрийте вікна — і привітайтеся."),
        ("<span>macOS 14 Sonoma or later</span><span>Apple silicon and Intel</span><span>Works offline</span>",
         "<span>macOS 14 Sonoma або новіша</span><span>Apple silicon та Intel</span><span>Працює без інтернету</span>"),
        ('<span class="hint" id="hint">pet me!</span>', '<span class="hint" id="hint">погладь мене!</span>'),
    ],
}
