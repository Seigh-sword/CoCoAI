// AIHandler/AISyntax.js
export class AISyntax {
    constructor() {
        this.models = {
            text: {
                openai: "openai", 
                deepseek: "deepseek-r1", // High-reasoning model
                gemini: "gemini",        // Default: Gemini 3 Flash
                p1: "p1"
            },
            image: {
                flux: "flux",
                seedream: "seedream",    // 2K resolution model
                turbo: "turbo"
            }
        };

        this.config = {
            text: { prompt: "", model: "gemini" },
            image: { prompt: "", model: "flux" },
            params: { seed: Math.floor(Math.random() * 99999) }
        };

        this.txt = { prompt: (p) => { this.config.text.prompt = p; return this; } };
        this.img = { prompt: (p) => { this.config.image.prompt = p; return this; } };
        
        this.set = {
            txt: { model: (m) => { this.config.text.model = m; return this; } },
            img: { model: (m) => { this.config.image.model = m; return this; } },
            seed: (s) => { this.config.params.seed = s; return this; }
        };
    }
}
