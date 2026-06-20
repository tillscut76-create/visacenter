// Global Configuration Store (Source of Truth)
// This file initializes default values and manages persistence via localStorage.

const DEFAULT_CONFIG = {
    admins: [
        { id: 'admin', pw: 'visa1234', name: '마스터', phone: '010-0000-0000' }
    ],
    // Hierarchical Fees: Country -> Category -> Speed -> Price
    fees: {
        'japan': {
            'e-visa (전자비자)': { 'Standard (보통)': 50000, 'Express (급행)': 80000 },
            'Sticker (스티커 - 부산)': { 'Agency Fee (수수료)': 50000 },
            'Sticker (스티커 - 서울)': { 'Agency Fee (수수료)': 80000 }
        },
        'china': {
            'Tourism (관광-단수)': { 'Standard (보통)': 120000, 'Express (급행)': 160000, 'Urgent (특급)': 190000 },
            'Business (상용-단수)': { 'Standard (보통)': 130000, 'Express (급행)': 170000, 'Urgent (특급)': 200000 },
            'Multiple (복수)': { 'Standard (보통)': 250000 }
        },
        'india': {
            'e-Visa (30 days)': { 'Standard (보통)': 65000 },
            'e-Visa (1 year)': { 'Standard (보통)': 120000 }
        },
        'mongolia': {
            'Tourism (관광)': { 'Standard (보통)': 85000, 'Express (급행)': 115000 }
        },
        'russia': {
            'Tourism (관광)': { 'Standard (보통)': 120000, 'Express (급행)': 180000 }
        },
        'myanmar': {
            'e-Visa (관광)': { 'Standard (보통)': 95000 }
        },
        'pakistan': {
            'e-Visa (관광)': { 'Standard (보통)': 80000 }
        },
        'usa': {
            'ESTA (승인)': { 'Standard (보통)': 40000 }
        },
        'canada': {
            'eTA (승인)': { 'Standard (보통)': 35000 }
        },
        'uk': {
            'ETA (승인)': { 'Standard (보통)': 60000 }
        }
    },
    notices: [
        { id: 1, target: 'global', text: '신규 투어 리더스에 오신 것을 환영합니다! 전세계 비자 대행 전문.', active: true },
        { id: 2, target: 'uk', text: '2025년 1월부터 한국인 영국 ETA 필수 적용 안내.', active: true }
    ],
    // Multi-Popup System (Max 3)
    popups: [
        {
            id: 1,
            active: false,
            title: '특별 이벤트',
            content: '일본 비자 발급 수수료 10% 파격 할인!'
        },
        {
            id: 2,
            active: false,
            title: '지연 안내',
            content: '현재 중국 비자 심사가 지연되고 있습니다.'
        },
        {
            id: 3,
            active: false,
            title: '상담 안내',
            content: '카카오톡을 통해 실시간 비자 상담이 가능합니다.'
        }
    ]
};

function getConfig() {
    const saved = localStorage.getItem('visa_site_config');
    if (!saved) {
        localStorage.setItem('visa_site_config', JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
    }
    return JSON.parse(saved);
}

function saveConfig(config) {
    localStorage.setItem('visa_site_config', JSON.stringify(config));
    // Trigger UI updates across open tabs
    window.dispatchEvent(new Event('storage'));
}

// Export for use in other scripts
window.VisaConfig = {
    get: getConfig,
    set: saveConfig
};
