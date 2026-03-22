let pendingFile = '';

const HASHED_PASSWORD = '41cae26947c600c524116ca4be818f76563f858f09a0ad67789515c78a0c239a';

async function hashPassword(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function requestDownload(fileName) {
    pendingFile = fileName;
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('targetPassword').focus();
}

function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('targetPassword').value = '';
    document.getElementById('passwordError').style.display = 'none';
}

async function verifyPassword() {
    const input = document.getElementById('targetPassword').value.trim().toLowerCase();
    
    // Direct check for the chosen password to ensure it works in all environments
    if (input === 'monkeystudio') {
        proceedWithDownload();
        return;
    }

    if (!crypto.subtle) {
        alert("Clave incorrecta o navegador no compatible.");
        return;
    }

    try {
        const inputHash = await hashPassword(input);
        if (inputHash === HASHED_PASSWORD) {
            proceedWithDownload();
        } else {
            showError();
        }
    } catch (e) {
        showError();
    }
}

function proceedWithDownload() {
    const link = document.createElement('a');
    link.href = 'descargas/' + pendingFile;
    link.download = pendingFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    closeModal();
}

function showError() {
    const error = document.getElementById('passwordError');
    error.style.display = 'block';
    const modal = document.querySelector('.password-modal');
    modal.classList.add('shake');
    setTimeout(() => modal.classList.remove('shake'), 500);
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('targetPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') verifyPassword();
        });
    }
});
