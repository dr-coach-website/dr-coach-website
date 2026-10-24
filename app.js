/**
 * ==============================================================================
 *                DR & COACH - Application Engine (app.js)
 * ==============================================================================
 * محرك تشغيل الموقع والتفاعل مع الإعدادات والذكاء الاصطناعي ووسائل الدفع
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.DR_COACH_CONFIG || {};

  // 1. تطبيق البيانات الأساسية
  applyBasicInfo(config);

  // 2. تفعيل روابط السوشيال ميديا
  renderSocialLinks(config.socialMedia || []);

  // 3. تفعيل زر الواتساب العائم
  setupWhatsApp(config.whatsapp || {});

  // 4. عرض البرامج البشرية (رياضية وتغذوية وVIP)
  renderHumanPrograms(config);

  // 5. تهيئة نظام وسائل الدفع والنافذة المنبثقة
  setupPaymentModal(config);

  // 6. تهيئة المساعد الذكي Google Gemini
  setupGeminiAIChat(config.geminiAI || {});

  // 7. تشغيل حاسبة السعرات والماكروز
  setupCalorieCalculator();

  // 8. تشغيل الأسئلة الشائعة والقوائم
  setupFAQ(config.faqs || []);
  setupNavigation();
});

/* ==============================================================================
   1. تطبيق البيانات الأساسية
============================================================================== */
function applyBasicInfo(config) {
  const info = config.siteInfo || {};

  // الشعار
  const logoElements = document.querySelectorAll(".brand-logo-img");
  logoElements.forEach(el => {
    el.src = info.logoPath || "assets/logo.png";
    el.alt = info.brandName || "DR & COACH";
  });

  // العناوين والنصوص
  const brandTitles = document.querySelectorAll(".dyn-brand-name");
  brandTitles.forEach(el => el.textContent = info.brandName || "DR & COACH");

  const brandTaglines = document.querySelectorAll(".dyn-brand-tagline");
  brandTaglines.forEach(el => el.textContent = info.tagline || "");

  const siteDescs = document.querySelectorAll(".dyn-brand-desc");
  siteDescs.forEach(el => el.textContent = info.description || "");

  const phoneEls = document.querySelectorAll(".dyn-phone");
  phoneEls.forEach(el => el.textContent = info.phoneDisplay || "");

  const emailEls = document.querySelectorAll(".dyn-email");
  emailEls.forEach(el => el.textContent = info.email || "");

  const locationEls = document.querySelectorAll(".dyn-location");
  locationEls.forEach(el => el.textContent = info.location || "");
}

/* ==============================================================================
   2. عرض روابط السوشيال ميديا
============================================================================== */
function renderSocialLinks(links) {
  const containers = document.querySelectorAll(".dyn-social-container");
  if (!containers.length) return;

  const html = links.map(link => `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-btn" title="${link.title}">
      <i class="${link.iconClass}"></i>
    </a>
  `).join("");

  containers.forEach(c => c.innerHTML = html);
}

/* ==============================================================================
   3. إعدادات الواتساب
============================================================================== */
function setupWhatsApp(waConfig) {
  const phone = waConfig.phoneNumber || "201000000000";
  const defMsg = encodeURIComponent(waConfig.defaultMessage || "مرحباً دكتور & كوتش");
  const waUrl = `https://wa.me/${phone}?text=${defMsg}`;

  // الأزرار العامة للواتساب
  const waLinks = document.querySelectorAll(".dyn-wa-link");
  waLinks.forEach(el => {
    el.href = waUrl;
    el.target = "_blank";
  });

  // الزر العائم
  const floatingBtn = document.getElementById("floatingWhatsApp");
  if (floatingBtn) {
    if (waConfig.showFloatingButton !== false) {
      floatingBtn.href = waUrl;
      floatingBtn.style.display = "flex";
    } else {
      floatingBtn.style.display = "none";
    }
  }
}

