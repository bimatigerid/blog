// File: src/utils/menu.js
import pagesData from '../data/pages.json';

/**
 * Menghasilkan string HTML untuk link menu mobile.
 * @returns {string} HTML untuk <li><a>...</a></li>
 */
export function generateMobileMenu() {
    let menuHtml = '<li><a href="/">Home</a></li>'; // Selalu tambahkan link Home
    pagesData.forEach(page => {
        menuHtml += `<li><a href="/${page.slug}">${page.title}</a></li>`;
    });
    return menuHtml;
}

/**
 * Menghasilkan string HTML untuk link menu footer.
 * @returns {string} HTML untuk <a>...</a>
 */
export function generateFooterMenu() {
    let menuHtml = '';
    pagesData.forEach((page, index) => {
        menuHtml += `<a href="/${page.slug}">${page.title}</a>`;
        // Tambahkan pemisah "|" jika bukan link terakhir
        if (index < pagesData.length - 1) {
            menuHtml += ' | ';
        }
    });
    return menuHtml;
}