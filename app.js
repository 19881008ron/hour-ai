const whatsappNumber = "447835210931";

const translations = {
  en: {
    nav: { orders: "Orders", courses: "Courses", support: "Support", profile: "Profile", register: "Register" },
    hero: {
      eyebrow: "AI editing training + order access",
      title: "Learn AI video editing, pass the test, and apply for real task orders.",
      lede: "Hour AI trains beginners through a practical 7-day path, then helps qualified editors apply for C, B, and A level AI video editing tasks.",
      ctaPrimary: "Talk to an advisor",
      ctaSecondary: "View orders",
      disclaimer: "Earnings are not guaranteed. Order access depends on training progress, testing, skill level, quality, and available demand."
    },
    slides: [
      { kicker: "Beginner path", title: "Start from C-Level AI editing tasks.", text: "Learn template-based editing workflows and apply for simple tasks after passing the skill test." },
      { kicker: "Skill upgrade", title: "Move from C to B to A as your work improves.", text: "Higher levels unlock more complex projects, stronger review standards, and higher task ranges." },
      { kicker: "Remote workflow", title: "Study online and submit task work remotely.", text: "The platform is designed for learners who want a practical AI skill they can practice from anywhere." }
    ],
    orders: { eyebrow: "Order marketplace preview", title: "C, B, and A level AI editor orders", text: "Click an order to review the task content, pay range, estimated time, and delivery requirements." },
    reviews: { eyebrow: "Learner feedback", title: "Reviews by AI editor level", text: "Placeholder reviews are included for layout. Replace them with verified learner feedback before full launch." },
    support: { eyebrow: "Customer support", title: "Talk to Hour AI before you enroll.", text: "Ask about course levels, task examples, testing rules, available languages, and whether this path fits your goals.", whatsapp: "Chat on WhatsApp", live: "Open online consultation", note: "Online consultation is currently routed to WhatsApp while live chat is being connected." },
    profile: { eyebrow: "AI editor profile", title: "Register, track your level, and prepare for testing.", text: "The MVP stores sample profile details in your browser. A secure database can be connected in phase two.", cTitle: "C-Level AI Editor", cText: "Beginner-friendly workflow, template edits, simple delivery checklists.", bTitle: "B-Level AI Editor", bText: "Commercial short videos, better pacing, stronger revisions and review standards.", aTitle: "A-Level AI Editor", aText: "Advanced projects, team review, project management and agent eligibility.", open: "Create sample profile" },
    courses: { eyebrow: "Course levels", title: "Choose your AI editor training level", text: "Payments are not active in this MVP. Course buttons send users to consultation first.", consult: "Consult before enrolling" },
    modal: { content: "Content", pay: "Pay range", time: "Estimated time", requirements: "Requirements", ask: "Ask about this order" },
    profileModal: { title: "Create your Hour AI profile", name: "Name", email: "Email", level: "Target level", save: "Save sample profile" },
    footer: { text: "AI video editing training, skill testing, and task marketplace access.", support: "Support", legal: "Earnings disclaimer" },
    labels: { pay: "Pay", time: "Time", level: "Level" },
    legal: "Important: Hour AI does not guarantee earnings, jobs, or order volume. Training results vary by effort, skill, testing performance, quality, and available demand.",
    saved: "Target level: {level}. This sample profile is stored in your browser."
  },
  zh: {
    nav: { orders: "订单", courses: "课程", support: "客服", profile: "个人中心", register: "注册" },
    hero: {
      eyebrow: "AI剪辑培训 + 订单申请",
      title: "学习 AI 视频剪辑，通过测试后申请真实任务订单。",
      lede: "Hour AI 为新手提供 7 天实操学习路径，帮助合格学员申请 C、B、A 级 AI 视频剪辑任务。",
      ctaPrimary: "咨询顾问",
      ctaSecondary: "查看订单",
      disclaimer: "收入不作保证。订单申请取决于学习进度、测试结果、技能等级、交付质量和订单需求。"
    },
    slides: [
      { kicker: "新手路径", title: "从 C 级 AI 剪辑任务开始。", text: "学习模板化剪辑流程，通过技能测试后可申请简单任务。" },
      { kicker: "技能升级", title: "随着作品质量提升，从 C 升到 B 再到 A。", text: "更高等级对应更复杂项目、更严格审核和更高任务区间。" },
      { kicker: "远程流程", title: "线上学习，远程提交任务。", text: "适合想学习可实践 AI 技能的新手用户。" }
    ],
    orders: { eyebrow: "订单大厅预览", title: "C、B、A 级 AI 师订单", text: "点击订单查看任务内容、酬劳区间、预计时长和交付要求。" },
    reviews: { eyebrow: "学员反馈", title: "按 AI 师等级展示评价", text: "当前为页面占位评价，正式上线前请替换为真实可验证评价。" },
    support: { eyebrow: "客服系统", title: "报名之前，先和 Hour AI 沟通。", text: "你可以咨询课程等级、任务样例、测试规则、语言支持和是否适合你。", whatsapp: "WhatsApp 咨询", live: "打开在线咨询", note: "在线咨询目前先跳转到 WhatsApp，后续可接入实时客服系统。" },
    profile: { eyebrow: "AI 师个人资料", title: "注册、查看等级，并准备测试。", text: "MVP 版本会把示例资料存在浏览器中，第二阶段可接入安全数据库。", cTitle: "C级 AI师", cText: "新手友好流程、模板剪辑、简单交付清单。", bTitle: "B级 AI师", bText: "商业短视频、更好节奏、更强修改和审核标准。", aTitle: "A级 AI师", aText: "高级项目、团队审核、项目管理和代理资格。", open: "创建示例资料" },
    courses: { eyebrow: "课程等级", title: "选择你的 AI 师培训等级", text: "MVP 暂未启用在线支付，课程按钮先跳转咨询。", consult: "报名前咨询" },
    modal: { content: "内容", pay: "酬劳区间", time: "预计时长", requirements: "交付要求", ask: "咨询这个订单" },
    profileModal: { title: "创建 Hour AI 个人资料", name: "姓名", email: "邮箱", level: "目标等级", save: "保存示例资料" },
    footer: { text: "AI 视频剪辑培训、技能测试和订单大厅申请。", support: "客服", legal: "收入免责声明" },
    labels: { pay: "酬劳", time: "时长", level: "等级" },
    legal: "重要提示：Hour AI 不保证收入、工作机会或订单数量。学习结果取决于努力程度、技能、测试表现、交付质量和实际订单需求。",
    saved: "目标等级：{level}。该示例资料保存在你的浏览器中。"
  },
  es: {
    nav: { orders: "Pedidos", courses: "Cursos", support: "Soporte", profile: "Perfil", register: "Registro" },
    hero: { eyebrow: "Formación AI + acceso a pedidos", title: "Aprende edición de video con AI, aprueba la prueba y solicita tareas reales.", lede: "Hour AI entrena a principiantes con una ruta práctica de 7 días y ayuda a editores calificados a solicitar tareas C, B y A.", ctaPrimary: "Hablar con un asesor", ctaSecondary: "Ver pedidos", disclaimer: "Los ingresos no están garantizados. El acceso depende del progreso, prueba, nivel, calidad y demanda disponible." },
    slides: [
      { kicker: "Ruta inicial", title: "Empieza con tareas C-Level.", text: "Aprende flujos con plantillas y solicita tareas simples tras aprobar la prueba." },
      { kicker: "Mejora", title: "Sube de C a B y A con mejores trabajos.", text: "Los niveles superiores desbloquean proyectos más complejos y mejores rangos." },
      { kicker: "Remoto", title: "Estudia online y entrega tareas a distancia.", text: "Diseñado para aprender una habilidad AI práctica desde cualquier lugar." }
    ],
    orders: { eyebrow: "Vista del mercado", title: "Pedidos para editores C, B y A", text: "Haz clic para ver contenido, pago, tiempo y requisitos." },
    reviews: { eyebrow: "Opiniones", title: "Reseñas por nivel", text: "Opiniones de muestra. Reemplázalas por comentarios verificados antes del lanzamiento." },
    support: { eyebrow: "Soporte", title: "Habla con Hour AI antes de inscribirte.", text: "Pregunta por niveles, ejemplos, reglas de prueba, idiomas y ajuste a tus metas.", whatsapp: "Chat en WhatsApp", live: "Abrir consulta online", note: "La consulta online redirige a WhatsApp mientras se conecta el chat en vivo." },
    profile: { eyebrow: "Perfil AI", title: "Regístrate, sigue tu nivel y prepárate.", text: "El MVP guarda datos de muestra en tu navegador.", cTitle: "Editor C-Level", cText: "Flujo para principiantes, plantillas y checklist simple.", bTitle: "Editor B-Level", bText: "Videos comerciales, mejor ritmo y revisión más fuerte.", aTitle: "Editor A-Level", aText: "Proyectos avanzados, revisión de equipo y elegibilidad de agente.", open: "Crear perfil de muestra" },
    courses: { eyebrow: "Cursos", title: "Elige tu nivel de formación", text: "Los pagos no están activos. Los botones envían a consulta.", consult: "Consultar antes de inscribirme" },
    modal: { content: "Contenido", pay: "Rango de pago", time: "Tiempo estimado", requirements: "Requisitos", ask: "Preguntar por este pedido" },
    profileModal: { title: "Crear perfil Hour AI", name: "Nombre", email: "Email", level: "Nivel objetivo", save: "Guardar perfil" },
    footer: { text: "Formación, prueba de habilidades y acceso a pedidos AI.", support: "Soporte", legal: "Aviso de ingresos" },
    labels: { pay: "Pago", time: "Tiempo", level: "Nivel" },
    legal: "Hour AI no garantiza ingresos, empleo ni volumen de pedidos. Los resultados dependen de esfuerzo, habilidad, prueba, calidad y demanda.",
    saved: "Nivel objetivo: {level}. Este perfil se guarda en tu navegador."
  }
};