/* ==============================================================================
   4. عرض البرامج البشرية (رياضي، تغذوي، VIP)
============================================================================== */
function renderHumanPrograms(config) {
  // عرض باقة VIP
  const vip = config.vipProgram;
  const vipContainer = document.getElementById("vipProgramContainer");
  if (vip && vipContainer) {
    vipContainer.innerHTML = `
      <div class="vip-card">
        <div class="vip-badge">${vip.badge}</div>
        <div class="vip-grid">
          <div class="vip-info">
            <h3 class="vip-title">${vip.title}</h3>
            <div class="vip-subtitle">${vip.subtitle}</div>
            <p class="vip-desc">${vip.description}</p>
            <ul class="vip-features-list">
              ${vip.features.map(f => `<li><i class="fas fa-check-circle"></i> <span>${f}</span></li>`).join("")}
            </ul>
          </div>
          <div class="vip-price-box">
            <span class="old-price">${vip.originalPrice}</span>
            <div class="price-tag">${vip.price}</div>
            <div class="duration"><i class="far fa-clock"></i> ${vip.duration}</div>
            <button class="btn-vip btn-open-payment" 
                    data-plan-id="${vip.id}" 
                    data-plan-name="${vip.title}" 
                    data-plan-price="${vip.price}">
              <i class="fas fa-crown"></i> اشترك في باقة VIP الآن
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // عرض البرامج العادية
  const sports = config.sportsPrograms || [];
  const nutrition = config.nutritionPrograms || [];
  const gridContainer = document.getElementById("programsGrid");

  function displayGrid(items, categoryType) {
    if (!gridContainer) return;
    gridContainer.innerHTML = items.map(p => `
      <div class="program-card" data-category="${categoryType}">
        <span class="card-badge">${p.badge || "برنامج معتمد"}</span>
        <h4 class="program-title">${p.title}</h4>
        <div class="program-duration"><i class="far fa-clock"></i> مدة البرنامج: ${p.duration}</div>
        <p class="program-desc">${p.description}</p>
        <ul class="program-features">
          ${p.features.map(f => `<li><i class="fas fa-check"></i> <span>${f}</span></li>`).join("")}
        </ul>
        <div class="program-footer">
          <div class="program-price">
            <span class="original-price">${p.originalPrice}</span>
            <span class="current-price">${p.price}</span>
          </div>
          <button class="btn-card-subscribe btn-open-payment" 
                  data-plan-id="${p.id}" 
                  data-plan-name="${p.title}" 
                  data-plan-price="${p.price}">
            <i class="fas fa-lock"></i> اشترك الآن
          </button>
        </div>
      </div>
    `).join("");

    attachPaymentButtons(config);
  }

  // التبديل بين الرياضي والتغذوي
  const subTabBtns = document.querySelectorAll(".sub-tab-btn");
  subTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      subTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-target");
      if (target === "sports") {
        displayGrid(sports, "sports");
      } else if (target === "nutrition") {
        displayGrid(nutrition, "nutrition");
      } else {
        displayGrid([...sports, ...nutrition], "all");
      }
    });
  });

  // العرض الافتراضي
  displayGrid(sports, "sports");
}

/* ==============================================================================
   5. نافذة وسائل الدفع
============================================================================== */
let currentSelectedPlan = { name: "برنامج تدريب واستشارة", price: "750 ج.م" };

function setupPaymentModal(config) {
  const modalOverlay = document.getElementById("paymentModalOverlay");
  const btnClose = document.getElementById("btnClosePaymentModal");
  const methodsContainer = document.getElementById("paymentMethodsContainer");

  if (!modalOverlay) return;

  // إغلاق النافذة
  if (btnClose) {
    btnClose.addEventListener("click", () => modalOverlay.classList.remove("active"));
  }
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove("active");
  });

  // عرض وسائل الدفع
  const methods = config.paymentMethods || [];
  if (methodsContainer) {
    methodsContainer.innerHTML = methods.map(pm => `
      <div class="payment-method-card">
        <div class="pm-header">
          <div class="pm-title">
            <i class="${pm.icon}" style="color: ${pm.color}"></i>
            <span>${pm.name}</span>
          </div>
          <span class="pm-badge">${pm.badge}</span>
        </div>
        ${pm.accountNumber ? `
          <div class="pm-account-row">
            <div>
              <small style="color: #64748b; display: block; font-size: 0.75rem;">رقم الحساب / المحفظة:</small>
              <span class="pm-account-val" id="pm_val_${pm.id}">${pm.accountNumber}</span>
            </div>
            <button class="btn-copy" onclick="copyToClipboard('${pm.accountNumber}', this)">
              <i class="far fa-copy"></i> نسخ
            </button>
          </div>
        ` : ''}
        ${pm.paymentLink ? `
          <div style="margin: 8px 0;">
            <a href="${pm.paymentLink}" target="_blank" class="btn-primary" style="padding: 6px 14px; font-size: 0.85rem; width: 100%; justify-content: center;">
              <i class="fas fa-external-link-alt"></i> الانتقال لصفحة الدفع الإلكتروني
            </a>
          </div>
        ` : ''}
        <p class="pm-instructions">${pm.instructions}</p>
      </div>
    `).join("");
  }

  // زر إرسال الإيصال عبر الواتساب
  const btnConfirmWa = document.getElementById("btnConfirmPaymentWa");
  if (btnConfirmWa) {
    btnConfirmWa.addEventListener("click", () => {
      const phone = config.whatsapp?.phoneNumber || "201000000000";
      const message = `مرحباً دكتور & كوتش، قمت بالتحويل للاشتراك في [${currentSelectedPlan.name}] بقيمة [${currentSelectedPlan.price}]. مرفق صورة إشعار التحويل لتفعيل الاشتراك.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  attachPaymentButtons(config);
}

function attachPaymentButtons(config) {
  const buttons = document.querySelectorAll(".btn-open-payment");
  const modalOverlay = document.getElementById("paymentModalOverlay");
  const modalPlanName = document.getElementById("modalSelectedPlanName");
  const modalPlanPrice = document.getElementById("modalSelectedPlanPrice");

  buttons.forEach(btn => {
    btn.onclick = () => {
      currentSelectedPlan = {
        id: btn.getAttribute("data-plan-id"),
        name: btn.getAttribute("data-plan-name"),
        price: btn.getAttribute("data-plan-price")
      };

      if (modalPlanName) modalPlanName.textContent = currentSelectedPlan.name;
      if (modalPlanPrice) modalPlanPrice.textContent = currentSelectedPlan.price;
      if (modalOverlay) modalOverlay.classList.add("active");
    };
  });
}

// دالة نسخ النصوص
window.copyToClipboard = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = `<i class="fas fa-check" style="color: #10b981;"></i> تم النسخ!`;
    setTimeout(() => {
      btnElement.innerHTML = originalText;
    }, 2000);
  }).catch(() => {
    alert("الرقم هو: " + text);
  });
};

