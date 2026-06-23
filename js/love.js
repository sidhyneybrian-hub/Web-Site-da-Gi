window.onload = function () {
    // --- FUNÇÃO DE GIFS ALEATÓRIOS PARA O FUNDO ---
    function carregarGifsDeFundo() {
        const container = document.getElementById('bg-gifs');
        if (!container) return;
        container.innerHTML = '';

        const numeros = Array.from({ length: 20 }, (_, i) => i + 1);

        function randomOutsideCenter() {
            while (true) {
                const x = Math.floor(Math.random() * 84) + 8;
                const y = Math.floor(Math.random() * 84) + 8;
                if (!(x > 25 && x < 75 && y > 18 && y < 58)) {
                    return { x, y };
                }
            }
        }

        numeros.forEach((gifNum) => {
            const img = document.createElement('img');
            img.src = `images/${gifNum}.gif`;
            img.className = 'random-bg-gif';

            const position = randomOutsideCenter();
            img.style.left = `${position.x}%`;
            img.style.top = `${position.y}%`;

            const tamanho = Math.floor(Math.random() * 90) + 80;
            img.style.width = `${tamanho}px`;

            const rotacao = Math.floor(Math.random() * 40) - 20;
            img.style.transform = `translate(-50%, -50%) rotate(${rotacao}deg)`;
            img.style.opacity = 0.55;
            img.style.animationDuration = `${18 + Math.random() * 8}s`;
            img.style.animationDelay = `${Math.random() * 4}s`;

            container.appendChild(img);
        });
    }
    
    // Executa a função imediatamente
    carregarGifsDeFundo();

    // VERIFICA O RECARREGAMENTO PRIMEIRO
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        window.location.href = 'index.html';
        return; 
    }

    // --- 1. CONTEXTO DE ÁUDIO E ELEMENTOS DO DOM ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audio = document.getElementById('audios');
    const muteButton = document.getElementById('mute-button');

    // --- CONFIGURAÇÃO DA TUA GALERIA (EDITA AQUI) ---
    // Coloca as tuas fotos na pasta "images/" ou usa links da internet
    const memorias = [
        { tipo: 'imagem', src: 'images/foto1.webp', texto: 'Desde o primeiro dia, soube que eras especial... ❤️' },
        { tipo: 'video', src: 'images/video1.mp4', texto: 'Cada momento ao teu lado é um sonho tornado realidade. ✨' },
        { tipo: 'imagem', src: 'images/foto2.png', texto: 'Adoro a tua cumplicidade e as nossas loucuras juntos! 👩‍❤️‍👨' },
        { tipo: 'video', src: 'images/video2.mp4', texto: 'Prometo amar-te hoje, amanhã e para sempre. 🌹' },
        { tipo: 'imagem', src: 'images/foto3.jpg', texto: 'O teu sorriso é o meu lugar favorito no mundo. 🥰' },
        { tipo: 'imagem', src: 'images/foto4.png', texto: 'Obrigado por seres a minha melhor metade e a minha melhor amiga. 💖' }
    ];

    // --- 2. DEFINIÇÕES DE FUNÇÕES ---
    function createPetals() {
        const petalContainer = document.getElementById('petal-container');
        if (!petalContainer) return;
        const petalCount = 30;
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            const randomX = Math.random() * 100;
            const randomSize = Math.random() * 15 + 10;
            const fallDuration = Math.random() * 10 + 8;
            const animationDelay = Math.random() * 12;
            petal.style.left = `${randomX}vw`;
            petal.style.width = `${randomSize}px`;
            petal.style.height = `${randomSize * 1.25}px`;
            petal.style.opacity = Math.random() * 0.5 + 0.5;
            petal.style.animationDuration = `${fallDuration}s`;
            petal.style.animationDelay = `${animationDelay}s`;
            petalContainer.appendChild(petal);
        }
    }

    function playPlopSound() {
        if (!audioContext) return;
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // NOVA FUNÇÃO: Controla a Galeria Romântica
    function iniciarGaleria() {
        const animContainer = document.getElementById('main-animation-container');
        const galleryContainer = document.getElementById('gallery-container');
        const imgElement = document.getElementById('gallery-media');
        const videoElement = document.getElementById('gallery-video');
        const textElement = document.getElementById('gallery-text');

        // Transição suave: esconde o envelope e mostra a galeria com um leve fade
        if (animContainer) {
            animContainer.style.transition = "opacity 2s";
            animContainer.style.opacity = "0";
        }
        
        setTimeout(() => {
            if (animContainer) animContainer.style.display = 'none';
            if (galleryContainer) {
                galleryContainer.style.display = 'flex';
                galleryContainer.style.opacity = 0;
                galleryContainer.style.transition = "opacity 2s";
                setTimeout(() => galleryContainer.style.opacity = 1, 100);
            }
            
            let currentSlide = 0;

            function mostrarProximoSlide() {
                const item = memorias[currentSlide];
                
                // Animação de fade-out no conteúdo antigo
                if (imgElement) imgElement.style.opacity = 0;
                if (videoElement) videoElement.style.opacity = 0;
                if (textElement) textElement.style.opacity = 0;

                setTimeout(() => {
                    if (textElement) textElement.textContent = item.texto || '';

                    if (item.tipo === 'video') {
                        if (imgElement) imgElement.style.display = 'none';
                        if (videoElement) {
                            videoElement.style.display = 'block';
                            videoElement.src = item.src || '';
                        }
                    } else {
                        if (videoElement) videoElement.style.display = 'none';
                        if (imgElement) {
                            imgElement.style.display = 'block';
                            imgElement.src = item.src || '';
                        }
                    }

                    // Aplica fade-in no novo conteúdo
                    setTimeout(() => {
                        if (imgElement) imgElement.style.opacity = 1;
                        if (videoElement) videoElement.style.opacity = 1;
                        if (textElement) textElement.style.opacity = 1;
                    }, 100);

                    currentSlide = (currentSlide + 1) % memorias.length;
                }, 1000); // tempo do fade-out
            }

            mostrarProximoSlide();
            setInterval(mostrarProximoSlide, 5000); // Muda de foto a cada 5 segundos
        }, 2000);
    }

    function iniciarHistoria() {
        const animContainer = document.getElementById('main-animation-container');
        const galleryContainer = document.getElementById('gallery-container');
        const storySection = document.getElementById('story-section');

        if (animContainer) {
            animContainer.style.transition = "opacity 1.2s";
            animContainer.style.opacity = "0";
        }
        if (galleryContainer) {
            galleryContainer.style.transition = "opacity 1.2s";
            galleryContainer.style.opacity = "0";
        }

        setTimeout(() => {
            if (animContainer) animContainer.style.display = 'none';
            if (galleryContainer) galleryContainer.style.display = 'none';
            if (storySection) {
                storySection.style.display = 'flex';
                storySection.style.opacity = 0;
                storySection.style.transition = "opacity 1.2s";
                setTimeout(() => storySection.style.opacity = 1, 100);
            }
            setupStoryGame();
            startPhotoSlideshow();
            startElapsedTimer();
        }, 700);
    }

    function setupStoryGame() {
        const cells = Array.from(document.querySelectorAll('.cell'));
        const statusText = document.getElementById('game-status');
        const resetButton = document.getElementById('reset-game');
        const playAIButton = document.getElementById('play-ai');
        const playPartnerButton = document.getElementById('play-partner');

        if (!statusText || !resetButton || !playAIButton || !playPartnerButton || cells.length !== 9) {
            return;
        }

        let board = Array(9).fill('');
        let gameMode = '';
        let currentPlayer = 'X';
        let gameActive = false;

        const winningCombinations = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        function resetGame() {
            board = Array(9).fill('');
            currentPlayer = 'X';
            gameActive = !!gameMode;
            cells.forEach(cell => {
                cell.style.backgroundImage = '';
                cell.style.backgroundColor = '#fff0f5';
                cell.textContent = '';
                cell.disabled = !gameActive;
            });
            updateStatus();
            if (gameMode === 'ai' && currentPlayer === 'O') {
                setTimeout(makeAIMove, 600);
            }
        }

        function updateStatus(message) {
            if (message) {
                statusText.textContent = message;
                return;
            }
            if (!gameMode) {
                statusText.textContent = 'Escolha um modo para começar a jogar.';
            } else if (!gameActive) {
                statusText.textContent = 'Clique em Reiniciar para jogar novamente.';
            } else {
                statusText.textContent = `Vez de ${currentPlayer === 'X' ? 'X (GIF 20)' : 'O (GIF 18)'}`;
            }
        }

        function setCellValue(cell, index, player) {
            board[index] = player;
            cell.style.backgroundImage = `url('images/${player === 'X' ? 20 : 18}.gif')`;
            cell.style.backgroundSize = 'cover';
            cell.style.backgroundPosition = 'center';
            cell.style.backgroundRepeat = 'no-repeat';
            cell.textContent = '';
            cell.disabled = true;
        }

        function checkWinner() {
            for (const combo of winningCombinations) {
                const [a, b, c] = combo;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            return board.includes('') ? null : 'draw';
        }

        function makeMove(index) {
            if (!gameActive || board[index] !== '') return;
            const cell = cells[index];
            setCellValue(cell, index, currentPlayer);
            const result = checkWinner();
            if (result) {
                endGame(result);
                return;
            }
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
            if (gameMode === 'ai' && currentPlayer === 'O') {
                setTimeout(makeAIMove, 600);
            }
        }

        function endGame(result) {
            gameActive = false;
            if (result === 'draw') {
                statusText.textContent = 'Empate! 🟰';
            } else {
                statusText.textContent = `${result} venceu!`;
            }
            cells.forEach(cell => cell.disabled = true);
        }

        function makeAIMove() {
            if (!gameActive) return;
            const index = getBestAIMove();
            if (index !== null) {
                makeMove(index);
            }
        }

        function getBestAIMove() {
            const winningMove = findAtRisk('O');
            if (winningMove !== null) return winningMove;
            const blockMove = findAtRisk('X');
            if (blockMove !== null) return blockMove;
            if (board[4] === '') return 4;
            const corners = [0,2,6,8].filter(i => board[i] === '');
            if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
            const empties = board.map((value,index) => value === '' ? index : null).filter(v => v !== null);
            return empties.length ? empties[Math.floor(Math.random()*empties.length)] : null;
        }

        function findAtRisk(player) {
            for (const combo of winningCombinations) {
                const [a,b,c] = combo;
                const values = [board[a], board[b], board[c]];
                if (values.filter(v => v === player).length === 2 && values.includes('')) {
                    return combo[values.indexOf('')];
                }
            }
            return null;
        }

        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => makeMove(index));
            cell.disabled = true;
        });

        playAIButton.addEventListener('click', () => {
            gameMode = 'ai';
            currentPlayer = 'X';
            gameActive = true;
            resetGame();
        });

        playPartnerButton.addEventListener('click', () => {
            gameMode = 'partner';
            currentPlayer = 'X';
            gameActive = true;
            resetGame();
        });

        resetButton.addEventListener('click', () => {
            resetGame();
        });

        updateStatus();
    }

    function startPhotoSlideshow() {
        const albumPhoto = document.getElementById('album-photo');
        const albumNote = document.getElementById('album-note');
        if (!albumPhoto || !albumNote) return;

        const albumVideo = document.getElementById('album-video');
        const slides = [
            { type: 'image', src: 'images/foto1.webp', note: 'Lembra do nosso primeiro passeio? Foi aí que entendi que você era meu lar.' },
            { type: 'video', src: 'images/video1.mp4', note: 'Este vídeo me lembra o brilho do teu sorriso em cada momento juntos.' },
            { type: 'image', src: 'images/foto2.png', note: 'Cada risada contigo fez meu coração se sentir mais leve.' },
            { type: 'video', src: 'images/video2.mp4', note: 'A tua voz, o teu olhar e a nossa conexão em cada cena.' },
            { type: 'image', src: 'images/foto3.jpg', note: 'Obrigado por tornar todos os dias mais doces. Você é meu melhor presente.' },
            { type: 'image', src: 'images/foto4.png', note: 'Prometo estar ao teu lado nos planos, nos sonhos e nas pequenas aventuras.' },
            { type: 'image', src: 'images/foto1.webp', note: 'Adoro a forma como o teu sorriso ilumina até os dias mais cinzentos.' },
            { type: 'image', src: 'images/foto2.png', note: 'Guardo este álbum no coração, com cada recado como uma promessa de carinho.' }
        ];

        let currentIndex = 0;

        function showSlide(index) {
            const slide = slides[index];
            albumPhoto.style.opacity = '0';
            albumNote.style.opacity = '0';
            if (albumVideo) albumVideo.style.opacity = '0';

            setTimeout(() => {
                if (slide.type === 'video') {
                    if (albumPhoto) albumPhoto.style.display = 'none';
                    if (albumVideo) {
                        albumVideo.src = slide.src;
                        albumVideo.style.display = 'block';
                        albumVideo.play().catch(() => {});
                    }
                } else {
                    if (albumVideo) albumVideo.pause();
                    if (albumVideo) albumVideo.style.display = 'none';
                    if (albumPhoto) {
                        albumPhoto.style.display = 'block';
                        albumPhoto.src = slide.src;
                    }
                }

                albumNote.textContent = slide.note;
                if (albumPhoto) albumPhoto.style.opacity = '1';
                if (albumVideo) albumVideo.style.opacity = '1';
                albumNote.style.opacity = '1';
            }, 500);
        }

        showSlide(currentIndex);
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 5000);
    }

    function startElapsedTimer() {
        const timerElement = document.getElementById('elapsed-timer');
        if (!timerElement) return;
        const startDate = new Date(2026, 3, 25, 20, 0, 0);

        function updateTimer() {
            const now = new Date();
            let years = 0;
            let months = 0;
            let current = new Date(startDate);

            while (true) {
                const next = new Date(current);
                next.setFullYear(next.getFullYear() + 1);
                if (next <= now) {
                    years++;
                    current = next;
                } else {
                    break;
                }
            }

            while (true) {
                const next = new Date(current);
                next.setMonth(next.getMonth() + 1);
                if (next <= now) {
                    months++;
                    current = next;
                } else {
                    break;
                }
            }

            const diff = now - current;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            timerElement.textContent = `${String(years).padStart(2,'0')} anos ${String(months).padStart(2,'0')} meses ${String(days).padStart(2,'0')} dias ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // --- 3. SISTEMA DO ENVELOPE INTERATIVO ---
    function setupEnvelope() {
        const envelopeWrapper = document.getElementById('envelope-click');
        const letterMain = document.getElementById('letter-main');
        const pagina1 = document.getElementById('pagina-1');
        const pagina2 = document.getElementById('pagina-2');
        const btnProximaFolha = document.getElementById('btn-proxima-folha');
        const btnIrGaleria = document.getElementById('btn-ir-galeria');

        if (!envelopeWrapper || !letterMain) return;

        // Abrir envelope ao clicar
        envelopeWrapper.addEventListener('click', () => {
            if (!envelopeWrapper.classList.contains('open')) {
                envelopeWrapper.classList.add('open');
                playPlopSound();
            }
        });

        // Passar para a segunda folha com animação de flip
        if (btnProximaFolha) {
            btnProximaFolha.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita ativar o click do envelope novamente
                playPlopSound();
                
                // Aplicar animação de flip no papel inteiro (letterMain)
                if (letterMain) {
                    letterMain.classList.add('flip-animation');
                    // Esconder page 1 e mostrar page 2 após metade da animação
                    setTimeout(() => {
                        if (pagina1) pagina1.style.display = 'none';
                        if (pagina2) pagina2.style.display = 'flex';
                    }, 300); // Meio da animação (0.6s / 2 = 0.3s)
                    
                    setTimeout(() => {
                        if (letterMain) letterMain.classList.remove('flip-animation');
                    }, 600);
                }
            });
        }

        // Ir para a história e o jogo
        if (btnIrGaleria) {
            btnIrGaleria.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita ativar o click do envelope novamente
                playPlopSound();

                // Volta com a carta para o envelope antes de seguir
                if (envelopeWrapper.classList.contains('open')) {
                    envelopeWrapper.classList.remove('open');
                }

                setTimeout(() => {
                    iniciarHistoria();
                }, 700); // espera fechar o envelope
            });
        }
    }

    // --- 4. INICIALIZAÇÃO ---
    (function setup() {
        createPetals();

        if (muteButton && audio) {
            muteButton.addEventListener('click', () => {
                audio.muted = !audio.muted;
                muteButton.textContent = audio.muted ? '🔇' : '🔊';
            });
        }
        
        audio.play().catch(e => console.warn("Autoplay da música foi bloqueado pelo navegador.", e));

        // Inicia o sistema do envelope
        setupEnvelope();
    })();
};