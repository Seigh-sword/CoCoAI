// webpage/script.js
import { AIHandler } from '../AIHandler/AIHandler.js'; 

const coco = new AIHandler();
const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');
const loader = document.getElementById('loader');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

async function handleAction() {
    const prompt = input.value.trim();
    if (!prompt) return;

    // UI Updates
    appendMessage('user', prompt);
    input.value = "";
    loader.classList.remove('hidden');
    statusDot.classList.add('active');
    statusText.innerText = "Thinking...";

    try {
        let result;
        if (prompt.startsWith('/image')) {
            const cleanPrompt = prompt.replace('/image', '').trim();
            // Using Flux for best 2025 image results
            result = await coco.img.prompt(cleanPrompt).set.model('flux').generate();
            appendMessage('ai', result, 'image');
        } else {
            // Default to OpenAI text
            result = await coco.txt.prompt(prompt).set.model('openai').generate();
            appendMessage('ai', result, 'text');
        }
    } catch (err) {
        appendMessage('ai', "🥥 CoCo tripped! The branch broke.");
    } finally {
        loader.classList.add('hidden');
        statusDot.classList.remove('active');
        statusText.innerText = "Ready";
    }
}

function appendMessage(sender, content, type = 'text') {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    
    if (sender === 'ai') {
        const icon = `<img src="https://raw.githubusercontent.com/Seigh-sword/Free-AI-For-All/refs/heads/main/assets/CoCoAiIcon.png" class="ai-icon">`;
        if (type === 'image') {
            msg.innerHTML = `${icon}<div class="img-wrap"><img src="${content}" class="gen-img"></div>`;
        } else {
            msg.innerHTML = `${icon}<span>${content}</span>`;
        }
    } else {
        msg.innerText = content;
    }
    
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

btn.onclick = handleAction;
input.onkeydown = (e) => e.key === 'Enter' && handleAction();
