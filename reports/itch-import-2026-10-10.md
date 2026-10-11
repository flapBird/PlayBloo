# itch.io 批量导入记录 · 2026-10-10

来源：「itch.io 新游戏速递 · 2026-10-10」导出（共 300 款，抓取时间 2026-10-10 17:59）。
本批入库 **296 款**，全部为免费 HTML5 网页游戏，介绍页指向 itch.io 原页面外链游玩（`external_url`），无 iframe 内嵌。

- 数据来源：导出 Markdown + 逐款抓取 itch.io 详情页；首轮 6 并发 257/300 → 低并发补抓恢复 42 款 → 最终 299/300
- 文案：每款英文 description / how_to_play / controls / tips / features，基于官方页面内容撰写；信息薄的如实写薄，demo/prototype 标注 development_status
- 字段惯例与既有 itch 导入一致：`source_type=itch.io`、`platforms=[browser]`、`monetization=free`、`content_verified=true`、`sources=[{url,type,verifiedAt}]`
- 分类：共绑定 715 条 game_categories；标签未使用（与既有惯例一致）
- 封面：296 张 itch 热链封面已镜像到 Supabase Storage（`covers/{slug}.{ext}`），`thumbnail_url` 已指向镜像
- 入库事故与修复：games 表 296 行写入成功后，脚本在读取插入响应时超时中断，分类关联与 Updates 未写入；已用修复脚本按原逻辑补齐（715 条分类 + 296 条 Updates），无重复数据

## 未入库 5 款

| 游戏 | 原因 |
|---|---|
| incedibox sprunki | itch 页面已 404（游戏下架，单发复核确认） |
| Nessie the explorer（jotsigma 副本） | 同款重复上传，保留 jotedinburgh 主页 |
| Lazy King（archibald-the-third-games） | 与 dani-cooleo 的《Protect the Lazy King!》同 slug（lazy-king）冲突，保留先上架者；archibald 版可待后续处理 |
| The Password Game（kurt2917） | Neal Agarwal（neal.fun）知名游戏的转贴，无授权再分发，版权风险跳过 |
| （批内无撞库记录） | 本批其余 296 款均与库内既有记录无冲突 |

## 入库清单（296 款）

| # | 游戏页面 | slug | 分类 | 状态 |
|---|---|---|---|---|

