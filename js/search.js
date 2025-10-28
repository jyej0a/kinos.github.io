/**
 * 클라이언트 사이드 검색 기능
 */

(function () {
    'use strict';

    let postsData = [];
    let searchInput = null;
    let searchResults = null;
    let searchTimeout = null;

    // 초기화
    function init() {
        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');

        if (!searchInput || !searchResults) return;

        // 검색 입력 이벤트
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', showResults);

        // 외부 클릭 시 결과 숨기기
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                hideResults();
            }
        });

        // 키보드 네비게이션
        searchInput.addEventListener('keydown', handleKeyboardNavigation);
    }

    // 검색 입력 핸들러 (디바운싱)
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        clearTimeout(searchTimeout);

        if (query.length === 0) {
            hideResults();
            return;
        }

        // 300ms 디바운싱
        searchTimeout = setTimeout(() => {
            performSearch(query);
            showResults();
        }, 300);
    }

    // 검색 수행
    (window.loadPostsForSearch = async function () {
        try {
            const response = await fetch('posts.json');
            postsData = await response.json();
            // 날짜순으로 정렬 (최신순)
            postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Failed to load posts:', error);
            postsData = [];
        }
    })();

    function performSearch(query) {
        if (postsData.length === 0 || query.length === 0) {
            hideResults();
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = postsData.filter(post => {
            // 제목 검색
            if (post.title.toLowerCase().includes(lowerQuery)) {
                return true;
            }

            // 설명 검색
            if (post.description && post.description.toLowerCase().includes(lowerQuery)) {
                return true;
            }

            // 태그 검색
            if (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
                return true;
            }

            // 카테고리 검색
            if (post.category && post.category.toLowerCase().includes(lowerQuery)) {
                return true;
            }

            return false;
        });

        displayResults(results, query);
    }

    // 검색 결과 표시
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
        <div class="search-result-item" style="cursor: default;">
          <div class="search-result-title">검색 결과 없음</div>
          <div class="search-result-snippet">"${query}"에 대한 결과를 찾을 수 없습니다.</div>
        </div>
      `;
            return;
        }

        searchResults.innerHTML = results.slice(0, 5).map(post => {
            const snippet = post.description || post.title;
            return `
        <div class="search-result-item" data-slug="${post.slug}">
          <div class="search-result-title">${highlightText(post.title, query)}</div>
          <div class="search-result-snippet">${highlightText(snippet.substring(0, 100), query)}...</div>
        </div>
      `;
        }).join('');

        // 클릭 이벤트 추가
        searchResults.querySelectorAll('.search-result-item[data-slug]').forEach(item => {
            item.addEventListener('click', () => {
                const slug = item.getAttribute('data-slug');
                window.location.href = `post.html?slug=${slug}`;
            });
        });
    }

    // 하이라이트 텍스트
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 결과 표시
    function showResults() {
        if (searchResults) {
            searchResults.classList.add('active');
        }
    }

    // 결과 숨기기
    function hideResults() {
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    }

    // 키보드 네비게이션
    function handleKeyboardNavigation(e) {
        const items = searchResults.querySelectorAll('.search-result-item[data-slug]');
        const firstItem = items[0];

        if (e.key === 'Enter' && firstItem) {
            e.preventDefault();
            firstItem.click();
        }
    }

    // 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