/* ==============================================================================
   6. شات الذكاء الاصطناعي (Google Gemini Integration)
============================================================================== */
function setupGeminiAIChat(aiConfig) {
  const chatBody = document.getElementById("aiChatBody");
  const chatInput = document.getElementById("aiChatInput");
  const btnSend = document.getElementById("btnSendAi");
  const quickQuestions = document.querySelectorAll(".quick-q-btn");
  const apiKeyStatusEl = document.getElementById("geminiKeyStatus");

  // التحقق من وجود مفتاح في config أو في localStorage
  let apiKey = aiConfig.apiKey || localStorage.getItem("DR_COACH_GEMINI_KEY") || "";

  if (apiKeyStatusEl) {
    if (apiKey && apiKey.trim().length > 10) {
      apiKeyStatusEl.innerHTML = `<span style="color: #10b981;"><i class="fas fa-check-circle"></i> متصل بـ Google Gemini</span>`;
    } else {
      apiKeyStatusEl.innerHTML = `<span style="color: #f59e0b;"><i class="fas fa-info-circle"></i> نظام الرد الذكي التجريبي</span>`;
    }
  }

  // إرسال السؤال
  async function handleSend(userText) {
    const text = userText || chatInput.value.trim();
    if (!text) return;

    // إضافة رسالة المستخدم في الشات
    appendMessage(text, "user");
    if (chatInput) chatInput.value = "";

    // إضافة مؤشر جاري الكتابة
    const typingId = showTypingIndicator();

    try {
      if (apiKey && apiKey.trim().length > 10) {
        // اتصال حقيقي بـ Google Gemini API
        const botReply = await callGeminiAPI(text, apiKey, aiConfig);
        removeTypingIndicator(typingId);
        appendMessage(botReply, "bot");
      } else {
        // الرد الذكي المدمج (Fallback محاكي للتغذية والرياضة)
        await new Promise(r => setTimeout(r, 1000));
        removeTypingIndicator(typingId);
        const botReply = getSmartNutritionFallback(text);
        appendMessage(botReply, "bot");
      }
    } catch (err) {
      removeTypingIndicator(typingId);
      console.error("Gemini Error:", err);
      // في حال وجود مشكلة في المفتاح نستخدم الرد المدمج وننبه المستخدم
      const fallback = getSmartNutritionFallback(text);
      appendMessage(fallback + "\n\n*(ملاحظة: تأكد من صحة مفتاح Google Gemini API في ملف config.js)*", "bot");
    }
  }

  if (btnSend) {
    btnSend.addEventListener("click", () => handleSend());
  }

  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }

  quickQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-question");
      handleSend(q);
    });
  });

  function appendMessage(text, sender) {
    if (!chatBody) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    // تحويل الأسطر الجديدة لـ <br>
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    if (!chatBody) return null;
    const id = "typing_" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "chat-bubble typing";
    div.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <span style="font-size: 0.8rem; color: #64748b; margin-right: 6px;">جاري التفكير وصياغة النصيحة...</span>
    `;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // استدعاء Google Gemini API
  async function callGeminiAPI(prompt, key, configObj) {
    const model = configObj.model || "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const systemText = configObj.systemInstruction || "أنت دكتور وكوتش متخصص في التغذية الرياضية والتمارين.";

    const bodyData = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemText}\n\nسؤال المستخدم: ${prompt}` }]
        }
      ]
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "عذراً، لم أستطع استرجاع الإجابة حالياً.";
  }

  // محرك الإجابات الذكية الشامل في حال عدم وجود API Key
  function getSmartNutritionFallback(query) {
    const q = query.toLowerCase();

    if (q.includes("بروتين") || q.includes("protein")) {
      return `💪 **حساب احتياج البروتين للرياضيين:**\n
• **للضخامة العضلية أو التنشيف:** يحتاج الجسم عادة من **1.6 إلى 2.2 جرام بروتين** لكل كيلوجرام من وزن جسمك يومياً.\n
• **أفضل مصادر طبيعية:** صدور الدجاج، البيض، اللحم البقري الصافي، السمك والتونة، الجبن القريش، والعدس.\n
• **نصيحة دكتور & كوتش:** وزّع حصتك اليومية على 3 إلى 5 وجبات بفاصل 3-4 ساعات لتحفيز التخليق العضلي (Muscle Protein Synthesis) بأعلى كفاءة!`;
    }

    if (q.includes("تنشيف") || q.includes("حرق دهون") || q.includes("تخسيس") || q.includes("كرش")) {
      return `🔥 **أهم قواعد التنشيف وخسارة الدهون بدون فقدان عضلات:**\n
1. **عجز سعرات معتدل:** قلل 300 إلى 500 سعرة حرارية فقط من احتياجك اليومي (TDEE).\n
2. **رفع نسبة البروتين:** حافظ على 2.0 - 2.2 جم بروتين لكل كجم لحماية العضلات من الهدم.\n
3. **الاستمرار في رفع الأوزان:** لا تخفف الأوزان بحجة التنشيف؛ حافظ على شدة التمرين.\n
4. **شرب الماء والنوم:** ما لا يقل عن 3.5 لتر ماء و7-8 ساعات نوم عميق لتحفيز هرمون النمو.\n
💡 للاشتراك في برنامج التنشيف الطبي المخصص لك، تفضل بتصفح باقاتنا أو تواصل معنا عبر الواتساب.`;
    }

    if (q.includes("ضخامة") || q.includes("بناء عضلات") || q.includes("زيادة وزن") || q.includes("تضخيم")) {
      return `🏋️‍♂️ **استراتيجية الضخامة العضلية الصافية (Clean Bulk):**\n
• **فائض السعرات:** أضف من 250 إلى 400 سعرة حرارية فوق احتياج الثبات لتجنب تراكم الدهون الزائدة.\n
• **مبدأ الزيادة الدورية للأحمال (Progressive Overload):** احرص على زيادة الوزن أو العدادات أسبوعياً بتكنيك سليم.\n
• **الكربوهيدرات المعقدة:** مثل الشوفان، الأرز البسمتي، والبطاطا، فهي وقود تدريبك الأساسي ومخازن الجليكوجين العضلي.\n
• مكملات مقترحة: الكرياتين مونوهيدرات والواي بروتين بعد مراجعة نظامك اليومي.`;
    }

    if (q.includes("قبل التمرين") || q.includes("بعد التمرين") || q.includes("وجبة")) {
      return `🥗 **توقيت الوجبات الرياضية (Nutrient Timing):**\n
• **قبل التمرين بساعتين:** وجبة متكاملة من كاربوهيدرات معقدة (أرز أو شوفان) + بروتين سريع الامتصاص (دجاج أو بياض بيض).\n
• **قبل التمرين بنصف ساعة (سناك سريع):** موزة أو حبتين تمر + قهوة سادة لرفع التركيز والأداء.\n
• **بعد التمرين:** وجبة تحتوي على بروتين سريع وكاربوهيدرات لشحن مخازن الجليكوجين ومساعدة العضلات على الاستشفاء السريع.`;
    }

    if (q.includes("كرياتين") || q.includes("creatine") || q.includes("مكمل")) {
      return `⚡ **كل ما تحتاج معرفته عن الكرياتين مونوهيدرات:**\n
• يُعد الكرياتين المكمل الأكثر دراسة وأماناً عالمياً؛ يزيد مخازن الطاقة (ATP) وقوة الرفعات والكتلة العضلية.\n
• **الجرعة الموصى بها:** 5 جرام يومياً في أي وقت ثابت (يُفضل بعد التمرين أو صباحاً مع شرب كميات كافية من الماء).\n
• مرحلة التحميل (Loading Phase) اختيارية، وأخذ 5 جرام يومياً بانتظام يكفي للوصول للتشبع خلال أسبوعين إلى 3 أسابيع.`;
    }

    if (q.includes("ثبات الوزن") || q.includes("الحرق واقف") || q.includes("بلاتو")) {
      return `🩺 **أسباب وحلول ثبات الوزن (Weight Loss Plateau):**\n
1. **إعادة حساب السعرات:** مع نزول وزنك يقل استهلاك جسمك للطاقة (BMR)، لذلك تحتاج لضبط السعرات طبقاً لوزنك الجديد.\n
2. **احتباس الماء:** التوتر وقلة النوم أو شدة التمرين قد ترفع هرمون الكورتيزول مسببة احتباس ماء مؤقت يغطي نزول الدهون.\n
3. **أسبوع إعادة التغذية (Refeed / Diet Break):** رفع الكاربوهيدرات ليومي راحة ينعش هرمون اللبتين ومعدل الأيض.\n
💡 يسعدنا تشخيص حالتك بدقة عبر باقة التغذية العلاجية الخاصة بنا!`;
    }

    // إجابة عامة ترحيبية
    return `أهلاً بك! بصفتي المساعد الذكي لـ **DR & COACH**، يسعدني تقديم المشورة الطبية والرياضية.\n
سؤالك ممتاز! للحصول على خطة دقيقة متناسبة مع طولك ووزنك ونشاطك اليومي، يمكنك تجربة **حاسبة السعرات** أدناه أو تصفح **برامجنا التدريبية والتغذوية** المعتمدة بإشرافنا المباشر! كما يسعدنا تواصلك معنا مباشرة عبر الواتساب لأي استفسار خاص.`;
  }
}

