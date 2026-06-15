const whatsappNumber = "447835210931";

const translations = {
  en: {
    nav: {
      live: "Live platform",
      orders: "Orders",
      path: "Learning path",
      courses: "Courses",
      support: "Support",
      register: "Register"
    },
    hero: {
      eyebrow: "AI editing training + order access",
      title: "Learn AI video editing. Build proof. Apply for real tasks.",
      lede: "A practical 7-day learning path for beginners, followed by skill testing and access to C, B, and A level editing opportunities.",
      ctaPrimary: "Talk to an advisor",
      ctaSecondary: "Explore orders",
      statDays: "day learning path",
      statLevels: "editor levels",
      statTime: "typical task estimate",
      disclaimer: "Earnings are not guaranteed. Access depends on training progress, testing, quality, and available demand.",
      visualLabel: "LEARN → TEST → APPLY",
      visualTitle: "One clear path from beginner skills to qualified order access."
    },
    signals: [
      { title: "Learn the workflow", text: "Follow structured lessons and practical editing exercises." },
      { title: "Pass the skill test", text: "Demonstrate delivery quality before order access." },
      { title: "Apply for tasks", text: "Choose opportunities aligned with your qualified level." }
    ],
    orders: {
      eyebrow: "Order marketplace preview",
      title: "Current AI editor task board",
      text: "Review the task scope, pay range, estimated time, and delivery requirements before you apply.",
      boardStatus: "Sample opportunities online",
      viewDetails: "View task details"
    },
    reviews: {
      eyebrow: "Learning experience",
      title: "How the workflow feels at each level.",
      text: "These are layout examples. Replace them with verified learner feedback before full public promotion."
    },
    support: {
      eyebrow: "Advisor channel online",
      title: "Talk through the right starting level before you enroll.",
      text: "Ask about course levels, sample tasks, testing rules, available languages, and whether the workflow fits your goals.",
      whatsapp: "Chat on WhatsApp",
      live: "Open online consultation",
      note: "Online consultation currently routes to WhatsApp while live chat is being connected."
    },
    profile: {
      eyebrow: "Level progression",
      title: "A visible path from first workflow to advanced delivery.",
      text: "Each level builds on the previous one with clearer standards, stronger reviews, and access to more advanced task categories.",
      cTitle: "C-Level AI Editor",
      cText: "Beginner workflow, template editing, captions, and delivery checklists.",
      bTitle: "B-Level AI Editor",
      bText: "Commercial short videos, better pacing, revisions, and stronger quality standards.",
      aTitle: "A-Level AI Editor",
      aText: "Advanced projects, team review, project management, and agent eligibility.",
      open: "Create sample profile"
    },
    courses: {
      eyebrow: "Training programs",
      title: "Choose the level that matches your goal.",
      text: "Course enrollment currently starts with a consultation. Online payment will be connected in the next platform phase.",
      consult: "Consult before enrolling",
      recommended: "Most selected",
      oneTime: "one-time course"
    },
    modal: {
      content: "Task scope",
      pay: "Pay range",
      time: "Estimated time",
      requirements: "Delivery requirements",
      ask: "Ask about this order"
    },
    profileModal: {
      eyebrow: "Profile preview",
      title: "Create your Hour AI profile",
      name: "Name",
      email: "Email",
      level: "Target level",
      save: "Save sample profile",
      savedLabel: "Profile saved locally",
      toast: "Your sample profile has been saved on this device."
    },
    footer: {
      text: "AI video editing training, skill testing, and task marketplace access.",
      support: "Support",
      legal: "Earnings disclaimer"
    },
    labels: { pay: "Pay", time: "Time", level: "Level" },
    legal: "Important: Hour AI does not guarantee earnings, jobs, or order volume. Training results vary by effort, skill, testing performance, quality, and available demand.",
    saved: "Target level: {level}. Saved on this device."
  },
  zh: {
    nav: {
      live: "平台已上线",
      orders: "订单",
      path: "学习路径",
      courses: "课程",
      support: "客服",
      register: "注册"
    },
    hero: {
      eyebrow: "AI 剪辑培训 + 订单申请",
      title: "学习 AI 视频剪辑，建立作品证明，申请真实任务。",
      lede: "为新手设计的 7 天实操学习路径，完成学习和技能测试后，可申请 C、B、A 级剪辑机会。",
      ctaPrimary: "咨询顾问",
      ctaSecondary: "浏览订单",
      statDays: "天学习路径",
      statLevels: "个 AI 师等级",
      statTime: "典型任务预计时长",
      disclaimer: "收入不作保证。申请资格取决于学习进度、测试结果、交付质量和实际订单需求。",
      visualLabel: "学习 → 测试 → 申请",
      visualTitle: "从新手技能到合格订单申请，一条清晰的成长路径。"
    },
    signals: [
      { title: "学习工作流程", text: "按照结构化课程完成实际剪辑练习。" },
      { title: "通过技能测试", text: "在获得订单申请资格前证明交付质量。" },
      { title: "申请匹配任务", text: "根据已认证的等级选择合适的机会。" }
    ],
    orders: {
      eyebrow: "订单大厅预览",
      title: "当前 AI 剪辑任务看板",
      text: "申请前查看任务范围、酬劳区间、预计时长和交付要求。",
      boardStatus: "示例任务在线",
      viewDetails: "查看任务详情"
    },
    reviews: {
      eyebrow: "学习体验",
      title: "不同等级的学习与交付体验。",
      text: "当前为页面布局示例。正式公开推广前，请替换为真实且可验证的学员反馈。"
    },
    support: {
      eyebrow: "顾问通道在线",
      title: "报名前先确认适合你的起始等级。",
      text: "你可以咨询课程等级、任务样例、测试规则、支持语言，以及这套流程是否符合你的目标。",
      whatsapp: "WhatsApp 咨询",
      live: "打开在线咨询",
      note: "实时客服接入前，在线咨询暂时跳转至 WhatsApp。"
    },
    profile: {
      eyebrow: "等级成长路径",
      title: "从第一个工作流到高级交付，成长过程清晰可见。",
      text: "每个等级都建立在前一级基础上，对质量、审核和可申请任务类型提出更高要求。",
      cTitle: "C 级 AI 师",
      cText: "新手工作流、模板剪辑、字幕制作和交付清单。",
      bTitle: "B 级 AI 师",
      bText: "商业短视频、更好节奏、修改流程和更高质量标准。",
      aTitle: "A 级 AI 师",
      aText: "高级项目、团队审核、项目管理和代理资格。",
      open: "创建示例资料"
    },
    courses: {
      eyebrow: "培训课程",
      title: "选择符合你目标的学习等级。",
      text: "当前课程先通过咨询报名，在线支付将在平台下一阶段接入。",
      consult: "报名前咨询",
      recommended: "选择最多",
      oneTime: "一次性课程"
    },
    modal: {
      content: "任务范围",
      pay: "酬劳区间",
      time: "预计时长",
      requirements: "交付要求",
      ask: "咨询这个订单"
    },
    profileModal: {
      eyebrow: "资料预览",
      title: "创建 Hour AI 个人资料",
      name: "姓名",
      email: "邮箱",
      level: "目标等级",
      save: "保存示例资料",
      savedLabel: "资料已保存在本机",
      toast: "示例资料已保存在当前设备。"
    },
    footer: {
      text: "AI 视频剪辑培训、技能测试和订单大厅申请。",
      support: "客服",
      legal: "收入免责声明"
    },
    labels: { pay: "酬劳", time: "时长", level: "等级" },
    legal: "重要提示：Hour AI 不保证收入、工作机会或订单数量。学习结果取决于个人投入、技能、测试表现、交付质量和实际订单需求。",
    saved: "目标等级：{level}。资料保存在当前设备。"
  },
  es: {
    nav: { orders: "Pedidos", path: "Ruta de aprendizaje", courses: "Cursos", support: "Soporte", register: "Registro" },
    hero: {
      eyebrow: "Formación AI + acceso a pedidos",
      title: "Aprende edición AI. Crea pruebas. Solicita tareas reales.",
      ctaPrimary: "Hablar con un asesor",
      ctaSecondary: "Explorar pedidos"
    },
    orders: { viewDetails: "Ver detalles" },
    courses: { consult: "Consultar antes de inscribirme", recommended: "Más elegido", oneTime: "curso de pago único" },
    support: { whatsapp: "Chat en WhatsApp", live: "Abrir consulta online" },
    profileModal: { toast: "Tu perfil de muestra se guardó en este dispositivo." },
    legal: "Hour AI no garantiza ingresos, empleo ni volumen de pedidos."
  },
  fr: {
    nav: { orders: "Commandes", path: "Parcours", courses: "Cours", support: "Support", register: "S'inscrire" },
    hero: {
      eyebrow: "Formation AI + accès aux commandes",
      title: "Apprenez le montage AI. Prouvez vos compétences. Postulez.",
      ctaPrimary: "Parler à un conseiller",
      ctaSecondary: "Voir les commandes"
    },
    orders: { viewDetails: "Voir les détails" },
    courses: { consult: "Consulter avant l'inscription", recommended: "Le plus choisi", oneTime: "cours en paiement unique" },
    support: { whatsapp: "Discuter sur WhatsApp", live: "Ouvrir la consultation" },
    legal: "Hour AI ne garantit pas les revenus, les emplois ou le volume de commandes."
  },
  pt: {
    nav: { orders: "Pedidos", path: "Trilha", courses: "Cursos", support: "Suporte", register: "Registrar" },
    hero: {
      eyebrow: "Treinamento AI + acesso a pedidos",
      title: "Aprenda edição AI. Crie provas. Candidate-se a tarefas.",
      ctaPrimary: "Falar com consultor",
      ctaSecondary: "Ver pedidos"
    },
    orders: { viewDetails: "Ver detalhes" },
    courses: { consult: "Consultar antes de entrar", recommended: "Mais escolhido", oneTime: "curso de pagamento único" },
    support: { whatsapp: "Conversar no WhatsApp", live: "Abrir consulta online" },
    legal: "A Hour AI não garante renda, emprego ou volume de pedidos."
  },
  ar: {
    nav: { orders: "الطلبات", path: "مسار التعلم", courses: "الدورات", support: "الدعم", register: "تسجيل" },
    hero: {
      eyebrow: "تدريب AI + الوصول للطلبات",
      title: "تعلم تحرير AI. أثبت مهارتك. تقدم لمهام حقيقية.",
      ctaPrimary: "تحدث مع مستشار",
      ctaSecondary: "عرض الطلبات"
    },
    orders: { viewDetails: "عرض التفاصيل" },
    courses: { consult: "استشارة قبل التسجيل", recommended: "الأكثر اختياراً", oneTime: "دورة بدفعة واحدة" },
    support: { whatsapp: "محادثة واتساب", live: "فتح الاستشارة" },
    legal: "لا تضمن Hour AI الدخل أو الوظائف أو حجم الطلبات."
  },
  id: {
    nav: { orders: "Order", path: "Jalur belajar", courses: "Kursus", support: "Bantuan", register: "Daftar" },
    hero: {
      eyebrow: "Pelatihan AI + akses order",
      title: "Belajar editing AI. Buat bukti. Ajukan tugas nyata.",
      ctaPrimary: "Bicara dengan advisor",
      ctaSecondary: "Lihat order"
    },
    orders: { viewDetails: "Lihat detail" },
    courses: { consult: "Konsultasi sebelum daftar", recommended: "Paling dipilih", oneTime: "kursus sekali bayar" },
    support: { whatsapp: "Chat WhatsApp", live: "Buka konsultasi online" },
    legal: "Hour AI tidak menjamin pendapatan, pekerjaan, atau jumlah order."
  }
};

