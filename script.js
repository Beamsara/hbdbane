// Snowflake creation
function createSnowflakes() {
    const snowflakes = document.querySelector('.snowflakes');
    const snowflakeCount = 50;

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.width = `${Math.random() * 5 + 5}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.animationName = 'fall';
        snowflake.style.zIndex = '1';
        snowflakes.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }

    setInterval(createSnowflake, 100);
}

// Candle management
let candleCount = 3;
const maxCandles = 5;
const candlesContainer = document.querySelector('.candles-container');
const addCandleBtn = document.getElementById('addCandleBtn');
const removeCandleBtn = document.getElementById('removeCandleBtn');
const blowBtn = document.getElementById('blowBtn');
const messageEl = document.getElementById('message');

function updateCandleButtons() {
    addCandleBtn.disabled = candleCount >= maxCandles;
    removeCandleBtn.disabled = candleCount <= 1;
}

function addCandle() {
    if (candleCount < maxCandles) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const flame = document.createElement('div');
        flame.className = 'flame';
        candle.appendChild(flame);
        candlesContainer.appendChild(candle);
        candleCount++;
        updateCandleButtons();
    }
}

function removeCandle() {
    if (candleCount > 1) {
        candlesContainer.removeChild(candlesContainer.lastChild);
        candleCount--;
        updateCandleButtons();
    }
}

function blowCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        flame.style.animation = 'flicker 0.1s infinite alternate, blowout 0.5s forwards';
    });
    messageEl.textContent = 'Happy Birthday! คุณเบญญญ!';
    setTimeout(() => {
        messageEl.textContent = '';
        flames.forEach(flame => {
            flame.style.animation = 'flicker 0.1s infinite alternate';
        });
    }, 3000);
}

// Event listeners
addCandleBtn.addEventListener('click', addCandle);
removeCandleBtn.addEventListener('click', removeCandle);
blowBtn.addEventListener('click', blowCandles);

// Initialize
createSnowflakes();
updateCandleButtons();

// Microphone-based candle blowing
function initMicrophoneBlowing() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            microphone.connect(analyser);

            function detectBlow() {
                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

                if (volume > 100) {
                    blowCandles();
                }

                requestAnimationFrame(detectBlow);
            }

            detectBlow();
        })
        .catch(err => console.error('Microphone access denied:', err));
}

initMicrophoneBlowing();