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
        eyebrow: "Alibaba-style member sourcing",
        title: "Member Store Entrance",
        lede: "Qualified Hour AI members can source member-only products, set their own local resale price, and keep the markup after buying at their ABC supply price.",
        stepSell: "Close local customers",
        stepPrice: "Set your markup",
        stepBuy: "Source at member price",
        catalogEyebrow: "Middle East demand categories",
        catalogTitle: "Member-only products prepared for resale",
        catalogText: "Each category is designed for about 50 products. Product details open as a sourcing page with a multi-image gallery on the left and ABC member supply prices on the right.",
        all: "All Categories",
        planned: "50 products planned",
        custom: "Member Product Customization",
        customText: "Cannot find the product? Contact Hour AI support to request sourcing.",
        cSupply: "C member supply",
        bSupply: "B member supply",
        aSupply: "A member supply",
        retail: "Local resale guide",
        details: "View product details",
        request: "Customize / sourcing consultation",
        supplyTitle: "ABC member supply prices",
        gallery: "Product gallery",
        specs: "Product highlights",
        profitTitle: "Member resale model",
        profitText: "Members sell to their local customer first, collect payment locally, then return to Hour AI to buy at the qualified member supply price.",
        flow1: "Confirm product, price, and delivery expectation with your customer.",
        flow2: "Receive local customer payment through your own sales channel.",
        flow3: "Buy from Hour AI at your C, B, or A member supply price.",
        flow4: "The supplier prepares fulfillment. Your markup remains your profit.",
        close: "Close"
      },
      categories: {
        all: "All Categories",
        electronics: "Consumer Electronics",
        mobile: "Mobile Accessories",
        fashion: "Fashion & Modest Wear",
        beauty: "Beauty & Personal Care",
        fragrance: "Fragrance & Oud",
        jewelry: "Jewelry & Watches",
        home: "Home & Kitchen",
        furniture: "Furniture & Decor",
        auto: "Auto Accessories",
        baby: "Mother & Baby",
        health: "Health & Wellness",
        sports: "Sports & Outdoor",
        creator: "Creator & Live Commerce",
        travel: "Travel & Bags",
        custom: "Member Product Customization"
      }
    },
    zh: {
      nav: { live: "在线平台", orders: "订单", path: "学习", courses: "课程", store: "会员商城入口", support: "客服" },
      store: {
        advisor: "顾问",
        backHome: "首页",
        eyebrow: "阿里巴巴风格会员选品",
        title: "会员商城入口",
        lede: "通过 Hour AI 评级的会员，可以采购会员专供商品，在本地自由定价销售，再用 ABC 会员供货价向平台采购，保留加价利润。",
        stepSell: "成交本地客户",
        stepPrice: "自由设置加价",
        stepBuy: "会员价采购",
        catalogEyebrow: "中东需求类目",
        catalogTitle: "为会员转售准备的专供商品",
        catalogText: "每个类目按约 50 个商品规划。点击商品后进入采购详情页，左侧多图展示，右侧展示 ABC 会员供货价。",
        all: "全部类目",
        planned: "计划 50 个商品",
        custom: "会员商品定制",
        customText: "商城没有想要的商品？直接联系 Hour AI 客服定制选品。",
        cSupply: "C级会员供货价",
        bSupply: "B级会员供货价",
        aSupply: "A级会员供货价",
        retail: "本地售价参考",
        details: "查看商品详情",
        request: "定制 / 采购咨询",
        supplyTitle: "ABC会员供货价",
        gallery: "商品多图",
        specs: "商品卖点",
        profitTitle: "会员转售模式",
        profitText: "会员先在本地与客户成交并收款，再回到 Hour AI 用自己的认证等级供货价采购商品。",
        flow1: "先与客户确认商品、价格和交付预期。",
        flow2: "通过自己的销售渠道收取本地客户付款。",
        flow3: "回到 Hour AI，用 C、B 或 A 会员价采购。",
        flow4: "供应商安排交付，你保留自由加价利润。",
        close: "关闭"
      },
      categories: {
        all: "全部类目",
        electronics: "消费电子",
        mobile: "手机配件",
        fashion: "服装与端庄服饰",
        beauty: "美妆个护",
        fragrance: "香水与沉香",
        jewelry: "珠宝手表",
        home: "家居厨具",
        furniture: "家具装饰",
        auto: "汽车配件",
        baby: "母婴用品",
        health: "健康护理",
        sports: "运动户外",
        creator: "创作者与直播电商",
        travel: "旅行箱包",
        custom: "会员商品定制"
      }
    },
    ar: {
      nav: { live: "منصة مباشرة", orders: "الطلبات", path: "التعلم", courses: "الدورات", store: "متجر الأعضاء", support: "الدعم" },
      store: {
        advisor: "المستشار",
        backHome: "الرئيسية",
        eyebrow: "توريد للأعضاء بأسلوب Alibaba",
        title: "مدخل متجر الأعضاء",
        lede: "يمكن لأعضاء Hour AI المؤهلين اختيار منتجات خاصة بالأعضاء، وتحديد سعر إعادة البيع المحلي، ثم الشراء بسعر توريد C أو B أو A.",
        stepSell: "أغلق البيع محليا",
        stepPrice: "حدد هامشك",
        stepBuy: "اشتر بسعر العضو",
        catalogEyebrow: "فئات مطلوبة في الشرق الأوسط",
        catalogTitle: "منتجات خاصة بالأعضاء جاهزة لإعادة البيع",
        catalogText: "كل فئة مصممة لنحو 50 منتجا. تفتح التفاصيل صفحة توريد: معرض صور متعدد في اليسار وأسعار توريد ABC في اليمين.",
        all: "كل الفئات",
        planned: "50 منتجا مخططا",
        custom: "تخصيص منتجات للأعضاء",
        customText: "لا تجد المنتج المطلوب؟ تواصل مع دعم Hour AI لطلب التوريد.",
        cSupply: "سعر توريد C",
        bSupply: "سعر توريد B",
        aSupply: "سعر توريد A",
        retail: "دليل سعر إعادة البيع",
        details: "عرض تفاصيل المنتج",
        request: "استشارة تخصيص / توريد",
        supplyTitle: "أسعار توريد أعضاء ABC",
        gallery: "معرض المنتج",
        specs: "نقاط المنتج",
        profitTitle: "نموذج إعادة البيع",
        profitText: "يبيع العضو للعميل المحلي أولا، ثم يشتري من Hour AI بسعر توريد العضوية المؤهلة.",
        flow1: "أكد المنتج والسعر وتوقعات التسليم مع عميلك.",
        flow2: "استلم الدفع من عميلك المحلي عبر قناتك الخاصة.",
        flow3: "اشتر من Hour AI بسعر عضوية C أو B أو A.",
        flow4: "يقوم المورد بتجهيز التسليم، ويبقى هامشك ربحا لك.",
        close: "إغلاق"
      },
      categories: {
        all: "كل الفئات",
        electronics: "إلكترونيات استهلاكية",
        mobile: "ملحقات الجوال",
        fashion: "أزياء وملابس محتشمة",
        beauty: "جمال وعناية شخصية",
        fragrance: "عطور وعود",
        jewelry: "مجوهرات وساعات",
        home: "منزل ومطبخ",
        furniture: "أثاث وديكور",
        auto: "إكسسوارات السيارات",
        baby: "الأم والطفل",
        health: "الصحة والعافية",
        sports: "رياضة وخارج المنزل",
        creator: "المبدعون والتجارة المباشرة",
        travel: "السفر والحقائب",
        custom: "تخصيص منتجات للأعضاء"
      }
    }
  };

  const categoryOrder = ["all", "electronics", "mobile", "fashion", "beauty", "fragrance", "jewelry", "home", "furniture", "auto", "baby", "health", "sports", "creator", "travel", "custom"];

  const productSeeds = [
    ["electronics", "Smart Mini Projector", "Portable projector for home cinema, family gatherings, and retail demonstrations.", "$145-$199", "$119", "$105", "$88"],
    ["mobile", "MagSafe Power Bank Set", "Fast-charging mobile accessory bundle with strong cross-border retail demand.", "$48-$79", "$31", "$27", "$22"],
    ["fashion", "Premium Modest Wear Set", "Lightweight modest fashion bundle suitable for Gulf and wider Middle East audiences.", "$69-$129", "$44", "$38", "$31"],
    ["beauty", "LED Beauty Care Device", "Retail-friendly beauty tech product for skincare demonstration and home use.", "$89-$169", "$58", "$49", "$41"],
    ["fragrance", "Oud Aroma Gift Kit", "Gift-ready oud and fragrance accessory set for seasonal and premium retail offers.", "$55-$118", "$36", "$31", "$25"],
    ["jewelry", "Smart Luxury Watch", "Fashion watch product for gift, lifestyle, and social commerce campaigns.", "$79-$149", "$51", "$44", "$36"],
    ["home", "Smart Kitchen Appliance", "Compact kitchen product designed for family use and marketplace resale.", "$99-$179", "$68", "$58", "$47"],
    ["furniture", "LED Decor Light Panel", "Home decor item for bedrooms, gaming rooms, studios, and living spaces.", "$59-$119", "$39", "$34", "$28"],
    ["auto", "Car Smart Display Kit", "Dashboard display accessory for navigation, entertainment, and daily driving upgrades.", "$85-$159", "$57", "$49", "$40"],
    ["baby", "Smart Baby Care Monitor", "Family-focused monitoring product for nursery and home safety retail demand.", "$79-$149", "$52", "$45", "$37"],
    ["health", "Portable Wellness Massager", "Personal wellness device for home relaxation and gifting scenarios.", "$49-$99", "$32", "$28", "$23"],
    ["sports", "Outdoor Cooling Gear", "Sports and outdoor product for warm-climate markets and travel resale.", "$39-$89", "$25", "$22", "$18"],
    ["creator", "Live Commerce Creator Kit", "Camera, lighting, and audio starter bundle for short video and livestream sellers.", "$169-$299", "$118", "$99", "$82"],
    ["travel", "Premium Travel Bag Set", "Organized luggage and travel bag bundle for business, family, and vacation use.", "$89-$179", "$59", "$50", "$42"]
  ];

  const products = productSeeds.map((seed, index) => {
    const [category, title, desc, retail, cPrice, bPrice, aPrice] = seed;
    const imageIndex = index % assetPool.length;
    return {
      id: `HA-${371011 + index}`,
      category,
      images: [assetPool[imageIndex], assetPool[(imageIndex + 1) % assetPool.length], assetPool[(imageIndex + 2) % assetPool.length]],
      title: { en: title, zh: translateTitleZh(category), ar: translateTitleAr(category) },
      desc: { en: desc, zh: translateDescZh(category), ar: translateDescAr(category) },
      specs: specList(category),
      retail,
      prices: { C: cPrice, B: bPrice, A: aPrice }
    };
  });

  let currentLanguage = "en";
  let activeCategory = "all";

  function translateTitleZh(category) {
    const map = {
      electronics: "智能迷你投影仪",
      mobile: "磁吸快充移动电源套装",
      fashion: "高端端庄服饰套装",
      beauty: "LED美肤护理仪",
      fragrance: "沉香香氛礼盒",
      jewelry: "智能轻奢手表",
      home: "智能厨房小家电",
      furniture: "LED氛围装饰灯板",
      auto: "汽车智能显示套件",
      baby: "智能母婴看护设备",
      health: "便携健康按摩仪",
      sports: "户外降温装备",
      creator: "直播电商创作者套装",
      travel: "高端旅行箱包套装"
    };
    return map[category] || "会员专供商品";
  }

  function translateTitleAr(category) {
    const map = {
      electronics: "جهاز عرض ذكي صغير",
      mobile: "مجموعة بطارية شحن مغناطيسية",
      fashion: "مجموعة أزياء محتشمة فاخرة",
      beauty: "جهاز عناية بالبشرة LED",
      fragrance: "طقم هدايا عود وعطور",
      jewelry: "ساعة فاخرة ذكية",
      home: "جهاز مطبخ ذكي",
      furniture: "لوحة إضاءة ديكور LED",
      auto: "طقم شاشة ذكية للسيارة",
      baby: "جهاز مراقبة ذكي للأطفال",
      health: "جهاز تدليك صحي محمول",
      sports: "معدات تبريد خارجية",
      creator: "طقم مبدعي التجارة المباشرة",
      travel: "مجموعة حقائب سفر فاخرة"
    };
    return map[category] || "منتج خاص بالأعضاء";
  }

  function translateDescZh(category) {
    return `适合中东市场的${i18n.zh.categories[category]}类会员专供商品，可用于本地转售、社交电商和客户定制采购。`;
  }

  function translateDescAr(category) {
    return `منتج من فئة ${i18n.ar.categories[category]} مناسب للشرق الأوسط وإعادة البيع المحلي والتجارة الاجتماعية.`;
  }

  function specList(category) {
    const base = {
      electronics: ["High demand", "Compact size", "Retail gift box"],
      mobile: ["Fast charging", "Daily use", "Easy resale"],
      fashion: ["Middle East fit", "Multiple sizes", "Seasonal demand"],
      beauty: ["Demo friendly", "Home use", "Premium packaging"],
      fragrance: ["Gift ready", "Arabic market fit", "High margin"],
      jewelry: ["Lifestyle appeal", "Gift demand", "Display ready"],
      home: ["Family use", "Practical demand", "Easy demo"],
      furniture: ["Home upgrade", "Visual product", "Social content ready"],
      auto: ["Driver upgrade", "Practical accessory", "High AOV"],
      baby: ["Family purchase", "Safety value", "Repeat demand"],
      health: ["Wellness demand", "Portable", "Giftable"],
      sports: ["Warm climate fit", "Outdoor use", "Seasonal demand"],
      creator: ["Short video fit", "Live commerce", "Creator bundle"],
      travel: ["Business travel", "Family travel", "Premium bundle"]
    };
    return base[category] || ["Custom sourcing", "Member request", "Advisor review"];
  }

  function get(path) {
    return path.split(".").reduce((value, key) => (value ? value[key] : undefined), i18n[currentLanguage]) || path;
  }

  function localized(value) {
    return value[currentLanguage] || value.en || "";
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
          return `<a class="store-filter store-filter-custom" href="${supportUrl}"><strong>${i18n[currentLanguage].categories.custom}</strong><small>${get("store.customText")}</small></a>`;
        }
        return `<button class="store-filter${activeCategory === category ? " is-active" : ""}" type="button" data-category="${category}"><strong>${i18n[currentLanguage].categories[category]}</strong><small>${category === "all" ? get("store.all") : get("store.planned")}</small></button>`;
      })
      .join("");
    bar.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const grid = document.getElementById("storeGrid");
    if (!grid) return;
    const visible = activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory);
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
          <div class="store-spec-list">${product.specs.map((spec) => `<span>${spec}</span>`).join("")}</div>
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
        body.querySelector(".store-main-image img").src = button.dataset.detailImage;
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
