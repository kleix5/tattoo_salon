const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.about, .gallery, .contact').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    const lines = hamburger.querySelectorAll('.line');
    if (hamburger.classList.contains('active')) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            const lines = hamburger.querySelectorAll('.line');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });
});

const filterButtons = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                setTimeout(() => { item.style.opacity = 1; item.style.transform = 'translateY(0)'; }, 10);
            } else {
                item.style.display = 'none';
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
            }
        });
    });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close');
const galleryImages = document.querySelectorAll('.gallery-item img');

galleryImages.forEach(img => {
    img.addEventListener('click', (e) => {
        const parent = e.target.parentElement;
        const caption = parent.querySelector('h3').textContent + ' - ' + parent.querySelector('p').textContent;
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const booking = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        description: formData.get('description'),
        style: formData.get('style')
    };
    try {
        const response = await fetch('/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        const result = await response.json();
        if (response.ok) {
            alert(`✅ Спасибо, ${booking.name}! Ваша заявка принята.`);
            bookingForm.reset();
        } else {
            alert(`❌ Ошибка: ${result.message || "Неизвестная ошибка"}`);
        }
    } catch (error) {
        console.error("❌ Ошибка сети:", error);
        alert(`❌ Ошибка сети: ${error.message}`);
    }
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
    }
});