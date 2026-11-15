// ======================================
// 1- ظهور الأقسام عند التمرير
// ======================================
const animationStyle = document.createElement("style");
animationStyle.textContent =   .reveal { opacity: 0; transform: translateY(25px); transition: opacity .7s ease, transform .7s ease; }   .reveal.show { opacity: 1; transform: translateY(0); }   @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }  ;
document.head.appendChild(animationStyle);

const elements = document.querySelectorAll(
".hero, .section, .closing-section, .students-section, .info-card, .timeline-item, .gallery-item, .history-event, .history-fact"
);
if ("IntersectionObserver" in window) {
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("show");
observer.unobserve(entry.target);
}
});
}, { threshold: 0.08 });
elements.forEach((element) => {
element.classList.add("reveal");
observer.observe(element);
});
} else {
elements.forEach((element) => element.classList.add("show"));
}

// ======================================
// 2- زر الرجوع إلى أعلى الصفحة
// ======================================
const topButton = document.createElement("button");
topButton.textContent = "↑";
topButton.id = "backToTop";
topButton.type = "button";
topButton.title = "الرجوع لأعلى الصفحة";
topButton.setAttribute("aria-label", "الرجوع لأعلى الصفحة");
topButton.style.cssText =   position: fixed; bottom: 20px; left: 16px; width: 40px; height: 40px;   padding: 0; border-radius: 50%; background: #D4AF37; color: #031b15;   font-size: 22px; font-weight: bold; display: none; align-items: center;   justify-content: center; border: 1px solid #f5d76e;   box-shadow: 0 3px 12px rgba(212,175,55,.3); cursor: pointer;   z-index: 9999; line-height: 1;  ;
document.body.appendChild(topButton);
window.addEventListener("scroll", () => {
topButton.style.display = window.scrollY > 300 ? "flex" : "none";
}, { passive: true });
topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ======================================
// 3- قائمة التنقل للموبايل
// ======================================
const nav = document.querySelector("#mainNav, .main-nav");
const menuButton = document.querySelector("#menuToggle, .menu-toggle");
if (nav && menuButton) {
menuButton.type = "button";
menuButton.setAttribute("aria-controls", "mainNav");
menuButton.setAttribute("aria-expanded", "false");
menuButton.setAttribute("aria-label", "فتح القائمة");

const closeMenu = () => {  
    nav.classList.remove("active");  
    menuButton.textContent = "☰";  
    menuButton.setAttribute("aria-expanded", "false");  
    menuButton.setAttribute("aria-label", "فتح القائمة");  
};  

menuButton.addEventListener("click", () => {  
    const isOpen = nav.classList.toggle("active");  
    menuButton.textContent = isOpen ? "✕" : "☰";  
    menuButton.setAttribute("aria-expanded", String(isOpen));  
    menuButton.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");  
});  
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));  
document.addEventListener("click", (event) => {  
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();  
});  
document.addEventListener("keydown", (event) => {  
    if (event.key === "Escape") closeMenu();  
});  
window.addEventListener("resize", () => {  
    if (window.innerWidth > 768) closeMenu();  
});

}

// ======================================
// 4- معرض الصور التفاعلي
// ======================================
const lightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCount = document.getElementById("lightboxCount");
const galleryButtons = [...document.querySelectorAll(".gallery-open")];
let currentImageIndex = 0;
let lastFocusedElement = null;

const getGalleryCaption = (button) => {
const caption = button.closest(".gallery-item")?.querySelector("figcaption");
return caption ? caption.innerText.replace(/مصدر الصورة|مصدر الصور التاريخية/g, "").trim() : "";
};

const showGalleryImage = (index) => {
if (!galleryButtons.length) return;
currentImageIndex = (index + galleryButtons.length) % galleryButtons.length;
const image = galleryButtons[currentImageIndex].querySelector("img");
lightboxImage.src = image.currentSrc || image.src;
lightboxImage.alt = image.alt;
lightboxCaption.textContent = getGalleryCaption(galleryButtons[currentImageIndex]);
lightboxCount.textContent = ${currentImageIndex + 1} / ${galleryButtons.length};
};

const closeLightbox = () => {
if (!lightbox || lightbox.hidden) return;
lightbox.hidden = true;
document.body.classList.remove("lightbox-open");
if (lastFocusedElement) lastFocusedElement.focus();
};

galleryButtons.forEach((button, index) => {
button.addEventListener("click", () => {
lastFocusedElement = button;
showGalleryImage(index);
lightbox.hidden = false;
document.body.classList.add("lightbox-open");
lightbox.querySelector(".lightbox-close").focus();
});
});
lightbox?.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox?.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(currentImageIndex - 1));
lightbox?.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(currentImageIndex + 1));
lightbox?.addEventListener("click", (event) => {
if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
if (!lightbox || lightbox.hidden) return;
if (event.key === "Escape") closeLightbox();
if (event.key === "ArrowLeft") showGalleryImage(currentImageIndex + 1);
if (event.key === "ArrowRight") showGalleryImage(currentImageIndex - 1);
});

