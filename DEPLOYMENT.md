# 🚀 GitHub Pages 배포 가이드

## 1. GitHub 저장소 생성

1. GitHub에 로그인 후, [새 저장소 생성](https://github.com/new)
2. 저장소 이름: `my-blog`
3. **Public**으로 설정 (GitHub Pages 무료 제공)
4. `README`, `.gitignore` 추가하지 않음 (이미 프로젝트에 포함됨)
5. **Create repository** 클릭

## 2. 로컬 프로젝트를 GitHub에 푸시

터미널에서 다음 명령어 실행:

```bash
# 현재 프로젝트 디렉토리로 이동
cd /path/to/GITblog

# Git 저장소 초기화 (이미 초기화되어 있다면 스킵)
git init

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Dark Green Blog"

# GitHub 저장소를 원격으로 추가 (YOUR_GITHUB_USERNAME은 실제 사용자명으로 변경)
git remote add origin https://github.com/jyej0a/my-blog.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

## 3. GitHub Pages 설정

1. GitHub 저장소 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 섹션:
   - Branch: `gh-pages` 선택
   - 폴더: `/ (root)` 선택
4. **Save** 클릭

## 4. GitHub Discussions 활성화

Giscus 댓글 시스템을 사용하려면 Discussions를 활성화해야 합니다:

1. 저장소 페이지에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **General** 클릭
3. **Features** 섹션에서 **Discussions** 체크박스 활성화
4. 저장하면 Discussions 탭이 나타납니다

## 5. Giscus 설정

### 5-1. Giscus 앱 설치

1. [Giscus 앱 설치 페이지](https://github.com/apps/giscus) 접속
2. **Install** 버튼 클릭
3. **Only select repositories** 선택
4. `my-blog` 저장소 선택
5. **Install** 클릭

### 5-2. Giscus 설정값 가져오기

1. [Giscus 설정 페이지](https://giscus.app/ko) 접속
2. 설정 입력:
   - **GitHub repository**: `jyej0a/my-blog`
   - **페이지 ↔️ Discussions 매핑**: `pathname`
   - **Discussion 카테고리**: `General`
   - **기능**: "메인 포스트에 반응 남기기" 활성화
   - **테마**: `preferred_color_scheme` (자동 다크/라이트 전환)
3. **응답** 섹션에서 다음 값 복사:
   - `data-repo-id`
   - `data-category-id`

### 5-3. Giscus 설정 적용

`js/post-loader.js` 파일을 열어 다음 부분을 수정:

```javascript
script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // 복사한 값으로 교체
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // 복사한 값으로 교체
```

변경사항 커밋 및 푸시:

```bash
git add js/post-loader.js
git commit -m "feat: Giscus 댓글 시스템 설정"
git push origin main
```

## 6. posts.json 수동 생성 (첫 배포 시)

GitHub Actions가 자동으로 실행되지만, 첫 배포 전에 로컬에서 테스트하고 싶다면:

```bash
# gray-matter 설치 (한 번만 필요)
npm install -g gray-matter

# posts.json 생성
npm run generate-posts

# 생성된 posts.json 확인
cat posts.json
```

## 7. 배포 완료 확인

1. 2-3분 후 [https://jyej0a.github.io/my-blog](https://jyej0a.github.io/my-blog) 접속
2. 블로그가 정상적으로 표시되는지 확인
3. 샘플 게시글(welcome) 클릭하여 상세 페이지 확인
4. 댓글 영역에 Giscus가 정상적으로 로드되는지 확인

## 8. 새 게시글 작성 및 배포

앞으로는 새 게시글을 추가할 때마다 자동으로 배포됩니다:

```bash
# 1. pages/ 폴더에 새 마크다운 파일 생성
touch pages/my-new-post.md

# 2. 게시글 작성 (편집기 사용)
# ...

# 3. 커밋 및 푸시
git add pages/my-new-post.md
git commit -m "post: 새 게시글 추가"
git push origin main

# 4. GitHub Actions가 자동으로:
#    - posts.json 생성
#    - gh-pages 브랜치에 배포
```

## 문제 해결

### 블로그가 표시되지 않음

- GitHub Actions 탭에서 워크플로우 실행 상태 확인
- Pages 설정에서 gh-pages 브랜치가 선택되어 있는지 확인
- 5-10분 정도 기다린 후 새로고침

### 댓글이 나타나지 않음

- Discussions가 활성화되어 있는지 확인
- Giscus 앱이 설치되어 있는지 확인
- `js/post-loader.js`의 repo-id와 category-id가 올바른지 확인

### posts.json 오류

- 마크다운 파일의 Front Matter 형식이 올바른지 확인
- GitHub Actions 로그에서 에러 메시지 확인

## 참고 자료

- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [Giscus 공식 문서](https://github.com/giscus/giscus)
- [Markdown 가이드](https://www.markdownguide.org/)

