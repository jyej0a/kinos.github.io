/**
 * 테마 토글 기능 (다크/라이트 모드)
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'theme';
    const THEME_ATTR = 'data-theme';

    // 시스템 테마 감지
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // 테마 초기화
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        let theme = savedTheme;

        // 저장된 테마가 없으면 시스템 테마 사용
        if (!theme) {
            theme = prefersDark.matches ? 'dark' : 'light';
        }

        applyTheme(theme);
        updateToggleButton(theme);
    }

    // 테마 적용
    function applyTheme(theme) {
        document.documentElement.setAttribute(THEME_ATTR, theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    // 토글 버튼 아이콘 업데이트
    function updateToggleButton(theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        toggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // 테마 전환
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute(THEME_ATTR);
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        updateToggleButton(newTheme);
    }

    // 토글 버튼 이벤트 리스너
    function setupToggleButton() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }
    }

    // 시스템 테마 변경 감지
    function setupSystemThemeListener() {
        prefersDark.addEventListener('change', (e) => {
            const savedTheme = localStorage.getItem(STORAGE_KEY);
            // 수동으로 설정한 테마가 없을 때만 시스템 테마 따름
            if (!savedTheme) {
                const theme = e.matches ? 'dark' : 'light';
                applyTheme(theme);
                updateToggleButton(theme);
            }
        });
    }

    // 초기화
    function init() {
        initTheme();
        setupToggleButton();
        setupSystemThemeListener();
    }

    // DOM 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