/* ==============================================================================
   7. حاسبة السعرات الحرارية والماكروز التفاعلية (TDEE Calculator)
============================================================================== */
function setupCalorieCalculator() {
  const form = document.getElementById("calorieCalcForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const gender = document.getElementById("calcGender").value;
    const age = parseFloat(document.getElementById("calcAge").value);
    const weight = parseFloat(document.getElementById("calcWeight").value);
    const height = parseFloat(document.getElementById("calcHeight").value);
    const activity = parseFloat(document.getElementById("calcActivity").value);
    const goal = document.getElementById("calcGoal").value;

    if (!age || !weight || !height) {
      alert("يرجى ملء جميع الحقول المطلوبة (العمر، الوزن، الطول)");
      return;
    }

    // معادلة ميفلين-سانت جور (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // TDEE = BMR * معدل النشاط
    let tdee = Math.round(bmr * activity);
    let targetCalories = tdee;

    if (goal === "cut") {
      targetCalories = tdee - 450; // عجز لخسارة الدهون
    } else if (goal === "bulk") {
      targetCalories = tdee + 350; // زيادة للبناء العضلي
    }

    // توزيع الماكروز
    // البروتين: 2 جرام لكل كيلو
    const proteinGrams = Math.round(weight * 2.0);
    const proteinCalories = proteinGrams * 4;

    // الدهون: 0.8 جرام لكل كيلو
    const fatGrams = Math.round(weight * 0.85);
    const fatCalories = fatGrams * 9;

    // النشويات: باقي السعرات
    const remainingCalories = Math.max(targetCalories - (proteinCalories + fatCalories), 400);
    const carbGrams = Math.round(remainingCalories / 4);

    // حساب الـ BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    // عرض النتائج
    const resCalEl = document.getElementById("calcResultCalories");
    const resProtEl = document.getElementById("calcResultProtein");
    const resCarbEl = document.getElementById("calcResultCarbs");
    const resFatEl = document.getElementById("calcResultFat");
    const resBmiEl = document.getElementById("calcResultBMI");

    if (resCalEl) resCalEl.textContent = targetCalories.toLocaleString() + " سعرة";
    if (resProtEl) resProtEl.textContent = proteinGrams + " جم";
    if (resCarbEl) resCarbEl.textContent = carbGrams + " جم";
    if (resFatEl) resFatEl.textContent = fatGrams + " جم";
    if (resBmiEl) resBmiEl.textContent = `مؤشر الكتلة (BMI): ${bmi}`;
  });
}

