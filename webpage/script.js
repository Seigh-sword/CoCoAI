import { AIHandler } from '../AIHandler/AIHandler.js';

const coco = new AIHandler();
const libraryGrid = document.getElementById('library-grid');
const loader = document.getElementById('loader');
const userInput = document.getElementById('userInput');
const chat = document.getElementById('chat');
const filePicker = document.getElementById('filePicker');
const attachBtn = document.getElementById('attachBtn');
const filePreview = document.getElementById('filePreview');

let attachedFileContent = "";
let attachedFileName = "";

// --- FILE ATTACHMENT LOGIC ---
attachBtn.onclick = () => filePicker.click();

filePicker.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        attachedFileContent = event.target.result;
        attachedFileName = file.name;
        filePreview.innerHTML = `📄 ${file.name} <span id="removeFile">×</span>`;
        filePreview.classList.remove('hidden');
        
        document.getElementById('removeFile').onclick = () => {
            attachedFileContent = "";
            attachedFileName = "";
            filePreview.classList.add('hidden');
            filePicker.value = "";
        };
    };
    reader.readAsText(file);
};

// --- SINGLE MERGED HANDLE ACTION ---
async function handleAction() {
    let text = userInput.value.trim();
    
    // Safety check: Don't send if both are empty
    if (!text && !attachedFileContent) return;

    // Build the "Actual Prompt" for the AI
    let finalPrompt = text;
    if (attachedFileContent) {
        finalPrompt = `[FILE ATTACHED: ${attachedFileName}]\n${attachedFileContent}\n\nUser Question: ${text}`;
    }

    // Show User Message in Chat
    const userDisplay = text || `Uploaded and analyzing: ${attachedFileName}`;
    appendMessage('user', userDisplay);
    
    // Reset inputs immediately
    userInput.value = "";
    const currentFileName = attachedFileName; // store for the AI response
    attachedFileContent = "";
    attachedFileName = "";
    filePreview.classList.add('hidden');
    filePicker.value = "";
    
    loader.classList.remove('hidden');

    try {
        if (text.startsWith('/image')) {
            const cleanPrompt = text.replace('/image', '').trim();
            const resultUrl = await coco.img.prompt(cleanPrompt).set.model('flux').generate();
            
            const imgId = 'img-' + Date.now();
            appendMessage('ai', `
                <div class="img-container">
                    <img id="${imgId}" src="${resultUrl}" class="gen-img">
                    <div class="dl-btns">
                        <button onclick="downloadImage('${resultUrl}', 'jpg')">Save JPG</button>
                    </div>
                </div>`, 'html');

            setTimeout(() => {
                const imgEl = document.getElementById(imgId);
                if(imgEl) imgEl.classList.add('revealed');
            }, 100);
            
            saveToLibrary(resultUrl);
        } else {
            // Send the merged prompt (Text + File) to AI
            const res = await coco.txt.prompt(finalPrompt).set.model('openai').generate();
            appendMessage('ai', res);
        }
    } catch (e) {
        appendMessage('ai', "🥥 CoCo tripped! The file might be too big or the connection dropped.");
        console.error(e);
    } finally {
        loader.classList.add('hidden');
        userInput.focus();
    }
}

// --- UTILS & NAVIGATION (Keep these as they were) ---
function appendMessage(sender, content, type = 'text') {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    const iconHTML = sender === 'ai' ? `<img src="https://raw.githubusercontent.com/Seigh-sword/Free-AI-For-All/refs/heads/main/assets/CoCoAiIcon.png" class="ai-icon">` : '';
    
    if (type === 'html') {
        msg.innerHTML = `${iconHTML}<div>${content}</div>`;
    } else {
        msg.innerHTML = `${iconHTML}<span>${content}</span>`;
    }
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

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

window.downloadImage = async (url, format) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `CoCo_Art_${Date.now()}.${format}`;
        link.click();
    } catch (e) { alert("Download failed!"); }
};

window.showPanel = (type) => {
    hidePanels();
    document.getElementById(`${type}-panel`).classList.remove('hidden');
};

window.hidePanels = () => {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
};

document.getElementById('sendBtn').onclick = handleAction;
userInput.onkeydown = (e) => { if(e.key === 'Enter') handleAction(); };
updateLibraryUI();
