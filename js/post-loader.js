/**
 * 게시글 로더 - 마크다운 파싱 및 Giscus 댓글 로드
 */

(function () {
    'use strict';

    // URL 파라미터에서 slug 추출
    function getSlugFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    // Front Matter 파싱
    function parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);

        if (!match) {
            return { metadata: {}, content: content.trim() };
        }

        const metadataText = match[1];
        const body = match[2].trim();

        const metadata = {};
        const lines = metadataText.split('\n');

        lines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                let key = match[1];
                let value = match[2].replace(/^['"]|['"]$/g, '');

                // 배열 처리
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.replace(/[\[\]']/g, '').split(',').map(s => s.trim()).filter(Boolean);
                }

                metadata[key] = value;
            }
        });

        return { metadata, content: body };
    }

    // 게시글 로드 및 렌더링
    async function loadAndRenderPost() {
        const slug = getSlugFromURL();

        if (!slug) {
            showError('게시글을 찾을 수 없습니다.');
            return;
        }

        try {
            // posts.json에서 게시글 정보 가져오기
            const postsResponse = await fetch('posts.json');
            const posts = await postsResponse.json();
            const post = posts.find(p => p.slug === slug);

            if (!post) {
                showError('게시글을 찾을 수 없습니다.');
                return;
            }

            // 마크다운 파일 로드
            const mdResponse = await fetch(`pages/${slug}.md`);
            const mdContent = await mdResponse.text();

            const { metadata, content } = parseFrontMatter(mdContent);

            // 게시글 정보 업데이트
            document.getElementById('postTitle').textContent = post.title;
            document.title = `${post.title} - Dark Green Blog`;

            if (document.getElementById('postDate')) {
                document.getElementById('postDate').textContent = formatDate(post.date);
            }

            if (post.category && document.getElementById('postCategory')) {
                document.getElementById('postCategory').textContent = post.category;
            }

            // 태그 렌더링
            if (post.tags && document.getElementById('postTags')) {
                document.getElementById('postTags').innerHTML = post.tags.map(tag =>
                    `<span class="tag">${escapeHtml(tag)}</span>`
                ).join('');
            }

            // 마크다운 렌더링
            const renderedContent = marked.parse(content);
            document.getElementById('postBody').innerHTML = renderedContent;

            // Prism.js로 코드 하이라이팅
            if (window.Prism) {
                Prism.highlightAll();
            }

            // Giscus 댓글 로드
            loadGiscus(post);

        } catch (error) {
            console.error('Failed to load post:', error);
            showError('게시글을 불러올 수 없습니다.');
        }
    }

    // Giscus 댓글 로드
    function loadGiscus(post) {
        const commentsSection = document.getElementById('comments');
        if (!commentsSection) return;

        // TODO: 실제 Giscus 설정값으로 교체 필요
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'jyej0a/my-blog');
        script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // Giscus에서 가져온 값으로 교체
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // Giscus에서 가져온 값으로 교체
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'dark_dimmed'); // 다크 그린 테마와 조화
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;

        commentsSection.appendChild(script);
    }

    // 날짜 포맷팅
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    }

    // HTML 이스케이프
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 에러 표시
    function showError(message) {
        const postBody = document.getElementById('postBody');
        if (postBody) {
            postBody.innerHTML = `<div style="text-align: center; padding: 4rem 0; color: var(--text-muted);">${message}</div>`;
        }
    }

    // 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndRenderPost);
    } else {
        loadAndRenderPost();
    }
})();

BERD 위치표시자를 수정 중.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
    search_replace
