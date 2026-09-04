(function () {
  const supportedLanguages = ["en", "ar", "zh"];
  const languageKey = "hourAiLanguage";
  const languageManualKey = "hourAiLanguageManual";
  const supportUrl = "index.html?support=1#support";
  const productCatalogUrl = "data/member-products.json?v=20260901";

  const productImageFallback = "assets/carousel-learn.webp";
  const categoryImagePools = {
    mobile: [
      "https://images.unsplash.com/photo-1609592806596-b43ed73a8f19?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=1100&q=82"
    ],
    fashion: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=82"
    ],
    jewelry: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1100&q=82"
    ],
    home: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1100&q=82"
    ],
    furniture: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1100&q=82"
    ],
    auto: [
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1100&q=82"
    ],
    baby: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1100&q=82"
    ],
    health: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1100&q=82"
    ],
    sports: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1100&q=82"
    ],
    creator: [
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=82"
    ],
    travel: [
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=82"
    ],
    gaming: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1100&q=82",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1100&q=82"
    ]
  };

  function imageSetFor(category, index) {
    const pool = categoryImagePools[category] || categoryImagePools.mobile;
    return [pool[index % pool.length], pool[(index + 1) % pool.length], pool[(index + 2) % pool.length]];
  }

  const i18n = {
    en: {
      nav: { live: "Live Platform", orders: "Orders", path: "Learning", courses: "Courses", store: "Member Store", support: "Support" },
      store: {
        advisor: "Advisor",
        backHome: "Home",
        eyebrow: "Member sourcing",
        title: "Member Store",
        lede: "Qualified members can source selected products at member-only prices, resell them locally, and keep the price difference as profit.",
        benefit1: "Member supply prices",
        benefit1Text: "C-, B-, and A-Level members receive tiered supply prices.",
        benefit2: "No inventory pressure",
        benefit2Text: "Confirm the local sale first, then source the product through Hour AI.",
        benefit3: "Local resale profit",
        benefit3Text: "Set your own retail price according to your market.",
        catalogEyebrow: "Choose a category",
        catalogTitle: "Browse member-only resale categories",
        catalogText: "Select a category to view products, compare member supply prices, and open product details with images and sourcing information.",
        emptyTitle: "Choose a category",
        emptyText: "Select any category above to view member-only products.",
        all: "All",
        custom: "Custom Sourcing",
        customText: "Request a product",
        cSupply: "C supply",
        bSupply: "B supply",
        aSupply: "A supply",
        retail: "Retail guide",
        details: "Reserve for Free",
        noonEnglish: "English Details",
        noonArabic: "التفاصيل العربية",
        noonUnavailable: "Noon detail link pending",
        request: "Request sourcing",
        supplyTitle: "Member supply prices",
        gallery: "Product gallery",
        specs: "Highlights",
        profitTitle: "Resale workflow",
        profitText: "Sell locally first, then source through Hour AI at your approved member price.",
        flow1: "Confirm product and local resale price.",
        flow2: "Collect payment from your customer.",
        flow3: "Purchase through Hour AI at member price.",
        flow4: "Keep the markup as your profit.",
        close: "Close"
      },
      categories: {
        all: "All Categories",
        mobile: "Mobile Accessories",
        fashion: "Fashion & Modest Wear",
        jewelry: "Jewelry & Watches",
        home: "Home & Kitchen",
        furniture: "Furniture & Decor",
        auto: "Auto Accessories",
        baby: "Mother & Baby",
        health: "Health & Wellness",
        sports: "Sports & Outdoor",
        creator: "Creator & Live Commerce",
        travel: "Travel & Bags",
        gaming: "Gaming & Entertainment",
        custom: "Custom Sourcing"
      },
      icons: {
        all: "ALL",
        mobile: "M",
        fashion: "F",
        jewelry: "J",
        home: "H",
        furniture: "D",
        auto: "A",
        baby: "B",
        health: "W",
        sports: "S",
        creator: "LIVE",
        travel: "T",
        gaming: "G",
        custom: "+"
      }
    },
    zh: {
      nav: { live: "在线平台", orders: "订单", path: "学习", courses: "课程", store: "会员商城", support: "客服" },
      store: {
        advisor: "客服",
        backHome: "首页",
        eyebrow: "会员专属供货系统",
        title: "会员商城",
        lede: "通过认证的会员可以用会员专属供货价采购精选商品，在本地市场转售，并将差价作为利润。",
        benefit1: "会员供货价",
        benefit1Text: "C、B、A 会员享有不同等级的供货价格。",
        benefit2: "无需囤货压力",
        benefit2Text: "先在本地确认客户订单，再通过 Hour AI 采购。",
        benefit3: "本地转售利润",
        benefit3Text: "你可以根据所在市场自行决定销售价格。",
        catalogEyebrow: "选择商品分类",
        catalogTitle: "浏览会员专供转售分类",
        catalogText: "选择分类即可查看商品、对比会员供货价，并打开详情页查看图片和供货信息。",
        emptyTitle: "选择分类",
        emptyText: "点击上方任意分类，查看会员专供商品。",
        all: "全部",
        custom: "商品定制",
        customText: "提交找货需求",
        cSupply: "C级供货价",
        bSupply: "B级供货价",
        aSupply: "A级供货价",
        retail: "建议零售价",
        details: "查看详情",
        noonEnglish: "英文介绍",
        noonArabic: "阿拉伯语介绍",
        noonUnavailable: "Noon 详情链接待补充",
        request: "申请找货",
        supplyTitle: "会员供货价格",
        gallery: "商品图片",
        specs: "商品卖点",
        profitTitle: "转售流程",
        profitText: "先在本地成交客户，再按认证会员供货价从 Hour AI 采购。",
        flow1: "确认商品和本地销售价格。",
        flow2: "向你的客户收款。",
        flow3: "按会员价从 Hour AI 采购。",
        flow4: "加价部分就是你的利润。",
        close: "关闭"
      },
      categories: {
        all: "全部分类",
        mobile: "手机配件",
        fashion: "服装与端庄服饰",
        jewelry: "珠宝与手表",
        home: "家居与厨房",
        furniture: "家具与装饰",
        auto: "汽车配件",
        baby: "母婴用品",
        health: "健康护理",
        sports: "运动户外",
        creator: "直播电商工具",
        travel: "旅行箱包",
        gaming: "游戏与娱乐",
        custom: "商品定制"
      },
      icons: {
        all: "全",
        mobile: "机",
        fashion: "衣",
        jewelry: "钻",
        home: "家",
        furniture: "居",
        auto: "车",
        baby: "婴",
        health: "康",
        sports: "动",
        creator: "播",
        travel: "旅",
        gaming: "游",
        custom: "+"
      }
    },
    ar: {
      nav: { live: "منصة مباشرة", orders: "الطلبات", path: "التعلم", courses: "الدورات", store: "متجر الأعضاء", support: "الدعم" },
      store: {
        advisor: "الدعم",
        backHome: "الرئيسية",
        eyebrow: "توريد الأعضاء",
        title: "متجر الأعضاء",
        lede: "يمكن للأعضاء المؤهلين شراء منتجات مختارة بأسعار خاصة للأعضاء، وإعادة بيعها محليا، والاحتفاظ بفارق السعر كربح.",
        benefit1: "أسعار توريد للأعضاء",
        benefit1Text: "يحصل أعضاء مستويات C و B و A على أسعار توريد بحسب مستوى العضوية.",
        benefit2: "بدون ضغط مخزون",
        benefit2Text: "أكد البيع محليا أولا، ثم اطلب المنتج عبر Hour AI.",
        benefit3: "ربح إعادة البيع المحلي",
        benefit3Text: "أنت تحدد سعر البيع المناسب في سوقك.",
        catalogEyebrow: "اختر فئة",
        catalogTitle: "تصفح فئات إعادة البيع الخاصة بالأعضاء",
        catalogText: "اختر فئة لعرض المنتجات، وقارن أسعار توريد الأعضاء، وافتح تفاصيل المنتج لمشاهدة الصور ومعلومات التوريد.",
        emptyTitle: "اختر فئة",
        emptyText: "اختر أي فئة أعلاه لعرض منتجات الأعضاء.",
        all: "الكل",
        custom: "توريد مخصص",
        customText: "اطلب منتجا",
        cSupply: "توريد C",
        bSupply: "توريد B",
        aSupply: "توريد A",
        retail: "سعر البيع",
        details: "عرض التفاصيل",
        noonEnglish: "تفاصيل باللغة الإنجليزية",
        noonArabic: "تفاصيل باللغة العربية",
        noonUnavailable: "رابط تفاصيل نون قيد الإضافة",
        request: "طلب توريد",
        supplyTitle: "أسعار توريد الأعضاء",
        gallery: "صور المنتج",
        specs: "المزايا",
        profitTitle: "مسار إعادة البيع",
        profitText: "بع محليا أولا، ثم اطلب عبر Hour AI بسعر عضويتك المعتمد.",
        flow1: "أكد المنتج وسعر البيع المحلي.",
        flow2: "استلم الدفع من عميلك.",
        flow3: "اشتر من Hour AI بسعر العضوية.",
        flow4: "احتفظ بفارق السعر كربح.",
        close: "إغلاق"
      },
      categories: {
        all: "كل الفئات",
        mobile: "إكسسوارات الجوال",
        fashion: "أزياء وملابس محتشمة",
        jewelry: "مجوهرات وساعات",
        home: "المنزل والمطبخ",
        furniture: "أثاث وديكور",
        auto: "إكسسوارات السيارات",
        baby: "الأم والطفل",
        health: "الصحة والعافية",
        sports: "رياضة وخارج المنزل",
        creator: "أدوات التجارة المباشرة",
        travel: "السفر والحقائب",
        gaming: "الألعاب والترفيه",
        custom: "توريد مخصص"
      },
      icons: {
        all: "ALL",
        mobile: "M",
        fashion: "F",
        jewelry: "J",
        home: "H",
        furniture: "D",
        auto: "A",
        baby: "B",
        health: "W",
        sports: "S",
        creator: "LIVE",
        travel: "T",
        gaming: "G",
        custom: "+"
      }
    }
  };

  const categoryOrder = ["all", "mobile", "fashion", "jewelry", "home", "furniture", "auto", "baby", "health", "sports", "creator", "travel", "gaming", "custom"];

  const categoryTemplates = {
    mobile: [
      ["MagSafe Power Bank Set", "Fast-charging phone power bundle for daily mobile users.", "$48-$79", 31],
      ["65W GaN Fast Charger Kit", "Compact wall charger kit for phones, tablets, and travel.", "$35-$69", 23],
      ["Wireless Earbuds Retail Pack", "High-demand audio accessory for commuting, work, and social media.", "$39-$89", 26],
      ["Privacy Screen Protector Bundle", "Fast-moving phone protection bundle for online resale.", "$19-$45", 12],
      ["Magnetic Car Phone Mount", "Dashboard phone holder for navigation and daily driving.", "$18-$39", 11],
      ["USB-C Hub Adapter", "Useful mobile and laptop adapter for creators, students, and offices.", "$29-$59", 18],
      ["Smart Watch Strap Set", "Low-cost wearable accessory with strong repeat-purchase demand.", "$15-$35", 9],
      ["Rugged Phone Case Bundle", "Protective phone case set for retail bundles and upsells.", "$22-$49", 14],
      ["3-in-1 Wireless Charging Stand", "Desk charging stand for phone, earbuds, and watch users.", "$45-$85", 29],
      ["Bluetooth Tracking Tag Pack", "Travel and daily-use locator tags for bags, keys, and wallets.", "$29-$59", 18]
    ],
    fashion: [
      ["Premium Modest Wear Set", "Lightweight coordinated outfit for Gulf daily wear and gifting.", "$69-$129", 44],
      ["Breathable Abaya Collection", "Warm-climate abaya line designed for daily wear and social commerce.", "$79-$139", 49],
      ["Men's Business Thobe Pack", "Clean formal thobe set for office, travel, and gifting.", "$65-$119", 41],
      ["Luxury Hijab Bundle", "Soft-fabric hijab set for modest fashion resale.", "$25-$59", 16],
      ["Kaftan Lounge Set", "Comfort-focused modest lounge set for home and Ramadan-season demand.", "$49-$99", 32],
      ["Modest Activewear Set", "Covered activewear outfit for fitness, travel, and casual use.", "$55-$109", 35],
      ["Family Eid Outfit Pack", "Coordinated family clothing bundle for seasonal gift campaigns.", "$89-$179", 59],
      ["Men's Sandal Retail Set", "Arabic sandal selection for daily wear and travel retail.", "$39-$89", 25],
      ["Women's Tote & Scarf Set", "Fashion accessory bundle suitable for gift and boutique resale.", "$45-$95", 29],
      ["Premium Prayer Wear Set", "Comfortable prayer wear bundle for women and gifting occasions.", "$35-$79", 23]
    ],
    jewelry: [
      ["Smart Luxury Watch", "Lifestyle watch product for gift, fashion, and social commerce sales.", "$79-$149", 51],
      ["Minimal Gold Jewelry Set", "Gift-ready accessory set for premium visual marketing.", "$49-$99", 32],
      ["Luxury Watch Display Box", "Retail display product for watches, jewelry, and gift packaging.", "$59-$109", 38],
      ["Men's Steel Bracelet Set", "Daily accessory bundle for men's fashion and gift retail.", "$29-$69", 19],
      ["Pearl Necklace Gift Box", "Elegant gift item for social commerce and boutique resale.", "$45-$95", 29],
      ["Arabic Initial Pendant Set", "Personalized-style pendant set with strong gifting appeal.", "$35-$79", 23],
      ["Women's Fashion Watch Pack", "Affordable watch bundle for gift and fashion resale.", "$39-$89", 25],
      ["Travel Jewelry Organizer", "Compact organizer for watches, rings, and earrings.", "$25-$55", 16],
      ["Luxury Cufflink Set", "Men's formal accessory for business and event gifting.", "$35-$75", 23],
      ["Crystal Bracelet Gift Set", "Visual accessory set for livestream and boutique campaigns.", "$29-$65", 19]
    ],
    home: [
      ["Compact Air Fryer", "High-demand kitchen appliance for family cooking and apartment living.", "$89-$169", 59],
      ["Arabic Coffee Gift Kit", "Hospitality gift set for homes, offices, and seasonal campaigns.", "$69-$129", 45],
      ["Electric Kettle Set", "Daily-use kitchen item with broad household demand.", "$29-$69", 19],
      ["Capsule Coffee Machine", "Compact coffee appliance for home and office buyers.", "$99-$199", 68],
      ["Kitchen Storage Organizer", "Practical cabinet and pantry organizer for family kitchens.", "$25-$59", 16],
      ["Digital Kitchen Scale", "Small appliance for cooking, baking, and healthy meal prep.", "$18-$39", 11],
      ["Countertop Blender", "Home drink and smoothie appliance for family use.", "$45-$95", 29],
      ["Stainless Cookware Set", "Kitchen cookware bundle for new homes and gifting.", "$79-$159", 52],
      ["Smart Home Diffuser", "Home fragrance device for living rooms, bedrooms, and offices.", "$39-$79", 25],
      ["Cordless Vacuum Cleaner", "Compact home cleaning product for apartments and villas.", "$89-$179", 59]
    ],
    furniture: [
      ["LED Decor Light Panel", "Visual decor item for bedrooms, studios, gaming rooms, and living spaces.", "$59-$119", 39],
      ["Foldable Study Desk", "Space-saving desk for apartments, students, and home offices.", "$79-$149", 52],
      ["Luxury Storage Organizer", "Home organization product with strong visual resale appeal.", "$45-$89", 29],
      ["3D LED Wall Clock", "Modern decor product popular for bedrooms, offices, and lounges.", "$29-$69", 19],
      ["Velvet Hanger Storage Pack", "Wardrobe organization bundle for family homes.", "$25-$55", 16],
      ["Gaming Chair Cushion Set", "Comfort upgrade for gaming, office, and creator setups.", "$45-$99", 29],
      ["Minimal Coffee Table", "Compact furniture piece for apartments and living rooms.", "$89-$179", 59],
      ["Decorative Floor Lamp", "Home lighting product for modern interiors and gift sales.", "$69-$139", 45],
      ["Under-Sink Organizer Rack", "Storage product for kitchen and bathroom organization.", "$25-$55", 16],
      ["Luxury Cushion Cover Set", "Affordable decor bundle for sofa and bedroom refreshes.", "$19-$45", 12]
    ],
    auto: [
      ["Car Smart Display Kit", "Dashboard display accessory for navigation and daily driving upgrades.", "$85-$159", 57],
      ["Car Cooling Seat Pad", "Warm-climate car accessory for comfort-focused buyers.", "$49-$99", 32],
      ["Premium Car Vacuum Set", "Portable cleaning bundle for car lifestyle and family buyers.", "$39-$79", 25],
      ["4K Dash Camera", "Driver safety and evidence camera for daily traffic and road trips.", "$59-$129", 39],
      ["Magnetic Phone Car Charger", "Wireless charging mount for navigation and commuting.", "$35-$75", 23],
      ["Foldable Car Sunshade", "Heat-control accessory for Gulf parking and summer demand.", "$18-$39", 11],
      ["Portable Tire Inflator", "Emergency car tool for travel, family cars, and desert trips.", "$45-$89", 29],
      ["Car Trunk Organizer", "Storage organizer for families, road trips, and daily errands.", "$29-$69", 19],
      ["LED Ambient Light Kit", "Interior car styling product for youth and lifestyle buyers.", "$25-$59", 16],
      ["Leather Steering Wheel Cover", "Comfort and styling accessory for daily drivers.", "$19-$45", 12]
    ],
    baby: [
      ["Smart Baby Care Monitor", "Family-focused monitoring product for nursery and home safety demand.", "$79-$149", 52],
      ["Baby Travel Organizer", "Parent-friendly organizer for daily use and travel retail.", "$35-$75", 23],
      ["Bottle Warmer Travel Kit", "Portable baby-care item for family and gifting demand.", "$45-$89", 29],
      ["Diaper Backpack", "High-utility parent bag for travel, malls, and daily family use.", "$35-$79", 23],
      ["Baby Stroller Fan", "Warm-climate baby comfort product for outdoor and travel use.", "$22-$49", 14],
      ["Baby Feeding Bottle Set", "Repeat-demand baby feeding bundle for family buyers.", "$25-$59", 16],
      ["Portable Changing Mat", "Practical baby travel item for parents and gift bundles.", "$18-$39", 11],
      ["Baby Safety Gate", "Home safety product for apartments and villas.", "$49-$99", 32],
      ["Nursery Night Light", "Soft-light product for baby rooms and bedtime routines.", "$19-$45", 12],
      ["Baby Grooming Kit", "Small care kit for newborn gifting and daily use.", "$18-$39", 11]
    ],
    health: [
      ["Portable Wellness Massager", "Portable wellness product for relaxation, gifting, and daily home use.", "$49-$99", 32],
      ["Posture Support Belt", "Daily wellness product for office workers and home fitness users.", "$29-$69", 19],
      ["Smart Fitness Scale", "Home health product with clear customer appeal and repeat demand.", "$39-$79", 25],
      ["Massage Gun Set", "Recovery product for gym users, families, and office workers.", "$59-$129", 39],
      ["Neck Heating Massager", "Comfort product for home relaxation and gift campaigns.", "$49-$109", 32],
      ["Digital Blood Pressure Monitor", "Home monitoring device for family wellness buyers.", "$39-$89", 25],
      ["Walking Pad Compact Treadmill", "Home fitness product for apartments and warm climates.", "$149-$299", 98],
      ["Resistance Band Training Kit", "Low-cost fitness bundle for home workout users.", "$19-$45", 12],
      ["Air Quality Monitor", "Home wellness device for offices, bedrooms, and family spaces.", "$45-$95", 29],
      ["Ergonomic Office Cushion", "Daily comfort product for work-from-home and office users.", "$29-$69", 19]
    ],
    sports: [
      ["Outdoor Cooling Gear", "Warm-climate outdoor product for sports, travel, and seasonal resale.", "$39-$89", 25],
      ["Foldable Camping Chair", "Outdoor lifestyle product for desert camping and family trips.", "$49-$99", 32],
      ["Hydration Fitness Pack", "Simple sports bundle for gym, travel, and outdoor buyers.", "$35-$69", 22],
      ["Padel Racket Starter Set", "Popular racket-sport bundle for Gulf fitness and social clubs.", "$79-$159", 52],
      ["Yoga Mat Fitness Kit", "Home workout bundle for wellness and social commerce sales.", "$29-$69", 19],
      ["Adjustable Dumbbell Set", "Compact home fitness product for apartment users.", "$89-$179", 59],
      ["Camping Lantern Power Bank", "Outdoor lighting and charging accessory for trips.", "$35-$79", 23],
      ["Cooling Sports Towel Pack", "Hot-weather sports item for gyms, outdoor training, and travel.", "$15-$35", 9],
      ["Insulated Water Bottle Set", "Daily-use sports and office hydration product.", "$19-$45", 12],
      ["Portable Beach Shade", "Outdoor family product for beach, camping, and desert trips.", "$49-$99", 32]
    ],
    creator: [
      ["Live Commerce Creator Kit", "Camera, lighting, and audio starter bundle for creators and live sellers.", "$169-$299", 118],
      ["Portable Studio Light", "Compact light for creators, product videos, and livestream selling.", "$59-$119", 39],
      ["Wireless Lavalier Mic Set", "Creator audio bundle for short videos and live commerce.", "$49-$99", 32],
      ["Product Photo Light Box", "Clean product photography setup for ecommerce sellers.", "$59-$129", 39],
      ["Phone Tripod With Remote", "Starter filming tool for short video and livestream content.", "$25-$59", 16],
      ["Desktop Teleprompter Kit", "Creator speaking tool for course, sales, and product videos.", "$79-$159", 52],
      ["RGB Background Light Bar", "Visual studio lighting for reels, livestreams, and product demos.", "$49-$99", 32],
      ["Mobile Gimbal Stabilizer", "Smooth video accessory for creators and travel sellers.", "$79-$169", 52],
      ["USB Podcast Microphone", "Desk audio product for creators, teachers, and live sellers.", "$49-$109", 32],
      ["Green Screen Backdrop Set", "Content-production background set for creators and ecommerce teams.", "$39-$89", 25]
    ],
    travel: [
      ["Premium Travel Bag Set", "Organized luggage and travel bag bundle for business and family travel.", "$89-$179", 59],
      ["Smart Carry-On Scale", "Travel accessory for frequent flyers and family trips.", "$35-$69", 22],
      ["Luxury Packing Cube Set", "High-visual travel organizer bundle for local resale.", "$29-$59", 18],
      ["Universal Travel Adapter", "International charging adapter for frequent flyers and students.", "$19-$45", 12],
      ["Hardshell Luggage Set", "Family and business travel suitcase set for airport buyers.", "$129-$269", 85],
      ["Anti-Theft Backpack", "Travel and daily commute bag for work, school, and flights.", "$49-$99", 32],
      ["Travel Toiletry Organizer", "Compact organizer for grooming, cosmetics, and family trips.", "$18-$39", 11],
      ["Memory Foam Neck Pillow", "Comfort travel product for long flights and road trips.", "$19-$45", 12],
      ["Passport Wallet Set", "Travel document organizer for family and business travelers.", "$18-$39", 11],
      ["Foldable Weekender Bag", "Lightweight travel bag for short trips and extra luggage needs.", "$29-$69", 19]
    ],
    gaming: [
      ["Console Accessory Kit", "Gaming accessory bundle for console owners, families, and gift buyers.", "$49-$109", 32],
      ["RGB Gaming Headset", "High-visual audio product for gamers, students, and livestream users.", "$39-$89", 25],
      ["Mechanical Keyboard Set", "Gaming and desk setup product for creators, students, and office users.", "$59-$129", 39],
      ["Wireless Gaming Mouse", "Daily-use gaming accessory for PC setups and esports fans.", "$29-$69", 19],
      ["Mobile Game Controller", "Phone gaming grip and controller for mobile-first entertainment buyers.", "$35-$79", 23],
      ["LED Gaming Desk Mat", "Low-cost desk upgrade with strong visual appeal for online resale.", "$19-$45", 12],
      ["Streaming Capture Card", "Creator and gaming tool for livestream and content production.", "$49-$99", 32],
      ["Gaming Chair Footrest", "Comfort accessory for long gaming, work, and study sessions.", "$45-$95", 29],
      ["Portable Mini Projector", "Entertainment device for gaming rooms, family nights, and travel.", "$89-$179", 59],
      ["VR Headset Carry Case", "Protection and travel accessory for VR and gaming devices.", "$25-$59", 16]
    ]
  };

  const categoryKeys = Object.keys(categoryTemplates);
  let products = [];
  let orderNumber = 371011;
  const variantLabels = [
    { en: "Retail", zh: "零售款", ar: "تجزئة" },
    { en: "Pro", zh: "专业款", ar: "احترافي" },
    { en: "Compact", zh: "便携款", ar: "مدمج" },
    { en: "Premium", zh: "高端款", ar: "فاخر" },
    { en: "Travel", zh: "旅行款", ar: "سفر" }
  ];

  categoryKeys.forEach((category) => {
    for (let index = 0; index < 50; index += 1) {
      const template = categoryTemplates[category][index % categoryTemplates[category].length];
      const [baseTitle, baseDesc, retail, cBase] = template;
      const variant = variantLabels[Math.floor(index / categoryTemplates[category].length) % variantLabels.length];
      const cPrice = cBase + Math.floor(index / 3) * 2;
      products.push({
        id: `ORDER-${orderNumber}`,
        category,
        images: imageSetFor(category, index),
        title: {
          en: `${variant.en} ${baseTitle}`,
          zh: `${variant.zh}${i18n.zh.categories[category]}商品`,
          ar: `${variant.ar} - ${i18n.ar.categories[category]}`
        },
        desc: {
          en: baseDesc,
          zh: `适合本地转售、社交电商和会员采购的${i18n.zh.categories[category]}商品。`,
          ar: `منتج مناسب لإعادة البيع المحلي والتجارة الاجتماعية ضمن فئة ${i18n.ar.categories[category]}.`
        },
        specs: {
          en: ["Member supply price", "Resale ready", "Visual product content"],
          zh: ["会员供货价", "适合转售", "适合内容展示"],
          ar: ["سعر توريد للأعضاء", "جاهز لإعادة البيع", "مناسب للمحتوى المرئي"]
        },
        retail,
        prices: { C: `$${cPrice}`, B: `$${Math.max(8, cPrice - 8)}`, A: `$${Math.max(5, cPrice - 16)}` }
      });
      orderNumber += 1;
    }
  });

  function localizedBundle(value, fallback = {}) {
    if (typeof value === "string") {
      return { en: value, ar: value, zh: value };
    }
    return {
      en: value?.en || fallback.en || "",
      ar: value?.ar || value?.en || fallback.ar || fallback.en || "",
      zh: value?.zh || value?.en || fallback.zh || fallback.en || ""
    };
  }

  function normalizeImageList(images, fallbackImages) {
    if (!Array.isArray(images)) return fallbackImages;
    const cleanImages = images.map((image) => String(image || "").trim()).filter(Boolean).slice(0, 8);
    return cleanImages.length ? cleanImages : fallbackImages;
  }

  function normalizeMarketplaceLinks(rawLinks = {}, fallbackLinks = {}) {
    const links = rawLinks.marketplace || rawLinks.amazon || rawLinks.noon || rawLinks || {};
    const fallback = fallbackLinks.marketplace || fallbackLinks.amazon || fallbackLinks.noon || fallbackLinks || {};
    return {
      en: String(links.en || links.english || fallback.en || fallback.english || "").trim(),
      ar: String(links.ar || links.arabic || fallback.ar || fallback.arabic || "").trim()
    };
  }

  function normalizeExternalProduct(raw, index, generatedProduct) {
    const fallback = generatedProduct || products[index] || products[0];
    const category = categoryKeys.includes(raw?.category) ? raw.category : fallback.category;
    const fallbackTitle = fallback?.title || {};
    const fallbackDesc = fallback?.desc || {};
    const fallbackSpecs = fallback?.specs || {};
    const prices = raw?.prices || {};
    return {
      id: raw?.id || fallback?.id || `ORDER-${371011 + index}`,
      category,
      images: normalizeImageList(raw?.images, fallback?.images || imageSetFor(category, index)),
      title: localizedBundle(raw?.title, fallbackTitle),
      desc: localizedBundle(raw?.desc, fallbackDesc),
      specs: {
        en: Array.isArray(raw?.specs?.en) ? raw.specs.en : fallbackSpecs.en,
        ar: Array.isArray(raw?.specs?.ar) ? raw.specs.ar : fallbackSpecs.ar,
        zh: Array.isArray(raw?.specs?.zh) ? raw.specs.zh : fallbackSpecs.zh
      },
      retail: raw?.retail || fallback?.retail || "$49-$99",
      prices: {
        C: prices.C || fallback?.prices?.C || "$30",
        B: prices.B || fallback?.prices?.B || "$24",
        A: prices.A || fallback?.prices?.A || "$18"
      },
      marketplace: normalizeMarketplaceLinks(raw?.marketplace || raw?.amazon || raw?.noon || raw?.links, fallback?.marketplace || fallback?.amazon || fallback?.noon || fallback?.links)
    };
  }

  async function loadExternalCatalog() {
    try {
      const response = await fetch(productCatalogUrl, { cache: "no-store" });
      if (!response.ok) return;
      const catalog = await response.json();
      const records = Array.isArray(catalog) ? catalog : catalog.products;
      if (!Array.isArray(records) || !records.length) return;
      const generatedProducts = products.slice();
      products = records
        .map((record, index) => normalizeExternalProduct(record, index, generatedProducts[index]))
        .filter((product) => categoryKeys.includes(product.category));
    } catch (error) {
      products = products.length ? products : [];
    }
  }

  let currentLanguage = "en";
  let activeCategory = null;

  function get(path) {
    return path.split(".").reduce((value, key) => (value ? value[key] : undefined), i18n[currentLanguage]) || path;
  }

  function localized(value) {
    return value[currentLanguage] || value.en || "";
  }

  function externalLinkButtons(product) {
    const links = normalizeMarketplaceLinks(product.marketplace || product.amazon || product.noon || product.links);
    if (!links.en && !links.ar) {
      return `<p class="store-link-pending">${get("store.noonUnavailable")}</p>`;
    }
    return `
      <div class="store-external-links" aria-label="External product details">
        ${links.en ? `<a class="button store-noon-link store-noon-link-en" href="${links.en}" target="_blank" rel="noopener noreferrer">${get("store.noonEnglish")}</a>` : ""}
        ${links.ar ? `<a class="button store-noon-link store-noon-link-ar" href="${links.ar}" target="_blank" rel="noopener noreferrer">${get("store.noonArabic")}</a>` : ""}
      </div>
    `;
  }

  function categoryIcon(category) {
    const icons = {
      all: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="7" width="7" height="7" rx="1.5"/><rect x="18" y="7" width="7" height="7" rx="1.5"/><rect x="7" y="18" width="7" height="7" rx="1.5"/><rect x="18" y="18" width="7" height="7" rx="1.5"/></svg>',
      mobile: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="10" y="4.5" width="12" height="23" rx="3"/><path d="M14 23.5h4"/></svg>',
      fashion: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 7l3.2 3h3.6L21 7l5 4-3.2 5v10H9.2V16L6 11l5-4z"/><path d="M14.2 10.2c.8.8 2.8.8 3.6 0"/></svg>',
      jewelry: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5l8 7-8 15-8-15 8-7z"/><path d="M8 12h16M12 5l4 7 4-7"/></svg>',
      home: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 15L16 7l10 8"/><path d="M10 14.5V26h12V14.5"/><path d="M14 26v-7h4v7"/></svg>',
      furniture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 17v-3.5A3.5 3.5 0 0 1 11.5 10h9A3.5 3.5 0 0 1 24 13.5V17"/><path d="M6 17h20v7H6z"/><path d="M9 24v3M23 24v3"/></svg>',
      auto: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 18l2.2-6h11.6L24 18"/><path d="M6 18h20v7H6z"/><circle cx="10.5" cy="25" r="2"/><circle cx="21.5" cy="25" r="2"/></svg>',
      baby: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M13 5h6v6l-2 2v12a4 4 0 0 1-8 0V13l-2-2V8a3 3 0 0 1 3-3h3z"/><path d="M10 17h6M10 21h6"/></svg>',
      health: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27s-9-5.7-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7.3-9 13-9 13z"/><path d="M16 12v8M12 16h8"/></svg>',
      sports: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10"/><path d="M8 13c4 1.5 7 5 9 12M24 13c-4 1.5-7 5-9 12M10 8c3.5 4 8.5 4 12 0"/></svg>',
      creator: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="8" width="17" height="16" rx="3"/><path d="M22 13l5-3v12l-5-3z"/><path d="M13 13l5 3-5 3z"/></svg>',
      travel: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="10" width="14" height="16" rx="2"/><path d="M13 10V7h6v3M12 26v2M20 26v2"/><path d="M24.5 6.5l2 2M23 9l4-4"/></svg>',
      gaming: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 13h14a5 5 0 0 1 4.7 3.3l1.2 3.5A4 4 0 0 1 25.1 25c-1.3 0-2.5-.6-3.3-1.7l-1.2-1.6h-9.2l-1.2 1.6A4 4 0 0 1 6.9 25a4 4 0 0 1-3.8-5.2l1.2-3.5A5 5 0 0 1 9 13z"/><path d="M10 17v4M8 19h4M20 18h.1M23 21h.1"/></svg>',
      custom: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 6v20M6 16h20"/><path d="M23 7l1.2 2.8L27 11l-2.8 1.2L23 15l-1.2-2.8L19 11l2.8-1.2L23 7z"/></svg>'
    };
    return icons[category] || icons.all;
  }

  function initBackToTop() {
    const button = document.querySelector("[data-back-top]");
    const sync = () => document.body.classList.toggle("has-scrolled", window.scrollY > 420);
    button?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function setLanguage(language, persist) {
    currentLanguage = supportedLanguages.includes(language) ? language : "en";
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    const select = document.getElementById("storeLanguageSelect");
    if (select) select.value = currentLanguage;
    if (persist) {
      localStorage.setItem(languageKey, currentLanguage);
      localStorage.setItem(languageManualKey, "true");
    }
    document.querySelectorAll("[data-store-i18n]").forEach((node) => {
      node.textContent = get(node.getAttribute("data-store-i18n"));
    });
    renderCategories();
    renderProducts();
  }

  function renderCategories() {
    const bar = document.getElementById("storeFilterBar");
    if (!bar) return;
    bar.innerHTML = categoryOrder
      .map((category) => {
        if (category === "custom") {
          return `<a class="store-filter store-filter-custom" href="${supportUrl}"><span class="store-filter-icon">${categoryIcon(category)}</span><strong>${get("store.custom")}</strong></a>`;
        }
        return `<button class="store-filter${activeCategory === category ? " is-active" : ""}" type="button" data-category="${category}"><span class="store-filter-icon">${categoryIcon(category)}</span><strong>${i18n[currentLanguage].categories[category]}</strong></button>`;
      })
      .join("");
    bar.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategories();
        renderProducts();
        document.getElementById("storeGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderEmptyState() {
    return `
      <div class="store-empty-state">
        <strong>${get("store.emptyTitle")}</strong>
        <p>${get("store.emptyText")}</p>
      </div>
    `;
  }

  function renderProducts() {
    const grid = document.getElementById("storeGrid");
    if (!grid) return;
    if (!activeCategory) {
      grid.innerHTML = renderEmptyState();
      return;
    }
    const visible = activeCategory === "all" ? products.slice(0, 50) : products.filter((product) => product.category === activeCategory).slice(0, 50);
    grid.innerHTML = visible
      .map((product) => `
        <article class="store-card">
          <div class="store-card-media">
            <img src="${product.images[0]}" alt="${localized(product.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${productImageFallback}';" />
            <span>${product.id}</span>
          </div>
          <div class="store-card-body">
            <div class="store-card-topline">
              <span>${i18n[currentLanguage].categories[product.category]}</span>
              <strong>${get("store.retail")}: ${product.retail}</strong>
            </div>
            <h3>${localized(product.title)}</h3>
            <p>${localized(product.desc)}</p>
            <div class="store-price-grid">
              <div><span>${get("store.cSupply")}</span><strong>${product.prices.C}</strong></div>
              <div><span>${get("store.bSupply")}</span><strong>${product.prices.B}</strong></div>
              <div><span>${get("store.aSupply")}</span><strong>${product.prices.A}</strong></div>
            </div>
            <button class="button button-outline store-detail-button" type="button" data-product="${product.id}">${get("store.details")}</button>
          </div>
        </article>
      `)
      .join("");
    grid.querySelectorAll("[data-product]").forEach((button) => {
      button.addEventListener("click", () => openDetail(button.dataset.product));
    });
  }

  function openDetail(id) {
    const product = products.find((item) => item.id === id);
    const overlay = document.getElementById("storeDetailOverlay");
    const body = document.getElementById("storeDetailBody");
    if (!product || !overlay || !body) return;
    body.innerHTML = `
      <div class="store-detail-grid">
        <div class="store-detail-gallery">
          <p class="section-kicker">${get("store.gallery")}</p>
          <div class="store-main-image"><img src="${product.images[0]}" alt="${localized(product.title)}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${productImageFallback}';" /></div>
          <div class="store-thumb-grid">
            ${product.images.map((image, index) => `<button type="button" data-detail-image="${image}" aria-label="Show product image ${index + 1}"><img src="${image}" alt="" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${productImageFallback}';" /></button>`).join("")}
          </div>
        </div>
        <aside class="store-detail-pricing-panel">
          <p class="section-kicker">${product.id} / ${i18n[currentLanguage].categories[product.category]}</p>
          <h2 id="storeDetailTitle">${localized(product.title)}</h2>
          <p>${localized(product.desc)}</p>
          <div class="store-spec-list">${localized(product.specs).map((spec) => `<span>${spec}</span>`).join("")}</div>
          <h3>${get("store.supplyTitle")}</h3>
          <div class="store-price-grid store-price-grid-large">
            <div><span>${get("store.cSupply")}</span><strong>${product.prices.C}</strong></div>
            <div><span>${get("store.bSupply")}</span><strong>${product.prices.B}</strong></div>
            <div><span>${get("store.aSupply")}</span><strong>${product.prices.A}</strong></div>
          </div>
          ${externalLinkButtons(product)}
          <a class="button button-primary store-request-button" href="${supportUrl}">${get("store.request")}</a>
          <div class="store-profit-box">
            <strong>${get("store.profitTitle")}</strong>
            <p>${get("store.profitText")}</p>
            <ol>
              <li>${get("store.flow1")}</li>
              <li>${get("store.flow2")}</li>
              <li>${get("store.flow3")}</li>
              <li>${get("store.flow4")}</li>
            </ol>
          </div>
        </aside>
      </div>
    `;
    body.querySelectorAll("[data-detail-image]").forEach((button) => {
      button.addEventListener("click", () => {
        const mainImage = body.querySelector(".store-main-image img");
        if (mainImage) mainImage.src = button.dataset.detailImage;
      });
    });
    overlay.hidden = false;
    document.body.classList.add("store-modal-open");
  }

  function closeDetail() {
    const overlay = document.getElementById("storeDetailOverlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("store-modal-open");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const saved = localStorage.getItem(languageKey);
    const manual = localStorage.getItem(languageManualKey) === "true";
    setLanguage(manual && saved && supportedLanguages.includes(saved) ? saved : "en", false);
    await loadExternalCatalog();
    renderCategories();
    renderProducts();
    initBackToTop();
    document.getElementById("storeLanguageSelect")?.addEventListener("change", (event) => setLanguage(event.target.value, true));
    document.getElementById("storeDetailClose")?.addEventListener("click", closeDetail);
    document.getElementById("storeDetailOverlay")?.addEventListener("click", (event) => {
      if (event.target.id === "storeDetailOverlay") closeDetail();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDetail();
    });
  });
})();
