# 🌿 Dark Green Blog

다크 그린 테마의 미니멀 정적 블로그입니다.

## 📋 소개

- **저장소**: [jyej0a/my-blog](https://github.com/jyej0a/my-blog)
- **배포 URL**: [https://jyej0a.github.io/my-blog](https://jyej0a.github.io/my-blog)
- **테마**: Deep Green (다크 그린)
- **폰트**: 나눔바른고딕

## 🎨 특징

- 다크 그린 기반의 눈이 편안한 디자인
- 나눔바 Nearby 가독성 최적화
- 완전한 정적 사이트 (서버 불필요)
- GitHub Actions 자동 배포
- 클라이언트 사이드 검색
- Giscus 기반 댓글 시스템
- 반응형 레이아웃
- 다크/라이트 모드 지원

## 🚀 사용 방법

### 게시글 작성

1. `pages/` 폴더에 마크다운 파일(`.md`) 생성
2. Front Matter 작성:
   ```markdown
   ---
   title: '게시글 제목'
   date: 2025-10-28
   tags: ['JavaScript', 'Web']
   category: 'Development'
   description: '게시글 설명'
   ---
   
   본문 내용...
   ```

3. 변경사항 커밋 및 푸시:
   ```bash
   git add pages/new-post.md
   git commit -m "post: 새 게시글"
   git push origin main
   ```

4. GitHub Actions가 자동으로:
   - `posts.json` 생성
   - gh-pages 브랜치에 배포

### 로컬에서 테스트

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server 확장 사용
```

## 🛠️ 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- [marked.js](https://github.com/markedjs/marked) - 마크다운 파싱
- [Prism.js](https://prismjs.com/) - 코드 하이라이팅
- [Giscus](https://giscus.app/) - 댓글 시스템
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## 📁 디렉토리 구조

```
/
├── index.html              # 메인 페이지 (게시글 목록)
├── post.html               # 게시글 상세 페이지
├── css/
│   ├── style.css          # 메인 스타일
│   └── prism-dark.css     # 코드 하이라이팅
├── js/
│   ├── app.js             # 메인 로직
│   ├── post-loader.js     # 마크다운 파싱
│   ├── search.js          # 검색 기능
│   └── theme.js           # 테마 토글
├── pages/                  # 마크다운 게시글
└── scripts/
    └── generate-posts.js  # posts.json 생성
```

## 📝 라이선스

MIT License

