/**
 * CLEC video index — episode → X (Twitter) video link.
 *
 * Source: CLEC's own compiled list of X video posts. Episode numbers are
 * ascending over time (higher = newer). `id` is the X status id; the URL is
 * built as https://x.com/clec168/status/<id>. Tracking query params (?s=…) are
 * dropped. Keep this list append-only as new episodes are published.
 *
 * `group: 'podcast'` entries (CLEC James 漫談) are audio-only, so they carry an
 * explicit `url` (Apple Podcasts episode link) instead of an X status `id`.
 * Source: Apple's public lookup API for show id6798136771.
 */
export const CHANNELS = [
  { name: 'CLEC 投資理財頻道 (@CLEC168) · X', url: 'https://x.com/CLEC168' },
  {
    name: 'CLEC FB 重要連結',
    url: 'https://www.facebook.com/share/p/1Bm159PWiB/?mibextid=wwXIfr',
  },
];

/** Build the X video URL from a status id. */
export const videoUrl = (id) => `https://x.com/clec168/status/${id}`;

/** Link for any entry: explicit `url` (podcasts) or the X status. */
export const entryUrl = (v) => v.url ?? videoUrl(v.id);

/** Where to follow the CLEC James 漫談 podcast as a whole. */
export const PODCAST_LINKS = [
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771' },
  { name: 'Spotify', url: 'https://open.spotify.com/show/0341y5vfK57DF4zMsbAmDL' },
  { name: 'YouTube', url: 'https://cfnavi.org/james_podcast/' },
];

