import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration for GoAround
const firebaseConfig = {
    apiKey: 'AIzaSyBmQO-DB5vkqplj-0WUKL5Cv420ZR1jJJo',
    appId: '1:608020950692:web:6193fdb127ae3f2dd10031',
    messagingSenderId: '608020950692',
    projectId: 'goaround-11',
    authDomain: 'goaround-11.firebaseapp.com',
    storageBucket: 'goaround-11.firebasestorage.app',
    measurementId: 'G-B46NQZCB3P',
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Premium Toast Notification Helper
const showToast = (message, isError = false) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    const icon = isError 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34c759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    toast.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="message">${message}</div>
        <div class="progress-bar"></div>
    `;

    toast.classList.remove('show', 'error', 'success');
    void toast.offsetWidth; // Force reflow for animation reset
    
    toast.classList.toggle('error', isError);
    toast.classList.toggle('success', !isError);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
};

// Apple-style Interaction Logic
const header = document.querySelector('header');
const videoSlider = document.querySelector('#video-slider');
const videoBtn = document.querySelectorAll('.vid-btn');

// 1. Smooth Header Transition on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        header.style.height = '4.4rem';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.7)';
        header.style.height = '4.8rem';
    }
});

// 2. Premium Video Slider with Placeholder Fallback
const handleVideoError = (video) => {
    console.warn("Local video not found, using premium placeholder...");
    // High-quality Apple-esque abstract video placeholder
    video.src = "https://assets.mixkit.co/videos/preview/mixkit-abstract-motion-of-white-lines-on-black-background-30230-large.mp4";
    video.play();
};

videoSlider.addEventListener('error', () => handleVideoError(videoSlider));

videoBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.controls .active').classList.remove('active');
        btn.classList.add('active');

        const src = btn.getAttribute('data-src');

        // Dynamic opacity transition
        videoSlider.style.opacity = '0';

        setTimeout(() => {
            videoSlider.src = src;
            videoSlider.play().catch(() => {
                handleVideoError(videoSlider);
            });
            videoSlider.style.opacity = '0.6';
        }, 400);
    });
});

// 3. Intersection Observer for Scroll Reveals (Apple Signature)
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

document.querySelectorAll('section > *').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
    revealOnScroll.observe(el);
});

// 4. Initial Experience Start
const startExperience = () => {
    videoSlider.muted = true; // Stay muted for autoplay compatibility
    videoSlider.play().catch(e => {
        handleVideoError(videoSlider);
    });
};

window.addEventListener('load', startExperience);
window.addEventListener('click', () => {
    videoSlider.muted = false; // Unmute on first click
}, { once: true });

// 5. Notify Me Form Handler with Firebase Integration
const notifyForm = document.querySelector('.notify-form');
if (notifyForm) {
    notifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = notifyForm.querySelector('input');
        const email = emailInput.value.trim();

        if (email) {
            // 1. Strict Gmail Validation (User explicitly requested Gmail only)
            if (!email.toLowerCase().endsWith('@gmail.com')) {
                showToast("Please use a valid @gmail.com address.", true);
                return;
            }

            // Optional: Loading state for button
            const notifyBtn = notifyForm.querySelector('button');
            const originalBtnText = notifyBtn.innerText;
            notifyBtn.innerText = "Processing...";
            notifyBtn.disabled = true;

            try {
                // 2. Store in Firebase Database - Collection: "pre-users"
                await addDoc(collection(db, "pre-users"), {
                    email: email,
                    source: "Coming Soon Page",
                    status: "waiting",
                    timestamp: serverTimestamp()
                });

                // 3. User Notification
                showToast(`Confirmed! We'll notify you here when we launch.`);
                notifyForm.reset();
            } catch (error) {
                console.error("Firebase Database Error: ", error);
                showToast("Registration error. Please try again.", true);
            } finally {
                notifyBtn.innerText = originalBtnText;
                notifyBtn.disabled = false;
            }
        }
    });
}
