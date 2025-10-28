/**
 * 메인 애플리케이션 로직 - 게시글 목록 렌더링 및 필터링
 */

(function () {
    'use strict';

    let postsData = [];
    let filteredPosts = [];
    let currentFilter = {
        category: null,
        tags: []
    };

    // 초기화
    async function init() {
        await loadPosts();
        renderPosts(postsData);
        renderCategoryFilter();
        renderTagCloud();
        setupEventListeners();
    }

    // posts.json 로드
    async function loadPosts() {
        try {
            const response = await fetch('posts.json');
            postsData = await response.json();
            filteredPosts = [...postsData];

            // 날짜순으로 정렬 (최신순)
            postsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log(`Loaded ${postsData.length} posts`);
        } catch (error) {
            console.error('Failed to load posts:', error);
            showErrorMessage('게시글을 불러올 수 없습니다.');
        }
    }

    // 게시글 목록 렌더링
    function renderPosts(posts) {
        const postList = document.getElementById('postList');
        if (!postList) return;

        if (posts.length === 0) {
            postList.innerHTML = '<div class="loading">게시글이 없습니다.</div>';
            return;
        }

        postList.innerHTML = posts.map(post => createPostCard(post)).join('');
    }

    // 게시글 카드 생성
    function createPostCard(post) {
        const tags = post.tags ? post.tags.map(tag =>
            `<span class="tag">${escapeHtml(tag)}</span>`
        ).join('') : '';

        return `
      <article class="post-card">
        <header class="post-card-header">
          <h2 class="post-card-title">
            <a href="post.html?slug=${post.slug}">${escapeHtml(post.title)}</a>
          </h2>
          <div class="post-card-meta">
            <time datetime="${post.date}">${formatDate(post.date)}</time>
            ${post.category ? `<span class="post-card-category">${escapeHtml(post.category)}</span>` : ''}
          </div>
        </header>
        ${post.description ? `<p class="post-card-description">${escapeHtml(post.description)}</p>` : ''}
        ${tags ? `<div class="post-card-tags">${tags}</div>` : ''}
        <footer class="post-card-footer">
          <a href="post.html?slug=${post.slug}" class="read-more">더 읽기 →</a>
        </footer>
      </article>
    `;
    }

    // 카테고리 필터 렌더링
    function renderCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(postsData.map(post => post.category).filter(Boolean))];

        categoryFilter.innerHTML = `
      <div class="filter-item${!currentFilter.category ? ' active' : ''}" data-filter-type="category" data-filter-value="">전체</div>
      ${categories.map(category => `
        <div class="filter-item${currentFilter.category === category ? ' active' : ''}" 
             data-filter-type="category" 
             data-filter-value="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </div>
      `).join('')}
    `;
    }

    // 태그 클라우드 렌더링
    function renderTagCloud() {
        const tagCloud = document.getElementById('tagCloud');
        if (!tagCloud) return;

        const tagCounts = {};
        postsData.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        // 태그를 많이 사용된 순으로 정렬
        const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20); // 상위 20개만 표시

        tagCloud.innerHTML = sortedTags.map(([tag, count]) => `
      <span class="tag${currentFilter.tags.includes(tag) ? ' selected' : ''}" 
            data-tag="${escapeHtml(tag)}"
            title="${count}개 게시글">
        ${escapeHtml(tag)} (${count})
      </span>
    `).join('');
    }

    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 카테고리 필터
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('click', (e) => {
                const item = e.target.closest('.filter-item');
                if (!item) return;

                const filterType = item.dataset.filterType;
                const filterValue = item.dataset.filterValue;

                if (filterType === 'category') {
                    currentFilter.category = filterValue || null;
                    applyFilters();
                    renderCategoryFilter();
                    renderTagCloud();
                }
            });
        }

        // 태그 필터
        const tagCloud = document.getElementById('tagCloud');
        if (tagCloud) {
            tagCloud.addEventListener('click', (e) => {
                const tagElement = e.target.closest('.tag[data-tag]');
                if (!tagElement) return;

                const tag = tagElement.dataset.tag;
                toggleTagFilter(tag);
                applyFilters();
                renderCategoryFilter();
                renderTagCloud();
            });
        }
    }

    // 태그 필터 토글
    function toggleTagFilter(tag) {
        const index = currentFilter.tags.indexOf(tag);
        if (index > -1) {
            currentFilter.tags.splice(index, 1);
        } else {
            currentFilter.tags.push(tag);
        }
    }

    // 필터 적용
    function applyFilters() {
        filteredPosts = postsData.filter(post => {
            // 카테고리 필터
            if (currentFilter.category && post.category !== currentFilter.category) {
                return false;
            }

            // 태그 필터
            if (currentFilter.tags.length > 0) {
                const hasAllTags = currentFilter.tags.every(tag =>
                    post.tags && post.tags.includes(tag)
                );
                if (!hasAllTags) return false;
            }

            return true;
        });

        renderPosts(filteredPosts);
    }

    // 날짜 포맷팅
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    // HTML 이스케이프
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 에러 메시지 표시
    function showErrorMessage(message) {
        const postList = document.getElementById('postList');
        if (postList) {
            postList.innerHTML = `<div class="loading" style="color: var(--text-muted);">${message}</div>`;
        }
    }

    // 초기화 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