// ======================================
// 5- الخريطة التفاعلية
// ======================================
const mapPlaces = {
portsaid: {
title: "بورسعيد",
text: "مدينة ساحلية تقع عند المدخل الشمالي لقناة السويس. يظهر موقعها على الخريطة لتوضيح امتداد القناة من الشمال إلى الجنوب."
},
ismailia: {
title: "الإسماعيلية",
text: "تقع الإسماعيلية على الضفة الغربية لقناة السويس تقريبًا في منتصف مجراها، وتُعد من المدن الرئيسية المطلة على القناة."
},
suez: {
title: "مدينة السويس",
text: "تقع عند الطرف الجنوبي لقناة السويس، بالقرب من خليج السويس، وهي من المدن المرتبطة جغرافيًا بأحداث أكتوبر."
},
sinai: {
title: "شبه جزيرة سيناء",
text: "تقع شرق قناة السويس، وهي أرض مصرية شهدت جانبًا رئيسيًا من أحداث حرب أكتوبر، ثم عادت إلى السيادة المصرية عبر مراحل."
}
};
document.querySelectorAll(".map-pin").forEach((pin) => {
pin.addEventListener("click", () => {
const place = mapPlaces[pin.dataset.place];
if (!place) return;
document.querySelectorAll(".map-pin").forEach((item) => item.classList.remove("active"));
pin.classList.add("active");
document.getElementById("mapInfoTitle").textContent = place.title;
document.getElementById("mapInfoText").textContent = place.text;
});
});

// ======================================
// 6- الاختبار التفاعلي
// ======================================
const quizForm = document.getElementById("historyQuiz");
if (quizForm) {
const questions = [...quizForm.querySelectorAll(".quiz-question")];
const answers = [1, 0, 1, 1, 0, 2];
const progressText = document.getElementById("quizProgress");
const progressBar = document.getElementById("quizProgressBar");
const feedback = document.getElementById("quizFeedback");
const previousButton = document.getElementById("quizPrev");
const nextButton = document.getElementById("quizNext");
const submitButton = document.getElementById("quizSubmit");
const resultPanel = document.getElementById("quizResult");
let currentQuestion = 0;

const selectedAnswer = (index) => quizForm.querySelector(`input[name="q${index}"]:checked`);  
const updateQuiz = () => {  
    questions.forEach((question, index) => question.hidden = index !== currentQuestion);  
    progressText.textContent = `السؤال ${currentQuestion + 1} من ${questions.length}`;  
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;  
    previousButton.disabled = currentQuestion === 0;  
    nextButton.hidden = currentQuestion === questions.length - 1;  
    submitButton.hidden = currentQuestion !== questions.length - 1;  
    nextButton.disabled = !selectedAnswer(currentQuestion);  
    submitButton.disabled = !selectedAnswer(currentQuestion);  
    feedback.textContent = "";  
};  

quizForm.addEventListener("change", () => {  
    nextButton.disabled = !selectedAnswer(currentQuestion);  
    submitButton.disabled = !selectedAnswer(currentQuestion);  
    feedback.textContent = "تم تسجيل إجابتك.";  
});  
previousButton.addEventListener("click", () => {  
    if (currentQuestion > 0) {  
        currentQuestion--;  
        updateQuiz();  
    }  
});  
nextButton.addEventListener("click", () => {  
    if (selectedAnswer(currentQuestion) && currentQuestion < questions.length - 1) {  
        currentQuestion++;  
        updateQuiz();  
    }  
});  
quizForm.addEventListener("submit", (event) => {  
    event.preventDefault();  
    if (!questions.every((_, index) => selectedAnswer(index))) {  
        feedback.textContent = "أجب عن جميع الأسئلة أولًا.";  
        return;  
    }  
    const score = answers.reduce((total, answer, index) => total + (Number(selectedAnswer(index).value) === answer ? 1 : 0), 0);  
    quizForm.hidden = true;  
    document.querySelector(".quiz-topline").hidden = true;  
    document.querySelector(".quiz-progress").hidden = true;  
    resultPanel.hidden = false;  
    document.getElementById("resultTitle").textContent = score === 6 ? "ممتاز! إجابات كلها صحيحة" : score >= 4 ? "أحسنت، نتيجة رائعة!" : "محاولة جيدة، واصل التعلم!";  
    document.getElementById("resultText").textContent = `حصلت على ${score} من ${questions.length}. ${score === 6 ? "لديك معرفة ممتازة بأحداث حرب أكتوبر." : "يمكنك مراجعة أقسام الموقع ثم إعادة الاختبار."}`;  
});  
document.getElementById("quizRestart").addEventListener("click", () => {  
    quizForm.reset();  
    quizForm.hidden = false;  
    document.querySelector(".quiz-topline").hidden = false;  
    document.querySelector(".quiz-progress").hidden = false;  
    resultPanel.hidden = true;  
    currentQuestion = 0;  
    updateQuiz();  
});  
updateQuiz();

}

console.log("موقع حرب أكتوبر المجيدة جاهز!");

// ======================================
// 7- شريط تقدم القراءة وتحديد القسم الحالي
// ======================================
const readingProgress = document.createElement("div");
readingProgress.className = "reading-progress";
readingProgress.setAttribute("aria-hidden", "true");
readingProgress.innerHTML = "<span></span>";
document.body.appendChild(readingProgress);
const readingProgressBar = readingProgress.querySelector("span");

const updateReadingProgress = () => {
const scrollable = document.documentElement.scrollHeight - window.innerHeight;
const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
readingProgressBar.style.width = ${Math.min(100, Math.max(0, progress))}%;
};
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

const navLinks = [...document.querySelectorAll(".main-nav a[href^='#']")];
const observedSections = navLinks
.map((link) => document.querySelector(link.getAttribute("href")))
.filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
const activeSectionObserver = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;
navLinks.forEach((link) => {
const active = link.getAttribute("href") === #${entry.target.id};
link.classList.toggle("active", active);
if (active) link.setAttribute("aria-current", "location");
else link.removeAttribute("aria-current");
});
});
}, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
observedSections.forEach((section) => activeSectionObserver.observe(section));
}
