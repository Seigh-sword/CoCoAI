// AIHandler/AISyntax.js
export class AISyntax {
    constructor(handler) {
        this.handler = handler;
        this.config = {
            type: 'text', // 'text' or 'image'
            prompt: "",
            model: "openai", // Default text model
            seed: Math.floor(Math.random() * 1000000)
        };

        this.models = {
            text: {
                openai: "openai",          // GPT-5.2
                deepseek: "deepseek",      // Latest DeepSeek
                gemini: "gemini",          // Gemini 3 Flash
                sonar: "sonar-reasoning"   // Perplexity's Sonar
            },
            image: {
                flux: "flux",              // Fast, artistic
                seedream: "seedream",      // Detailed, higher resolution
                turbo: "turbo",            // Another fast option
                dalle: "dalle-3"           // OpenAI DALL-E 3 (requires specific use)
            }
        };

        // Chaining for text generation
        this.txt = {
            prompt: (text) => {
                this.config.type = 'text';
                this.config.prompt = text;
                return this;
            }
        };

        // Chaining for image generation
        this.img = {
            prompt: (text) => {
                this.config.type = 'image';
                this.config.prompt = text;
                // Default image model for img.prompt() if not explicitly set
                if (!this.config.model || !Object.values(this.models.image).includes(this.config.model)) {
                    this.config.model = this.models.image.flux; 
                }
                return this;
            }
        };

        // Setters for model and seed
        this.set = {
            model: (modelName) => {
                this.config.model = modelName;
                return this;
            },
            seed: (customSeed) => {
                this.config.seed = customSeed;
                return this;
            }
        };
    }

    async generate() {
        return await this.handler.generate();
    }
}