translations.fr = cloneWithFallback({
  nav: { orders: "Commandes", courses: "Cours", support: "Support", profile: "Profil", register: "S'inscrire" },
  hero: { eyebrow: "Formation AI + accès aux commandes", title: "Apprenez le montage vidéo AI, réussissez le test et postulez à des tâches réelles.", ctaPrimary: "Parler à un conseiller", ctaSecondary: "Voir les commandes" },
  courses: { consult: "Consulter avant l'inscription" },
  support: { whatsapp: "Discuter sur WhatsApp", live: "Ouvrir la consultation" },
  legal: "Hour AI ne garantit pas les revenus, les emplois ou le volume de commandes."
});
translations.pt = cloneWithFallback({
  nav: { orders: "Pedidos", courses: "Cursos", support: "Suporte", profile: "Perfil", register: "Registrar" },
  hero: { eyebrow: "Treinamento AI + acesso a pedidos", title: "Aprenda edição de vídeo com AI, passe no teste e candidate-se a tarefas reais.", ctaPrimary: "Falar com consultor", ctaSecondary: "Ver pedidos" },
  courses: { consult: "Consultar antes de entrar" },
  support: { whatsapp: "Conversar no WhatsApp", live: "Abrir consulta online" },
  legal: "A Hour AI não garante renda, emprego ou volume de pedidos."
});
translations.ar = cloneWithFallback({
  nav: { orders: "الطلبات", courses: "الدورات", support: "الدعم", profile: "الملف", register: "تسجيل" },
  hero: { eyebrow: "تدريب AI + طلبات", title: "تعلم تحرير الفيديو بالذكاء الاصطناعي، اجتز الاختبار، ثم تقدم لطلبات حقيقية.", ctaPrimary: "تحدث مع مستشار", ctaSecondary: "عرض الطلبات" },
  courses: { consult: "استشارة قبل التسجيل" },
  support: { whatsapp: "محادثة واتساب", live: "فتح الاستشارة" },
  legal: "لا تضمن Hour AI الدخل أو الوظائف أو حجم الطلبات."
});
translations.id = cloneWithFallback({
  nav: { orders: "Order", courses: "Kursus", support: "Bantuan", profile: "Profil", register: "Daftar" },
  hero: { eyebrow: "Pelatihan AI + akses order", title: "Belajar editing video AI, lulus tes, lalu ajukan order nyata.", ctaPrimary: "Bicara dengan advisor", ctaSecondary: "Lihat order" },
  courses: { consult: "Konsultasi sebelum daftar" },
  support: { whatsapp: "Chat WhatsApp", live: "Buka konsultasi online" },
  legal: "Hour AI tidak menjamin pendapatan, pekerjaan, atau jumlah order."
});

