/**
 * common.js - Handles uniform Header, Footer, and Marquee injection
 */

document.addEventListener('DOMContentLoaded', () => {
    const config = window.VisaConfig.get();

    // 1. Inject Scrolling Notice (Marquee)
    injectMarquee(config.notices);

    // 2. Unify Header & Footer (Synchronize content)
    unifyBranding();

    // 3. Handle Popups
    if (config.popups && Array.isArray(config.popups)) {
        showPopups(config.popups);
    }

    // 4. Dynamic Fee Replacement (Search for elements with data-fee-id)
    updateDynamicFees(config.fees);

    // 5. Inject Floating Contact Buttons
    injectFloatingButtons();
});

function injectMarquee(notices) {
    const header = document.querySelector('header');
    if (!header) return;

    // 1. Determine current page context
    let target = 'global';
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop() || 'index.html';

    // Check for explicit target on body
    const explicitTarget = document.body.getAttribute('data-country-target');
    if (explicitTarget) {
        target = explicitTarget;
    } else if (filename.includes('-visa') || filename.includes('-eta') || filename.includes('-esta')) {
        // Extract country name from filename (e.g., "india-visa.html" -> "india")
        target = filename.split('-')[0];
    }

    const activeNotices = notices.filter(n => {
        if (!n.active) return false;
        if (n.target === 'global') return true;
        if (n.target === target) return true;
        // Allow 'japan' target to apply to all specific japan pages
        if (n.target === 'japan' && target.startsWith('japan-')) return true;
        return false;
    });
    if (activeNotices.length === 0) return;

    // Prevent duplicate marquee injection
    if (document.querySelector('.marquee-container')) return;

    const marqueeText = activeNotices.map(n => n.text).join(' &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp; ');

    const marqueeDiv = document.createElement('div');
    marqueeDiv.className = 'marquee-container';
    marqueeDiv.innerHTML = `
        <div class="marquee-content">
            <span class="marquee-icon"><i class="fa-solid fa-bullhorn"></i> NOTICE: </span>
            <div class="marquee-text-wrap">
                <div class="marquee-text">${marqueeText} &nbsp;&nbsp;&nbsp;&nbsp; ${marqueeText}</div>
            </div>
        </div>
    `;

    // Add styles for components
    const style = document.createElement('style');
    style.textContent = `
        .marquee-container {
            background: #1e293b;
            color: #f8fafc;
            padding: 8px 0;
            overflow: hidden;
            font-size: 0.85rem;
            font-weight: 500;
            border-bottom: 2px solid #00247d;
        }
        .marquee-content {
            display: flex;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .marquee-icon { color: #fbbf24; margin-right: 15px; white-space: nowrap; }
        .marquee-text-wrap { overflow: hidden; white-space: nowrap; flex: 1; position: relative; }
        .marquee-text {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        .marquee-container:hover .marquee-text { animation-play-state: paused; }
    `;
    document.head.appendChild(style);
    header.parentNode.insertBefore(marqueeDiv, header);
}

