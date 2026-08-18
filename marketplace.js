(function () {
  const supportedLanguages = ["en", "ar", "zh"];
  const languageKey = "hourAiLanguage";

  const i18n = {
    en: {
      nav: {
        live: "Live platform",
        orders: "Orders",
        path: "Learning",
        courses: "Courses",
        store: "Member Store",
        support: "Support"
      },
      store: {
        advisor: "Advisor",
        backHome: "Home",
        eyebrow: "Member-only supply marketplace",
        title: "Member Store Entrance",
        lede: "Qualified Hour AI members can review supplier products, member-only supply prices, and product details before reselling in their own market.",
        stepSell: "Sell locally",
        stepPrice: "Set your markup",
        stepBuy: "Buy at member price",
        catalogEyebrow: "Product catalog",
        catalogTitle: "Products prepared for member resale",
        catalogText: "Each product shows C, B, and A level supply prices. Your local resale price is decided by you.",
        all: "All",
        cSupply: "C supply",
        bSupply: "B supply",
        aSupply: "A supply",
        retail: "Suggested local resale",
        details: "View product details",
        request: "Request member purchase",
        supplyTitle: "Member supply prices",
        profitTitle: "Resale workflow",
        profitText: "Your profit is the difference between your local customer payment and your member supply cost, after local expenses.",
        flow1: "Agree on a resale price with your customer.",
        flow2: "Receive payment from your customer in your local market.",
        flow3: "Return to Hour AI and buy at your qualified member price.",
        flow4: "The supplier prepares delivery while you keep your markup.",
        close: "Close"
      },
      categories: {
        all: "All",
        creator: "Creator kits",
        electronics: "Smart electronics",
        beauty: "Beauty tech",
        home: "Smart home",
        travel: "Travel gear"
      }
    },
    zh: {
      nav: {
        live: "在线平台",
        orders: "订单",
        path: "学习",
        courses: "课程",
        store: "会员商城入口",
        support: "客服"
      },
      store: {
        advisor: "顾问",
        backHome: "首页",
        eyebrow: "会员专供商品商城",
        title: "会员商城入口",
        lede: "通过 Hour AI 评级的会员，可以查看供应商商品、ABC会员专属供货价和商品细节，并在自己的国家自由加价销售。",
        stepSell: "本地销售",
        stepPrice: "自由加价",
        stepBuy: "会员价采购",
        catalogEyebrow: "商品目录",
        catalogTitle: "为会员转售准备的商品",
        catalogText: "每个商品都会展示 C、B、A 不同等级的会员供货价。你的本地销售价格由你自己决定。",
        all: "全部",
        cSupply: "C级供货价",
        bSupply: "B级供货价",
        aSupply: "A级供货价",
        retail: "建议本地售价",
        details: "查看商品细节",
        request: "咨询会员采购",
        supplyTitle: "会员供货价",
        profitTitle: "转售流程",
        profitText: "你的利润等于本地客户付款金额，减去会员供货成本和本地必要费用后的差额。",
        flow1: "先与本地客户确认销售价格。",
        flow2: "在你的本地市场收取客户付款。",
        flow3: "回到 Hour AI，用你已认证的会员价格采购。",
        flow4: "供应商安排发货，你保留自由加价利润。",
        close: "关闭"
      },
      categories: {
        all: "全部",
        creator: "创作者设备",
        electronics: "智能电子",
        beauty: "美妆科技",
        home: "智能家居",
        travel: "出行装备"
      }
    },
    ar: {
      nav: {
        live: "منصة مباشرة",
        orders: "الطلبات",
        path: "التعلم",
        courses: "الدورات",
        store: "متجر الأعضاء",
        support: "الدعم"
      },
      store: {
        advisor: "المستشار",
        backHome: "الرئيسية",
        eyebrow: "سوق توريد خاص بالأعضاء",
        title: "مدخل متجر الأعضاء",
        lede: "يمكن لأعضاء Hour AI المؤهلين مراجعة المنتجات وأسعار التوريد الخاصة وتفاصيل المنتج قبل إعادة بيعها في أسواقهم المحلية.",
        stepSell: "بع محليا",
        stepPrice: "حدد هامشك",
        stepBuy: "اشتر بسعر العضو",
        catalogEyebrow: "كتالوج المنتجات",
        catalogTitle: "منتجات جاهزة لإعادة البيع",
        catalogText: "يعرض كل منتج أسعار توريد C و B و A. أنت تحدد سعر إعادة البيع المحلي.",
        all: "الكل",
        cSupply: "توريد C",
        bSupply: "توريد B",
        aSupply: "توريد A",
        retail: "سعر إعادة بيع مقترح",
        details: "عرض التفاصيل",
        request: "طلب شراء عضو",
        supplyTitle: "أسعار توريد الأعضاء",
        profitTitle: "مسار إعادة البيع",
        profitText: "ربحك هو الفرق بين ما يدفعه عميلك المحلي وتكلفة توريد العضو بعد المصاريف المحلية.",
        flow1: "اتفق على سعر إعادة البيع مع عميلك.",
        flow2: "استلم الدفع من عميلك في سوقك المحلي.",
        flow3: "ارجع إلى Hour AI واشتر بسعر عضويتك المؤهلة.",
        flow4: "يقوم المورد بتجهيز التسليم وتحتفظ أنت بهامشك.",
        close: "إغلاق"
      },
      categories: {
        all: "الكل",
        creator: "معدات المبدعين",
        electronics: "إلكترونيات ذكية",
        beauty: "تقنية الجمال",
        home: "منزل ذكي",
        travel: "معدات السفر"
      }
    }
  };

  const products = [
    {
      id: "ha-5001",
      category: "creator",
      image: "assets/order-level-b.webp",
      title: { en: "AI Creator Camera Kit", zh: "AI创作者拍摄套装", ar: "مجموعة كاميرا للمبدعين" },
      desc: {
        en: "A compact creator kit for short video shooting, product demos, and livestream starter setups.",
        zh: "适合短视频拍摄、产品演示和直播起步场景的轻量化创作者套装。",
        ar: "مجموعة مدمجة لتصوير الفيديو القصير وعروض المنتجات والبث المباشر."
      },
      specs: ["4K capture", "Wireless control", "Creator bundle"],
      retail: "$229-$319",
      prices: { C: "$168", B: "$149", A: "$129" }
    },
    {
      id: "ha-5002",
      category: "electronics",
      image: "assets/order-level-c.webp",
      title: { en: "Smart Translation Earbuds", zh: "智能翻译耳机", ar: "سماعات ترجمة ذكية" },
      desc: {
        en: "Lightweight earbuds for travel, meetings, and cross-border customer communication.",
        zh: "适合旅行、会议和跨境客户沟通的轻便智能翻译耳机。",
        ar: "سماعات خفيفة للسفر والاجتماعات والتواصل مع العملاء الدوليين."
      },
      specs: ["Multi-language mode", "Charging case", "Low-latency audio"],
      retail: "$99-$149",
      prices: { C: "$65", B: "$58", A: "$49" }
    },
    {
      id: "ha-5003",
      category: "creator",
      image: "assets/order-level-a.webp",
      title: { en: "Portable LED Studio Light", zh: "便携式LED摄影灯", ar: "إضاءة استوديو محمولة" },
      desc: {
        en: "Portable lighting for product photos, creator desks, and short video recording.",
        zh: "用于产品拍摄、创作者桌面和短视频录制的便携补光设备。",
        ar: "إضاءة محمولة لتصوير المنتجات ومكاتب المبدعين وتسجيل الفيديو القصير."
      },
      specs: ["Adjustable color", "USB-C power", "Desk mount"],
      retail: "$89-$129",
      prices: { C: "$54", B: "$47", A: "$39" }
    },
    {
      id: "ha-5004",
      category: "electronics",
      image: "assets/carousel-learn.webp",
      title: { en: "AI Voice Recorder", zh: "AI语音记录仪", ar: "مسجل صوت بالذكاء الاصطناعي" },
      desc: {
        en: "A compact recorder for meetings, interviews, course notes, and content planning.",
        zh: "适合会议、访谈、课程记录和内容规划的便携AI录音设备。",
        ar: "مسجل صغير للاجتماعات والمقابلات وملاحظات الدورات وتخطيط المحتوى."
      },
      specs: ["Noise reduction", "Long battery life", "Transcript export"],
      retail: "$129-$199",
      prices: { C: "$82", B: "$74", A: "$63" }
    },
    {
      id: "ha-5005",
      category: "beauty",
      image: "assets/carousel-apply.webp",
      title: { en: "Beauty Skin Analysis Device", zh: "智能肌肤分析仪", ar: "جهاز تحليل البشرة الذكي" },
      desc: {
        en: "A retail-friendly beauty tech product for skin analysis demonstrations and consultations.",
        zh: "适合美妆零售演示和咨询服务的智能肌肤分析设备。",
        ar: "منتج تقني مناسب للبيع بالتجزئة لعروض تحليل البشرة والاستشارات."
      },
      specs: ["App report", "Portable body", "Retail display ready"],
      retail: "$159-$239",
      prices: { C: "$98", B: "$88", A: "$76" }
    },
    {
      id: "ha-5006",
      category: "home",
      image: "assets/carousel-test.webp",
      title: { en: "Smart Aroma Diffuser", zh: "智能香薰扩香器", ar: "ناشر عطر ذكي" },
      desc: {
        en: "A smart home product with app timing, ambient light, and gift-ready packaging.",
        zh: "带有App定时、氛围灯和礼品包装的智能家居商品。",
        ar: "منتج منزل ذكي مع توقيت عبر التطبيق وإضاءة محيطية وتغليف مناسب للهدايا."
      },
      specs: ["App timer", "Ambient light", "Gift packaging"],
      retail: "$69-$119",
      prices: { C: "$38", B: "$33", A: "$28" }
    },
    {
      id: "ha-5007",
      category: "travel",
      image: "assets/hour-ai-workflow.svg",
      title: { en: "Travel Power Bank Pro", zh: "旅行快充移动电源", ar: "بطارية سفر احترافية" },
      desc: {
        en: "High-capacity travel charging for phones, tablets, and creator accessories.",
        zh: "适合手机、平板和创作者配件的高容量旅行快充电源。",
        ar: "شحن سفر عالي السعة للهواتف والأجهزة اللوحية وملحقات المبدعين."
      },
      specs: ["Fast charging", "Airline friendly", "Multi-port output"],
      retail: "$79-$129",
      prices: { C: "$45", B: "$39", A: "$34" }
    },
    {
      id: "ha-5008",
      category: "creator",
      image: "assets/order-level-b.webp",
      title: { en: "Wireless Lavalier Mic Set", zh: "无线领夹麦克风套装", ar: "مجموعة ميكروفون لاسلكي" },
      desc: {
        en: "A creator audio kit for product reviews, lessons, interviews, and short video recording.",
        zh: "适合产品评测、课程、访谈和短视频录制的创作者收音套装。",
        ar: "مجموعة صوت للمبدعين للمراجعات والدروس والمقابلات وتسجيل الفيديو القصير."
      },
      specs: ["Dual mic", "Noise reduction", "Phone ready"],
      retail: "$89-$139",
      prices: { C: "$52", B: "$46", A: "$39" }
    }
  ];

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
    const categories = ["all", "creator", "electronics", "beauty", "home", "travel"];
    bar.innerHTML = categories
      .map((category) => (
        `<button class="store-filter${activeCategory === category ? " is-active" : ""}" type="button" data-category="${category}">${i18n[currentLanguage].categories[category]}</button>`
      ))
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
            <img src="${product.image}" alt="${localized(product.title)}" loading="lazy" />
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
        <div class="store-detail-media">
          <img src="${product.image}" alt="${localized(product.title)}" />
        </div>
        <div class="store-detail-copy">
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
          <a class="button button-primary store-request-button" href="index.html#support">${get("store.request")}</a>
        </div>
      </div>
    `;
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

    document.getElementById("storeLanguageSelect")?.addEventListener("change", (event) => {
      setLanguage(event.target.value, true);
    });
    document.getElementById("storeDetailClose")?.addEventListener("click", closeDetail);
    document.getElementById("storeDetailOverlay")?.addEventListener("click", (event) => {
      if (event.target.id === "storeDetailOverlay") closeDetail();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDetail();
    });
  });
})();
