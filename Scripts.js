let pendingFile = '';

const HASHED_PASSWORD = '3b0d46dd961f7481f9b37d45543c8d35f414731f92e3a137b0191faed121338b';

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
    const input = document.getElementById('targetPassword').value;
    const inputHash = await hashPassword(input);

    if (inputHash === HASHED_PASSWORD) {
        const link = document.createElement('a');
        link.href = 'descargas/' + pendingFile;
        link.download = pendingFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closeModal();
    } else {
        const error = document.getElementById('passwordError');
        error.style.display = 'block';
        const modal = document.querySelector('.password-modal');
        modal.classList.add('shake');
        setTimeout(() => modal.classList.remove('shake'), 500);
    }
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
