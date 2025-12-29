// AIHandler/AILoader.js
export class AILoader {
    constructor() {
        // 2025 Unified API Endpoint
        this.endpoint = "https://gen.pollinations.ai/";
    }

    async load(config) {
        // New 2025 Format
        const params = new URLSearchParams({
            model: config.text.model,
            seed: config.params.seed,
            json: false // Set to true if you want structured data
        });

        const url = `${this.endpoint}${encodeURIComponent(config.text.prompt)}?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("CoCo couldn't reach the server.");
            return await response.text();
        } catch (error) {
            return `🥥 CoCo Error: ${error.message}`;
        }
    }
}
