import postsData from '../data/posts.json';
import settings from '../data/settings.json';
import layout from '../templates/layout.html';
import postsTemplate from '../templates/posts.html';
import singleTemplate from '../templates/single.html';
import { renderTemplate } from '../utils/renderer.js';
import { generateMeta } from '../utils/seo.js';
import { generateMobileMenu, generateFooterMenu } from '../utils/menu.js';

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

function getMainContent(htmlContent) {
    const moreTag = '';
    const searchTag = "If you are searching about";
    const searchIndex = htmlContent.indexOf(searchTag);
    let contentToEnd = htmlContent;
    if (searchIndex !== -1) {
        contentToEnd = htmlContent.substring(0, searchIndex);
    }
    return contentToEnd.replace(moreTag, '');
}

function getFirstImage(htmlContent) {
    const match = htmlContent.match(/<img src=(?:"|')([^"']+)("|')/);
    return match ? match[1] : 'https://placehold.co/300x200/png';
}

function getRelatedPosts(currentSlug) {
    return postsData
        .filter(p => p.slug !== currentSlug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map(p => {
            const firstImage = getFirstImage(p.content);
            const cleanedTitle = cleanTitle(p.title);
            return `
                <li class="related-post-item">
                    <img src="${firstImage}" alt="${cleanedTitle}" onerror="this.onerror=null;this.src='https://placehold.co/300x200/png';">
                    <div><a href="/${p.slug}">${cleanedTitle}</a></div>
                </li>
            `;
        }).join('');
}

async function showPostList() {
    const initialPosts = postsData.slice(0, 8);
    const postItems = initialPosts.map(post => {
        const firstImage = getFirstImage(post.content);
        const cleanedTitle = cleanTitle(post.title);
        // Tambahkan onerror di sini
        return `
            <div class="post-card">
                <a href="/${post.slug}">
                    <img src="${firstImage}" alt="${cleanedTitle}" class="post-card-image" onerror="this.onerror=null;this.src='https://placehold.co/300x200/png';">
                    <h2 class="post-card-title">${cleanedTitle}</h2>
                </a>
            </div>
        `;
    }).join('');

    const pageContent = await renderTemplate(postsTemplate, { POST_GRID_ITEMS: postItems });
    const meta = generateMeta(null);
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

async function showSinglePost(slug) {
    const post = postsData.find(p => p.slug === slug);
    if (!post) return new Response('Postingan tidak ditemukan', { status: 404 });

    const cleanedTitle = cleanTitle(post.title);
    const mainContent = getMainContent(post.content);

    const pageContent = await renderTemplate(singleTemplate, {
        POST_TITLE: cleanedTitle,
        POST_CONTENT: mainContent,
        RELATED_POSTS: getRelatedPosts(slug)
    });

    const metaPost = { ...post, title: cleanedTitle };
    const meta = generateMeta(metaPost);
    const finalHtml = await renderTemplate(layout, {
        SEO_TITLE: meta.title,
        PAGE_CONTENT: pageContent,
        SITE_TITLE: settings.siteTitle,
        MOBILE_MENU_LINKS: generateMobileMenu(),
        FOOTER_MENU_LINKS: generateFooterMenu(),
        JSON_LD_SCRIPT: post.json_ld || ''
    });

    return new Response(finalHtml, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}

export async function handlePostsRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === '/' || path === '') {
        return await showPostList();
    }
    const pathParts = path.split('/').filter(part => part.length > 0);
    const slug = pathParts[pathParts.length - 1];
    if (!slug) {
        return showPostList();
    }
    return await showSinglePost(slug);
}