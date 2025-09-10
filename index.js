import { handlePostsRequest } from './handlers/handlePosts.js';
import { handlePageRequest } from './handlers/handlePage.js';
import { handleSitemapRequest } from './handlers/handleSitemap.js';
import { handleApiRequest } from './handlers/handleApi.js'; // <-- Impor handler baru
import postsData from './data/posts.json';

const STATIC_PAGE_SLUGS = ['contact', 'copyright', 'dmca', 'privacy-policy'];

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const slug = path.split('/')[1];

        // Rute baru untuk API
        if (path.startsWith('/api/')) { // <-- Tambahkan ini
            return handleApiRequest(request);
        }
        
        if (path === '/search-data.json') {
            const searchData = postsData.map(post => ({
                title: post.title,
                url: `/${post.slug}`
            }));
            return new Response(JSON.stringify(searchData), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        if (path === '/sitemap.xml') return handleSitemapRequest();
        if (STATIC_PAGE_SLUGS.includes(slug)) return handlePageRequest(request);

        return handlePostsRequest(request);
    },
};