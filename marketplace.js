(function () {
  const supportedLanguages = ["en", "ar", "zh"];
  const languageKey = "hourAiLanguage";
  const supportUrl = "index.html?support=1#support";

  const productImageFallback = "assets/store-mobile-1.svg";
  const categoryImagePools = {
    mobile: [
      "assets/store-mobile-1.svg",
      "assets/store-mobile-2.svg",
      "assets/store-mobile-3.svg"
    ],
    fashion: [
      "assets/store-fashion-1.svg",
      "assets/store-fashion-2.svg",
      "assets/store-fashion-3.svg"
    ],
    jewelry: [
      "assets/store-jewelry-1.svg",
      "assets/store-jewelry-2.svg",
      "assets/store-jewelry-3.svg"
    ],
    home: [
      "assets/store-home-1.svg",
      "assets/store-home-2.svg",
      "assets/store-home-3.svg"
    ],
    furniture: [
      "assets/store-furniture-1.svg",
      "assets/store-furniture-2.svg",
      "assets/store-furniture-3.svg"
    ],
    auto: [
      "assets/store-auto-1.svg",
      "assets/store-auto-2.svg",
      "assets/store-auto-3.svg"
    ],
    baby: [
      "assets/store-baby-1.svg",
      "assets/store-baby-2.svg",
      "assets/store-baby-3.svg"
    ],
    health: [
      "assets/store-health-1.svg",
      "assets/store-health-2.svg",
      "assets/store-health-3.svg"
    ],
    sports: [
      "assets/store-sports-1.svg",
      "assets/store-sports-2.svg",
      "assets/store-sports-3.svg"
    ],
    creator: [
      "assets/store-creator-1.svg",
      "assets/store-creator-2.svg",
      "assets/store-creator-3.svg"
    ],
    travel: [
      "assets/store-travel-1.svg",
      "assets/store-travel-2.svg",
      "assets/store-travel-3.svg"
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
        details: "View details",
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
        custom: "+"
      }
    }
  };

  const categoryOrder = ["all", "mobile", "fashion", "jewelry", "home", "furniture", "auto", "baby", "health", "sports", "creator", "travel", "custom"];

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
    ]
  };

  const categoryKeys = Object.keys(categoryTemplates);
  const products = [];
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

  let currentLanguage = "en";
  let activeCategory = null;

  function get(path) {
    return path.split(".").reduce((value, key) => (value ? value[key] : undefined), i18n[currentLanguage]) || path;
  }

  function localized(value) {
    return value[currentLanguage] || value.en || "";
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
    if (persist) localStorage.setItem(languageKey, currentLanguage);
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
          <a class="button button-primary store-request-button" href="${supportUrl}">${get("store.request")}</a>
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

  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(languageKey);
    setLanguage(saved && supportedLanguages.includes(saved) ? saved : "en", false);
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