const orders = [
  {
    id: "c1",
    level: "C",
    title: "Template short video edit",
    content: "Create a 25-35 second AI-assisted vertical video from provided clips, captions, and a simple hook.",
    pay: "$20-$30",
    time: "1-2 hours",
    requirements: "Use the provided template, add clean subtitles, keep pacing tight, and export a 1080x1920 MP4."
  },
  {
    id: "c2",
    level: "C",
    title: "Product demo subtitle cut",
    content: "Turn a product screen recording into a short tutorial with captions and basic transitions.",
    pay: "$20-$30",
    time: "1-2 hours",
    requirements: "Follow the checklist, remove pauses, add three text callouts, and submit source and final files."
  },
  {
    id: "b1",
    level: "B",
    title: "Commercial Reels package",
    content: "Produce a conversion-focused short video using AI voiceover, stock visuals, captions, and a brand CTA.",
    pay: "$60-$70",
    time: "1-2 hours",
    requirements: "Create a stronger hook, align visuals with the script, and deliver two thumbnail options plus the editable project."
  },
  {
    id: "b2",
    level: "B",
    title: "UGC style AI ad edit",
    content: "Build a 40-second UGC-style ad from a script, avatar clip, B-roll, and product screenshots.",
    pay: "$60-$70",
    time: "1-2 hours",
    requirements: "Match the brand tone, add animated captions, include a clear CTA, and pass quality review."
  },
  {
    id: "a1",
    level: "A",
    title: "Multi-scene launch video",
    content: "Create a polished launch video with structured scenes, AI narration, advanced pacing, and revision notes.",
    pay: "$80-$100",
    time: "1-2 hours",
    requirements: "Plan the scenes, manage assets, and deliver the final video, project file, and quality checklist."
  },
  {
    id: "a2",
    level: "A",
    title: "Team lead review task",
    content: "Review junior edits, improve one final version, and prepare clear feedback for the editor group.",
    pay: "$80-$100",
    time: "1-2 hours",
    requirements: "Provide timestamped feedback, correct pacing, validate subtitles, and prepare the final delivery."
  }
];

