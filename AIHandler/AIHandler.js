import { AISyntax } from './AISyntax.js';
import { AILoader } from './AILoader.js';

export class AIHandler {
    constructor() {
        this.loader = new AILoader();
        // Pass 'this' so Syntax can call handler.generate()
        this.syntax = new AISyntax(this); 
        
        this.txt = this.syntax.txt;
        this.img = this.syntax.img;
        this.set = this.syntax.set;
        this.models = this.syntax.models;
    }

    async generate() {
        // AIHandler calls the loader using the syntax config
        return await this.loader.load(this.syntax.config);
    }
}