const orders = [
  { id: "c1", level: "C", title: "Template short video edit", content: "Create a 25-35 second AI-assisted vertical video from provided clips, captions, and a simple hook.", pay: "$20-$30", time: "1-2 hours", requirements: "Use the provided template, add clean subtitles, keep pacing tight, export 1080x1920 MP4." },
  { id: "c2", level: "C", title: "Product demo subtitle cut", content: "Turn a product screen recording into a short tutorial with captions and basic transitions.", pay: "$20-$30", time: "1-2 hours", requirements: "Follow checklist, remove pauses, add three text callouts, submit source and final file." },
  { id: "b1", level: "B", title: "Commercial Reels package", content: "Produce a conversion-focused short video using AI voiceover, stock visuals, captions, and brand CTA.", pay: "$60-$70", time: "1-2 hours", requirements: "Create stronger hook, align visuals with script, deliver two thumbnail options and editable project." },
  { id: "b2", level: "B", title: "UGC style AI ad edit", content: "Build a 40-second UGC-style ad from script, avatar clip, B-roll, and product screenshots.", pay: "$60-$70", time: "1-2 hours", requirements: "Match brand tone, add animated captions, include CTA, pass quality review." },
  { id: "a1", level: "A", title: "Multi-scene launch video", content: "Create a polished launch video with structured scenes, AI narration, advanced pacing, and revision notes.", pay: "$80-$100", time: "1-2 hours", requirements: "Plan scenes, manage assets, deliver final video, project file, and quality checklist." },
  { id: "a2", level: "A", title: "Team lead review task", content: "Review junior edits, improve one final version, and prepare feedback for the editor group.", pay: "$80-$100", time: "1-2 hours", requirements: "Provide timestamped feedback, correct pacing, validate subtitles, prepare final delivery." }
];

