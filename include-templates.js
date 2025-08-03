// Template Include System
class TemplateLoader {
    constructor() {
        this.templates = {};
    }

    // Load a template from file
    async loadTemplate(templateName, templatePath) {
        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            this.templates[templateName] = html;
            return html;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            return null;
        }
    }

    // Include template into an element
    includeTemplate(templateName, targetElement) {
        if (this.templates[templateName]) {
            targetElement.innerHTML = this.templates[templateName];
            return true;
        }
        return false;
    }

    // Load and include template in one step
    async loadAndInclude(templateName, templatePath, targetElement) {
        const html = await this.loadTemplate(templateName, templatePath);
        if (html) {
            targetElement.innerHTML = html;
            return true;
        }
        return false;
    }
}

// Initialize template loader
const templateLoader = new TemplateLoader();

// Function to load header and footer
async function loadHeaderAndFooter() {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        await templateLoader.loadAndInclude('header', 'header.htm', headerContainer);
    }

    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        await templateLoader.loadAndInclude('footer', 'footer.htm', footerContainer);
    }

    // Re-initialize any scripts that depend on header/footer elements
    if (typeof initializeScripts === 'function') {
        initializeScripts();
    }
}

// Load templates when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeaderAndFooter); 