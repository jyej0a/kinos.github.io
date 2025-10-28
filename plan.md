# GitHub Pages 정적 블로그 구축 계획

## 📋 프로젝트 개요

- 배포: {your_github_username}.github.io
- 기술: HTML, CSS, Vanilla JavaScript
- 마크다운 파싱: marked.js (CDN)
- 코드 하이라이팅: Prism.js
- 댓글: Giscus (GitHub Discussions)
- 빌드: GitHub Actions (자동)

## 📁 디렉토리 구조

```sh
/
├── index.html # 메인 페이지 (게시글 목록)
├── post.html # 게시글 상세 페이지
├── css/
│ ├── style.css # 메인 스타일 (다크/라이트 모드)
│ └── prism.css # 코드 하이라이팅 테마
├── js/
│ ├── app.js # 메인 애플리케이션 로직
│ ├── post-loader.js # 마크다운 로딩 및 파싱
│ ├── search.js # 검색 기능
│ └── theme.js # 다크/라이트 모드 토글
├── pages/ # 마크다운 게시글 폴더
│ └── example.md
├── .github/
│ └── workflows/
│ └── generate-posts.yml # posts.json 자동 생성
└── posts.json # 게시글 메타데이터 (자동 생성)
```

## 🔧 구현 단계

### 1단계: 기본 HTML 구조

- index.html: 게시글 목록, 검색창, 태그 필터
- post.html: 게시글 본문, Giscus 댓글

### 2단계: CSS 스타일링

- 미니멀 디자인 (여백 중심, 타이포그래피 강조)
- CSS 변수 기반 다크/라이트 모드
- 반응형 레이아웃

### 3단계: JavaScript 기능

- marked.js로 마크다운 → HTML 변환
- Front Matter 파싱 (제목, 날짜, 태그, 카테고리 추출)
- 태그/카테고리 필터링
- 클라이언트 사이드 검색
- 다크/라이트 모드 토글

### 4단계: Giscus 통합

- GitHub Discussions 설정
- Giscus 설정 및 스크립트 추가

### 5단계: GitHub Actions 워크플로우

- pages/ 폴더 스캔
- Front Matter 추출 → posts.json 생성
- gh-pages 브랜치에 자동 배포

### 6단계: 코드 하이라이팅

- Prism.js CDN 추가
- 주요 언어 지원 설정

## 📝 마크다운 파일 형식 예시

```markdown
---
title: '첫 번째 게시글'
date: 2025-01-26
tags: ['JavaScript', 'Web']
category: 'Development'
description: '게시글 설명'
---

# 제목

내용...
```

## 🚀 배포 플로우

1.  pages/에 .md 파일 작성
2.  git push
3.  GitHub Actions 자동 실행
4.  posts.json 생성
5.  GitHub Pages 배포
6.  https://{your_github_username}.github.io 접속

## ⚠️ 중요 사항

### posts.json 관리

`posts.json`은 GitHub Actions가 자동으로 생성하는 파일이므로 **반드시 .gitignore에 추가**해야 합니다.

```gitignore
# Generated files (GitHub Actions에서 자동 생성)
posts.json
```

이미 git에 커밋된 경우:

```bash
git rm posts.json
git add .gitignore
git commit -m "fix: posts.json을 git에서 제거 (GitHub Actions가 자동 생성)"
git push origin main
```

## 💬 Giscus 댓글 설정

### 1단계: GitHub Discussions 활성화

1. 저장소 **Settings** > **General** > **Features**
2. **Discussions** 체크박스 활성화

### 2단계: Giscus 앱 설치

1. https://github.com/apps/giscus 접속
2. **Install** 버튼 클릭
3. **Only select repositories** 선택
4. `{your_github_username}.github.io` 저장소 선택
5. **Install** 클릭

### 3단계: Giscus 설정 정보 가져오기

1. https://giscus.app/ko 접속
2. **저장소** 입력: `{your_github_username}/{your_github_username}.github.io`
3. 설정:
   - **페이지 ↔️ Discussions 매핑**: `pathname` (권장)
   - **Discussion 카테고리**: `General` 또는 `Announcements`
   - **기능**: 메인 포스트에 반응 남기기 활성화
   - **테마**: `preferred_color_scheme` (자동 다크/라이트 전환)
4. 생성된 코드에서 값 복사:
   - `data-repo-id`
   - `data-category-id`

### 4단계: 블로그에 설정 적용

`js/post-loader.js` 파일의 `loadGiscus()` 함수 업데이트:

```javascript
script.setAttribute(
  'data-repo',
  '{your_github_username}/{your_github_username}.github.io',
);
script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // 3단계에서 복사
script.setAttribute('data-category', 'General');
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // 3단계에서 복사
script.setAttribute('data-emit-metadata', '1'); // 실시간 업데이트를 위해 반드시 1로 설정
```

### 5단계: 변경사항 커밋 & 푸시

```bash
git add js/post-loader.js
git commit -m "feat: Giscus 댓글 시스템 설정"
git push origin main
```

배포 후 게시글 페이지에서 댓글 시스템이 작동합니다.