const reviews = [
  { level: "C", name: "Maya R.", role: "C-Level learner", quote: "The checklist made the first AI editing workflow much easier to understand. I knew what to practice each day." },
  { level: "B", name: "Daniel K.", role: "B-Level learner", quote: "The commercial short video lessons helped me improve hooks, pacing, subtitles, and review habits." },
  { level: "A", name: "Aisha M.", role: "A-Level learner", quote: "The advanced path focused on quality control and managing a task from brief to delivery." }
];

const pricing = [
  { level: "C", name: "C-Level AI Editor", price: "$199", items: ["7-day beginner workflow", "Template editing lessons", "C-Level skill test preview", "$20-$30 task range after qualification"] },
  { level: "B", name: "B-Level AI Editor", price: "$599", items: ["Commercial short video workflow", "AI voiceover and pacing", "Quality review training", "$60-$70 task range after qualification"] },
  { level: "A", name: "A-Level AI Editor", price: "$999", items: ["Advanced project workflow", "Team review methods", "Agent eligibility preparation", "$80-$100 task range after qualification"] }
];

let currentLanguage = "en";

function cloneWithFallback(overrides) {
  return deepMerge(JSON.parse(JSON.stringify(translations.en)), overrides);
}

function deepMerge(target, source) {
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
}

function t(path) {
  return path.split(".").reduce((value, key) => value?.[key], translations[currentLanguage]) ?? path;
}

function whatsappLink(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
}

