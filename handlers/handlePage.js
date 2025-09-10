import pagesData from '../data/pages.json';
import postsData from '../data/posts.json'; // <-- Impor data postingan
import settings from '../data/settings.json';
import layout from '../templates/layout.html';
import pageTemplate from '../templates/page.html';
import { renderTemplate } from '../utils/renderer.js';
import { generateMeta } from '../utils/seo.js';
import { generateMobileMenu, generateFooterMenu } from '../utils/menu.js';

// --- Fungsi Helper (kita ambil dari handlePosts.js) ---
function getFirstImage(htmlContent) {
    const match = htmlContent.match(/<img src="([^"]+)"/);
    return match ? match[1] : 'https://via.placeholder.com/300x200.png?text=No+Image';
}

function cleanTitle(title) {
    const cutoffIndex = title.indexOf('');
    if (cutoffIndex !== -1) {
        return title.substring(0, cutoffIndex).trim();
    }
    const separators = [' | ', ' – '];
     for (const sep of separators) {
        if (title.includes(sep)) {
            return title.split(sep)[0].trim();
        }
    }
    return title;
}

function getRandomPosts() {
    return postsData
        .sort(() => 0.5 - Math.random()) // Acak array
        .slice(0, 5) // Ambil 5 post
        .map(p => {
            const firstImage = getFirstImage(p.content);
            const cleanedTitle = cleanTitle(p.title);
            return `
                <li class="related-post-item">
                    <img src="${firstImage}" alt="${cleanedTitle}">
                    <div><a href="/${p.slug}">${cleanedTitle}</a></div>
                </li>
            `;
        }).join('');
}


export async function handlePageRequest(request) {
    const url = new URL(request.url);
    const slug = url.pathname.replace('/', '');
    const page = pagesData.find(p => p.slug === slug);
    if (!page) {
        return new Response('Halaman tidak ditemukan', { status: 404 });
    }
    
    const renderedPageContent = await renderTemplate(page.content, {
        SITE_TITLE: settings.siteTitle
    });

    const pageContent = await renderTemplate(pageTemplate, {
        PAGE_TITLE: page.title,
        PAGE_CONTENT: page.content,
        RELATED_POSTS: getRandomPosts() // <-- Panggil fungsi untuk mendapatkan post acak
    });

    const meta = generateMeta(page, 'page');

    const finalHtml = await renderTemplate(layout, {
        SEO_TITLE: meta.title,
        PAGE_CONTENT: pageContent,
        SITE_TITLE: settings.siteTitle,
        MOBILE_MENU_LINKS: generateMobileMenu(),
        FOOTER_MENU_LINKS: generateFooterMenu(),
        JSON_LD_SCRIPT: ''
    });
    
    return new Response(finalHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}