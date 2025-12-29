export class AISyntax {
    constructor(handler) {
        this.handler = handler;
        this.models = {
            text: {
                openai: "openai",          // GPT-5.2
                deepseek: "deepseek",      // Note: Just 'deepseek' in the new API
                gemini: "gemini",          // Gemini 3 Flash (Fast & Free)
                sonar: "sonar-reasoning"   // Perplexity's new 2025 model
            }
        };

        this.config = {
            text: { prompt: "", model: this.models.text.gemini }, // Gemini is most stable today
            params: { seed: Math.floor(Math.random() * 99999) }
        };

        this.txt = { prompt: (p) => { this.config.text.prompt = p; return this; } };
        this.set = {
            txt: { model: (m) => { this.config.text.model = m; return this; } },
            seed: (s) => { this.config.params.seed = s; return this; }
        };
    }

    async generate() {
        return await this.handler.generate();
    }
}
