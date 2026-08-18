(function () {
  const supportedLanguages = ["en", "ar", "zh"];
  const languageKey = "hourAiLanguage";
  const supportUrl = "index.html?support=1#support";

  const assetPool = [
    "assets/order-level-a.webp",
    "assets/order-level-b.webp",
    "assets/order-level-c.webp",
    "assets/carousel-apply.webp",
    "assets/carousel-learn.webp",
    "assets/carousel-test.webp"
  ];

  const i18n = {
    en: {
      nav: { live: "Live platform", orders: "Orders", path: "Learning", courses: "Courses", store: "Member Store", support: "Support" },
      store: {
        advisor: "Advisor",
        backHome: "Home",
        eyebrow: "Member-only sourcing system",
        title: "Member Store",
        lede: "Qualified members can source selected products at internal supply prices, resell locally at their own markup, and keep the price difference as profit.",
        benefit1: "Member supply prices",
        benefit1Text: "C, B, and A members see different internal prices.",
        benefit2: "No inventory pressure",
        benefit2Text: "Sell first, then purchase through Hour AI for delivery support.",
        benefit3: "Local resale profit",
        benefit3Text: "You decide the retail price in your market.",
        catalogEyebrow: "Choose a category",
        catalogTitle: "Open a category to view member-only products",
        catalogText: "Products appear only after you choose a category. Each product detail page shows a multi-image gallery on the left and C, B, and A member supply prices on the right.",
        emptyTitle: "Select a product category",
        emptyText: "Choose one category above to load member-only products and compare supply prices.",
        all: "All",
        custom: "Custom Sourcing",
        customText: "Request product sourcing",
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
        profitText: "Sell locally first, then purchase from Hour AI at your qualified member supply price.",
        flow1: "Confirm product and local resale price.",
        flow2: "Receive payment from your customer.",
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
        lede: "通过认证的会员可以用内部供货价采购精选商品，在本地市场自由加价销售，并将差价作为利润。",
        benefit1: "会员供货价",
        benefit1Text: "C、B、A 会员可查看不同级别的内部价格。",
        benefit2: "无需囤货压力",
        benefit2Text: "先在本地成交客户，再通过 Hour AI 采购并获得交付支持。",
        benefit3: "本地转售利润",
        benefit3Text: "你可以根据所在市场自行决定销售价格。",
        catalogEyebrow: "选择商品分类",
        catalogTitle: "点击分类后查看会员专供商品",
        catalogText: "只有选择分类后才会展示商品。商品详情页左侧展示多张图片，右侧展示 C、B、A 三类会员供货价。",
        emptyTitle: "请选择一个商品分类",
        emptyText: "点击上方分类后，即可加载会员专供商品并对比供货价格。",
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
        eyebrow: "نظام توريد خاص بالأعضاء",
        title: "متجر الأعضاء",
        lede: "يمكن للأعضاء المؤهلين شراء منتجات مختارة بأسعار توريد داخلية، ثم إعادة بيعها في أسواقهم المحلية بسعر يحددونه والاحتفاظ بفارق السعر كربح.",
        benefit1: "أسعار توريد للأعضاء",
        benefit1Text: "تظهر أسعار مختلفة لأعضاء مستويات C و B و A.",
        benefit2: "بدون ضغط مخزون",
        benefit2Text: "بع أولا، ثم اشتر عبر Hour AI للحصول على دعم التوريد.",
        benefit3: "ربح إعادة البيع المحلي",
        benefit3Text: "أنت تحدد سعر البيع المناسب في سوقك.",
        catalogEyebrow: "اختر فئة",
        catalogTitle: "افتح فئة لعرض منتجات الأعضاء",
        catalogText: "تظهر المنتجات فقط بعد اختيار الفئة. صفحة التفاصيل تعرض معرض الصور في اليسار وأسعار توريد C و B و A في اليمين.",
        emptyTitle: "اختر فئة منتجات",
        emptyText: "اختر فئة من الأعلى لعرض منتجات الأعضاء ومقارنة أسعار التوريد.",
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
        profitText: "بع محليا أولا، ثم اشتر من Hour AI بسعر توريد العضوية المؤهلة.",
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
      ["MagSafe Power Bank Set", "Fast-charging accessory bundle with strong daily-use demand.", "$48-$79", 31],
      ["Wireless Charging Dock", "Compact charging dock for phones, earbuds, and watches.", "$55-$89", 36],
      ["Privacy Screen Bundle", "High-turnover phone protection set for retail and online sales.", "$29-$55", 18]
    ],
    fashion: [
      ["Premium Modest Wear Set", "Lightweight fashion bundle suited to Gulf and wider Middle East retail.", "$69-$129", 44],
      ["Cooling Travel Abaya Set", "Breathable daily-wear set for warm-climate buyers.", "$79-$139", 49],
      ["Men's Business Thobe Pack", "Clean formal style bundle for office, travel, and gifting.", "$65-$119", 41]
    ],
    jewelry: [
      ["Smart Luxury Watch", "Lifestyle watch product for gift, fashion, and social commerce sales.", "$79-$149", 51],
      ["Minimal Gold Jewelry Set", "Gift-ready accessory set for premium visual marketing.", "$49-$99", 32],
      ["Luxury Watch Display Box", "Retail display product for watches, jewelry, and gift packaging.", "$59-$109", 38]
    ],
    home: [
      ["Smart Kitchen Appliance", "Compact kitchen product designed for family use and marketplace resale.", "$99-$179", 68],
      ["Arabic Coffee Gift Kit", "Home hospitality product for gifting and local retail demand.", "$69-$129", 45],
      ["Compact Air Purifier", "Home wellness appliance for bedrooms, offices, and family spaces.", "$89-$159", 58]
    ],
    furniture: [
      ["LED Decor Light Panel", "Visual decor item for bedrooms, studios, gaming rooms, and living spaces.", "$59-$119", 39],
      ["Foldable Study Desk", "Space-saving desk for apartments, students, and home offices.", "$79-$149", 52],
      ["Luxury Storage Organizer", "Home organization product with strong visual resale appeal.", "$45-$89", 29]
    ],
    auto: [
      ["Car Smart Display Kit", "Dashboard display accessory for navigation and daily driving upgrades.", "$85-$159", 57],
      ["Car Cooling Seat Pad", "Warm-climate car accessory for comfort-focused buyers.", "$49-$99", 32],
      ["Premium Car Vacuum Set", "Portable cleaning bundle for car lifestyle and family buyers.", "$39-$79", 25]
    ],
    baby: [
      ["Smart Baby Care Monitor", "Family-focused monitoring product for nursery and home safety demand.", "$79-$149", 52],
      ["Baby Travel Organizer", "Parent-friendly organizer for daily use and travel retail.", "$35-$75", 23],
      ["Bottle Warmer Travel Kit", "Portable baby-care item for family and gifting demand.", "$45-$89", 29]
    ],
    health: [
      ["Portable Wellness Massager", "Portable wellness product for relaxation, gifting, and daily home use.", "$49-$99", 32],
      ["Posture Support Belt", "Daily wellness product for office workers and home fitness users.", "$29-$69", 19],
      ["Smart Fitness Scale", "Home health product with clear demonstration and repeat demand.", "$39-$79", 25]
    ],
    sports: [
      ["Outdoor Cooling Gear", "Warm-climate outdoor product for sports, travel, and seasonal resale.", "$39-$89", 25],
      ["Foldable Camping Chair", "Outdoor lifestyle product for desert camping and family trips.", "$49-$99", 32],
      ["Hydration Fitness Pack", "Simple sports bundle for gym, travel, and outdoor buyers.", "$35-$69", 22]
    ],
    creator: [
      ["Live Commerce Creator Kit", "Camera, lighting, and audio starter bundle for creators and live sellers.", "$169-$299", 118],
      ["Portable Studio Light", "Compact light for creators, product videos, and livestream selling.", "$59-$119", 39],
      ["Wireless Lavalier Mic Set", "Creator audio bundle for short videos and live commerce.", "$49-$99", 32]
    ],
    travel: [
      ["Premium Travel Bag Set", "Organized luggage and travel bag bundle for business and family travel.", "$89-$179", 59],
      ["Smart Carry-On Scale", "Travel accessory for frequent flyers and family trips.", "$35-$69", 22],
      ["Luxury Packing Cube Set", "High-visual travel organizer bundle for local resale.", "$29-$59", 18]
    ]
  };

  const categoryKeys = Object.keys(categoryTemplates);
  const products = [];
  let orderNumber = 371011;

  categoryKeys.forEach((category) => {
    for (let index = 0; index < 50; index += 1) {
      const template = categoryTemplates[category][index % categoryTemplates[category].length];
      const [baseTitle, baseDesc, retail, cBase] = template;
      const variant = index + 1;
      const cPrice = cBase + Math.floor(index / 3) * 2;
      products.push({
        id: `ORDER-${orderNumber}`,
        category,
        images: [
          assetPool[(orderNumber + 0) % assetPool.length],
          assetPool[(orderNumber + 1) % assetPool.length],
          assetPool[(orderNumber + 2) % assetPool.length]
        ],
        title: {
          en: `${baseTitle} ${variant}`,
          zh: `${i18n.zh.categories[category]}精选商品 ${variant}`,
          ar: `${i18n.ar.categories[category]} ${variant}`
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
            <img src="${product.images[0]}" alt="${localized(product.title)}" loading="lazy" />
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
          <div class="store-main-image"><img src="${product.images[0]}" alt="${localized(product.title)}" /></div>
          <div class="store-thumb-grid">
            ${product.images.map((image, index) => `<button type="button" data-detail-image="${image}" aria-label="Show product image ${index + 1}"><img src="${image}" alt="" /></button>`).join("")}
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
