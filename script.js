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

// 5. Notify Me Form Handler
const notifyForm = document.querySelector('.notify-form');
if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = notifyForm.querySelector('input').value;
        if (email) {
            alert(`Thank you! We will notify you at ${email} when the future of travel arrives.`);
            notifyForm.reset();
        }
    });
}
