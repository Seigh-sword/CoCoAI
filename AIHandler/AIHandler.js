// AIHandler/AIHandler.js
import { AISyntax } from './AISyntax.js';
import { AILoader } from './AILoader.js';

export class AIHandler {
    constructor() {
        this.syntax = new AISyntax();
        this.loader = new AILoader();
        
        // Mapping for easy access
        this.txt = this.syntax.txt;
        this.img = this.syntax.img;
        this.set = this.syntax.set;
        this.models = this.syntax.models;
    }

    async generate() {
        return await this.loader.load(this.syntax.config);
    }
}
