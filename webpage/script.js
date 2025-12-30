import { AIHandler } from '../AIHandler/AIHandler.js';

const coco = new AIHandler();
const libraryGrid = document.getElementById('library-grid');
const loader = document.getElementById('loader');
const userInput = document.getElementById('userInput');
const chat = document.getElementById('chat');
// webpage/script.js - Add these near the top with your other variables
const filePicker = document.getElementById('filePicker');
const attachBtn = document.getElementById('attachBtn');
const filePreview = document.getElementById('filePreview');
let attachedFileContent = "";

// --- FILE ATTACHMENT LOGIC ---
attachBtn.onclick = () => filePicker.click();

filePicker.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        attachedFileContent = event.target.result;
        filePreview.innerHTML = `📄 Attached: <strong>${file.name}</strong> <span id="removeFile">×</span>`;
        filePreview.classList.remove('hidden');
        
        // Add functionality to remove the file
        document.getElementById('removeFile').onclick = () => {
            attachedFileContent = "";
            filePreview.classList.add('hidden');
            filePicker.value = "";
        };
    };
    reader.readAsText(file);
};

// --- UPDATED HANDLE ACTION ---
async function handleAction() {
    let prompt = userInput.value.trim();
    
    // If a file is attached, merge it with the prompt
    if (attachedFileContent) {
        prompt = `Attached File Content:\n${attachedFileContent}\n\nUser Message: ${prompt}`;
    }

    if (!prompt && !attachedFileContent) return;

    // UI Feedback (Show the user message, not the whole file block to keep chat clean)
    appendMessage('user', userInput.value || `Analyzed file: ${filePicker.files[0].name}`);
    
    // Clear inputs
    userInput.value = "";
    attachedFileContent = ""; 
    filePreview.classList.add('hidden');
    filePicker.value = "";
    
    loader.classList.remove('hidden');

    try {
        if (prompt.startsWith('/image')) {
            // ... (keep your existing image logic here)
        } else {
            const res = await coco.txt.prompt(prompt).set.model('openai').generate();
            appendMessage('ai', res);
        }
    } catch (e) {
        appendMessage('ai', "🥥 CoCo couldn't read that file. Is it too big?");
    } finally {
        loader.classList.add('hidden');
        userInput.focus();
    }
}

// --- 1. LOCAL STORAGE LIBRARY ---
function saveToLibrary(url) {
    let images = JSON.parse(localStorage.getItem('coco_library') || '[]');
    images.push({ url, date: new Date().toLocaleDateString() });
    localStorage.setItem('coco_library', JSON.stringify(images));
    updateLibraryUI();
}

function updateLibraryUI() {
    if(!libraryGrid) return;
    const images = JSON.parse(localStorage.getItem('coco_library') || '[]');
    libraryGrid.innerHTML = images.map(img => `
        <div class="lib-card">
            <img src="${img.url}" onclick="downloadImage('${img.url}', 'jpg')">
        </div>
    `).join('');
}

// --- 2. DOWNLOAD ENGINE ---
window.downloadImage = async (url, format) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `CoCo_Art_${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Download failed:", e);
        alert("Could not download image. Try right-clicking it!");
    }
};

// --- 3. CHAT LOGIC ---
async function handleAction() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    appendMessage('user', prompt);
    userInput.value = "";
    loader.classList.remove('hidden');

    try {
        if (prompt.startsWith('/image')) {
            const cleanPrompt = prompt.replace('/image', '').trim();
            const resultUrl = await coco.img.prompt(cleanPrompt).set.model('flux').generate();
            
            // Generate unique ID for reveal animation
            const imgId = 'img-' + Date.now();
            
            appendMessage('ai', `<div class="img-container">
                <img id="${imgId}" src="${resultUrl}" class="gen-img">
                <div class="dl-btns">
                    <button onclick="downloadImage('${resultUrl}', 'jpg')">Save JPG</button>
                </div>
            </div>`, 'html');

            // Trigger Slow Reveal
            setTimeout(() => {
                const imgEl = document.getElementById(imgId);
                if(imgEl) imgEl.classList.add('revealed');
            }, 100);
            
            saveToLibrary(resultUrl);
        } else {
            // Text Mode
            const res = await coco.txt.prompt(prompt).set.model('openai').generate();
            appendMessage('ai', res);
        }
    } catch (e) { 
        console.error(e);
        appendMessage('ai', "CoCo tripped over a root! Please try again.");
    } finally { 
        loader.classList.add('hidden'); 
        userInput.focus();
    }
}

// --- 4. THE MISSING FUNCTION (Fixed!) ---
function appendMessage(sender, content, type = 'text') {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    
    // CoCo Icon
    const iconHTML = sender === 'ai' ? 
        `<img src="https://raw.githubusercontent.com/Seigh-sword/Free-AI-For-All/refs/heads/main/assets/CoCoAiIcon.png" class="ai-icon">` : '';

    if (type === 'html') {
        msg.innerHTML = `${iconHTML}<div>${content}</div>`;
    } else {
        msg.innerHTML = `${iconHTML}<span>${content}</span>`;
    }
    
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// --- 5. PANEL NAVIGATION ---
// We attach these to 'window' so HTML onclick="" works
window.showPanel = (type) => {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`${type}-panel`);
    if(target) target.classList.remove('hidden');
};

window.hidePanels = () => {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
};

window.clearLibrary = () => {
    if(confirm("Delete all saved images?")) {
        localStorage.removeItem('coco_library');
        updateLibraryUI();
    }
};

// Init
document.getElementById('sendBtn').onclick = handleAction;
userInput.onkeydown = (e) => { if(e.key === 'Enter') handleAction(); };
updateLibraryUI();