function unifyBranding() {
    if (document.body.getAttribute('data-skip-unify') === 'true') return;

    // Unify logic for Header/Footer content transparency
    // This function will ensure consistent address/contact across all pages
    const addressStr = "B124, 1F, Beomyang Reus Central Bay 104-dong, 114 Choryangjung-ro, Dong-gu, Busan (부산광역시 동구 초량중로 114, 범양레우스센트럴베이 104동 1층 B124호)";
    const telStr = "051-818-0801 / 1588-8903";
    const emailStr = "kim83077@nate.com";

    // 1. Unify Header (Phone, Kakao, and FULL NAVIGATION)
    let topContactLink = 'contact.html';
    if (document.body.getAttribute('data-country-target') === 'japan-working') {
        topContactLink = 'contact.html?type=wh';
    }
    const topContact = document.querySelector('.top-contact');
    if (topContact) {
        topContact.innerHTML = `
            <a href="tel:051-818-0801"><i class="fa-solid fa-phone"></i> 051-818-0801 / 1588-8903</a>
            <a href="${topContactLink}"><i class="fa-solid fa-comments"></i> 1:1 Inquiry (문의하기)</a>
        `;
    }

    // Standardize Navigation Menu (Handle both UL and DIV based navs)
    let navContainer = document.querySelector('nav ul');
    if (!navContainer) {
        navContainer = document.querySelector('nav > div:last-child'); // Fallback for div-based nav
    }

    let contactLink = 'contact.html';
    if (document.body.getAttribute('data-country-target') === 'japan-working') {
        contactLink = 'contact.html?type=wh';
    }

    if (navContainer) {
        navContainer.innerHTML = `
            <li><a href="index.html">
                <span class="nav-en">Home</span>
                <span class="nav-kr">홈</span>
            </a></li>
            <li><a href="index.html#about">
                <span class="nav-en">About Us</span>
                <span class="nav-kr">회사소개</span>
            </a></li>
            <li>
                <a href="index.html">
                    <span class="nav-en">Japan Visa</span>
                    <span class="nav-kr">일본비자</span>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="evisa.html">일본 전자비자 (e-Visa)</a></li>
                    <li><a href="sticker-visa.html">일본 스티커비자</a></li>
                    <li><a href="working-holiday.html">일본 워킹홀리데이</a></li>
                </ul>
            </li>
            <li>
                <a href="global-visa.html">
                    <span class="nav-en">Global Visa</span>
                    <span class="nav-kr">전세계비자</span>
                </a>
                <ul class="dropdown-menu">
                    <div class="dropdown-category">For Koreans (한국인 대상)</div>
                    <li><a href="china-visa.html">중국 비자</a></li>
                    <li><a href="vietnam-visa.html">베트남 비자</a></li>
                    <li><a href="india-visa.html">인도 비자</a></li>
                    <li><a href="thailand-visa.html">태국 비자</a></li>
                    <li><a href="mongolia-visa.html">몽골 비자</a></li>
                    <li><a href="taiwan-visa-kr.html">대만 비자</a></li>
                    <li><a href="russia-visa.html">러시아 비자</a></li>
                    <li><a href="europe-visa.html">유럽 (쉥겐) 비자</a></li>
                    <li><a href="uk-visa.html">영국 비자</a></li>
                    <li><a href="usa-visa.html">미국 ESTA / 비자</a></li>
                    <li><a href="canada-visa.html">캐나다 eTA / 비자</a></li>
                    <li><a href="global-visa.html" style="color: #D30000; font-weight: 700;">기타 전세계 비자 전체보기</a></li>
                    <div class="dropdown-category" style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 12px;">For Foreigners (외국인 대상)</div>
                    <li><a href="korean-visa.html">Korea Visa (F-4, C-3, etc)</a></li>
                    <li><a href="taiwan-visa.html">Taiwan Visa Guide</a></li>
                </ul>
            </li>
            <li><a href="index.html#location">
                <span class="nav-en">Location</span>
                <span class="nav-kr">오시는길</span>
            </a></li>
            <li><a href="${contactLink}">
                <span class="nav-en">Contact</span>
                <span class="nav-kr">상담/문의</span>
            </a></li>
        `;
        // Ensure it's a UL if we found a div but want a UL list
        if (navContainer.tagName !== 'UL' && !navContainer.querySelector('li')) {
            navContainer.style.display = 'flex';
            navContainer.style.gap = '30px';
            navContainer.innerHTML = `
                <a href="index.html" style="text-decoration:none; color:inherit;">Home (홈)</a>
                <a href="index.html#about" style="text-decoration:none; color:inherit;">About Us (회사소개)</a>
                <a href="index.html" style="text-decoration:none; color:inherit;">Japan Visa (일본비자)</a>
                <a href="global-visa.html" style="text-decoration:none; color:inherit;">Global Visa (전세계비자)</a>
                <a href="index.html#location" style="text-decoration:none; color:inherit;">Location (오시는길)</a>
                <a href="${contactLink}" style="text-decoration:none; color:inherit;">Contact (상담/문의)</a>
             `;
        }
    }

    // 2. Unify Footer (New Branding: CO.,LTD, Corp Name, Multi-line Address)
    const footerInner = document.querySelector('footer .container');
    if (footerInner) {
        footerInner.innerHTML = `
            <div class="footer-info">
                <div style="font-size: 1.2rem; font-weight: 800; margin-bottom: 5px; color: #fff; letter-spacing: 1px;">
                    NEW TOUR LEADERS CO.,LTD
                </div>
                <div style="font-size: 1.0rem; font-weight: 600; margin-bottom: 15px; color: #ccc;">
                    주식회사 뉴투어리더스
                </div>
                <div style="margin-bottom: 5px;">
                    <span style="color: #aaa; margin-right: 10px;">TEL.</span> 051-818-0801 / 1588-8903
                    <span style="color: #aaa; margin-left: 20px; margin-right: 10px;">EMAIL.</span> kim83077@nate.com
                </div>
                <div style="margin-bottom: 5px; font-size: 0.9rem; color: #ccc;">
                    사업자등록번호 : 609-81-79341 &nbsp;&nbsp; | &nbsp;&nbsp; 통신판매등록번호 : 제 2020-부산동구-0354호
                </div>
                <div style="line-height: 1.6;">
                    <span style="color: #aaa; margin-right: 10px;">ADDR (ENG).</span> B124, 1F, Beomyang Reus Central Bay 104-dong, 114 Choryangjung-ro, Dong-gu, Busan<br>
                    <a href="admin.html" target="_blank" style="color: #aaa; margin-right: 10px; text-decoration: none; cursor: default;">ADDR (KR).</a> 부산광역시 동구 초량중로 114, 범양레우스센트럴베이 104동 1층 B124호
                </div>
            </div>
            <div class="footer-copy" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 20px; position: relative;">
                &copy; 2026 NEW TOUR LEADERS CO.,LTD. All Rights Reserved.
            </div>
        `;
    }

    // 3. Global Redirection: Change all direct Kakao/Consultation/Inquiry links to contact.html
    const inquiryKeywords = ['신청하기', '문의하기', '상담하기', '견적 문의', '무료 상담 신청', 'Consultation', 'Inquiry', 'Contact Us', 'Free Consultation', 'Apply'];
    document.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href') || '';
        const text = (el.innerText || '').trim();

        const matchesHref = href.includes('pf.kakao.com') || href.includes('open.kakao.com') || href.includes('Consultation');
        const matchesClass = el.classList.contains('cta-button') || el.classList.contains('download-btn');
        const matchesText = inquiryKeywords.some(kw => text.includes(kw));

        if (matchesHref || matchesClass || matchesText) {
            // Exceptions: Don't redirect internal HTML links (like visa details) unless they are Kakao links
            if (href.endsWith('.html') && !href.includes('pf.kakao.com') && !href.includes('Consultation')) return;
            // Exceptions: Don't redirect download links
            if (el.hasAttribute('download') || href.includes('forms/')) return;

            let finalContactLink = 'contact.html';
            if (document.body.getAttribute('data-country-target') === 'japan-working') {
                finalContactLink = 'contact.html?type=wh';
            }
            el.setAttribute('href', finalContactLink);
            el.removeAttribute('target');

            // Standardize text if it was just a Kakao link or generic Inquiry
            if (href.includes('kakao.com') || text.toLowerCase().includes('inquiry')) {
                if (text.includes('카톡') || text.includes('Kakao')) {
                    el.innerHTML = el.innerHTML.replace(/카톡|KakaoTalk|Kakao/g, '신청/문의');
                }
            }
        }
    });

    // 4. Hidden Admin Access (Removed dblclick as per user request, keeping dot only)
    // Logo cursor reset
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        logoImg.style.cursor = 'pointer'; // Keep pointer for home link
        logoImg.title = 'New Tour Leaders';
    }

    // Force consistent header/footer styles via JS injection
    if (!document.getElementById('branding-styles')) {
        const style = document.createElement('style');
        style.id = 'branding-styles';
        style.textContent = `
            header { background: #fff !important; color: #333 !important; border-bottom: 1px solid #eee; }
            header .container { display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
            nav ul { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; justify-content: center; }
            nav a { text-decoration: none; color: #333; font-weight: 600; font-size: 0.95rem; display: flex; flex-direction: column; align-items: center; }
            .nav-kr { font-size: 0.75rem; color: #666; font-weight: 400; }
            footer { background: #1a1a1a !important; color: #fff !important; padding: 60px 0 30px !important; }
            .footer-logo { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 25px; cursor: pointer; }
            .footer-info { font-family: 'Noto Sans KR', sans-serif; }
            @media (max-width: 768px) {
                header .container { flex-direction: column; gap: 15px; padding: 10px; }
                nav ul { gap: 10px 15px; }
                nav a { font-size: 0.85rem; }
                .nav-en { font-size: 0.85rem; }
                .nav-kr { font-size: 0.65rem; }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateDynamicFees(fees) {
    // 1. Legacy flat lookups
    document.querySelectorAll('[data-fee-id]').forEach(el => {
        const feeId = el.getAttribute('data-fee-id');
        if (fees[feeId]) {
            el.textContent = Number(fees[feeId]).toLocaleString();
        }
    });

    // 2. Hierarchical path lookups (e.g. data-fee-path="china.tourism.standard")
    document.querySelectorAll('[data-fee-path]').forEach(el => {
        const path = el.getAttribute('data-fee-path').split('.');
        let val = fees;
        for (const key of path) {
            if (val && val[key] !== undefined) val = val[key];
            else { val = null; break; }
        }
        if (val !== null && typeof val === 'number') {
            el.textContent = val.toLocaleString();
        }
    });
}

function showPopups(popups) {
    if (!popups || !Array.isArray(popups)) return;

    popups.filter(p => p.active).forEach((p, index) => {
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'visa-popup-overlay';
            overlay.id = `popup-${p.id}`;
            overlay.style = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:${9999 + index}; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px);`;

            overlay.innerHTML = `
                <div style="background:white; border-radius:30px; width:90%; max-width:400px; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,0.4); animation: popupIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    <div style="padding:40px 30px; text-align:center;">
                        <h3 style="font-size:1.5rem; font-weight:900; color:#1e293b; margin-bottom:15px; font-family:'Noto Sans KR';">${p.title}</h3>
                        <p style="color:#64748b; line-height:1.6; font-size:1rem; font-family:'Noto Sans KR'; word-break:keep-all;">${p.content.replace(/\n/g, '<br>')}</p>
                    </div>
                    <div style="padding:20px; background:#f8fafc; border-top:1px solid #f1f5f9; text-align:center;">
                        <button onclick="document.getElementById('popup-${p.id}').remove()" style="background:#00247d; color:white; padding:12px 40px; border-radius:15px; border:none; font-weight:700; cursor:pointer; font-size:1rem; transition:all 0.3s; box-shadow:0 4px 12px rgba(0,36,125,0.2);">확인 (Confirm)</button>
                    </div>
                </div>
                <style>
                    @keyframes popupIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                </style>
            `;
            document.body.appendChild(overlay);
        }, index * 300); // Stagger popups
    });
}

