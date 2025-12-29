export class AISyntax {
    constructor() {
        // 2025 Model Library
        this.models = {
            text: {
                openai: "openai",           // GPT-5.2 / 4o
                deepseek: "deepseek-r1",    // Reasoning specialist
                gemini: "gemini",           // Gemini 3 Flash (Default)
                mistral: "mistral",
                qwen: "qwen-coder",
                p1: "p1"                    // Pollinations Custom
            },
            image: {
                flux: "flux",
                turbo: "turbo",
                seedream: "seedream"        // 2025 High-Res (2K)
            },
            video: {
                veo: "veo",                 // Google's 2025 Video Model
                seedance: "seedance"
            }
        };

        // Internal State
        this.config = {
            text: { prompt: "", model: this.models.text.gemini },
            image: { prompt: "", model: this.models.image.flux },
            video: { prompt: "", model: this.models.video.veo },
            audio: { prompt: "", voice: "nova" },
            sfx: { prompt: "" },
            params: { seed: Math.floor(Math.random() * 99999), temp: 0.7, attachments: [] }
        };

        // Syntax Bindings
        this.txt = { prompt: (p) => { this.config.text.prompt = p; return this; } };
        this.img = { prompt: (p) => { this.config.image.prompt = p; return this; } };
        this.vid = { prompt: (p) => { this.config.video.prompt = p; return this; } };
        this.snd = { prompt: (p) => { this.config.audio.prompt = p; return this; } };
        this.sfx = { prompt: (p) => { this.config.sfx.prompt = p; return this; } };

        this.set = {
            txt: { model: (m) => { this.config.text.model = m; return this; } },
            img: { model: (m) => { this.config.image.model = m; return this; } },
            temp: (t) => { this.config.params.temp = t; return this; },
            seed: (s) => { this.config.params.seed = s; return this; }
        };

        this.attach = {
            url: (u) => { this.config.params.attachments.push({ type: 'url', url: u }); return this; },
            file: (f) => { this.config.params.attachments.push({ type: 'file', data: f }); return this; }
        };
    }
}
