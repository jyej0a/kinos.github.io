/**
 * posts.json 자동 생성 스크립트
 * pages/ 폴더의 마크다운 파일들을 스캔하여 posts.json 생성
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PAGES_DIR = path.join(__dirname, '../pages');
const OUTPUT_FILE = path.join(__dirname, '../posts.json');

function getSlugFromFilename(filename) {
    return filename.replace('.md', '');
}

function extractFrontMatter(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        category: data.category || 'Uncategorized',
        description: data.description || '',
        slug: getSlugFromFilename(path.basename(filePath))
    };
}

function generatePostsJSON() {
    console.log('Generating posts.json...');

    try {
        // pages 디렉토리 읽기
        const files = fs.readdirSync(PAGES_DIR);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        console.log(`Found ${mdFiles.length} markdown files`);

        // 각 파일에서 메타데이터 추출
        const posts = mdFiles.map(file => {
            const filePath = path.join(PAGES_DIR, file);
            return extractFrontMatter(filePath);
        });

        // 날짜순으로 정렬 (최신순)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // posts.json 파일로 저장
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf-8');

        console.log(`Successfully generated posts.json with ${posts.length} posts`);
        console.log('Posts:');
        posts.forEach(post => {
            console.log(`  - ${post.title} (${post.slug})`);
        });
    } catch (error) {
        console.error('Error generating posts.json:', error);
        process.exit(1);
    }
}

generatePostsJSON();

