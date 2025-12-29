// AIHandler/AILoader.js
export class AILoader {
    constructor() {
        this.textEndpoint = "https://text.pollinations.ai/";
        this.imageEndpoint = "https://image.pollinations.ai/"; // Dedicated image endpoint
    }

    /**
     * Loads either a text response or an image URL based on config.
     * @param {Object} config - The configuration from AISyntax
     * @returns {Promise<string>} - AI response (text or image URL)
     */
    async load(config) {
        const { type, prompt, model, seed } = config;
        let url;

        if (type === 'text') {
            url = `${this.textEndpoint}${encodeURIComponent(prompt)}?model=${model}&seed=${seed}`;
        } else if (type === 'image') {
            // For images, we return the direct URL which the browser will display
            url = `${this.imageEndpoint}prompt/${encodeURIComponent(prompt)}?model=${model}&seed=${seed}&nologo=true`;
            return url; // Directly return the URL for images
        } else {
            return "🥥 CoCo Error: Unknown generation type.";
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Try to parse error message from response if available
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            return await response.text();
        } catch (error) {
            console.error("CoCo Loader Error:", error);
            return `🥥 CoCo encountered a problem: ${error.message}`;
        }
    }
}
