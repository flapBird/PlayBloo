# itch.io 批量导入记录 · 2026-10-09

来源：「itch.io 新游戏速递 · 2026-10-09」导出（共 300 款，抓取时间 2026-10-10 16:16）。
本批入库 **289 款**，全部为免费 HTML5 网页游戏，介绍页指向 itch.io 原页面外链游玩（`external_url`），无 iframe 内嵌。

- 数据来源：导出 Markdown + 逐款抓取 itch.io 详情页（封面、作者、引擎、类型、截图、介绍）；导出里的 403 抓取备注经本机代理补抓后详情完整
- 抓取过程：首轮 6 并发 257/300 成功 → 低并发（workers=2）补抓恢复 36 款 → 最终 295/300；4 款单发复核仍 404（已下架）、1 款持续 TLS 复位不可达
- 文案：每款英文 description / how_to_play / controls / tips / features，基于官方页面内容撰写；信息薄的如实写薄，demo/prototype 标注 development_status
- 字段惯例与既有 itch 导入一致：`source_type=itch.io`、`platforms=[browser]`、`monetization=free`、`content_verified=true`、`sources=[{url,type,verifiedAt}]`
- 分类：共绑定 662 条 game_categories；标签未使用（与既有惯例一致）
- 封面：289 张 itch 热链封面已全部镜像到 Supabase Storage（`covers/{slug}.{ext}`），`thumbnail_url` 已指向镜像（见 covers-mirror-2026-10-11.json）

## 未入库 11 款

| 游戏 | 原因 |
|---|---|
| Things We Never Said | itch 页面已 404（游戏下架，单发复核确认） |
| HyperSlash | itch 页面已 404（游戏下架，单发复核确认） |
| For_You | itch 页面已 404（游戏下架，单发复核确认） |
| USB 3 (an italian analog horror NIght) | itch 页面已 404（游戏下架，单发复核确认） |
| Dominó Colmadón | 页面经代理与多路径均无法访问（TLS 复位），本轮放弃 |
| NeonRush3D（radulesqagency088 副本） | 同款重复上架，保留 radulessqagency 主页 |
| Beyond Sleep（rayen-zayani 副本） | 同款重复上架，保留 beyond-sleep 专页 |
| Roketspace | 同作者同封面重复上架，保留 Rocketspace |
| Deadwatch（netlify 占位 slug 副本） | 同款重复上架，保留 deadwatch 主页 |
| Baldi's Basics Classic Remastered (Chromebook Port) | 付费商业游戏的 DECOMP + WebGL 非官方再分发，版权风险，跳过 |
| （批内查重）2D Shooter | slug/URL 与库内既有记录冲突，脚本自动去重跳过 |

## 入库清单（289 款）

| # | 游戏页面 | slug | 分类 | 状态 |
|---|---|---|---|---|

