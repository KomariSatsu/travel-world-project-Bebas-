// =============================================
// JS/animations.js - PT Jelajah Nusantara
// =============================================

// --- 1. HIGHLIGHT MENU AKTIF ---
// Menandai link navigasi yang sesuai dengan halaman yang sedang dibuka
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#ffd700';
            link.style.borderBottom = '2px solid #ffd700';
            link.style.paddingBottom = '3px';
        }
    });

    // --- 2. FADE-IN SAAT HALAMAN DIMUAT ---
    // Elemen artikel dan card muncul perlahan saat halaman terbuka
    const fadeTargets = document.querySelectorAll('article, .card-link');
    fadeTargets.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 150 * index);
    });

    // --- 3. TOMBOL KEMBALI KE ATAS ---
    // Tombol muncul ketika pengguna scroll ke bawah
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.textContent = '↑';
    backToTopBtn.title = 'Kembali ke atas';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #e74707, #db0b0b);
        color: white;
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        font-size: 1.3rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(231,71,7,0.4);
        display: none;
        z-index: 999;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function () {
        backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. KONFIRMASI SEBELUM BUKA LINK EKSTERNAL ---
    // Memberi tahu pengguna saat akan diarahkan ke situs luar
    const externalLinks = document.querySelectorAll('article a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = this.href;
            const confirmed = confirm('Anda akan diarahkan ke situs eksternal:\n' + url + '\n\nLanjutkan?');
            if (confirmed) {
                window.open(url, '_blank');
            }
        });
    });

    // --- 5. TAHUN OTOMATIS DI FOOTER ---
    // Supaya tahun copyright selalu up-to-date
    const footerText = document.querySelector('footer p');
    if (footerText) {
        const tahun = new Date().getFullYear();
        footerText.textContent = '© ' + tahun + ' PT Jelajah Nusantara. All Rights Reserved.';
    }
});
