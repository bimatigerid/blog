import postsData from '../data/posts.json';
import pagesData from '../data/pages.json';
import settings from '../data/settings.json';

export async function handleSitemapRequest() {
    const baseUrl = settings.baseUrl;
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // 1. Halaman Utama (Homepage)
    // Diberi prioritas tertinggi (1.0) dan diindikasikan untuk sering diperbarui.
    xml += `
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    // 2. Halaman Statis (Contact, DMCA, dll.)
    // Diberi prioritas sedang (0.8) karena jarang berubah.
    pagesData.forEach(page => {
        xml += `
        <url>
            <loc>${baseUrl}/${page.slug}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>`;
    });

    // 3. Semua Halaman Postingan
    // Diberi prioritas tinggi (0.9) dan menggunakan tanggal update dari data.
    postsData.forEach(post => {
        // Ambil tanggal update dari 'updated_at', jika tidak ada, gunakan tanggal publikasi
        const lastModDate = post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : new Date(post.published_at).toISOString().split('T')[0];
        
        xml += `
        <url>
            <loc>${baseUrl}/${post.slug}</loc>
            <lastmod>${lastModDate}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>`;
    });

    xml += '</urlset>';

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'max-age=3600' // Cache sitemap selama 1 jam
        }
    });
}