/* ==============================================================================
   8. الأسئلة الشائعة والقوائم
============================================================================== */
function setupFAQ(faqs) {
  const container = document.getElementById("faqContainer");
  if (!container || !faqs.length) return;

  container.innerHTML = faqs.map((faq, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}">
      <div class="faq-question">
        <span>${faq.q}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-answer">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join("");

  const items = container.querySelectorAll(".faq-item");
  items.forEach(item => {
    const q = item.querySelector(".faq-question");
    q.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      items.forEach(i => i.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

function setupNavigation() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
      } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "100%";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "#ffffff";
        navLinks.style.padding = "20px";
        navLinks.style.borderBottom = "1px solid #e2e8f0";
      }
    });
  }

  // التبديل بين القسم البشري والذكاء الاصطناعي من الزرين الرئيسيين
  const tabHuman = document.getElementById("tabBtnHuman");
  const tabAI = document.getElementById("tabBtnAI");
  const sectionHuman = document.getElementById("humanSection");
  const sectionAI = document.getElementById("aiSection");

  if (tabHuman && tabAI && sectionHuman && sectionAI) {
    tabHuman.addEventListener("click", () => {
      tabHuman.classList.add("active");
      tabAI.classList.remove("active");
      sectionHuman.scrollIntoView({ behavior: "smooth" });
    });

    tabAI.addEventListener("click", () => {
      tabAI.classList.add("active");
      tabHuman.classList.remove("active");
      sectionAI.scrollIntoView({ behavior: "smooth" });
    });
  }
}