const reviews = [
  {
    level: "C",
    name: "Maya R.",
    role: "C-Level learner",
    quote: "The checklist made the first AI editing workflow much easier to understand. I knew what to practice each day."
  },
  {
    level: "B",
    name: "Daniel K.",
    role: "B-Level learner",
    quote: "The commercial short video lessons helped me improve hooks, pacing, subtitles, and review habits."
  },
  {
    level: "A",
    name: "Aisha M.",
    role: "A-Level learner",
    quote: "The advanced path focused on quality control and managing a task from brief to delivery."
  }
];

const pricing = [
  {
    level: "C",
    name: "C-Level AI Editor",
    price: "$199",
    items: ["7-day beginner workflow", "Template editing lessons", "C-Level skill test preview", "$20-$30 task range after qualification"]
  },
  {
    level: "B",
    name: "B-Level AI Editor",
    price: "$599",
    recommended: true,
    items: ["Commercial short video workflow", "AI voiceover and pacing", "Quality review training", "$60-$70 task range after qualification"]
  },
  {
    level: "A",
    name: "A-Level AI Editor",
    price: "$999",
    items: ["Advanced project workflow", "Team review methods", "Agent eligibility preparation", "$80-$100 task range after qualification"]
  }
];

const localizedContent = {
  zh: {
    orders: {
      c1: {
        title: "模板短视频剪辑",
        content: "使用提供的素材、字幕和开场钩子，制作一条 25-35 秒的 AI 辅助竖屏短视频。",
        requirements: "使用指定模板，添加清晰字幕，保持紧凑节奏，并导出 1080x1920 MP4 文件。"
      },
      c2: {
        title: "产品演示字幕剪辑",
        content: "将产品录屏制作成带字幕和基础转场的简短教学视频。",
        requirements: "按照清单删除停顿，添加三处文字提示，并提交工程文件和最终成片。"
      },
      b1: {
        title: "商业 Reels 视频套件",
        content: "使用 AI 配音、素材画面、字幕和品牌行动指令，制作一条以转化为目标的短视频。",
        requirements: "强化开场钩子，使画面与脚本一致，并交付两个封面方案和可编辑工程。"
      },
      b2: {
        title: "UGC 风格 AI 广告剪辑",
        content: "根据脚本、数字人片段、补充画面和产品截图，制作一条 40 秒 UGC 风格广告。",
        requirements: "匹配品牌语气，添加动态字幕和明确 CTA，并通过质量审核。"
      },
      a1: {
        title: "多场景产品发布视频",
        content: "制作包含完整场景结构、AI 旁白、高级节奏和修改说明的精致发布视频。",
        requirements: "规划场景、管理素材，并交付最终视频、工程文件和质量检查表。"
      },
      a2: {
        title: "团队组长审核任务",
        content: "审核初级剪辑师作品，优化最终版本，并为团队准备清晰的修改反馈。",
        requirements: "提供带时间点的反馈，修正节奏，检查字幕，并完成最终交付。"
      }
    },
    reviews: {
      C: {
        role: "C 级学员",
        quote: "清单让第一个 AI 剪辑工作流更容易理解，我每天都清楚应该练习什么。"
      },
      B: {
        role: "B 级学员",
        quote: "商业短视频课程帮助我改善了开场、节奏、字幕和审核习惯。"
      },
      A: {
        role: "A 级学员",
        quote: "高级路径更注重质量控制，以及如何从需求说明一直管理到最终交付。"
      }
    },
    pricing: {
      C: {
        name: "C 级 AI 师",
        items: ["7 天新手工作流", "模板剪辑课程", "C 级技能测试预览", "通过认证后可申请 $20-$30 任务"]
      },
      B: {
        name: "B 级 AI 师",
        items: ["商业短视频工作流", "AI 配音与节奏训练", "质量审核训练", "通过认证后可申请 $60-$70 任务"]
      },
      A: {
        name: "A 级 AI 师",
        items: ["高级项目工作流", "团队审核方法", "代理资格准备", "通过认证后可申请 $80-$100 任务"]
      }
    }
  }
};