| 1 | [Maurice the Mischievous Mouse - Cheesy Rivary](https://625-lkw.itch.io/maurice-mouse-cheesy-rivary) | `maurice-mouse-cheesy-rivary` | action, casual, arcade | Released |
| 2 | [Project Bastion](https://8illy8ob.itch.io/project-bastion) | `project-bastion` | survival, strategy | In development |
| 3 | [DYCENS: THE UPRISING](https://abdelkader-hazerchi.itch.io/dycens-the-uprising) | `dycens-the-uprising` | platformer, adventure, rpg | Released |
| 4 | [Hero of the Legendary Keys](https://abdelkader-hazerchi.itch.io/hero-of-the-legendary-keys) | `hero-of-the-legendary-keys` | adventure, rpg | Released |
| 5 | [REbox](https://achilleas90.itch.io/rebox) | `rebox` | simulation, survival, strategy | In development |
| 6 | [Sudoku Arena](https://aiyuni.itch.io/sudoku-arena) | `sudoku-arena` | puzzle, casual | Released |
| 7 | [PaperSnips](https://albagames.itch.io/papersnips) | `papersnips` | puzzle, casual | Released |
| 8 | [Talking Simulator](https://albyianna.itch.io/talking-simulator) | `talking-simulator` | simulation, casual | In development |
| 9 | [HellCrawler](https://alexwest81.itch.io/hellcrawler) | `hellcrawler` | rpg, card, strategy | In development |
| 10 | [Desktop Clicker](https://alros.itch.io/desktop-clicker) | `desktop-clicker` | idle, casual | In development |
| 11 | [Infinite Minesweeper](https://ancooper.itch.io/minesweeper) | `minesweeper` | puzzle, casual | In development |
| 12 | [Andros Games: Demo Arcade — 10 Games to Try](https://androsgames.itch.io/andros-games-demo-arcade-10-games-to-try) | `andros-games-demo-arcade-10-games-to-try` | puzzle, casual, arcade | Demo |
| 13 | [rogue bits](https://antropydev.itch.io/rogue-bits) | `rogue-bits` | rpg, strategy | In development |
| 14 | [Llama Roguelike (work in progress)](https://aovks23.itch.io/llama-roguelike-work-in-progress) | `llama-roguelike-work-in-progress` | rpg, strategy | Released |
| 15 | [First Bid](https://arambit.itch.io/first-bid) | `first-bid` | strategy, card | In development |
| 16 | [Let the Dough Rest (2-4 Players)](https://arcana.itch.io/let-the-dough-rest) | `let-the-dough-rest` | strategy, casual, multiplayer | In development |
| 17 | [The Last Light](https://arkavo.itch.io/the-last-light) | `the-last-light` | rpg, adventure | Released |
| 18 | [Snake Out of Bounds](https://aurorali.itch.io/snake-out-of-bounds) | `snake-out-of-bounds` | arcade, casual | Released |
| 19 | [SPY WAR: CLANDESTINE SYNDICATE](https://baodingball.itch.io/spywar) | `spywar` | card, strategy, rpg | In development |
| 20 | [Elves VS Goblins](https://bardwulfgames.itch.io/elves-vs-goblins) | `elves-vs-goblins` | strategy, action, rpg | Canceled |
| 21 | [Rocketspace](https://bastioneown.itch.io/rocketspace) | `rocketspace` | action, arcade | In development |
| 22 | [A Place Beyond](https://bcaa777.itch.io/a-place-beyond) | `a-place-beyond` | adventure, action | In development |
| 23 | [Beyond Sleep](https://beyond-sleep.itch.io/beyond-sleep) | `beyond-sleep` | casual | In development |
| 24 | [The Toy Store](https://biggerdyl.itch.io/the-toy-store) | `the-toy-store` | casual, simulation | Released |
| 25 | [Word Search Incremental Co.](https://billbkk.itch.io/word-search-incremental-co) | `word-search-incremental-co` | puzzle, idle | Released |
| 26 | [C64 BASIC Online](https://blackcreepycat.itch.io/c64-basic-online) | `c64-basic-online` | educational, casual | In development |
| 27 | [BougieMan](https://bougieman.itch.io/bougieman) | `bougieman` | puzzle, action, casual | In development |
| 28 | [Gem Depths](https://boushido.itch.io/gem-depths) | `gem-depths` | idle, casual | Released |
| 29 | [cube blast game](https://bozkurto.itch.io/cube-blast-game) | `cube-blast-game` | arcade, action | Released |
| 30 | [Beacon Keep](https://brainboxgames.itch.io/beacon) | `beacon` | strategy, action | Released |
| 31 | [Learn Chinese](https://brainboxgames.itch.io/learn-chinese) | `learn-chinese` | educational, casual | Released |
| 32 | [Branoxy](https://brainoxystudio.itch.io/branoxy) | `branoxy` | puzzle, casual, educational | Released |
| 33 | [Little Rabbit Jump](https://brightdaysbooks.itch.io/little-rabbit-jump) | `little-rabbit-jump` | platformer, casual, arcade | Released |
| 34 | [Tic Tac Gone](https://bro-skito.itch.io/tic-tac-gone) | `tic-tac-gone` | puzzle, strategy, board-game | Released |
| 35 | [Arouri's Birthday Special!](https://btjanuary.itch.io/arouri-birthday-special) | `arouri-birthday-special` | casual | Released |
| 36 | [Mech a Meow](https://buildwithstar.itch.io/mech-a-meow) | `mech-a-meow` | action, arcade | Released |
| 37 | [Prospect TEST v1](https://cambiefrog.itch.io/prospect) | `prospect` | casual, arcade | In development |
| 38 | [MANAGER CAREER](https://carlosmorataa.itch.io/manager-career) | `manager-career` | simulation, sports, strategy | Released |
| 39 | [LASTLINE: They Are Coming](https://chplusgames.itch.io/lastline-they-are-coming) | `lastline-they-are-coming` | shooting, survival, action | In development |
| 40 | [Act_1_Cinco](https://cinco-melanie.itch.io/act-1-cinco) | `act-1-cinco` | rpg, adventure | Released |
| 41 | [Act 2 Cinco](https://cinco-melanie.itch.io/act-2-cinco) | `act-2-cinco` | rpg, adventure | Released |
| 42 | [ACT 3 Cinco](https://cinco-melanie.itch.io/act-3-cinco) | `act-3-cinco` | rpg, adventure | Released |
| 43 | [晶體突擊隊](https://cktoobo.itch.io/lens-strike) | `lens-strike` | action, simulation | Released |
| 44 | [Test game](https://conan1213.itch.io/test-game) | `test-game` | rpg, casual | In development |
| 45 | [Lava A Platformer](https://crossfireproductions.itch.io/lava-a-platformer) | `lava-a-platformer` | platformer, action, casual | Released |
| 46 | [BANNWALD](https://csaf.itch.io/bannwald) | `bannwald` | simulation, strategy | Released |
| 47 | [CHRONOLOGY OF A GHOST](https://csaf.itch.io/chronology-of-a-ghost) | `chronology-of-a-ghost` | puzzle, adventure, horror | Released |
| 48 | [FLYWAY](https://csaf.itch.io/flyway) | `flyway` | simulation, strategy, educational | Released |
| 49 | [PYX](https://csaf.itch.io/pyx) | `pyx` | idle, simulation, strategy | Released |
| 50 | [水果星球探險 · Fruit Planet Adventure](https://culaliya.itch.io/fruit-planet-adventure) | `fruit-planet-adventure` | adventure, simulation, casual | Released |
| 51 | [廢棄深夜遊樂園｜LUNA PARK: Midnight Loop](https://culaliya.itch.io/luna-park-midnight-loop) | `luna-park-midnight-loop` | horror, adventure | Released |
| 52 | [Fettle](https://curpish.itch.io/fettle) | `fettle` | simulation, casual | In development |
| 53 | [UnStranded](https://dalecook.itch.io/unstranded) | `unstranded` | puzzle, educational, casual | Released |
| 54 | [Jonas ! Va à Ninive !](https://danielolender04.itch.io/jonas) | `jonas` | adventure, educational | Released |
| 55 | [Alura Quest [Prototype]](https://danyl4o.itch.io/alura-quest) | `alura-quest` | adventure, rpg | In development |
| 56 | [Mold.log](https://dariy-nazarov.itch.io/mold-log) | `mold-log` | simulation, casual | Released |
| 57 | [Flappy Universe](https://darkhavengames.itch.io/flappy-universe) | `flappy-universe` | arcade, casual, platformer | In development |
| 58 | [Darkwaar25 - The Lamp](https://darkwoodcom.itch.io/darkwaar25) | `darkwaar25` | puzzle, horror | Released |
| 59 | [Mushroom Kingdoms](https://dasryel.itch.io/mushroom-kingdoms) | `mushroom-kingdoms` | strategy, action | In development |
| 60 | [Halloween MineSweeper](https://david-dawn.itch.io/halloween-minesweeper) | `halloween-minesweeper` | puzzle, casual | Released |
| 61 | [Photo Apropos](https://davidli.itch.io/photo-apropos) | `photo-apropos` | casual, puzzle | Released |
| 62 | [Cosmic snake](https://dd-productions.itch.io/cosmic-snake) | `cosmic-snake` | arcade, puzzle, casual | Released |
| 63 | [MIDNIGHT LEAD](https://dead9917.itch.io/midnight-lead) | `midnight-lead` | action, shooting, rpg | In development |
| 64 | [Deadwatch](https://deadwatch.itch.io/deadwatch) | `deadwatch` | action, survival, shooting | In development |
| 65 | [Let's Do the Dishes](https://deidamoth.itch.io/letsdothedishes) | `letsdothedishes` | casual, simulation | Released |
| 66 | [Survival Craft](https://dennispage123.itch.io/survival) | `survival` | survival, casual | Released |
| 67 | [Juego 2d Prototipo](https://dereckpudla.itch.io/juego-2d-prototipo) | `juego-2d-prototipo` | action, rpg | In development |
| 68 | [CLUB BOSS](https://dev-deiff.itch.io/club-boss) | `club-boss` | simulation, sports, strategy | In development |
| 69 | [In the Walls of Eryx](https://dfxstudio.itch.io/in-the-walls-of-eryx) | `in-the-walls-of-eryx` | horror, survival, adventure | Released |
| 70 | [Gate Ajar](https://dister1962.itch.io/gate-ajar) | `gate-ajar` | card, multiplayer, strategy | In development |
| 71 | [Paws vs. Vacs](https://dmitryivanov.itch.io/paws-vs-vacs) | `paws-vs-vacs` | action, arcade | Released |
| 72 | [Paris Déblocage](https://docpicon.itch.io/paris-dblocage) | `paris-dblocage` | puzzle, casual | In development |
| 73 | [TimeGo Quest](https://dolako.itch.io/timego-quest) | `timego-quest` | adventure, rpg | Released |
| 74 | [Medieval Pixel Arena](https://dongu-the-rat.itch.io/medieval-pixel-arena) | `medieval-pixel-arena` | action, multiplayer | In development |
| 75 | [Last Mile 2D](https://dooshima.itch.io/last-mile-2d) | `last-mile-2d` | arcade, casual | Released |
| 76 | [Coin Catcher](https://dorijjk.itch.io/coin-catcher) | `coin-catcher` | arcade, casual | Released |
| 77 | [MINI MUSUME - Pretty Ride](https://doubleint-software.itch.io/mini-musume-pretty-ride) | `mini-musume-pretty-ride` | simulation, racing, sports | Released |
| 78 | [Kegare: Vowbreaker](https://eatpho.itch.io/kegare-vowbreaker) | `kegare-vowbreaker` | action, rpg | In development |
| 79 | [Murim's Last Hope: David](https://echoplayroom.itch.io/murims-last-hope) | `murims-last-hope` | action, arcade | Released |
| 80 | [Awkward Sidewalk](https://elixirslabs.itch.io/awkward-sidewalk) | `awkward-sidewalk` | arcade, action, casual | Released |
| 81 | [Space Games](https://enricopapi.itch.io/gioco-spazio) | `gioco-spazio` | action, arcade | Released |
| 82 | [Coordenação do Caos](https://espelhodaarte.itch.io/coordenao-do-caos) | `coordenao-do-caos` | arcade, casual | Released |
| 83 | [Piper The MineSweeper](https://estudio-escarlata.itch.io/piper-the-minesweeper) | `piper-the-minesweeper` | puzzle, casual | Released |
| 84 | [Golf Diving](https://euan-mitchell.itch.io/golf-diving) | `golf-diving` | simulation, sports | In development |
| 85 | [CC: Bianca's Sigils](https://evilous.itch.io/cc-biancas-sigils) | `cc-biancas-sigils` | puzzle, casual | Released |
| 86 | [Sodium Drift](https://ezlb.itch.io/sodium-drift) | `sodium-drift` | racing, arcade | Released |
| 87 | [PUPUTAN MARGARANA](https://fajarputra2022.itch.io/puputan-margarana) | `puputan-margarana` | educational, rpg, adventure | Released |
| 88 | [PUPUTAN MARGARANA IN BALI](https://fajarputra2022.itch.io/puputan-margarana-in-bali) | `puputan-margarana-in-bali` | educational, rpg, adventure | Released |
| 89 | [DRIFT // ESCAPIST](https://feeengyuuu.itch.io/drift-escapist) | `drift-escapist` | horror, adventure | Released |
| 90 | [A Toast to Christmas](https://flines.itch.io/a-toast-to-christmas) | `a-toast-to-christmas` | casual | Canceled |
| 91 | [Chicken Stack](https://flockfactory.itch.io/chicken-stack) | `chicken-stack` | arcade, casual, action | Released |
| 92 | [Volley carrier](https://foidecanard.itch.io/volley-carrier) | `volley-carrier` | sports, simulation | Released |
| 93 | [BolsoRato](https://forabolsonaro.itch.io/bolsoratop1) | `bolsoratop1` | action, adventure | Released |
| 94 | [For Elise](https://forelise.itch.io/for-elise) | `for-elise` | platformer, adventure | Released |
| 95 | [ForkBuild](https://forkbuild.itch.io/forkbuild) | `forkbuild` | simulation, casual | Released |
| 96 | [Silencio en Sol](https://forta.itch.io/silencio-en-sol) | `silencio-en-sol` | casual, adventure | Released |
| 97 | [Super Tic-Tac-Toe](https://franny22.itch.io/super-tic-tac-toe) | `super-tic-tac-toe` | strategy, puzzle, board-game | Released |
| 98 | [Occultics | Weridcore speed date](https://funtimefreddie.itch.io/occultics) | `occultics` | casual, horror | Released |
| 99 | [Activity 2](https://gabriel-l-enriquez.itch.io/activity-2) | `activity-2` | adventure, rpg | Released |
| 100 | [Activity 3 Gen the Adventurer](https://gabriel-l-enriquez.itch.io/activity-3-gen-the-adventurer) | `activity-3-gen-the-adventurer` | adventure, rpg | Released |
| 101 | [Group 9](https://gabriel-l-enriquez.itch.io/group-9) | `group-9` | adventure, casual | Released |
| 102 | [Hollow Hours](https://gamertemple.itch.io/hollow-hours) | `hollow-hours` | shooting, action, survival | Released |
| 103 | [PROTECT MIEKO](https://gattenshochi.itch.io/protect-mieko) | `protect-mieko` | shooting, action, arcade | In development |
| 104 | [Cookie clicker 3](https://ghost-developments.itch.io/cookie-clicker-3) | `cookie-clicker-3` | idle, casual | In development |
| 105 | [Realm of Embers](https://gilianogvk.itch.io/realm-of-embers) | `realm-of-embers` | rpg, adventure | In development |
| 106 | [4ビット2進数→16進数 変換 ドリル](https://go-kaaart.itch.io/binary4bit) | `binary4bit` | educational, puzzle | Released |
| 107 | [Sentai Strike](https://hatdoc1030.itch.io/sentai-strike) | `sentai-strike` | action, arcade | Released |
| 108 | [Top Cat](https://hawkc.itch.io/top-cat) | `top-cat` | adventure, casual | In development |
| 109 | [TRAPMATES](https://hazael39.itch.io/trapmates) | `trapmates` | action, multiplayer, casual | In development |
| 110 | [Lagrange](https://heosphorus.itch.io/lagrange) | `lagrange` | casual, survival | Released |
| 111 | [Plop Ball](https://higherdreams.itch.io/plop-ball) | `plop-ball` | arcade, platformer, casual | Released |
| 112 | [Rüpü](https://huenu-che-studio.itch.io/rp) | `rp` | platformer, adventure, action | In development |
| 113 | [Blob Siege](https://hunnag.itch.io/blob-siege) | `blob-siege` | shooting, multiplayer, action | Released |
| 114 | [Monopalade](https://hunnag.itch.io/monopalade) | `monopalade` | simulation, strategy | In development |
| 115 | [Unlucky Traveler](https://hunnag.itch.io/unlucky-traveler) | `unlucky-traveler` | rpg, survival, strategy | In development |
| 116 | [Attar](https://huseyinbuyukbayram.itch.io/attar) | `attar` | puzzle, casual | Released |
| 117 | [HyperCat: Cozy Cat Pet](https://hyperhollowgames.itch.io/hypercat) | `hypercat` | simulation, casual | Released |
| 118 | [UNINVITED](https://igoryakunin.itch.io/uninvited) | `uninvited` | casual, puzzle | Released |
| 119 | [Bubble Cat](https://ilijarad.itch.io/bubble-cat) | `bubble-cat` | shooting, arcade, action | Released |
| 120 | [Los Santos Rising](https://imdonix.itch.io/lsr) | `lsr` | rpg, action, adventure | Released |
| 121 | [When the Boss Turns Away](https://imnotiris.itch.io/when-the-boss-turns-away) | `when-the-boss-turns-away` | strategy, simulation, casual | Released |
| 122 | [Talking Bomby](https://jacknjellify.itch.io/talking-bomby) | `talking-bomby` | casual | Released |
| 123 | [Watching Walls](https://jackthestuckman.itch.io/watching-walls) | `watching-walls` | arcade, action | Released |
| 124 | [Dave Bound](https://janjigangi.itch.io/bound) | `bound` | arcade, casual, action | Released |
| 125 | [Sudoku](https://jdsherbert.itch.io/sudoku) | `sudoku` | puzzle, casual | Released |
| 126 | [Teatro antidisturbio](https://jeremotas.itch.io/teatro-antidisturbio) | `teatro-antidisturbio` | adventure, casual | In development |
| 127 | [Double Agent](https://jesseblueberry.itch.io/double-agents) | `double-agents` | strategy, casual | Released |
| 128 | [RetrOS](https://jimsgamedesign.itch.io/retros) | `retros` | simulation, casual | Released |
| 129 | [怒髪天！ガンギレ番長蹴り一発!](https://jin-e-yamamoto.itch.io/raging-bancho-one-kick-shot) | `raging-bancho-one-kick-shot` | action, arcade, sports | Released |
| 130 | [Out of Scale](https://jingwens.itch.io/out-of-scale) | `out-of-scale` | puzzle, casual | Released |
| 131 | [Cockroach Sprint](https://jinnoslag.itch.io/cockroach-sprint) | `cockroach-sprint` | racing, arcade, casual | Released |
| 132 | [JEWEL CATCH](https://joe1223k.itch.io/jewel-catch) | `jewel-catch` | arcade, casual | Released |
| 133 | [BARQUINHO DO TRÁFICO 5: ROUBEI O TESOURO DO DAVY JONES E AGORA PRECISO FUGIR DO KRAKEN NA BAÍA DE GUANABARA](https://jomigmonte.itch.io/barquinho-do-trfico-5-roubei-o-tesouro-do-davy-jones-e-agora-preciso-fugir-do-kr) | `barquinho-do-trfico-5-roubei-o-tesouro-do-davy-jones-e-agora-preciso-fugir-do-kr` | action, adventure, arcade | Released |
| 134 | [Rumorsmith](https://jopiraca.itch.io/rumorsmith) | `rumorsmith` | puzzle, casual | Released |
| 135 | [Firni](https://kaziliandev.itch.io/firni) | `firni` | action, arcade | Released |
| 136 | [運道 — 2部屋の試遊 / The Way of Quantum Demo](https://keidoro-lab.itch.io/undo-two-room-demo) | `undo-two-room-demo` | adventure, casual, puzzle | Demo |
| 137 | [Mayas school life](https://kekoyum.itch.io/mayas-school-life) | `mayas-school-life` | casual, simulation | In development |
| 138 | [SKY CLIMBER 3D](https://kenken0014.itch.io/skyclimber3d) | `skyclimber3d` | platformer, action | Released |
| 139 | [ASCENT//FLUX](https://key-keeper999.itch.io/ascentflux) | `ascentflux` | platformer, puzzle, action | In development |
| 140 | [Due at Midnight](https://khovanet.itch.io/due-at-midnight) | `due-at-midnight` | simulation, casual | In development |
| 141 | [Qubimo](https://kidspark.itch.io/qubimo) | `qubimo` | educational, puzzle | Released |
| 142 | [Simulador De Carreras](https://kimbo1042.itch.io/simulador-carreras) | `simulador-carreras` | racing, simulation | In development |
| 143 | [Fork in the Road](https://kingeln.itch.io/fork-in-the-road) | `fork-in-the-road` | adventure, casual | In development |
| 144 | [Let It Soak](https://kios-house.itch.io/let-it-soak) | `let-it-soak` | puzzle, casual | Released |
| 145 | [Safe Space](https://kirkclarke.itch.io/safe-space) | `safe-space` | survival, arcade, action | Released |
| 146 | [HEADSTACK](https://kohsija.itch.io/headstack) | `headstack` | puzzle, casual | Released |
| 147 | [KNOCKWORKS (free demo)](https://kqmigqkqri.itch.io/knockworks-demo) | `knockworks-demo` | strategy, casual, simulation | Demo |
| 148 | [Race to second](https://krisboulton82gmailcom.itch.io/race-to-second) | `race-to-second` | racing, arcade | Released |
| 149 | [Last Defense: Asteroid Protocol](https://kronfeld.itch.io/last-defense-asteroid-protocol) | `last-defense-asteroid-protocol` | action, shooting, arcade | Released |
| 150 | [Lantern City](https://lasterminator.itch.io/lantern-city) | `lantern-city` | music, puzzle, casual | Released |
| 151 | [Luck Aside](https://launchwaygames.itch.io/luck-aside) | `luck-aside` | strategy, casual, board-game | Released |
| 152 | [Wave Back](https://launchwaygames.itch.io/wave-back) | `wave-back` | casual, simulation | Released |
| 153 | [The Urban Menu Australia](https://laurabarker82.itch.io/the-urban-menu-australia) | `the-urban-menu-australia` | educational, casual | In development |
| 154 | [Banana Rain](https://leolofuj.itch.io/banana-rain) | `banana-rain` | platformer, casual | Released |
| 155 | [Cozy Closet](https://leolofuj.itch.io/cozy-closet) | `cozy-closet` | puzzle, casual | Released |
| 156 | [Fellshorn Port Prototype V2](https://limelazer.itch.io/fellshorn-port-prototype-v2) | `fellshorn-port-prototype-v2` | adventure, casual | In development |
| 157 | [Eight Wastes Survivors · 八荒幸存者](https://linsama.itch.io/eight-wastes-survivors) | `eight-wastes-survivors` | survival, action, rpg | In development |
| 158 | [Hollow Void](https://loghanv.itch.io/hollow-void) | `hollow-void` | platformer, horror, action | Released |
| 159 | [Memo the bunny](https://lunana-8.itch.io/memothebunny) | `memothebunny` | adventure, casual | Released |
| 160 | [The Button](https://makerspacers.itch.io/the-button) | `the-button` | idle, casual | Released |
| 161 | [Her Wish](https://makoteam.itch.io/her-wish) | `her-wish` | puzzle, action | In development |
| 162 | [Extinción Inversa ODS 15](https://marcoantoniofuentes.itch.io/extincin-inversaa) | `extincin-inversaa` | adventure, educational, simulation | Released |
| 163 | [Color Clump: Sort Puzzle](https://marea-alta-games.itch.io/color-clump-sort-puzzle) | `color-clump-sort-puzzle` | puzzle, casual | Released |
| 164 | [school-avg](https://markzhengma.itch.io/school-avg) | `school-avg` | casual, simulation | Released |
| 165 | [Trauma Slayer](https://master-m-game.itch.io/trauma-slayer) | `trauma-slayer` | horror, action | Released |
| 166 | [Hand Helfinger](https://masterado.itch.io/hand-helfinger) | `hand-helfinger` | puzzle, strategy, casual | In development |
| 167 | [POP!](https://mat3ushrc.itch.io/pop) | `pop` | arcade, casual, action | In development |
| 168 | [Lion Catch](https://maxwellsdad.itch.io/lion-catch) | `lion-catch` | casual, educational | Released |
| 169 | [CUBE 2048](https://mayjune78.itch.io/cube-2048) | `cube-2048` | puzzle, casual, arcade | Released |
| 170 | [Untenmaille](https://mctre.itch.io/untenmaille) | `untenmaille` | casual, arcade | Released |
| 171 | [Character Customizer (2D)](https://methodox.itch.io/character-customizer-2d) | `character-customizer-2d` | casual, simulation | Released |
| 172 | [¿Dónde está la Llama? Busca y Colorea (Find the Llama)](https://miky53.itch.io/donde-esta-la-llama) | `donde-esta-la-llama` | puzzle, casual, educational | Released |
| 173 | [Last Earth](https://milicen.itch.io/last-on-earth) | `last-on-earth` | simulation, casual | Released |
| 174 | [Parry Knight](https://miloovaltine.itch.io/parry-knight) | `parry-knight` | action, fighting | Released |
| 175 | [ocgame](https://miluocgame.itch.io/ocgame) | `ocgame` | shooting, action | Released |
| 176 | [Guishan: Autumn Return](https://mishua.itch.io/guishan-autumn-return) | `guishan-autumn-return` | adventure, casual | In development |
| 177 | [Cozy Cat House](https://mitsurukatsu.itch.io/cozy-cat-house) | `cozy-cat-house` | simulation, casual | Released |
| 178 | [Tunjomania. Guerreros de Sie](https://mitty027.itch.io/tunjomania-guerreros-de-sie) | `tunjomania-guerreros-de-sie` | adventure, casual | In development |
| 179 | [Mix & Mortar](https://mneho333.itch.io/mix-and-mortar) | `mix-and-mortar` | simulation, strategy, casual | In development |
| 180 | [STORM BROTHERS](https://molki09.itch.io/storm-brothers) | `storm-brothers` | platformer, adventure | In development |
| 181 | [Underbloom](https://motawe3.itch.io/underbloom) | `underbloom` | rpg, survival, action | Released |
| 182 | [Robot Outbreak!](https://mrsctat.itch.io/robot-outbreak) | `robot-outbreak` | strategy, survival, arcade | Released |
| 183 | [Traffic Congestion-INDIE HALLOWEN HORROR GAME](https://mubeflexin08.itch.io/the-traffic-congestion-indie-hallowen-horror-game) | `the-traffic-congestion-indie-hallowen-horror-game` | horror, action | Released |
| 184 | [氷紋 HYOMON](https://muonwashere.itch.io/hyomon) | `hyomon` | casual, simulation | Released |
| 185 | [Little Talks](https://myriadgames.itch.io/little-talks) | `little-talks` | casual | Released |
| 186 | [산군을 베다 (Slay the Mountain King)](https://newcomsys1gmailcom.itch.io/slay-the-mountain-king) | `slay-the-mountain-king` | action, survival | Released |
| 187 | [Balls and walls](https://nikos-12.itch.io/balls-and-walls) | `balls-and-walls` | arcade, casual | Canceled |
| 188 | [Tower Defense: Word Scramble!](https://nnoob.itch.io/tower-defense-word-scramble) | `tower-defense-word-scramble` | strategy, puzzle, educational | In development |
| 189 | [Driftdrop](https://nodudguy.itch.io/driftdrop) | `driftdrop` | puzzle, casual | Released |
| 190 | [Neo-Chronos: Vector Legacy](https://nomadadigital.itch.io/neo-chronos-vector-legacy) | `neo-chronos-vector-legacy` | action, arcade | Released |
| 191 | [Backrooms world](https://noni079.itch.io/backrooms-world) | `backrooms-world` | horror, multiplayer, adventure | Released |
| 192 | [Stick Battle 1&2 Player](https://nrjx.itch.io/stick-battle-12-player) | `stick-battle-12-player` | shooting, action, multiplayer | Released |
| 193 | [Jelly Valley](https://nubbaka.itch.io/jelly-valley) | `jelly-valley` | casual, arcade | Released |
| 194 | [POOP LAUNCHER](https://octopustako.itch.io/poop-launcher) | `poop-launcher` | action, arcade, casual | Released |
| 195 | [5040: Find the Secret Number](https://ojdeal.itch.io/codebreaker) | `codebreaker` | puzzle, card, strategy | In development |
| 196 | [One for Millennium](https://oleandergarden.itch.io/millennium) | `millennium` | casual | Released |
| 197 | [church rat](https://oon-safka.itch.io/church-rat3d) | `church-rat3d` | adventure, casual | Released |
| 198 | [UNREAD 33](https://orangelily.itch.io/unread-33) | `unread-33` | puzzle, casual | In development |
| 199 | [hydrojump](https://p2ki.itch.io/hydrojump0001) | `hydrojump0001` | arcade, casual | Released |
| 200 | [Hurdle Jump!](https://pandemic-phil.itch.io/hurdle-jump) | `hurdle-jump` | arcade, sports, casual | In development |
| 201 | [Patea el Anillo (Kick the Ring)](https://paracetamil.itch.io/kick-the-ring) | `kick-the-ring` | arcade, casual, action | Released |
| 202 | [COMBAT WARS](https://pilaf2.itch.io/combat-wars) | `combat-wars` | strategy, action | Released |
| 203 | [War Zone](https://poolfish.itch.io/war-zone) | `war-zone` | shooting, action | Released |
| 204 | [Shmoop](https://protomo.itch.io/shmoop) | `shmoop` | shooting, arcade, action | Released |
| 205 | [Voidswarm](https://pteeg.itch.io/voidswarm) | `voidswarm` | shooting, survival, arcade | Released |
| 206 | [3 Seconds-Chapter 2- Episode 2](https://qixya.itch.io/3-seconds-chapter-2-episode-2) | `3-seconds-chapter-2-episode-2` | casual | Released |
| 207 | [Sweet Visits](https://quarantineweightgain.itch.io/sweet-visits) | `sweet-visits` | casual, arcade | Released |
| 208 | [NeonRush2D](https://radulessqagency.itch.io/neonrush2d) | `neonrush2d` | racing, arcade, action | Released |
| 209 | [NeonRush3D](https://radulessqagency.itch.io/neonrush3d) | `neonrush3d` | racing, arcade, casual | Released |
| 210 | [同歸於盡  동귀어진 : Mutual Destruction](https://ramie-kim.itch.io/mutual-destruction) | `mutual-destruction` | casual | Released |
| 211 | [Lava Jump](https://ramnindersingh.itch.io/lava-jump) | `lava-jump` | platformer, arcade, casual | Released |
| 212 | [Defend Constantinople](https://real-history-with-sam.itch.io/defend-constantinople) | `defend-constantinople` | strategy, action | Released |
| 213 | [DUKE MASTER](https://redbus69gmailcom.itch.io/duke-master) | `duke-master` | action, arcade | Released |
| 214 | [Ball Bounce](https://reddestvr.itch.io/ballboing) | `ballboing` | platformer, arcade, casual | Released |
| 215 | [Las Profudidades](https://riky2411de.itch.io/las-profudidades) | `las-profudidades` | action, arcade | Released |
| 216 | [Midnight Market](https://ringtail-interactive.itch.io/midnight-market) | `midnight-market` | action, strategy | In development |
| 217 | [Velocity Tag](https://ronald12345.itch.io/velocity-tag) | `velocity-tag` | arcade, action, casual | Released |
| 218 | [Trick Or Treat! The Side Scroller](https://rubber-ducky-games.itch.io/trick-or-treat-the-side-scroller) | `trick-or-treat-the-side-scroller` | platformer, action | Released |
| 219 | [Fruits Blocs](https://saby55.itch.io/fruits-blocs) | `fruits-blocs` | puzzle, casual | Released |
| 220 | [小小白肚子餓！](https://sakanabone.itch.io/sakanabone20261009) | `sakanabone20261009` | casual | Released |
| 221 | [Gravity Box](https://sakanfar.itch.io/gravity-box) | `gravity-box` | puzzle, casual | In development |
| 222 | [Altar of Thirteen](https://sangtkdahr.itch.io/altar-of-thirteen) | `altar-of-thirteen` | card, strategy | Released |
| 223 | [Retro Cheerful Fish](https://satewold.itch.io/retro-cheerful-fish) | `retro-cheerful-fish` | arcade, casual, simulation | Released |
| 224 | [Cookie Quest: The Quest For Cookies](https://scwambledgames.itch.io/cookie-quest-the-quest-for-cookies) | `cookie-quest-the-quest-for-cookies` | rpg, action, casual | Released |
| 225 | [Previous Session](https://shadoweeq.itch.io/previous-session) | `previous-session` | puzzle, casual | Released |
| 226 | [The Last Ember](https://shanks4to.itch.io/the-last-ember) | `the-last-ember` | adventure, platformer | Released |
| 227 | [MaxPaw](https://shawnthevolcano.itch.io/maxpaw) | `maxpaw` | action, casual | In development |
| 228 | [HELL x SPIN: Cards Mode](https://sichugames.itch.io/hell-x-spin-cards) | `hell-x-spin-cards` | card, strategy | Demo |
| 229 | [On Board](https://simonkhan.itch.io/on-board) | `on-board` | casual | Released |
| 230 | [November Uprising 1830](https://simonkick.itch.io/november-uprising-1830) | `november-uprising-1830` | strategy | Released |
| 231 | [Build Escape](https://skoodle-doot.itch.io/build-escape) | `build-escape` | puzzle, platformer, simulation | Released |
| 232 | [Fishticuffs](https://snakeyjakey1999.itch.io/fishticuffs) | `fishticuffs` | puzzle, casual | Released |
| 233 | [CozyTidePool](https://softcade.itch.io/cozytidepool) | `cozytidepool` | simulation, casual | In development |
| 234 | [Honk! Express](https://sokaros.itch.io/honk-express) | `honk-express` | adventure, action, casual | In development |
| 235 | [Blankie Run 3](https://songmeng0402.itch.io/blankie-run-3) | `blankie-run-3` | platformer, arcade, casual | Released |
| 236 | [Lanterne](https://soraque.itch.io/lanterne) | `lanterne` | platformer, action | In development |
| 237 | [Aura & Alche-Me](https://soulofblight.itch.io/aura-alche-me) | `aura-alche-me` | casual | Released |
| 238 | [Power Name Reader](https://soulofblight.itch.io/power-name-reader) | `power-name-reader` | casual | Released |
| 239 | [Cool Game Mario](https://spaceverse.itch.io/cool-game-mario) | `cool-game-mario` | platformer, action | Released |
| 240 | [Pajé](https://starfightrebellion.itch.io/paj) | `paj` | simulation, strategy, adventure | Released |
| 241 | [Tree Hole](https://stevenli-phoenix-work.itch.io/tree-hole) | `tree-hole` | casual, simulation | In development |
| 242 | [Fall Damage](https://suff-tuff.itch.io/fall-damage) | `fall-damage` | fighting, multiplayer, action | In development |
| 243 | [F1 Management](https://superespaditas.itch.io/f1-management) | `f1-management` | racing, simulation, strategy | Released |
| 244 | [Buck Face Saves Us All](https://tacobeartaco.itch.io/buck-face-saves-us-all) | `buck-face-saves-us-all` | strategy, action | In development |
| 245 | [GeludX](https://taipeistudio.itch.io/geludx) | `geludx` | fighting, action | Released |
| 246 | [Kuli Coding](https://taipeistudio.itch.io/kuli-coding) | `kuli-coding` | card, strategy, educational | Released |
| 247 | [Thought Bubbler](https://taylund.itch.io/thought-bubbler) | `thought-bubbler` | puzzle, multiplayer, casual | In development |
| 248 | [ポッチと灯火の回廊](https://tetsugame.itch.io/pocchi-tomoshibi) | `pocchi-tomoshibi` | card, strategy, rpg | Released |
| 249 | [Dark Adaptation](https://thawborn.itch.io/dark-adaptation) | `dark-adaptation` | horror, adventure | Released |
| 250 | [the CLUB poker](https://theclubpoker.itch.io/the-club-poker) | `the-club-poker` | card, multiplayer, strategy | Released |
| 251 | [Pony Cuddle Castle](https://thecrimsondm-vanillia.itch.io/pony-cuddle-castle) | `pony-cuddle-castle` | casual | Released |
| 252 | [REDLINE](https://thegamer-dude.itch.io/redline) | `redline` | arcade, action | Released |
| 253 | [The King Speaks](https://thekingspeakss.itch.io/the-king-speaks) | `the-king-speaks` | strategy, rpg | In development |
| 254 | [Drifty Drifters](https://thelabratdon.itch.io/drifty-drifters) | `drifty-drifters` | racing, arcade | Released |
| 255 | [ETHERY](https://theonlysebastian007.itch.io/ethery) | `ethery` | adventure, survival, rpg | In development |
| 256 | [The Quinn Game](https://thequinngame.itch.io/the-quinn-game) | `the-quinn-game` | casual, arcade | Released |
| 257 | [Asteroids](https://therealsabas.itch.io/asteroids) | `asteroids` | arcade, shooting, action | Released |
| 258 | [Yu-Gi-Oh! Rogue Duelist](https://thronior.itch.io/ygo-rogue) | `ygo-rogue` | card, strategy | Released |
| 259 | [Ninja Bunny](https://trmike.itch.io/ninja-bunny) | `ninja-bunny` | educational, casual | Released |
| 260 | [Villisika ja koodisade](https://tuukkakekarainen.itch.io/villisika) | `villisika` | arcade, casual | Released |
| 261 | [KA.IJU](https://tv-game-corp.itch.io/kaiju) | `kaiju` | action, arcade | Released |
| 262 | [Color Blind](https://txb13.itch.io/color-blindz) | `color-blindz` | puzzle, casual | Released |
| 263 | [30 Days To Develop](https://unhingedkiwi.itch.io/30-days-to-develop) | `30-days-to-develop` | simulation, educational, strategy | In development |
| 264 | [IRONFALL](https://vannil.itch.io/ironfall) | `ironfall` | shooting, action, strategy | In development |
| 265 | [Bosque Sereno — Demo](https://vectobanana.itch.io/bosque-sereno) | `bosque-sereno` | platformer, casual | Demo |
| 266 | [PULSO](https://velza-pulso.itch.io/pulso) | `pulso` | music, casual | In development |
| 267 | [SCOLIONOPHOBIA](https://vesperdagoat.itch.io/scolionophobia) | `scolionophobia` | casual, horror | Released |
| 268 | [Muistipeli (Lumiukko)](https://vilminauha.itch.io/lumiukkomuistipeli) | `lumiukkomuistipeli` | card, casual, educational | In development |
| 269 | [Vilminauha muistipeli](https://vilminauha.itch.io/vilminauha-muistipeli) | `vilminauha-muistipeli` | card, casual, educational | Released |
| 270 | [Pixel Octopus HD – Usage limit reached](https://vitya-games.itch.io/pixel-octopus-hd) | `pixel-octopus-hd` | platformer, casual | Released |
| 271 | [Untitled Lazy Office Simulator](https://volonecake.itch.io/untitled-lazy-office-simulator) | `untitled-lazy-office-simulator` | simulation, casual | In development |
| 272 | [Ah!Steroids](https://walangstudio.itch.io/ahsteroids) | `ahsteroids` | action, arcade | In development |
| 273 | [tales of the leafclan [a warrior cats simulator]](https://warrior-cats-kitty123.itch.io/tales-of-the-leafclan-a-warrior-cats-simulator) | `tales-of-the-leafclan-a-warrior-cats-simulator` | simulation, rpg, casual | Released |
| 274 | [Looks Legit](https://webholt.itch.io/looks-legit) | `looks-legit` | puzzle, casual | In development |
| 275 | [StarTurrets](https://willva.itch.io/starturrets) | `starturrets` | strategy, idle | In development |
| 276 | [Ironfront](https://wimkamphorstcoaching.itch.io/ironfront) | `ironfront` | strategy, simulation | Released |
| 277 | [RPG Tático](https://wuiz4rd.itch.io/rpg-tatico) | `rpg-tatico` | strategy, rpg | In development |
| 278 | [APSIS](https://xiaoxiaouk.itch.io/apsis) | `apsis` | simulation, casual | In development |
| 279 | [TaffyRush](https://xklein.itch.io/taffyrush) | `taffyrush` | strategy, casual | In development |
| 280 | [Animal Soda Shop](https://xunn371459.itch.io/animal-soda-shop) | `animal-soda-shop` | music, casual | Released |
| 281 | [Starwing](https://xwisegames.itch.io/starwing) | `starwing` | action, arcade, shooting | Released |
| 282 | [el kuka game](https://yamileerbes.itch.io/el-kuka-game) | `el-kuka-game` | casual, arcade | In development |
| 283 | [Rust and Rations](https://yaya-studios.itch.io/rust-and-rations) | `rust-and-rations` | survival, strategy, casual | Released |
| 284 | [Ink Blade Endless](https://ykm-zergling.itch.io/ink-blade-endless) | `ink-blade-endless` | action, arcade | Released |
| 285 | [Moonlight](https://yundadada.itch.io/moonlight) | `moonlight` | puzzle, casual | Released |
| 286 | [deli sou](https://yurinosuke.itch.io/deli-sou) | `deli-sou` | casual | Released |
| 287 | [Catch Me(ow) If You Can](https://zackyhax.itch.io/catch-meow-if-you-can) | `catch-meow-if-you-can` | puzzle, casual | In development |
| 288 | [Oathless Knight](https://zerocreator.itch.io/oathless-knight) | `oathless-knight` | rpg, action | Released |
| 289 | [Window](https://zezimite.itch.io/window) | `window` | casual, simulation | In development |