function injectFloatingButtons() {
    if (document.querySelector('.floating-contact-buttons')) return;

    let floatContactLink = 'contact.html';
    if (document.body.getAttribute('data-country-target') === 'japan-working') {
        floatContactLink = 'contact.html?type=wh';
    }

    const floatingDiv = document.createElement('div');
    floatingDiv.className = 'floating-contact-buttons';
    floatingDiv.innerHTML = `
        <a href="tel:051-818-0801" class="float-btn float-phone" title="전화 상담">
            <i class="fa-solid fa-phone"></i>
            <span class="float-tooltip">전화 상담</span>
        </a>
        <a href="${floatContactLink}" class="float-btn float-kakao" title="카카오톡/1:1 문의">
            <i class="fa-solid fa-comment-dots"></i>
            <span class="float-tooltip">카톡/문의</span>
        </a>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .floating-contact-buttons {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 9999;
        }
        .float-btn {
            position: relative;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #fff;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .float-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            color: #fff;
        }
        .float-btn.float-phone {
            background-color: #00247d;
        }
        .float-btn.float-kakao {
            background-color: #FEE500;
            color: #381E1F;
        }
        .float-btn.float-kakao:hover {
            color: #381E1F;
        }
        .float-tooltip {
            position: absolute;
            right: 75px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s, transform 0.3s;
            transform: translateX(10px);
            font-family: 'Noto Sans KR', sans-serif;
        }
        .float-btn:hover .float-tooltip {
            opacity: 1;
            transform: translateX(0);
        }
        @media (max-width: 768px) {
            .floating-contact-buttons {
                bottom: 20px;
                right: 20px;
                gap: 10px;
            }
            .float-btn {
                width: 50px;
                height: 50px;
                font-size: 22px;
            }
            .float-tooltip {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(floatingDiv);
}