let currentLanguage = "en";
let lastFocusedElement = null;
let toastTimer = null;

function deepMerge(target, source) {
  Object.keys(source || {}).forEach((key) => {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

function languagePack(language) {
  if (language === "en") return translations.en;
  return deepMerge(structuredClone(translations.en), translations[language] || {});
}

function t(path) {
  return path.split(".").reduce((value, key) => value?.[key], languagePack(currentLanguage)) ?? path;
}

function whatsappLink(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function safeInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function localizedOrder(order) {
  return { ...order, ...(localizedContent[currentLanguage]?.orders?.[order.id] || {}) };
}

function localizedReview(review) {
  return { ...review, ...(localizedContent[currentLanguage]?.reviews?.[review.level] || {}) };
}

function localizedPlan(plan) {
  return { ...plan, ...(localizedContent[currentLanguage]?.pricing?.[plan.level] || {}) };
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    if (typeof value === "string") node.textContent = value;
  });
  renderOrders();
  renderReviews();
  renderPricing();

  const saved = readSavedProfile();
  if (saved) showSavedProfile(saved);
}

function renderOrders() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = orders
    .map((baseOrder, index) => {
      const order = localizedOrder(baseOrder);
      return `
        <article class="order-card">
          <div class="order-card-header">
            <span class="level-chip chip-${order.level.toLowerCase()}">${order.level}-Level</span>
            <span class="order-code">TASK-${String(index + 1).padStart(3, "0")}</span>
          </div>
          <h3>${order.title}</h3>
          <p>${order.content}</p>
          <div class="order-meta">
            <span><strong>${t("labels.pay")}</strong><b>${order.pay}</b></span>
            <span><strong>${t("labels.time")}</strong><b>${order.time}</b></span>
          </div>
          <button class="button button-outline full-width" type="button" data-order-id="${order.id}">
            <span>${t("orders.viewDetails")}</span><span aria-hidden="true">→</span>
          </button>
        </article>
      `;
    })
    .join("");
}

function renderReviews() {
  const grid = document.getElementById("reviewsGrid");
  grid.innerHTML = reviews
    .map((baseReview) => {
      const review = localizedReview(baseReview);
      return `
        <article class="review-card">
          <span class="level-chip chip-${review.level.toLowerCase()}">${review.level}-Level</span>
          <blockquote>${review.quote}</blockquote>
          <div class="review-author">
            <span class="review-avatar" aria-hidden="true">${safeInitials(review.name)}</span>
            <div><strong>${review.name}</strong><span>${review.role}</span></div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPricing() {
  const grid = document.getElementById("pricingGrid");
  grid.innerHTML = pricing
    .map((basePlan) => {
      const plan = localizedPlan(basePlan);
      return `
        <article class="price-card${plan.recommended ? " recommended" : ""}">
          ${plan.recommended ? `<span class="recommended-tag">${t("courses.recommended")}</span>` : ""}
          <span class="level-chip chip-${plan.level.toLowerCase()}">${plan.level}-Level</span>
          <h3>${plan.name}</h3>
          <div class="price-row"><span class="price">${plan.price}</span><span class="price-note">${t("courses.oneTime")}</span></div>
          <ul>${plan.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          <a class="button button-primary full-width" href="${whatsappLink(`I want to consult about the ${plan.name} course.`)}" target="_blank" rel="noreferrer">
            <span>${t("courses.consult")}</span><span aria-hidden="true">↗</span>
          </a>
        </article>
      `;
    })
    .join("");
}

function openOrder(orderId) {
  const baseOrder = orders.find((item) => item.id === orderId);
  if (!baseOrder) return;
  const order = localizedOrder(baseOrder);

  const modalLevel = document.getElementById("modalLevel");
  modalLevel.className = `order-level-pill chip-${order.level.toLowerCase()}`;
  modalLevel.textContent = `${order.level}-Level`;
  document.getElementById("orderModalTitle").textContent = order.title;
  document.getElementById("modalContent").textContent = order.content;
  document.getElementById("modalPay").textContent = order.pay;
  document.getElementById("modalTime").textContent = order.time;
  document.getElementById("modalRequirements").textContent = order.requirements;
  document.getElementById("modalWhatsapp").href = whatsappLink(`I want to ask about this Hour AI order: ${order.title}`);
  openModal("orderModal");
}

function openModal(id) {
  lastFocusedElement = document.activeElement;
  const modal = document.getElementById(id);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.querySelector(".modal-panel")?.focus());
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal.is-open")) document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
}

function readSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem("hourAiProfile") || "null");
  } catch {
    localStorage.removeItem("hourAiProfile");
    return null;
  }
}

function setupProfile() {
  const saved = readSavedProfile();
  if (saved) showSavedProfile(saved);

  document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profile = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      level: String(formData.get("level") || "C")
    };
    localStorage.setItem("hourAiProfile", JSON.stringify(profile));
    showSavedProfile(profile);
    showToast(t("profileModal.toast"));
  });
}

function showSavedProfile(profile) {
  const badge = document.getElementById("savedBadge");
  badge.textContent = profile.level;
  badge.className = `level-badge level-${profile.level.toLowerCase()}`;
  document.getElementById("savedName").textContent = profile.name;
  document.getElementById("savedMeta").textContent = `${t("saved").replace("{level}", `${profile.level}-Level`)} ${profile.email}`;
  document.getElementById("savedProfile").hidden = false;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function setupEvents() {
  document.getElementById("languageSelect").addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem("hourAiLanguage", currentLanguage);
    applyTranslations();
  });

  document.body.addEventListener("click", (event) => {
    const orderButton = event.target.closest("[data-order-id]");
    if (orderButton) openOrder(orderButton.dataset.orderId);
  });

  document.querySelectorAll("[data-close-modal]").forEach((item) => {
    item.addEventListener("click", () => closeModal("orderModal"));
  });
  document.querySelectorAll("[data-open-profile]").forEach((item) => {
    item.addEventListener("click", () => openModal("profileModal"));
  });
  document.querySelectorAll("[data-close-profile]").forEach((item) => {
    item.addEventListener("click", () => closeModal("profileModal"));
  });

  document.getElementById("liveChatButton").addEventListener("click", () => {
    window.open(whatsappLink("I want to start an online consultation with Hour AI."), "_blank", "noopener");
  });

  document.getElementById("legalButton").addEventListener("click", () => {
    window.alert(t("legal"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal("orderModal");
      closeModal("profileModal");
    }
  });
}

function initLinks() {
  const message = "Hi Hour AI, I want to learn about AI video editing courses and task orders.";
  document.getElementById("heroWhatsapp").href = whatsappLink(message);
  document.getElementById("supportWhatsapp").href = whatsappLink(message);
}

function initLanguage() {
  const savedLanguage = localStorage.getItem("hourAiLanguage");
  if (savedLanguage && translations[savedLanguage]) currentLanguage = savedLanguage;
  document.getElementById("languageSelect").value = currentLanguage;
}

document.getElementById("currentYear").textContent = new Date().getFullYear();
initLanguage();
setupEvents();
setupProfile();
initLinks();
applyTranslations();
