// File: src/utils/renderer.js

export async function renderTemplate(template, data) {
    let renderedHtml = template;
    for (const key in data) {
        // Menggunakan regex global 'g' untuk mengganti semua kemunculan
        const regex = new RegExp(`{{${key}}}`, 'g');
        renderedHtml = renderedHtml.replace(regex, data[key]);
    }
    return renderedHtml;
}