// group: 'lecture' | 'topic' | 'long' | 'podcast'
export const VIDEOS = [
  // 投資第一堂課《價值十億元的投資講座》
  { ep: '00696', group: 'lecture', date: '2026-05-07', id: '2071585566735700473', title: '2026年投資第一堂課《價值十億元的投資講座》第三章' },
  { ep: '00695', group: 'lecture', date: '2026-05-06', id: '2071585253316313318', title: '2026年投資第一堂課《價值十億元的投資講座》第二章' },
  { ep: '00694', group: 'lecture', date: '2026-05-05', id: '2071329516484796535', title: '2026年投資第一堂課《價值十億元的投資講座》第一章' },

  // CLEC 專題
  { ep: '專題', group: 'topic', date: '2025-12-30', id: '2071748489223258225', title: 'CLEC 專題 · 資產配置回測軟體使用教學' },

  // 長篇
  { ep: '00585', group: 'long', date: '2026-11-21', id: '2124183354451050786', title: '有錢就買，何必等跌？把錢花在值得的體驗上！' },
  { ep: '00584', group: 'long', date: '2026-11-14', id: '2121651520567706084', title: '借錢前先想好怎麼還！退休後如何靠資產配置與年度再平衡，維持 15 年現金流？' },
  { ep: '00583', group: 'long', date: '2026-09-19', id: '2101348388981879161', title: '錢夠了，為什麼還不敢退休？想清楚自由之後的人生' },
  { ep: '00582', group: 'long', date: '2026-09-12', id: '2098807238882451569', title: '先借先贏？善用低利資金，啟動年輕人的致富引擎' },
  { ep: '00581', group: 'long', date: '2026-09-05', id: '2096282296735432985', title: '別迷信 AI、別忽略伴侶：學會放過自己，找回快樂與自由' },
  { ep: '00580', group: 'long', date: '2026-08-29', id: '2093738263223963873', title: '輝達財報亮眼，QQQ 別輕易下車！退休配置與投資心態全解析' },
  { ep: '00579', group: 'long', date: '2026-08-22', id: '2091219015364653316', title: '孩子變大人，父母變小孩！談退休提領、慢呼吸與台幣升值' },
  { ep: '00578', group: 'long', date: '2026-08-15', id: '2088664777971401099', title: '教育上，父母的身教決定孩子的未來；投資上，我們為何不學巴菲特？' },
  { ep: '00577', group: 'long', date: '2026-08-08', id: '2086132888664441207', title: '六、七十歲投資也不遲！從 17 倍年開銷、退休前信貸到 QQQI 資產配置' },
  { ep: '00576', group: 'long', date: '2026-08-01', id: '2083607723590246879', title: '等待不是策略，買進並長期持有，才是真正的投資之道！' },
  { ep: '00575', group: 'long', date: '2026-07-25', id: '2081055007319974205', title: '真正教會你的，不是結果，而是過程！' },
  { ep: '00574', group: 'long', date: '2026-07-18', id: '2078537545311486158', title: '消費才是經濟之母，有錢人消費是道德' },
  { ep: '00573', group: 'long', date: '2026-07-11', id: '2076003351125545147', title: '真正讓我富有的，只有一件事：買進持有，打死不賣！' },
  { ep: '00572', group: 'long', date: '2026-07-04', id: '2073438502071746736', title: '投資人的財富獨立宣言' },
  { ep: '00571', group: 'long', date: '2026-06-27', id: '2070946389975347267', title: '財務自由真相：提早退休不是靠省小錢！AI 大行情下，你需要的「韓信點兵」啟動資金策略' },
  { ep: '00570', group: 'long', date: '2026-06-20', id: '2071742085255119083', title: '投資能讓你變富有，但真正決定你快不快樂的其實是關係！' },
  { ep: '00569', group: 'long', date: '2026-06-13', id: '2071737400137769424', title: '有 15 倍年開銷資產後，別再為錢賣命！西藏高僧的一把掃帚，醒了無數人的人生' },
  { ep: '00568', group: 'long', date: '2026-06-06', id: '2071733458905522253', title: '能改變自己的人是神，想改變他人的是神經病：當資產自由後，別再用生命換垃圾！' },
  { ep: '00567', group: 'long', date: '2026-05-30', id: '2071731061374275709', title: '富有是天賦：QQQ 終將一千、一萬、甚至一百萬！' },
  { ep: '00566', group: 'long', date: '2026-05-23', id: '2071727429803204901', title: 'PAL 真正厲害的地方：欠錢不能還就不要還！讓資產一代傳一代' },
  { ep: '00565', group: 'long', date: '2026-05-16', id: '2071724097772683391', title: '等待是最笨的投資策略！你不是神，立即市價買進' },
  { ep: '00564', group: 'long', date: '2026-05-09', id: '2071721333407588811', title: '人生最大的風險不是波動，而是一輩子都沒有資產' },
  { ep: '00563', group: 'long', date: '2026-05-02', id: '2071718643021570105', title: '投資沒有標準答案：從變革到覺醒，找到屬於你的人生之道' },
  { ep: '00562', group: 'long', date: '2026-04-25', id: '2071715152643416282', title: '有錢就買打死不賣：為什麼大多數人一賣就回不來？' },
  { ep: '00561', group: 'long', date: '2026-04-18', id: '2071710616411340809', title: '市場不難，就是不能有人性！投資週期的殘酷真相' },
  { ep: '00560', group: 'long', date: '2026-04-11', id: '2071708101393420389', title: '你不是輸在市場，是輸在情緒！散戶投資的真相' },
  { ep: '00559', group: 'long', date: '2026-04-04', id: '2071739519888691709', title: '美元霸權的本質；退休金不足，如何取得安穩現金流退休！' },
  { ep: '00558', group: 'long', date: '2026-03-28', id: '2071674250289934744', title: '投資不是操作，是風險控管：週期思維全面升級' },
  { ep: '00557', group: 'long', date: '2026-03-21', id: '2071672353701142640', title: '市場會跌 80% 你還撐得住嗎？關鍵在資產配置' },
  { ep: '00556', group: 'long', date: '2026-03-14', id: '2071672093721448551', title: '為什麼股票借款不要還？資產越大，你每年可用的錢越多！' },
  { ep: '00555', group: 'long', date: '2026-03-07', id: '2071668482220171722', title: '從勞工到資本家：登上資本主義的諾亞方舟' },
  { ep: '00554', group: 'long', date: '2026-02-28', id: '2071665834637103581', title: '生在資本主義：迷宮裡的人，與拿到導航的人' },
  { ep: '00553', group: 'long', date: '2026-02-14', id: '2073436476311019772', title: '如何運用 QQQI + 433 資產配置打造 15 倍年開銷退休現金？' },
  { ep: '00552', group: 'long', date: '2026-02-07', id: '2071660767997476952', title: '你不知道的致命風險，沒有它什麼都是假的；稅務、繼承與錯誤配置' },
  { ep: '00551', group: 'long', date: '2026-01-31', id: '2071658155743092974', title: 'Pre-Tax IRA 的三大致命問題：RMD、高稅率、雙重課稅！' },
  { ep: '00550', group: 'long', date: '2026-01-24', id: '2071640101390803062', title: '不是每個人都適合用借來的錢致富；心理素質比報酬率重要！' },
  { ep: '00549', group: 'long', date: '2026-01-17', id: '2071640101390803062', title: '投資不是選標，是選制度：非美國稅務居民別碰美國帳戶、別迷信抄底、年輕人別碰高股息' },
  { ep: '00548', group: 'long', date: '2026-01-10', id: '2071637757165027729', title: '為什麼 QQQI 的股息能穩定又安心？關鍵不在配息，而在資產配置與人性管理' },
  { ep: '00547', group: 'long', date: '2026-01-03', id: '2071634649303191703', title: '真正的風險不是下跌；能通過模擬考驗才是能夠活著的資產配置' },
  { ep: '00546', group: 'long', date: '2025-12-27', id: '2071632482093736042', title: '你早就可以退休了，只是你不敢' },
  { ep: '00545', group: 'long', date: '2025-12-20', id: '2071629515953213831', title: '讓家庭從悲劇變成喜劇：清醒投資與陪伴的力量' },
  { ep: '00544', group: 'long', date: '2025-12-13', id: '2071627580789383405', title: '市場會跌 10 年，你準備好了嗎？現金、負債與 QQQ 生存法則' },
  { ep: '00543', group: 'long', date: '2025-12-06', id: '2071624965129183322', title: '市場恐懼時該怎麼辦？市場恐懼與房產牢籠中的致富心法' },
  { ep: '00542', group: 'long', date: '2025-11-29', id: '2071622680810549286', title: '退休提領率 25% 關鍵；QQQ 不是科技，是最強公司！投資重點不是產業，而是長期致富的正確邏輯' },
  { ep: '00541', group: 'long', date: '2025-11-22', id: '2071619609858613342', title: '兩倍槓桿不會歸零，但會跌到你懷疑人生：沒有再平衡，誰都救不了你' },
  { ep: '00540', group: 'long', date: '2025-11-16', id: '2071616253106721240', title: '新興國家百姓如何用納指 100 跳出剝削循環！做美國主人才能翻轉命運' },
  { ep: '00539', group: 'long', date: '2025-11-08', id: '2071612433547051029', title: '市場創新高，還在猶豫？投資只靠紀律，致富不靠運氣！' },
  { ep: '00538', group: 'long', date: '2025-11-01', id: '2071609854423453961', title: '彈性再平衡：現金 15 年不減損，贏多輸少的安全升級版' },
  { ep: '00537', group: 'long', date: '2025-10-25', id: '2071607547111580034', title: '理財型房貸 + 反脆弱退休：現金 15 年安全墊，聰明借錢成富豪' },
  { ep: '00536', group: 'long', date: '2025-10-18', id: '2071604752597848511', title: '會用 AI 的人更忙；會投資 QQQ 的人更閒：學會投資，才是真正的人工智慧' },
  { ep: '00535', group: 'long', date: '2025-10-11', id: '2071599612239233322', title: '理財第一步先理金流；不懂現金流，你就像瞎子摸象在投資' },
  { ep: '00534', group: 'long', date: '2025-10-04', id: '2071597237659206121', title: '活著比回報率重要：先訂現金比例，再選 Beta，投資就很穩了' },
  { ep: '00533', group: 'long', date: '2025-09-27', id: '2071592971473150000', title: '活著比回報率重要：先訂現金比例，再選 Beta，投資就很穩了' },
  { ep: '00532', group: 'long', date: '2025-09-20', id: '2071589687853220351', title: '退休現金流的選擇：以防養老；只有投資基因進化成高等 DNA 才能在惡劣市場環境存活' },

  // CLEC James 漫談 (podcast, audio-only; EP28 was uploaded twice — the later upload is listed)
  { ep: 'EP44', group: 'podcast', date: '2026-11-23', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000803625621', title: '黃仁勳回歸輝達啟示：留在市場、打死不賣，才是投資最高準則！' },
  { ep: 'EP43', group: 'podcast', date: '2026-11-20', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000803167611', title: '意外總比明天早到：用平常心扛住裁員與股市大跌！' },
  { ep: 'EP42', group: 'podcast', date: '2026-11-19', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000802994692', title: '破解美國衰敗焦慮、投資「不聽不看」、外派赴美稅務攻略、劃清父母債務界線與 Roth 轉換策略！' },
  { ep: 'EP41', group: 'podcast', date: '2026-11-18', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000802747047', title: '不做文憑的奴隸：用投資贖回自由，給孩子真正快樂的未來！' },
  { ep: 'EP40', group: 'podcast', date: '2026-11-17', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000802520305', title: '投資、修行、活在當下與人生智慧的六大主題！' },
  { ep: 'EP39', group: 'podcast', date: '2026-11-16', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000802323692', title: '人生分數自己打——擺脫外界雜音，掌握核心投資與內心平靜！' },
  { ep: 'EP38', group: 'podcast', date: '2026-11-13', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000801760370', title: '富有不是靠吃苦：做餐桌上的食客，別當火爐裡的食材！' },
  { ep: 'EP37', group: 'podcast', date: '2026-11-12', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000801563566', title: '無人不可取代的職場現實、資本主義生存法則與長期投資之道！' },
  { ep: 'EP36', group: 'podcast', date: '2026-11-11', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000801274401', title: '為什麼科技與股市能屢創新高？破除「借錢給家人」與「討厭工作」的傳統迷思' },
  { ep: 'EP35', group: 'podcast', date: '2026-11-10', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000801029437', title: '理財聖經 30 週年、借貸還款心法與 AI 助理的本質差異' },
  { ep: 'EP34', group: 'podcast', date: '2026-11-09', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000800803820', title: '理財觀念與現金流的重要性' },
  { ep: 'EP33', group: 'podcast', date: '2026-11-08', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000800600295', title: '北歐極光之旅、高齡長者出國通關經驗與面對市場波動的投資心法' },
  { ep: 'EP32', group: 'podcast', date: '2026-10-23', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000797797788', title: '我每天和 AI 一起回六七十封信——Muse 和 ChatGPT 差在哪' },
  { ep: 'EP31', group: 'podcast', date: '2026-10-21', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000797449971', title: '美股ETF溢價、借貸與房產策略、以及穩定幣未來趨勢' },
  { ep: 'EP30', group: 'podcast', date: '2026-10-10', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000794608880', title: '挪威旅遊心得、投資理財心法與 AI 發展未來展望' },
  { ep: 'EP29', group: 'podcast', date: '2026-09-18', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000790412655', title: '投資大道至簡，親子大道至愛：財富與家庭的兩堂人生課' },
  { ep: 'EP28', group: 'podcast', date: '2026-09-17', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000790284925', title: '一燈能除千年暗，一念可渡萬重山：從投資智慧走向幸福人生' },
  { ep: 'EP27', group: 'podcast', date: '2026-09-16', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000789855831', title: '買進美國企業，讓美國企業養我們！喚醒資本主義自覺，掌握自己的未來' },
  { ep: 'EP26', group: 'podcast', date: '2026-09-15', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000789636149', title: '自由、無懼、成長：方向對了，人生就有無限可能' },
  { ep: 'EP25', group: 'podcast', date: '2026-09-14', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000789386269', title: '講實話為何成了政治不正確？關係與內心平靜的人生智慧' },
  { ep: 'EP24', group: 'podcast', date: '2026-09-11', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000788946803', title: '青春期不是叛逆，而是走向獨立：父母學會放手，也勇敢面對自己' },
  { ep: 'EP23', group: 'podcast', date: '2026-09-10', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000788757741', title: '從1,200萬到4,000萬：長期投資不只改變資產，更改變整個家庭' },
  { ep: 'EP22', group: 'podcast', date: '2026-09-09', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000788542786', title: '破解投資界的獨門密技！超越致富夢想！' },
  { ep: 'EP21', group: 'podcast', date: '2026-09-08', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000788367579', title: '告別花錢的羞恥感：我們值得從容享受富足人生' },
  { ep: 'EP20', group: 'podcast', date: '2026-09-07', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000788199561', title: '別把財富直接送給孩子：適度匱乏，才能培養他創造財富的能力' },
  { ep: 'EP19', group: 'podcast', date: '2026-09-04', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000787725060', title: '當所有設備與家電都連上大語言模型，人工智慧的成長無可限量' },
  { ep: 'EP18', group: 'podcast', date: '2026-09-03', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000787522184', title: '全球算力壟斷危機與避開個人理財的三大陷阱' },
  { ep: 'EP17', group: 'podcast', date: '2026-09-02', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000787259216', title: '美債利率趨勢分析、NVIDIA 財報展望與 AI 產業融資疑慮解析' },
  { ep: 'EP16', group: 'podcast', date: '2026-09-01', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000787070899', title: '從個股迷惘到長期持有QQQ：普通人也能改變財務人生' },
  { ep: 'EP15', group: 'podcast', date: '2026-08-31', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000786896318', title: '讓知識是平的｜喚醒資本主義自覺｜也無風雨也無晴' },
  { ep: 'EP14', group: 'podcast', date: '2026-08-21', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000784692149', title: '從虧損百萬到刪除app：什麼都不做，反而賺回二十多年的投資學費' },
  { ep: 'EP13', group: 'podcast', date: '2026-08-20', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000784446340', title: '婚姻不是尋找完美的人，而是勇敢走進一場人生冒險｜從心動、真愛到長久相處' },
  { ep: 'EP12', group: 'podcast', date: '2026-08-19', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000784196955', title: '絕不借錢給賭徒！從期貨陷阱到翻轉命運的幸運投資人生' },
  { ep: 'EP11', group: 'podcast', date: '2026-08-18', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000783962476', title: '從不敢花錢到提早退休——AI時代的太空艙即將關門，沒有投資的人恐怕再也追不上' },
  { ep: 'EP10', group: 'podcast', date: '2026-08-17', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000783711477', title: '從槍林彈雨到搭電梯：40年投資歷程與「打死不賣」的生存之道' },
  { ep: 'EP09', group: 'podcast', date: '2026-08-14', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000783224461', title: '別把自己的遺憾轉嫁給孩子！談養老、親情與真正的外部經濟' },
  { ep: 'EP08', group: 'podcast', date: '2026-08-13', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000783045437', title: '共情的能力：從「傾聽」開始，接住對方的靈魂' },
  { ep: 'EP07', group: 'podcast', date: '2026-08-12', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000782838509', title: '從「我願意」到「Aha Moment」——維護家庭與愛的能力' },
  { ep: 'EP06', group: 'podcast', date: '2026-08-11', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000782081633', title: '告別理專迷思與一窩蜂文化：談真正的退休理財與獨立思考' },
  { ep: 'EP05', group: 'podcast', date: '2026-08-09', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000781325062', title: '成了新時代的審查上帝？為什麼借錢投資反而是在幫國家大忙！' },
  { ep: 'EP04', group: 'podcast', date: '2026-08-08', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000780974743', title: '人生只有兩件事：關你屁事、關我屁事！別為二十年後的焦慮買單' },
  { ep: 'EP03', group: 'podcast', date: '2026-08-06', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000780348306', title: '金錢的終極價值與資產配置的自由人生' },
  { ep: 'EP02', group: 'podcast', date: '2026-08-05', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000780162733', title: '放下的智慧：人生、關係與投資，都無法教會一個人' },
  { ep: 'EP01', group: 'podcast', date: '2026-08-04', url: 'https://podcasts.apple.com/tw/podcast/clec-james-%E6%BC%AB%E8%AB%87/id6798136771?i=1000779999091', title: '今日行情、日本困境、亞洲與美國養老大不同' },
];
