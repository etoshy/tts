const textoParaFalar = document.getElementById('textoParaFalar');
const vozSelect = document.getElementById('vozSelect');
const taxaFala = document.getElementById('taxaFala');
const valorTaxaFala = document.getElementById('valorTaxaFala');
const volume = document.getElementById('volume');
const valorVolume = document.getElementById('valorVolume');
const pitch = document.getElementById('pitch');
const valorPitch = document.getElementById('valorPitch');
const falarBtn = document.getElementById('falarBtn');
const pararBtn = document.getElementById('pararBtn');

let synth = window.speechSynthesis;
let utterance = null;
let voices = [];

// Função para preencher as opções de voz
function popularVozes() {
    voices = synth.getVoices();
    vozSelect.innerHTML = ''; // Limpa as opções existentes
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        vozSelect.appendChild(option);
    });
}

// Evento que dispara quando as vozes são carregadas
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = popularVozes;
} else {
    // Para navegadores que podem não disparar onvoiceschanged de imediato
    popularVozes();
}

// Atualizar valores dos sliders
taxaFala.addEventListener('input', () => {
    valorTaxaFala.textContent = taxaFala.value;
});

volume.addEventListener('input', () => {
    valorVolume.textContent = volume.value;
});

pitch.addEventListener('input', () => {
    valorPitch.textContent = pitch.value;
});


// Função para falar o texto
falarBtn.addEventListener('click', () => {
    if (textoParaFalar.value.trim() === '') {
        alert('Por favor, digite um texto para falar.');
        return;
    }

    if (synth.speaking) {
        // Se já estiver falando, pare antes de começar uma nova fala
        synth.cancel();
    }

    utterance = new SpeechSynthesisUtterance(textoParaFalar.value);

    // Seleciona a voz
    const selectedVoiceName = vozSelect.selectedOptions[0].getAttribute('data-name');
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Configurações de fala
    utterance.rate = parseFloat(taxaFala.value);
    utterance.volume = parseFloat(volume.value);
    utterance.pitch = parseFloat(pitch.value);

    // Eventos para controlar os botões
    utterance.onstart = () => {
        falarBtn.disabled = true;
        pararBtn.disabled = false;
    };

    utterance.onend = () => {
        falarBtn.disabled = false;
        pararBtn.disabled = true;
    };

    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        falarBtn.disabled = false;
        pararBtn.disabled = true;
        alert('Ocorreu um erro ao tentar falar o texto. Verifique o console para mais detalhes.');
    };

    synth.speak(utterance);
});

// Função para parar a fala
pararBtn.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
        falarBtn.disabled = false;
        pararBtn.disabled = true;
    }
});

// Inicializa as vozes caso já estejam disponíveis
popularVozes();