| 1 | [wowhaha](https://1234li.itch.io/wowhaha) | `wowhaha` | action, arcade | Released |
| 2 | [Path to Glory](https://168429221016.itch.io/path-to-glory) | `path-to-glory` | casual, adventure | Released |
| 3 | [the fat man and the cat](https://abdoslim.itch.io/the-fit-man-and-the-cat) | `the-fit-man-and-the-cat` | adventure, casual | In development |
| 4 | [The Train](https://abirdnamedboris.itch.io/the-train) | `the-train` | simulation, casual | Released |
| 5 | [Necromancer: Raise The Horde](https://adarmawan1977.itch.io/necromancer-raise-the-horde) | `necromancer-raise-the-horde` | action, survival, rpg | In development |
| 6 | [Nasubi: 335 Days of Solitude (Playable Demo)](https://adn-game.itch.io/nasubi-335-days-of-solitude-playable-demo) | `nasubi-335-days-of-solitude-playable-demo` | simulation, survival | Demo |
| 7 | [Drift](https://afaskiev.itch.io/drift) | `drift` | racing, arcade, casual | Released |
| 8 | [Pixel Hold'em](https://aflyingsheep.itch.io/pixel-holdem) | `pixel-holdem` | card, strategy, casual | Released |
| 9 | [grand theft 67](https://ai-games67.itch.io/grand-theft-67) | `grand-theft-67` | action, adventure | Released |
| 10 | [stella_cadente](https://akitakomatin.itch.io/stella-cadente) | `stella-cadente` | rpg, casual | Released |
| 11 | [Untitled Car Racing Game](https://anpanlover.itch.io/untitled-car-racing-game-anpanlover) | `untitled-car-racing-game-anpanlover` | racing, arcade, casual | Released |
| 12 | [Patternbook](https://arcadesquirrel.itch.io/patternbook) | `patternbook` | simulation, casual, educational | In development |
| 13 | [SHIFT — Logistics Simulator](https://aretedriver.itch.io/shift-logistics-simulator) | `shift-logistics-simulator` | simulation, strategy, casual | In development |
| 14 | [Fable Flight — Flight Academy](https://arnav16.itch.io/fable-flight-academy) | `fable-flight-academy` | simulation, educational | In development |
| 15 | [Galevein: Stormflight](https://arnav16.itch.io/galevein-stormflight) | `galevein-stormflight` | simulation, adventure, arcade | In development |
| 16 | [Approved!](https://arondhan.itch.io/approved) | `approved` | idle, simulation, casual | In development |
| 17 | [Just Beat It](https://arsenal4eva.itch.io/just-beat-it) | `just-beat-it` | music, casual | Released |
| 18 | [VANISH](https://arxeja.itch.io/vanish) | `vanish` | puzzle, board-game, casual | In development |
| 19 | [Baller Story](https://asaf-shitrit.itch.io/baller-story) | `baller-story` | sports, strategy, rpg | In development |
| 20 | [Feed: Night Shift](https://ashfolk-studio.itch.io/feed-night-shift) | `feed-night-shift` | simulation, card, strategy | In development |
| 21 | [The hunt for Jeff](https://astrion-games.itch.io/the-hunt-for-jeff) | `the-hunt-for-jeff` | action, rpg, survival | In development |
| 22 | [Shadow Registry](https://auriaca.itch.io/shadow-registry) | `shadow-registry` | puzzle, casual | In development |
| 23 | [Locked In](https://axolotl-jim.itch.io/locked-in) | `locked-in` | simulation, puzzle | In development |
| 24 | [Apex Line](https://ayutarou0604-arch.itch.io/apex-line) | `apex-line` | racing, multiplayer, arcade | Released |
| 25 | [Nonario: Hearth](https://backfjord.itch.io/nonario-hearth) | `nonario-hearth` | puzzle, strategy, casual | In development |
| 26 | [XO](https://bar13.itch.io/xo) | `xo` | board-game, casual, puzzle | Released |
| 27 | [Countryballs Phase 3](https://belendas.itch.io/countryballs-phase-3) | `countryballs-phase-3` | casual, action | Released |
| 28 | [Tideblade](https://ben7503.itch.io/tidebladfilecuserscristdownloadstideblade-island-duelhtml) | `tidebladfilecuserscristdownloadstideblade-island-duelhtml` | survival, action, casual | Released |
| 29 | [WipeOut](https://betasdu.itch.io/wipeout) | `wipeout` | arcade, action, racing | In development |
| 30 | [Farm Tycoon v1.15](https://bewareofcandles.itch.io/farm-tycoon) | `farm-tycoon` | simulation, strategy, idle | In development |
| 31 | [Project VORTEX CHRONOS](https://bibengames.itch.io/project-vortex-chronos) | `project-vortex-chronos` | adventure, casual | In development |
| 32 | [Staying Warm · 守烛](https://bluejosh.itch.io/staying-warm-221) | `staying-warm-221` | action, survival | Released |
| 33 | [Forza Horizon 9 -bull$hit edition](https://bredyiscoolandhi.itch.io/forza-horizon-9-bullhit-edition) | `forza-horizon-9-bullhit-edition` | racing, arcade, casual | In development |
| 34 | [NEONBOUNCE](https://bstggt.itch.io/neonbounce) | `neonbounce` | arcade, action, casual | Released |
| 35 | [Tiny Hoops](https://cactusfiesta.itch.io/tiny-hoops) | `tiny-hoops` | puzzle, sports, casual | Released |
| 36 | [Ankam](https://cambinnov.itch.io/ankam) | `ankam` | fighting, action | Released |
| 37 | [Head Money](https://canesen7.itch.io/head-money) | `head-money` | shooting, action, simulation | In development |
| 38 | [The Seventh Seal](https://chestnutpawn.itch.io/the-seventh-seal) | `the-seventh-seal` | action, survival | Released |
| 39 | [Neon Merge](https://chokosmilez.itch.io/neon-merge) | `neon-merge` | puzzle, casual | Released |
| 40 | [Blocky Racing](https://cocodev-1.itch.io/blocky-racing) | `blocky-racing` | racing, arcade | Released |
| 41 | [Egg Kart](https://codingbanana21.itch.io/egg-kart) | `egg-kart` | puzzle, casual | Released |
| 42 | [BRIZNA: Islas Suspendidas](https://creatorisla.itch.io/brizna-islas-suspendidas) | `brizna-islas-suspendidas` | adventure, platformer | In development |
| 43 | [Retro Rabbit Web](https://crunchycarrot.itch.io/retro-rabbit-web) | `retro-rabbit-web` | arcade, action, casual | Released |
| 44 | [El Tesoro de los Inocentes](https://cuervo-locutor.itch.io/tesoro) | `tesoro` | survival, casual | In development |
| 45 | [居家失物簿｜Home Lost & Found](https://culaliya.itch.io/home-lost-found) | `home-lost-found` | puzzle, casual | Released |
| 46 | [Prismora — 裂璃掃光](https://culaliya.itch.io/prismora) | `prismora` | action, arcade | Released |
| 47 | [The Brass Leviathan｜黃銅蒸汽輪船密室](https://culaliya.itch.io/the-brass-leviathan) | `the-brass-leviathan` | puzzle, adventure | Released |
| 48 | [SpellSurge](https://d3velopp.itch.io/spellsurge) | `spellsurge` | action, adventure, survival | Released |
| 49 | [Corn-vior](https://dafriedchikn.itch.io/corn-vior) | `corn-vior` | platformer, action | Released |
| 50 | [Protect the Lazy King!](https://dani-cooleo.itch.io/lazy-king) | `lazy-king` | action, strategy, casual | Released |
| 51 | [Alchemy Orders](https://darhanqfzx.itch.io/alchemy-orders) | `alchemy-orders` | puzzle, casual, arcade | Released |
| 52 | [Lumberbound](https://darkc-dev.itch.io/lumberbound) | `lumberbound` | simulation, casual | In development |
| 53 | [Darkwaar26 - Signal Leap](https://darkwoodcom.itch.io/darkwaar26) | `darkwaar26` | puzzle, casual | Released |
| 54 | [Python is Easy](https://david-martinez034.itch.io/python-is-easy) | `python-is-easy` | educational, casual | Released |
| 55 | [Emberwatch — Helios Colony Defense](https://ddweiba.itch.io/emberwatch-helios-colony-defense) | `emberwatch-helios-colony-defense` | strategy, action, survival | In development |
| 56 | [Door to Door](https://dead9917.itch.io/door-to-door) | `door-to-door` | puzzle, simulation, casual | In development |
| 57 | [New Monster Smash](https://dennjzerbetto2-del.itch.io/monster-smash) | `monster-smash` | action, arcade | In development |
| 58 | [Uninvited Pumpkins](https://devviktoria.itch.io/uninvited-pumpkins) | `uninvited-pumpkins` | shooting, action, arcade | Released |
| 59 | [夷陵剑仙：夜幕斩妖](https://df-business.itch.io/yiling-jianxian) | `yiling-jianxian` | action, rpg | Released |
| 60 | [La solitaria vaca ¿cubana?](https://diegostgm.itch.io/vaca-cubana) | `vaca-cubana` | casual, adventure | Released |
| 61 | [Fleet Werewolf](https://diffinity.itch.io/fleet-werewolf) | `fleet-werewolf` | strategy, board-game, puzzle | Released |
| 62 | [1 more minute, Mage](https://digitalite.itch.io/1-more-minute-mage) | `1-more-minute-mage` | platformer, action | In development |
| 63 | [Cratory](https://dormison.itch.io/cratory) | `cratory` | simulation, casual | Released |
| 64 | [泥臭きモノノフどもよ](https://dorokusaki.itch.io/doro-mononofu) | `doro-mononofu` | action, rpg | Released |
| 65 | [Cube wars](https://dos884.itch.io/cube-wars) | `cube-wars` | strategy, casual | In development |
| 66 | [The Baleful Wall](https://driftingduck.itch.io/the-baleful-wall) | `the-baleful-wall` | horror, puzzle, casual | Released |
| 67 | [BLOCUS 2026 : FUSION](https://drisscreatif.itch.io/blocus-2026-fusion) | `blocus-2026-fusion` | strategy, rpg | In development |
| 68 | [Wishing Sphinx](https://drowningmoth.itch.io/wishing-sphinx) | `wishing-sphinx` | puzzle, casual | Released |
| 69 | [A Picnic For Two](https://drtada.itch.io/a-picnic-for-two) | `a-picnic-for-two` | casual, simulation | Released |
| 70 | [DEUS VULT](https://dukex.itch.io/deus-vult) | `deus-vult` | strategy, adventure, educational | Released |
| 71 | [Zombie Mart: Shop by Day](https://dvdixon1122.itch.io/zombie-mart-shop-by-day) | `zombie-mart-shop-by-day` | simulation, casual | Released |
| 72 | [Iron and Musket(Alpha)](https://dyingantstudios.itch.io/iron-and-musketalpha) | `iron-and-musketalpha` | shooting, multiplayer, action | In development |
| 73 | [Sprunki-Pre-Pyramixed (BIG UPDATE)](https://dyl4nx.itch.io/sprunki-pre-pyramixed-big-update) | `sprunki-pre-pyramixed-big-update` | music, casual | Released |
| 74 | [Le Serpentin Des Chiffres](https://edenpixel.itch.io/le-serpentin-des-chiffres) | `le-serpentin-des-chiffres` | educational, puzzle, casual | Released |
| 75 | [Silk Road](https://edmodo1.itch.io/silk-road) | `silk-road` | simulation, strategy | Released |
| 76 | [The Lists](https://edmodo1.itch.io/the-lists) | `the-lists` | simulation, rpg, sports | In development |
| 77 | [Silkong Plus](https://elthe.itch.io/silkong-plus) | `silkong-plus` | action, casual | In development |
| 78 | [Yes Master!](https://emmynn.itch.io/yes-master) | `yes-master` | action, survival | Released |
| 79 | [Xor-Game](https://endike.itch.io/xor-game) | `xor-game` | puzzle, casual | Released |
| 80 | [Token Tumble](https://entou-rage.itch.io/token-tumble) | `token-tumble` | strategy, casual, arcade | Released |
| 81 | [drink coffee, get mad](https://eprimee184workspace.itch.io/drink-coffee-get-mad) | `drink-coffee-get-mad` | platformer, arcade, casual | Released |
| 82 | [La torre de Babel](https://esmeralda-palacios.itch.io/la-torre-de-babel) | `la-torre-de-babel` | platformer, arcade | In development |
| 83 | [Strange Aliens](https://eufneto15.itch.io/strange-aliens) | `strange-aliens` | action, platformer, survival | Released |
| 84 | [Moonlit Hearts: Moonblade](https://exebill1199.itch.io/moonlit-hearts-moonblade) | `moonlit-hearts-moonblade` | action, casual | Released |
| 85 | [الجهراء: عيال مفضي](https://faihan501kuwait.itch.io/jahra-eyal-mafdi) | `jahra-eyal-mafdi` | action, adventure | Released |
| 86 | [Nekotiti: Queen in the Machine](https://feelmakergames.itch.io/nekotiti) | `nekotiti` | simulation, casual | Released |
| 87 | [AFTERCUT](https://feixukeji.itch.io/aftercut) | `aftercut` | puzzle, casual | In development |
| 88 | [too lazy](https://feustsen.itch.io/too-lazy) | `too-lazy` | arcade, action, platformer | Released |
| 89 | [THE LAST QUESTION](https://fiveminutemysteries.itch.io/the-last-question) | `the-last-question` | puzzle, casual | In development |
| 90 | [Poste 84](https://flantechnique.itch.io/poste-84) | `poste-84` | simulation, strategy | In development |
| 91 | [Checkers by FoolFish](https://foolfishgames.itch.io/checkers) | `checkers` | strategy, board-game, multiplayer | Released |
| 92 | [FreeCell by FoolFish](https://foolfishgames.itch.io/freecell) | `freecell` | card, puzzle, casual | Released |
| 93 | [Mancala by FoolFish](https://foolfishgames.itch.io/mancala) | `mancala` | strategy, board-game, multiplayer | Released |
| 94 | [MoonBaseClicker by FoolFish](https://foolfishgames.itch.io/moonbaseclicker) | `moonbaseclicker` | idle, simulation, casual | Released |
| 95 | [Nonograms by FoolFish](https://foolfishgames.itch.io/nonograms) | `nonograms` | puzzle, casual, educational | Released |
| 96 | [TowerMerge by FoolFish](https://foolfishgames.itch.io/tower-merge) | `tower-merge` | puzzle, casual | Released |
| 97 | [Eat the Cookie](https://gabgamesli.itch.io/eat-the-cookie) | `eat-the-cookie` | puzzle, casual | Released |
| 98 | [Chains of Desire](https://gameover888.itch.io/chains-of-desire) | `chains-of-desire` | casual | In development |
| 99 | [Chess Mentor](https://gamer35000.itch.io/chess-mentor) | `chess-mentor` | strategy, educational, board-game | Released |
| 100 | [Kitty Clicker](https://gasman-makes-games.itch.io/kitty-clicker) | `kitty-clicker` | idle, casual | In development |
| 101 | [Gorrilaz The Fan Game](https://gatomarino.itch.io/gorrilaz-the-fan-game) | `gorrilaz-the-fan-game` | racing, casual | Released |
| 102 | [Shiro: The Last Tail](https://geekyinc.itch.io/shiro-the-last-tail) | `shiro-the-last-tail` | fighting, action | Released |
| 103 | [Touhou Magic Circle](https://gepyu.itch.io/touhou-magic-circle) | `touhou-magic-circle` | action, casual | Released |
| 104 | [Radar Picket](https://ghost-845.itch.io/radar-picket) | `radar-picket` | strategy, shooting, simulation | In development |
| 105 | [Gipfelhüpfer – Die große Österreich-Reise](https://gipfelhuepfer.itch.io/gipfelhuepfer) | `gipfelhuepfer` | platformer, adventure, educational | In development |
| 106 | [The Fallen Guardian](https://good-games1.itch.io/the-fallen-guardian) | `the-fallen-guardian` | adventure, rpg | Released |
| 107 | [Nugget Cat](https://gorbunov.itch.io/nugget-cat) | `nugget-cat` | action, arcade, casual | In development |
| 108 | [SlimeTime](https://gordonramsme-gd.itch.io/slimetime) | `slimetime` | puzzle, casual | Released |
| 109 | [Lazy to make a game](https://hahabro-123.itch.io/lazy-to-make-a-game) | `lazy-to-make-a-game` | survival, casual | Released |
| 110 | [Paw Control](https://hanaknik.itch.io/paw-control) | `paw-control` | platformer, puzzle, casual | Released |
| 111 | [音ゲーメーカー/ RHYTHM GAME MAKER](https://hanku2026.itch.io/rhythm-game-maker) | `rhythm-game-maker` | music, casual | Released |
| 112 | [Cookie Buisness](https://haze-xdriven.itch.io/cookie-buisness) | `cookie-buisness` | casual, simulation | In development |
| 113 | [8-ball Billiard](https://heishodan.itch.io/8-ball-billiard) | `8-ball-billiard` | sports, simulation, casual | Released |
| 114 | [Second Paw](https://hergal.itch.io/second-paw) | `second-paw` | simulation, casual | Released |
| 115 | [orbit-hop](https://hibiseichou.itch.io/orbit-hop) | `orbit-hop` | arcade, casual | Released |
| 116 | [勇者伝説](https://hinataro04.itch.io/growing-sword) | `growing-sword` | action, rpg | In development |
| 117 | [Shroom](https://hobbezriel.itch.io/shroom) | `shroom` | platformer, adventure, casual | Released |
| 118 | [David RPG](https://husk471.itch.io/david) | `david` | rpg, adventure | Released |
| 119 | [drop by drop](https://hzxuxx.itch.io/dbd) | `dbd` | simulation, casual | Released |
| 120 | [Ghosts of Aramoor (The Game)](https://ibgoge.itch.io/ghosts-of-aramoor-the-game) | `ghosts-of-aramoor-the-game` | casual, rpg, adventure | Released |
| 121 | [Last Biscuit](https://ibsssss.itch.io/last-biscuit) | `last-biscuit` | strategy, board-game, educational | Released |
| 122 | [JUGUETES PERDIDOS](https://ignacioalonsomurias.itch.io/juguetes-perdidos) | `juguetes-perdidos` | casual, simulation | Released |
| 123 | [Arcana: 3D Tarot](https://infiniteyao.itch.io/arcana-3d-tarot) | `arcana-3d-tarot` | card, casual | Released |
| 124 | [Last Ember](https://inkharbor.itch.io/last-ember) | `last-ember` | survival, action, arcade | Released |
| 125 | [배도라지: 네 명이었다 / Cradle of Cronos](https://j001net.itch.io/cradle-of-cronos) | `cradle-of-cronos` | horror, adventure | Released |
| 126 | [Territory Master](https://jayden221229.itch.io/territory-master) | `territory-master` | strategy, casual | In development |
| 127 | [Sigma Tower Defense](https://jhonata7.itch.io/sigma-tower-defence) | `sigma-tower-defence` | strategy, rpg, action | Released |
| 128 | [Forsaken Fjords](https://jinjanstudios.itch.io/forsaken-fjords) | `forsaken-fjords` | survival, action, adventure | In development |
| 129 | [Snowboard Squad](https://joaovrocha.itch.io/snowboard-squad) | `snowboard-squad` | arcade, sports, action | Released |
| 130 | [OTHELLO LINE](https://joe1223k.itch.io/othello-line) | `othello-line` | board-game, puzzle, strategy | Released |
| 131 | [Dirpy Trucs](https://jonamation.itch.io/dirpy-trucs) | `dirpy-trucs` | casual, arcade | Released |
| 132 | [Nessie the explorer](https://jotedinburgh.itch.io/nessie-the-explorer) | `nessie-the-explorer` | adventure, casual, educational | In development |
| 133 | [Forgotten Hollow's Horror Stories — Capitolo III: Oltre la Soglia](https://julienclementbz.itch.io/forgotten-hollow-oltre-la-soglia) | `forgotten-hollow-oltre-la-soglia` | horror, adventure | In development |
| 134 | [んぐもん~メイジドッジアバレッジ~](https://justes.itch.io/ngumon) | `ngumon` | action, arcade | Released |
| 135 | [Totally Accurate Way To Bake Cookies](https://justtunguska.itch.io/totally-accurate-way-to-bake-cookies) | `totally-accurate-way-to-bake-cookies` | simulation, casual | In development |
| 136 | [Kalastaja Pekka](https://kalastaja-pekka.itch.io/go) | `go` | simulation, adventure, casual | In development |
| 137 | [NEO SHIFT 64: DIVERSE HORIZONS](https://kenken0014.itch.io/neoshift64diversehorizons) | `neoshift64diversehorizons` | racing, action, arcade | Released |
| 138 | [The buster](https://kezzo175.itch.io/the-buster) | `the-buster` | action, arcade | Released |
| 139 | [Chase hat](https://kkkiiijjj.itch.io/chase-hat) | `chase-hat` | action, casual | Released |
| 140 | [Open My Mouth and Feed Me](https://klenchandrei.itch.io/open-my-mouth-and-feed-me) | `open-my-mouth-and-feed-me` | casual, arcade | In development |
| 141 | [CYBER BEAT - YouTube Rhythm Game](https://kobaken.itch.io/cyber-beat) | `cyber-beat` | music, casual | Released |
| 142 | [One More Minute](https://koppiko.itch.io/one-more-minute) | `one-more-minute` | puzzle, casual | In development |
| 143 | [BEAMWRIGHT (free demo)](https://kqmigqkqri.itch.io/beamwright-demo) | `beamwright-demo` | puzzle, strategy, casual | Demo |
| 144 | [STILLHAND (free demo)](https://kqmigqkqri.itch.io/stillhand-demo) | `stillhand-demo` | strategy, puzzle | Demo |
| 145 | [Draw a Perfect Circle](https://kurt2917.itch.io/draw-a-perfect-circle) | `draw-a-perfect-circle` | casual, educational | Released |
| 146 | [Potions de Minuit](https://laclairedu91.itch.io/potions-de-minuit) | `potions-de-minuit` | adventure, casual | In development |
| 147 | [Star Battle](https://le-gamer0001.itch.io/star-battle) | `star-battle` | action, arcade | Released |
| 148 | [closed-walls](https://lov4loli.itch.io/closed-walls) | `closed-walls` | puzzle, casual, arcade | In development |
| 149 | [Dungeon Farm — Demo](https://lozeeerxd.itch.io/dungeon-farm-demo) | `dungeon-farm-demo` | simulation, strategy, casual | Demo |
| 150 | [Cancha 26 Sports Kit](https://lukibara.itch.io/cancha-26-sports-kit) | `cancha-26-sports-kit` | sports, arcade, casual | Released |
| 151 | [Catch to sacrifatch](https://m4qko.itch.io/cts098676) | `cts098676` | puzzle, casual | Released |
| 152 | [Foggy mirror webcam toy](https://madmarcel.itch.io/foggy-mirror) | `foggy-mirror` | casual | Released |
| 153 | [The Hollow Tide](https://malorum-games.itch.io/the-hollow-tide) | `the-hollow-tide` | action, horror, rpg | In development |
| 154 | [Garden Memory Match](https://mangofunplay.itch.io/garden-memory-match) | `garden-memory-match` | card, puzzle, casual | Released |
| 155 | [Pocket Nonogram](https://mangofunplay.itch.io/pocket-nonogram) | `pocket-nonogram` | puzzle, casual | Released |
| 156 | [Worth Keeping](https://marconathan.itch.io/worth-keeping) | `worth-keeping` | casual, puzzle | Released |
| 157 | [Lantern Cave](https://mariamsalama.itch.io/lantern-cave) | `lantern-cave` | adventure, puzzle, casual | Released |
| 158 | [Spark Desk](https://martintale.itch.io/spark-desk) | `spark-desk` | puzzle, casual | Released |
| 159 | [Chud bros games](https://masterx125.itch.io/chud-bros-games) | `chud-bros-games` | platformer, casual | Released |
| 160 | [Sprunke Discovery Centre GGTP](https://max-is-1-of-the-best.itch.io/sprunke-discovery-centre-ggtp) | `sprunke-discovery-centre-ggtp` | music, casual | Released |
| 161 | [SideEntry](https://me4tw.itch.io/sideentry) | `sideentry` | shooting, racing, action | In development |
| 162 | [Knockout](https://medhyaravi.itch.io/knockout) | `knockout` | fighting, multiplayer, action | Released |
| 163 | [Swingfall](https://memory404games.itch.io/swingfall) | `swingfall` | puzzle, casual, arcade | Demo |
| 164 | [Escapando del puticlub](https://migue-angel-oller.itch.io/escapando-del-puticlub) | `escapando-del-puticlub` | action, casual | In development |
| 165 | [El pogo de la Muerte](https://mikarumii.itch.io/el-pogo-de-la-muerte) | `el-pogo-de-la-muerte` | arcade, action, casual | Released |
| 166 | [Monster Merge Chaos](https://mocchi111.itch.io/monster-merge-chaos) | `monster-merge-chaos` | puzzle, casual | In development |
| 167 | [Echo Orbit](https://monolithrealm.itch.io/echo-orbit) | `echo-orbit` | arcade, casual, action | Released |
| 168 | [Ricochet Wizard](https://monolithrealm.itch.io/ricochet-wizard) | `ricochet-wizard` | puzzle, casual, strategy | Released |
| 169 | [MoodFrog: Jelly Merge](https://moodfrog.itch.io/moodfrog-jelly-merge) | `moodfrog-jelly-merge` | puzzle, casual | Released |
| 170 | [WAKA-MAN](https://mookit.itch.io/waka-man) | `waka-man` | arcade, action, puzzle | Released |
| 171 | [Checkmist](https://mudralabs.itch.io/checkmist) | `checkmist` | strategy, board-game | In development |
| 172 | [Vestalborne - A Pixel RPG](https://mythrylstudio.itch.io/vestalborne) | `vestalborne` | survival, rpg, simulation | In development |
| 173 | [Seen't (Thai)](https://n3lenek.itch.io/seent-thai) | `seent-thai` | educational, casual | Released |
| 174 | [Next Step](https://n3vm.itch.io/next-step) | `next-step` | educational, adventure | In development |
| 175 | [MIBS](https://nac13.itch.io/mibs) | `mibs` | action, arcade, casual | Released |
| 176 | [Cats Vs Dogs](https://nahb02.itch.io/cats-vs-dogs) | `cats-vs-dogs` | fighting, casual, puzzle | Released |
| 177 | [Retro Blaster](https://naoki-gf.itch.io/retro-blaster) | `retro-blaster` | shooting, arcade, action | Released |
| 178 | [Desk Bots (Free Demo)](https://naoki83.itch.io/desk-bots-demo) | `desk-bots-demo` | idle, simulation, casual | Demo |
| 179 | [DIG THE BRAVER](https://nekonote-software.itch.io/dig-the-braver) | `dig-the-braver` | action, arcade | In development |
| 180 | [Wave Shooter](https://newworld99.itch.io/wave-shooter) | `wave-shooter` | shooting, action, survival | Released |
| 181 | [Death at Ashgrave Manor](https://ninjistudio.itch.io/ashgrave) | `ashgrave` | puzzle, adventure, casual | Released |
| 182 | [Crimson frame](https://nintendo-packsa-lee.itch.io/crimson-frame) | `crimson-frame` | action, arcade | In development |
| 183 | [Finance Life](https://notorious-mo.itch.io/finance-life) | `finance-life` | simulation, educational | Released |
| 184 | [Press Button](https://nutshellinprogress.itch.io/press-button-test1) | `press-button-test1` | casual, idle | In development |
| 185 | [Strata](https://nycgio.itch.io/strata) | `strata` | platformer, rpg | In development |
| 186 | [I see you](https://nzkieran.itch.io/i-see-you) | `i-see-you` | action, horror | In development |
| 187 | [Master of Hybridization](https://octrain12.itch.io/master-of-hybridization) | `master-of-hybridization` | simulation, educational, casual | In development |
| 188 | [Split-Second Racers](https://ofatihhilmi.itch.io/split-second-racers) | `split-second-racers` | racing, arcade, multiplayer | In development |
| 189 | [Bravery (labrute)](https://okhhen.itch.io/bravery) | `bravery` | fighting, simulation, rpg | Released |
| 190 | [Ein feste Burg ist unser Gott](https://oldboy-levi.itch.io/ein-feste-burg-ist-unser-gott) | `ein-feste-burg-ist-unser-gott` | music, casual | In development |
| 191 | [Sartori](https://oliveroliveira.itch.io/sartori) | `sartori` | puzzle, casual | Released |
| 192 | [GOOD DEEDS : 0 — DAY2まで試遊版](https://onlinestylus.itch.io/good-deeds-0-day2) | `good-deeds-0-day2` | adventure, casual | Demo |
| 193 | [Spectator Sports](https://ophidic.itch.io/spectator-sports) | `spectator-sports` | sports, simulation, casual | Released |
| 194 | [לגעת במותן  - dont thigh](https://oscarnotcharlie.itch.io/mosh) | `mosh` | action, simulation, casual | Released |
| 195 | [Sokoban](https://ostapkondur.itch.io/sokoban) | `sokoban` | puzzle, casual | Released |
| 196 | [Commander](https://overlordsock.itch.io/commander) | `commander` | strategy, action | In development |
| 197 | [Slendersweet](https://panchoverni.itch.io/slendersweet) | `slendersweet` | horror, strategy, action | Released |
| 198 | [Doug's Railway Legends](https://patron-labs.itch.io/dougs-railway-legends) | `dougs-railway-legends` | simulation, casual | Released |
| 199 | [La aventura de Juan Carlos](https://pernacle.itch.io/la-aventura-de-juan-carlos) | `la-aventura-de-juan-carlos` | adventure, casual | Released |
| 200 | [Scout Simulator](https://petern313.itch.io/scout-simulator) | `scout-simulator` | card, simulation | Released |
| 201 | [Salva els Velars](https://pgambardella.itch.io/salva-els-velars) | `salva-els-velars` | educational, adventure, puzzle | Released |
| 202 | [Despiertalos](https://philip6k.itch.io/despiertalos) | `despiertalos` | casual, adventure | Released |
| 203 | [SOMETHING IS MESSING WITH MY PUZZLE GAME](https://piggward.itch.io/something-is-messing-with-my-puzzle-game) | `something-is-messing-with-my-puzzle-game` | puzzle, casual | Released |
| 204 | [Pixel Pennant](https://pixelpennant.itch.io/pixel-pennant) | `pixel-pennant` | simulation, sports, strategy | Released |
| 205 | [Sky Hop](https://playskyhop.itch.io/sky-hop) | `sky-hop` | arcade, casual, action | Released |
| 206 | [Quantum Conquest](https://playxel2026.itch.io/quantum-conquest) | `quantum-conquest` | shooting, action, arcade | Released |
| 207 | [泯声/eclipse](https://plutowmxx.itch.io/eclipse) | `eclipse` | puzzle, adventure | In development |
| 208 | [PokoPuri Planet](https://pokepurikun.itch.io/pokopuri-planet) | `pokopuri-planet` | puzzle, casual | Released |
| 209 | [Corner Pocket](https://pokiyeti.itch.io/corner-pocket) | `corner-pocket` | sports, simulation, multiplayer | Released |
| 210 | [Pomomons](https://pomomons.itch.io/pomomons) | `pomomons` | educational, casual | Released |
| 211 | [gamenoob](https://prio123.itch.io/gamenoob) | `gamenoob` | casual, arcade | Released |
| 212 | [羽継烏有と万枚稼がないと出られない部屋](https://punimi.itch.io/manmai) | `manmai` | rpg, casual | Released |
| 213 | [猛牛吃嫩草 Lawnmower Bull](https://purplerice91.itch.io/lawnmower-bull) | `lawnmower-bull` | arcade, casual | Released |
| 214 | [Fuzzy Grand Prix](https://pyuse.itch.io/fuzzy-grand-prix) | `fuzzy-grand-prix` | racing, arcade, casual | Released |
| 215 | [Scene Calibration](https://qxq2026.itch.io/scene-calibration) | `scene-calibration` | puzzle, casual | In development |
| 216 | [Lazy Baker](https://raghuve3r.itch.io/lazy-baker) | `lazy-baker` | simulation, casual | Released |
| 217 | [Getting Over Block](https://ragtago89.itch.io/getting-over-block) | `getting-over-block` | platformer, casual | In development |
| 218 | [RuneWyrm](https://rainydayart.itch.io/runewyrm) | `runewyrm` | puzzle, casual | Released |
| 219 | [Rachadinha](https://raonifranciscosilva.itch.io/rachadinha) | `rachadinha` | puzzle, casual | Released |
| 220 | [AfterImage](https://recks-studio.itch.io/afterimage) | `afterimage` | puzzle, casual | Released |
| 221 | [Venganza de Noviembre](https://reibanjose.itch.io/venganza-de-noviembre) | `venganza-de-noviembre` | action, casual | In development |
| 222 | [Rest in Produce](https://restinproduce.itch.io/afterlife) | `afterlife` | simulation, casual | In development |
| 223 | [The Vance Files](https://richardsongames.itch.io/the-vance-files) | `the-vance-files` | adventure, puzzle | Released |
| 224 | [a caçada de joão santo](https://ro2496.itch.io/a-caada-de-joo-santo2) | `a-caada-de-joo-santo2` | action, arcade | Released |
| 225 | [Sad Damn](https://roadkiller12.itch.io/sad-damn) | `sad-damn` | strategy, action, arcade | Released |
| 226 | [Moshimo StockSim](https://robustlab.itch.io/moshimo-stocksim) | `moshimo-stocksim` | simulation, strategy, educational | Released |
| 227 | [Colors of ME](https://roddyka.itch.io/colors-of-me) | `colors-of-me` | puzzle, platformer | In development |
| 228 | [Dustcrawler](https://roman-inc.itch.io/dustcrawler) | `dustcrawler` | rpg, action, survival | In development |
| 229 | [Blocky Tanks](https://romaniskz.itch.io/blocky-tanks) | `blocky-tanks` | action, shooting, simulation | In development |
| 230 | [Static Between Walls (Demo)](https://rpbentz.itch.io/static-between-walls) | `static-between-walls` | horror, casual | Demo |
| 231 | [The Watching Tower](https://rpg-jespil-studio.itch.io/the-watching-tower) | `the-watching-tower` | action, horror, arcade | Released |
| 232 | [Bubble Royale](https://rubikones.itch.io/bubble-royale) | `bubble-royale` | puzzle, casual, arcade | Released |
| 233 | [SolitaireCard](https://russelltan721gmailcom.itch.io/solitaire) | `solitaire` | card, puzzle, casual | In development |
| 234 | [doorward](https://s00d88.itch.io/doorward) | `doorward` | adventure, casual | In development |
| 235 | [PIXEL QUEST](https://sa-rd1.itch.io/pixel-quest) | `pixel-quest` | rpg, action, adventure | Released |
| 236 | [Afterglow: Night Run](https://saggyhatpoe.itch.io/afterglow-night-run) | `afterglow-night-run` | arcade, racing, action | Released |
| 237 | [Shard Miner: AI Kitten](https://scdolab.itch.io/shard-miner) | `shard-miner` | idle, casual | Released |
| 238 | [Nine Skies / 九霄伏妖](https://scottss3.itch.io/nine-skies) | `nine-skies` | shooting, action, arcade | Released |
| 239 | [Chronicle of the Mystic Mirror](https://sea-serpent.itch.io/mystic-mirror) | `mystic-mirror` | strategy, horror, casual | In development |
| 240 | [FOLD//GRID](https://seiitaisyougunwashi.itch.io/fold-grid) | `fold-grid` | puzzle, casual | Released |
| 241 | [SIGNAL ZERO](https://seiyamob.itch.io/signal-zero) | `signal-zero` | shooting, survival, strategy | Released |
| 242 | [Sakuragaoka days](https://setthank.itch.io/sakuragaoka-days) | `sakuragaoka-days` | casual | Released |
| 243 | [Defend The Keep](https://shadycharade.itch.io/defend-the-keep) | `defend-the-keep` | survival, action, strategy | In development |
| 244 | [Cachyphus](https://shamekhing.itch.io/cachyphus) | `cachyphus` | simulation, casual | In development |
| 245 | [Tatoi 1941: An Attic Airfield](https://shotokan-111.itch.io/tatoi-1941) | `tatoi-1941` | educational, simulation, casual | Released |
| 246 | [Wigram 1942: A Station Remembered](https://shotokan-111.itch.io/wigram-1942) | `wigram-1942` | educational, simulation, casual | Released |
| 247 | [FOG](https://siggiii.itch.io/fog) | `fog` | adventure, casual | In development |
| 248 | [Dead Street](https://skoobygames.itch.io/deadstreet) | `deadstreet` | action, horror | Released |
| 249 | [Number Rush](https://sora-lab.itch.io/number-rush) | `number-rush` | puzzle, arcade, casual | Released |
| 250 | [SPRUNKI - CONJUCT SHIFTED](https://sp1x-spixy.itch.io/sprunki-conjuct-shifted) | `sprunki-conjuct-shifted` | music, casual | Released |
| 251 | [The Last Stop](https://spdio22.itch.io/the-last-stop) | `the-last-stop` | adventure, casual | Released |
| 252 | [Digital Soul - Jam Version](https://spolchen.itch.io/digital-soul-jam-version) | `digital-soul-jam-version` | rpg, action | In development |
| 253 | [Acechando tu Ventana](https://spooky-blue.itch.io/acechando-tu-ventana) | `acechando-tu-ventana` | action, horror, casual | Released |
| 254 | [REVERSED PHASE 4 AHHH](https://sprunkijevinchambaxd.itch.io/reversed-phase-4-ahhh) | `reversed-phase-4-ahhh` | music, casual | Released |
| 255 | [SP***KI REVERSED PHASE 5](https://sprunkijevinchambaxd.itch.io/spki-reversed-phase-5) | `spki-reversed-phase-5` | music, casual | Released |
| 256 | [Trick or Thief](https://spunkysarb.itch.io/trick-or-thief) | `trick-or-thief` | action, strategy, arcade | Released |
| 257 | [quadtris](https://squadtris.itch.io/quadtris) | `quadtris` | casual, music, puzzle | Released |
| 258 | [WORLD DRIVE](https://squipy411.itch.io/world-drive) | `world-drive` | simulation, racing | In development |
| 259 | [Pocketlight: The Lantern Garden](https://suryanshss1011.itch.io/pocketlight) | `pocketlight` | adventure, casual, puzzle | In development |
| 260 | [Niddle](https://sylsyd.itch.io/niddle) | `niddle` | puzzle, music, casual | Released |
| 261 | [TANDOR](https://tandorgame.itch.io/tandor) | `tandor` | sports, multiplayer, arcade | Released |
| 262 | [Be Verity. (Simulator)](https://thatone-awesomedude.itch.io/be-verity-simulator) | `be-verity-simulator` | simulation, casual | In development |
| 263 | [The Unopened Page](https://the-unopened-page.itch.io/the-unopened-page) | `the-unopened-page` | puzzle, educational, casual | Released |
| 264 | [Mini Jam 221](https://thechayoscat.itch.io/mini-jam-221) | `mini-jam-221` | strategy, simulation, casual | Released |
| 265 | [Low Poly Racing V00.01 (Early Prototype)](https://thomas-leo.itch.io/low-poly-racing) | `low-poly-racing` | racing, arcade | In development |
| 266 | [ROOF RUN](https://tienyao.itch.io/roof-run) | `roof-run` | arcade, platformer, action | Released |
| 267 | [Spike Dash](https://timtimstsh.itch.io/dash-dash) | `dash-dash` | arcade, platformer, casual | In development |
| 268 | [弾幕将棋](https://tokyolevel22.itch.io/danmaku-shogi) | `danmaku-shogi` | strategy, action, board-game | Released |
| 269 | [Cafe Dog Game](https://tururimusic.itch.io/cafe-dog-game) | `cafe-dog-game` | puzzle, casual | Released |
| 270 | [IndioFest Tycoon](https://urielchanquia-gamedev.itch.io/indiofest-tycoon) | `indiofest-tycoon` | simulation, strategy, casual | Released |
| 271 | [Race the Clock](https://usernameabad.itch.io/race-the-clock) | `race-the-clock` | arcade, casual | Released |
| 272 | [USO GALAXY INVADERS](https://usotsukida.itch.io/uso-galaxy-invaders) | `uso-galaxy-invaders` | arcade, shooting | Released |
| 273 | [seven years ago](https://uygaraa.itch.io/seven-years-ago) | `seven-years-ago` | casual | Released |
| 274 | [Wacky Horse Racing](https://vampy173.itch.io/wacky-horse-racing) | `wacky-horse-racing` | racing, sports, casual | In development |
| 275 | [Coração Aventureiro](https://victorborges1997.itch.io/coracao-aventureiro) | `coracao-aventureiro` | rpg, adventure | Released |
| 276 | [Mistlight — A Quiet Puzzle at Sea](https://vincentchanxx.itch.io/mistlight) | `mistlight` | puzzle, casual | Released |
| 277 | [Power Pong](https://warchamel-studio.itch.io/power-pong) | `power-pong` | arcade, multiplayer, sports | Released |
| 278 | [Hard mode last breath sans](https://wold-19.itch.io/hard-mode-last-breath-sans) | `hard-mode-last-breath-sans` | action, casual | Released |
| 279 | [Cookie Needs To Sleep](https://wotadev.itch.io/cookie-needs-to-sleep) | `cookie-needs-to-sleep` | platformer, casual | Released |
| 280 | [Six Bastions](https://xenieu.itch.io/six-bastions) | `six-bastions` | strategy, action | Released |
| 281 | [ZOMBIE SURVIVAL HERO（ヒーローゾンビサバイバル）](https://yasuou.itch.io/zombie-survival-hero) | `zombie-survival-hero` | shooting, action, survival | Released |
| 282 | [Steel Continent](https://ycyx.itch.io/steel-continent) | `steel-continent` | action, shooting, strategy | Released |
| 283 | [Checkout](https://yellowgou.itch.io/checkout) | `checkout` | simulation, casual | In development |
| 284 | [Yibai Jet test play 01](https://yibaistudio.itch.io/yibai-jet-test-play-01) | `yibai-jet-test-play-01` | action, simulation | In development |
| 285 | [MIR](https://yminstudio.itch.io/mir) | `mir` | simulation, puzzle, casual | Released |
| 286 | [Cap man with a hat man prototype](https://yo-dude75.itch.io/cap-man-with-a-hat-man-prototype) | `cap-man-with-a-hat-man-prototype` | platformer, action | Released |
| 287 | [Feed](https://yolona.itch.io/feed) | `feed` | casual, simulation | Released |
| 288 | [Inbox Duel](https://yukisora313.itch.io/inbox-duel) | `inbox-duel` | card, strategy, casual | Released |
| 289 | [negi](https://yurinosuke.itch.io/negi) | `negi` | casual | Released |
| 290 | [Dosukoi Hamster](https://yutori.itch.io/dosukoi-hamster) | `dosukoi-hamster` | platformer, puzzle, casual | Released |
| 291 | [BRUME](https://zayanabdel.itch.io/brume) | `brume` | platformer, casual | In development |
| 292 | [Oil Man](https://zeno543.itch.io/oil-man) | `oil-man` | simulation, strategy | In development |
| 293 | [Survive Bear5](https://zenopiggyboi.itch.io/survive-bear5) | `survive-bear5` | action, horror | Released |
| 294 | [Al Billar Mi Amor](https://zetasole.itch.io/al-billar-mi-amor) | `al-billar-mi-amor` | sports, simulation | Released |
| 295 | [Outrageous Grace - CMGJ](https://zhiqiz17uciedu.itch.io/outrageous-grace-cmgj) | `outrageous-grace-cmgj` | casual | Released |
| 296 | [Knight of the bell](https://ztf666.itch.io/knight-of-the-bell) | `knight-of-the-bell` | platformer, action | Released |
