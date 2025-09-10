import postsData from '../data/posts.json';

// --- Pastikan SEMUA fungsi helper ada di sini ---

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

function getFirstImage(htmlContent) {
    const match = htmlContent.match(/<img src=(?:"|')([^"']+)("|')/);
    return match ? match[1] : 'https://placehold.co/300x200/png';
}

export async function handleApiRequest(request) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const postsPerPage = 8;

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    
    const paginatedPosts = postsData.slice(start, end);

    const responseData = paginatedPosts.map(post => ({
        slug: post.slug,
        title: cleanTitle(post.title), // Judul bersih untuk API
        image: getFirstImage(post.content)
    }));

    return new Response(JSON.stringify(responseData), {
        headers: { 'Content-Type': 'application/json' },
    });
}