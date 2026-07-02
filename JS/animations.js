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

    // --- 6. POPUP NOTIFIKASI DISKON + TIMER ---
    // Muncul sekali setiap sesi saat pengguna membuka web, lalu hilang otomatis saat waktu habis
    tampilkanPopupDiskon();
});

function tampilkanPopupDiskon() {
    // Jangan tampilkan lagi di halaman diskon itu sendiri
    const halamanSekarang = window.location.pathname.split('/').pop() || 'index.html';
    if (halamanSekarang === 'diskon.html') return;

    // Hanya tampil sekali per sesi browser
    if (sessionStorage.getItem('diskonPopupSudahTampil') === 'true') return;

    // Durasi promo berjalan (10 menit) untuk timer di popup
    const DURASI_DETIK = 10 * 60;
    let sisaWaktu = DURASI_DETIK;
    let interval;

    const overlay = document.createElement('div');
    overlay.className = 'diskon-overlay';
    overlay.innerHTML = `
        <div class="diskon-popup" role="dialog" aria-label="Notifikasi Diskon">
            <button class="diskon-close" aria-label="Tutup">&times;</button>
            <span class="diskon-badge">Penawaran Terbatas</span>
            <h2>🎉 Dapatkan <span>Diskon hingga 30%</span>!</h2>
            <p>Nikmati potongan harga spesial untuk paket wisata pilihan sebelum waktu promo berakhir.</p>
            <div class="diskon-timer">
                <div class="kotak-waktu"><span id="diskon-menit">10</span><small>MENIT</small></div>
                <div class="kotak-waktu"><span id="diskon-detik">00</span><small>DETIK</small></div>
            </div>
            <div class="diskon-aksi">
                <button class="btn-pergi" id="btn-diskon-pergi">Pergi ke Halaman Diskon</button>
                <button class="btn-nanti" id="btn-diskon-nanti">Nanti Saja</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Trigger animasi masuk
    requestAnimationFrame(() => overlay.classList.add('tampil'));

    const elMenit = overlay.querySelector('#diskon-menit');
    const elDetik = overlay.querySelector('#diskon-detik');

    function perbaruiTampilanTimer() {
        const menit = Math.floor(sisaWaktu / 60);
        const detik = sisaWaktu % 60;
        elMenit.textContent = String(menit).padStart(2, '0');
        elDetik.textContent = String(detik).padStart(2, '0');
    }

    function tutupPopup() {
        clearInterval(interval);
        overlay.classList.remove('tampil');
        setTimeout(() => overlay.remove(), 350);
        sessionStorage.setItem('diskonPopupSudahTampil', 'true');
    }

    perbaruiTampilanTimer();
    interval = setInterval(() => {
        sisaWaktu--;
        perbaruiTampilanTimer();
        if (sisaWaktu <= 0) {
            tutupPopup();
        }
    }, 1000);

    // Tombol "Pergi ke Halaman Diskon" -> pindah ke halaman diskon.html
    overlay.querySelector('#btn-diskon-pergi').addEventListener('click', function () {
        sessionStorage.setItem('diskonPopupSudahTampil', 'true');
        window.location.href = 'diskon.html';
    });

    // Tombol "Nanti Saja" & tombol close -> tutup popup saja
    overlay.querySelector('#btn-diskon-nanti').addEventListener('click', tutupPopup);
    overlay.querySelector('.diskon-close').addEventListener('click', tutupPopup);

    // Klik di luar kotak popup juga menutup
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) tutupPopup();
    });
}
