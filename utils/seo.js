// File: src/utils/seo.js
import settings from '../data/settings.json';

// Fungsi untuk membuat excerpt/ringkasan dari konten HTML
function createExcerpt(html, maxLength = 160) {
    const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
}

// Fungsi utama untuk generate meta tags
export function generateMeta(item, type) {
    let meta = {
        title: settings.siteTitle,
        description: settings.siteDescription,
        canonical: settings.baseUrl,
    };

    if (item) {
        meta.title = `${item.title} | ${settings.siteTitle}`;
        meta.description = createExcerpt(item.content);

        meta.canonical = `${settings.baseUrl}/${item.slug}`;
    }

    return meta;
}