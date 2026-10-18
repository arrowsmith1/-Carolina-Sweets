/**
 * THEA SUMMERS — LUXURY PORTFOLIO INTERACTION CONTROLLER
 * Vanilla ES6 JavaScript handling Navigation, Accordion, Lightbox Modal, and Touch Micro-interactions
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* --------------------------------------------------------------------------
       1. VERIFIED TRAVEL LOCATIONS DATA STRUCTURE (PRIORITIZED HIERARCHY)
       -------------------------------------------------------------------------- */
    const travelLocations = [
        {
            city: "Washington",
            state: "DC",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Oct 24 - Oct 28",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "Boston",
            state: "MA",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Oct 28 - Oct 30",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "Houston",
            state: "TX",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Nov 05 - Nov 07",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "Dallas",
            state: "TX",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Nov 08 - Nov 10",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "New York",
            state: "NY",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Dec 02 - Dec 05",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "Philadelphia",
            state: "PA",
            type: "upcoming",
            status: "Upcoming City Tour",
            dates: "Dec 06 - Dec 08",
            availability: "Tour dates confirmed • Request booking in advance."
        },
        {
            city: "Detroit",
            state: "MI",
            type: "primary",
            status: "Primary Base Location",
            dates: "Primary Base",
            availability: "Primary Base Location • Contact for current schedule & availability."
        }
    ];

    /* --------------------------------------------------------------------------
       2. STICKY NAVBAR SCROLL EFFECT
       -------------------------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    /* --------------------------------------------------------------------------
       3. ACCESSIBLE MOBILE MENU, DRAWER & FOCUS MANAGEMENT
       -------------------------------------------------------------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const mobileBackdrop = document.getElementById("mobileBackdrop");
    const navAnchors = document.querySelectorAll(".nav-links a");

    const openMobileMenu = () => {
        menuToggle?.classList.add("active");
        navLinks?.classList.add("active");
        mobileBackdrop?.classList.add("active");
        menuToggle?.setAttribute("aria-expanded", "true");
        document.body.classList.add("no-scroll");

        // Accessible Focus Management: Move focus to first nav item
        setTimeout(() => {
            const firstFocusable = navLinks?.querySelector("a");
            firstFocusable?.focus();
        }, 50);
    };

    const closeMobileMenu = () => {
        menuToggle?.classList.remove("active");
        navLinks?.classList.remove("active");
        mobileBackdrop?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");

        // Return focus to menu button for screen reader continuity
        menuToggle?.focus();
    };

    menuToggle?.addEventListener("click", () => {
        const isOpen = navLinks?.classList.contains("active");
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileBackdrop?.addEventListener("click", closeMobileMenu);

    navAnchors.forEach(anchor => {
        anchor.addEventListener("click", closeMobileMenu);
    });

    /* --------------------------------------------------------------------------
       4. INTERSECTION OBSERVER FOR ACTIVE NAV HIGHLIGHTING
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll("section[id]");
    
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute("id");
                navAnchors.forEach(link => {
                    const href = link.getAttribute("href")?.replace("#", "");
                    if (href === activeId) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    /* --------------------------------------------------------------------------
       5. ACCESSIBLE FAQ ACCORDION (TOUCH ENFORCED)
       -------------------------------------------------------------------------- */
    const faqButtons = document.querySelectorAll(".faq-btn");

    faqButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq-item");
            const isCurrentlyActive = item?.classList.contains("active");

            // Close all items
            document.querySelectorAll(".faq-item").forEach(otherItem => {
                otherItem.classList.remove("active");
                const otherBtn = otherItem.querySelector(".faq-btn");
                otherBtn?.setAttribute("aria-expanded", "false");
            });

            // Toggle current item if it wasn't active
            if (!isCurrentlyActive && item) {
                item.classList.add("active");
                btn.setAttribute("aria-expanded", "true");
            }
        });
    });

    /* --------------------------------------------------------------------------
       6. GALLERY LIGHTBOX MODAL & MOBILE TOUCH SWIPE CONTROLLER
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentIndex = 0;
    let lastActiveTrigger = null;

    const galleryData = Array.from(galleryItems).map(item => ({
        src: item.getAttribute("data-src") || "",
        alt: item.querySelector("img")?.getAttribute("alt") || "Thea Summers Portfolio Image"
    }));

    const updateLightboxContent = (index) => {
        if (!galleryData[index]) return;
        currentIndex = index;
        if (lightboxImg) {
            lightboxImg.src = galleryData[currentIndex].src;
            lightboxImg.alt = galleryData[currentIndex].alt;
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
        }
    };

    const openLightbox = (index, triggerElement) => {
        lastActiveTrigger = triggerElement;
        updateLightboxContent(index);
        lightboxModal?.classList.add("active");
        document.body.classList.add("no-scroll");
        lightboxClose?.focus();
    };

    const closeLightbox = () => {
        lightboxModal?.classList.remove("active");
        document.body.classList.remove("no-scroll");
        if (lastActiveTrigger) {
            lastActiveTrigger.focus();
        }
    };

    const showPrevImage = () => {
        const newIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent(newIndex);
    };

    const showNextImage = () => {
        const newIndex = (currentIndex + 1) % galleryData.length;
        updateLightboxContent(newIndex);
    };

    // Attach click and keydown events to gallery items
    galleryItems.forEach((item, index) => {
        item.setAttribute("tabindex", "0");
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `View photograph ${index + 1}`);

        item.addEventListener("click", () => openLightbox(index, item));
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(index, item);
            }
        });
    });

    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxPrev?.addEventListener("click", showPrevImage);
    lightboxNext?.addEventListener("click", showNextImage);

    // Touch Swipe Gestures for Mobile Lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxModal?.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal?.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 40;
        if (touchEndX < touchStartX - swipeThreshold) {
            showNextImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            showPrevImage();
        }
    };

    // Backdrop click to close lightbox
    lightboxModal?.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    /* --------------------------------------------------------------------------
       7. GLOBAL KEYBOARD NAVIGATION (ESC & Arrow keys)
       -------------------------------------------------------------------------- */
    document.addEventListener("keydown", (e) => {
        if (lightboxModal?.classList.contains("active")) {
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowLeft") {
                showPrevImage();
            } else if (e.key === "ArrowRight") {
                showNextImage();
            }
        } else if (navLinks?.classList.contains("active")) {
            if (e.key === "Escape") {
                closeMobileMenu();
            }
        }
    });

    /* --------------------------------------------------------------------------
       8. FORM UX MICRO-INTERACTION (EMAIL CONFIRMATION MATCH CHECK)
       -------------------------------------------------------------------------- */
    const emailInput = document.getElementById("email");
    const confirmEmailInput = document.getElementById("confirm-email");

    const validateEmailMatch = () => {
        if (confirmEmailInput && emailInput) {
            if (confirmEmailInput.value.length > 0 && confirmEmailInput.value !== emailInput.value) {
                confirmEmailInput.setCustomValidity("Email addresses do not match.");
            } else {
                confirmEmailInput.setCustomValidity("");
            }
        }
    };

    emailInput?.addEventListener("input", validateEmailMatch);
    confirmEmailInput?.addEventListener("input", validateEmailMatch);
});