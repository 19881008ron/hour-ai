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
        eyebrow: "Member supply marketplace",
        title: "Member Store",
        lede: "Source selected products at your qualified member price and resell them in your local market.",
        stepSell: "Find buyer",
        stepPrice: "Set markup",
        stepBuy: "Member supply",
        catalogEyebrow: "Middle East demand categories",
        catalogTitle: "Products ready for member resale",
        catalogText: "Browse product categories, open a product, review the image gallery, and compare C, B, and A member supply prices.",
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
        profitText: "Sell locally first, then purchase from Hour AI at your member supply price.",
        flow1: "Confirm product and local resale price.",
        flow2: "Receive payment from your customer.",
        flow3: "Purchase through Hour AI at member price.",
        flow4: "Keep the markup as your profit.",
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
        custom: "Custom Sourcing"
      },
      tags: {
        all: "Full catalog",
        electronics: "Smart devices",
        mobile: "High turnover",
        fashion: "Gulf demand",
        beauty: "Social commerce",
        fragrance: "Gift market",
        jewelry: "Premium retail",
        home: "Daily demand",
        furniture: "Home upgrade",
        auto: "Car lifestyle",
        baby: "Family buyers",
        health: "Wellness picks",
        sports: "Outdoor climate",
        creator: "Live selling",
        travel: "Travel retail"
      }
    },
    zh: {
      nav: { live: "在线平台", orders: "订单", path: "学习", courses: "课程", store: "会员商城", support: "客服" },
      store: {
        advisor: "客服",
        backHome: "首页",
        eyebrow: "会员专供商城",
        title: "会员商城",
        lede: "会员可按认证等级查看专供价格，并在本地市场自由加价销售。",
        stepSell: "找到买家",
        stepPrice: "自由加价",
        stepBuy: "会员供货",
        catalogEyebrow: "中东需求类目",
        catalogTitle: "适合会员转售的精选商品",
        catalogText: "选择类目，打开商品详情，查看多图展示，并对比 C、B、A 会员供货价。",
        all: "全部",
        custom: "商品定制",
        customText: "提交需求",
        cSupply: "C级供货价",
        bSupply: "B级供货价",
        aSupply: "A级供货价",
        retail: "建议售价",
        details: "查看详情",
        request: "申请定制",
        supplyTitle: "会员供货价",
        gallery: "商品图片",
        specs: "商品卖点",
        profitTitle: "转售流程",
        profitText: "先在本地成交客户，再按会员供货价从 Hour AI 采购。",
        flow1: "确认商品和本地销售价格。",
        flow2: "向你的客户收款。",
        flow3: "按会员价从 Hour AI 采购。",
        flow4: "加价部分就是你的利润。",
        close: "关闭"
      },
      categories: {
        all: "全部类目",
        electronics: "消费电子",
        mobile: "手机配件",
        fashion: "服装与端庄服饰",
        beauty: "美容个护",
        fragrance: "香水与沉香",
        jewelry: "珠宝手表",
        home: "家居厨具",
        furniture: "家具装饰",
        auto: "汽车配件",
        baby: "母婴用品",
        health: "健康护理",
        sports: "运动户外",
        creator: "直播电商",
        travel: "旅行箱包",
        custom: "商品定制"
      },
      tags: {
        all: "全部商品",
        electronics: "智能设备",
        mobile: "高周转",
        fashion: "海湾需求",
        beauty: "社交电商",
        fragrance: "礼品市场",
        jewelry: "高端零售",
        home: "日常需求",
        furniture: "家居升级",
        auto: "车载生活",
        baby: "家庭消费",
        health: "健康精选",
        sports: "户外气候",
        creator: "直播销售",
        travel: "旅行零售"
      }
    },
    ar: {
      nav: { live: "منصة مباشرة", orders: "الطلبات", path: "التعلم", courses: "الدورات", store: "متجر الأعضاء", support: "الدعم" },
      store: {
        advisor: "الدعم",
        backHome: "الرئيسية",
        eyebrow: "سوق توريد للأعضاء",
        title: "متجر الأعضاء",
        lede: "اشتر منتجات مختارة بسعر العضوية المؤهلة وأعد بيعها في سوقك المحلي.",
        stepSell: "ابحث عن مشتر",
        stepPrice: "حدد هامشك",
        stepBuy: "توريد العضوية",
        catalogEyebrow: "فئات مطلوبة في الشرق الأوسط",
        catalogTitle: "منتجات جاهزة لإعادة البيع",
        catalogText: "تصفح الفئات، افتح المنتج، راجع معرض الصور، وقارن أسعار توريد عضوية C و B و A.",
        all: "الكل",
        custom: "توريد مخصص",
        customText: "اطلب منتجا",
        cSupply: "سعر C",
        bSupply: "سعر B",
        aSupply: "سعر A",
        retail: "سعر البيع",
        details: "عرض التفاصيل",
        request: "طلب توريد",
        supplyTitle: "أسعار توريد الأعضاء",
        gallery: "معرض المنتج",
        specs: "المزايا",
        profitTitle: "مسار إعادة البيع",
        profitText: "بع محليا أولا، ثم اشتر من Hour AI بسعر توريد العضوية.",
        flow1: "أكد المنتج وسعر البيع المحلي.",
        flow2: "استلم الدفع من عميلك.",
        flow3: "اشتر من Hour AI بسعر العضوية.",
        flow4: "احتفظ بالهامش كربح لك.",
        close: "إغلاق"
      },
      categories: {
        all: "كل الفئات",
        electronics: "إلكترونيات استهلاكية",
        mobile: "إكسسوارات الجوال",
        fashion: "أزياء وملابس محتشمة",
        beauty: "الجمال والعناية",
        fragrance: "العطور والعود",
        jewelry: "مجوهرات وساعات",
        home: "المنزل والمطبخ",
        furniture: "أثاث وديكور",
        auto: "إكسسوارات السيارات",
        baby: "الأم والطفل",
        health: "الصحة والعافية",
        sports: "رياضة وخارج المنزل",
        creator: "التجارة المباشرة",
        travel: "السفر والحقائب",
        custom: "توريد مخصص"
      },
      tags: {
        all: "كل المنتجات",
        electronics: "أجهزة ذكية",
        mobile: "دوران سريع",
        fashion: "طلب خليجي",
        beauty: "تجارة اجتماعية",
        fragrance: "سوق الهدايا",
        jewelry: "بيع فاخر",
        home: "طلب يومي",
        furniture: "ترقية المنزل",
        auto: "أسلوب السيارة",
        baby: "مشتريات عائلية",
        health: "اختيارات صحية",
        sports: "مناخ خارجي",
        creator: "بيع مباشر",
        travel: "تجزئة السفر"
      }
    }
  };

  const categoryOrder = ["all", "electronics", "mobile", "fashion", "beauty", "fragrance", "jewelry", "home", "furniture", "auto", "baby", "health", "sports", "creator", "travel", "custom"];

  const productSeeds = [
    ["electronics", "Smart Mini Projector", "便携智能投影仪", "جهاز عرض ذكي صغير", "Portable projector for home cinema, retail demos, and family entertainment.", "$145-$199", "$119", "$105", "$88"],
    ["mobile", "MagSafe Power Bank Set", "磁吸快充移动电源套装", "مجموعة بطارية مغناطيسية", "Fast-charging accessory bundle with strong daily-use demand.", "$48-$79", "$31", "$27", "$22"],
    ["fashion", "Premium Modest Wear Set", "高端端庄服饰套装", "مجموعة أزياء محتشمة فاخرة", "Lightweight fashion bundle suited to Gulf and wider Middle East retail.", "$69-$129", "$44", "$38", "$31"],
    ["beauty", "LED Beauty Care Device", "LED美容护理仪", "جهاز عناية بالبشرة LED", "Demo-friendly beauty tech product for skincare and home use.", "$89-$169", "$58", "$49", "$41"],
    ["fragrance", "Oud Aroma Gift Kit", "沉香香氛礼盒", "طقم هدايا عود وعطور", "Gift-ready oud and fragrance accessory set for premium retail offers.", "$55-$118", "$36", "$31", "$25"],
    ["jewelry", "Smart Luxury Watch", "智能轻奢手表", "ساعة ذكية فاخرة", "Lifestyle watch product for gift, fashion, and social commerce sales.", "$79-$149", "$51", "$44", "$36"],
    ["home", "Smart Kitchen Appliance", "智能厨房小家电", "جهاز مطبخ ذكي", "Compact kitchen product designed for family use and marketplace resale.", "$99-$179", "$68", "$58", "$47"],
    ["furniture", "LED Decor Light Panel", "LED氛围装饰灯板", "لوحة إضاءة ديكور LED", "Visual decor item for bedrooms, studios, gaming rooms, and living spaces.", "$59-$119", "$39", "$34", "$28"],
    ["auto", "Car Smart Display Kit", "汽车智能显示套件", "طقم شاشة سيارة ذكية", "Dashboard display accessory for navigation and daily driving upgrades.", "$85-$159", "$57", "$49", "$40"],
    ["baby", "Smart Baby Care Monitor", "智能母婴看护设备", "جهاز مراقبة أطفال ذكي", "Family-focused monitoring product for nursery and home safety demand.", "$79-$149", "$52", "$45", "$37"],
    ["health", "Portable Wellness Massager", "便携健康按摩仪", "جهاز تدليك صحي محمول", "Portable wellness product for relaxation, gifting, and daily home use.", "$49-$99", "$32", "$28", "$23"],
    ["sports", "Outdoor Cooling Gear", "户外降温装备", "معدات تبريد خارجية", "Warm-climate outdoor product for sports, travel, and seasonal resale.", "$39-$89", "$25", "$22", "$18"],
    ["creator", "Live Commerce Creator Kit", "直播电商创作套装", "طقم صانع للتجارة المباشرة", "Camera, lighting, and audio starter bundle for creators and live sellers.", "$169-$299", "$118", "$99", "$82"],
    ["travel", "Premium Travel Bag Set", "高端旅行箱包套装", "مجموعة حقائب سفر فاخرة", "Organized luggage and travel bag bundle for business and family travel.", "$89-$179", "$59", "$50", "$42"]
  ];

  const products = productSeeds.map((seed, index) => {
    const [category, enTitle, zhTitle, arTitle, desc, retail, cPrice, bPrice, aPrice] = seed;
    const imageIndex = index % assetPool.length;
    return {
      id: `ORDER-${371011 + index}`,
      category,
      images: [assetPool[imageIndex], assetPool[(imageIndex + 1) % assetPool.length], assetPool[(imageIndex + 2) % assetPool.length]],
      title: { en: enTitle, zh: zhTitle, ar: arTitle },
      desc: {
        en: desc,
        zh: `${i18n.zh.categories[category]}类会员专供商品，适合本地转售、社交电商和定制采购。`,
        ar: `منتج من فئة ${i18n.ar.categories[category]} مناسب لإعادة البيع المحلي والتجارة الاجتماعية.`
      },
      specs: {
        en: ["High demand", "Member supply price", "Resale ready"],
        zh: ["需求明确", "会员供货价", "适合转售"],
        ar: ["طلب واضح", "سعر عضوية", "جاهز للبيع"]
      },
      retail,
      prices: { C: cPrice, B: bPrice, A: aPrice }
    };
  });

  let currentLanguage = "en";
  let activeCategory = "all";

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
          return `<a class="store-filter store-filter-custom" href="${supportUrl}"><strong>${get("store.custom")}</strong><small>${get("store.customText")}</small></a>`;
        }
        return `<button class="store-filter${activeCategory === category ? " is-active" : ""}" type="button" data-category="${category}"><strong>${i18n[currentLanguage].categories[category]}</strong><small>${category === "all" ? get("store.all") : i18n[currentLanguage].tags[category]}</small></button>`;
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