function renderOrders() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = orders.map((order) => `
    <article class="order-card">
      <span class="level-chip chip-${order.level.toLowerCase()}">${order.level}-Level</span>
      <h3>${order.title}</h3>
      <p>${order.content}</p>
      <div class="order-meta">
        <span><strong>${t("labels.pay")}</strong>${order.pay}</span>
        <span><strong>${t("labels.time")}</strong>${order.time}</span>
      </div>
      <button class="button button-secondary full-width" type="button" data-order-id="${order.id}">${t("orders.title").includes("C, B") ? "View details" : "Details"}</button>
    </article>
  `).join("");
}

function renderReviews() {
  const grid = document.getElementById("reviewsGrid");
  grid.innerHTML = reviews.map((review) => `
    <article class="review-card">
      <span class="level-chip chip-${review.level.toLowerCase()}">${review.level}-Level</span>
      <h3>${review.name}</h3>
      <p>${review.role}</p>
      <blockquote>${review.quote}</blockquote>
    </article>
  `).join("");
}

function renderPricing() {
  const grid = document.getElementById("pricingGrid");
  grid.innerHTML = pricing.map((plan) => `
    <article class="price-card">
      <span class="level-chip chip-${plan.level.toLowerCase()}">${plan.level}-Level</span>
      <h3>${plan.name}</h3>
      <div class="price">${plan.price}</div>
      <ul>${plan.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <a class="button button-primary full-width" href="${whatsappLink(`I want to consult about the ${plan.name} course.`)}" target="_blank" rel="noreferrer">${t("courses.consult")}</a>
    </article>
  `).join("");
}

function openOrder(orderId) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  document.getElementById("modalLevel").className = `order-level-pill chip-${order.level.toLowerCase()}`;
  document.getElementById("modalLevel").textContent = `${order.level}-Level`;
  document.getElementById("orderModalTitle").textContent = order.title;
  document.getElementById("modalContent").textContent = order.content;
  document.getElementById("modalPay").textContent = order.pay;
  document.getElementById("modalTime").textContent = order.time;
  document.getElementById("modalRequirements").textContent = order.requirements;
  document.getElementById("modalWhatsapp").href = whatsappLink(`I want to ask about this Hour AI order: ${order.title}`);
  openModal("orderModal");
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function setupCarousel() {
  const slides = [...document.querySelectorAll(".promo-slide")];
  const dots = [...document.querySelectorAll(".dot")];
  let activeIndex = 0;

  function goToSlide(index) {
    activeIndex = index;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => goToSlide(Number(dot.dataset.slide)));
  });

  window.setInterval(() => goToSlide((activeIndex + 1) % slides.length), 5000);
}

function setupProfile() {
  const saved = JSON.parse(localStorage.getItem("hourAiProfile") || "null");
  if (saved) showSavedProfile(saved);

  document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profile = {
      name: formData.get("name"),
      email: formData.get("email"),
      level: formData.get("level")
    };
    localStorage.setItem("hourAiProfile", JSON.stringify(profile));
    showSavedProfile(profile);
  });
}

function showSavedProfile(profile) {
  const badge = document.getElementById("savedBadge");
  badge.textContent = profile.level;
  badge.className = `level-badge level-${profile.level.toLowerCase()}`;
  document.getElementById("savedName").textContent = profile.name;
  document.getElementById("savedMeta").textContent = t("saved").replace("{level}", `${profile.level}-Level`) + ` ${profile.email}`;
  document.getElementById("savedProfile").hidden = false;
}

function setupEvents() {
  document.getElementById("languageSelect").addEventListener("change", (event) => {
    currentLanguage = event.target.value;
    applyTranslations();
  });

  document.body.addEventListener("click", (event) => {
    const orderButton = event.target.closest("[data-order-id]");
    if (orderButton) openOrder(orderButton.dataset.orderId);
  });

  document.querySelectorAll("[data-close-modal]").forEach((item) => item.addEventListener("click", () => closeModal("orderModal")));
  document.querySelectorAll("[data-open-profile]").forEach((item) => item.addEventListener("click", () => openModal("profileModal")));
  document.querySelectorAll("[data-close-profile]").forEach((item) => item.addEventListener("click", () => closeModal("profileModal")));

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

setupEvents();
setupCarousel();
setupProfile();
initLinks();
applyTranslations();
