
        // Scene management
        const scenes = [
            document.getElementById('scene1'),
            document.getElementById('scene2'),
            document.getElementById('scene3'),
            document.getElementById('scene4'),
            document.getElementById('scene5')
        ];
        
        const photos = [
            document.getElementById('photo1'),
            document.getElementById('photo2'),
            document.getElementById('photo3'),
            document.getElementById('photo4'),
            document.getElementById('photo5'),
            document.getElementById('photo6'),
            document.getElementById('photo7'),
            document.getElementById('photo8')
        ];
        
        const confettiContainer = document.getElementById('confetti-container');
        const replayBtn = document.getElementById('replay-btn');
        const countdownContainer = document.getElementById('countdown-container');
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        let currentScene = 0;
        let photoIndex = 0;
        let sequenceTimeout;
        let countdownInterval;
        
        // Set the target date to May 31st at midnight
        function getTargetDate() {
            const now = new Date();
            const currentYear = now.getFullYear();
            // May is month 4 (0-indexed)
            const targetDate = new Date(currentYear, 5, 1, 0, 0, 0);
            
            // If we're already past May 31st this year, set target for next year
           // if (now > targetDate) {
             //   return new Date(currentYear + 1, 5, 1, 0, 0, 0);
            //}
            
            return targetDate;
        }
        
        const targetDate = getTargetDate();
        
        // Update countdown timer
        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            
            if (diff <= 0) {
                // Countdown is over
                clearInterval(countdownInterval);
                countdownContainer.style.opacity = '0';
                setTimeout(() => {
                    countdownContainer.style.display = 'none';
                    startSequence();
                }, 1000);
                return;
            }
            
            // Calculate time units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Update DOM
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Start countdown
        function startCountdown() {
            updateCountdown(); // Initial update
            countdownInterval = setInterval(updateCountdown, 1000);
        }
        
        // Check if we should show countdown or start immediately
        function checkCountdownStatus() {
            const now = new Date();
            if (now >= targetDate) {
                // It's already past the target date, start animations immediately
                countdownContainer.style.display = 'none';
                startSequence();
            } else {
                // Show countdown
                countdownContainer.style.display = 'flex';
                startCountdown();
            }
        }
        
        // Auto-play sequence
        function startSequence() {
            // Clear any existing timeouts
            clearTimeout(sequenceTimeout);
            
            // Scene 1: Glitchy loading (5 seconds)
            goToScene(0);
            sequenceTimeout = setTimeout(() => {
                goToScene(1);
                
                // Scene 2: Photo montage (8 photos × 4s each)
                setTimeout(() => {
                    showNextPhoto();
                    
                    const photoInterval = setInterval(() => {
                        photoIndex++;
                        if (photoIndex < photos.length) {
                            showNextPhoto();
                        } else {
                            clearInterval(photoInterval);
                            setTimeout(() => goToScene(2), 4000);
                        }
                    }, 4000); // Each photo stays for 4 seconds
                }, 500);
                
            }, 5000); // Longer loading time
            
            // Scene 3: Text explosion (6 seconds)
            sequenceTimeout = setTimeout(() => goToScene(2), 5000 + 500 + (photos.length * 4000) + 4000);
            
            // Scene 4: Fake heartfelt (8 seconds)
            sequenceTimeout = setTimeout(() => goToScene(3), 5000 + 500 + (photos.length * 4000) + 4000 + 6000);
            
            // Scene 5: Final message (with confetti)
            sequenceTimeout = setTimeout(() => {
                goToScene(4);
                createConfetti();
                
                // Stay on this scene indefinitely until replay is clicked
            }, 5000 + 500 + (photos.length * 4000) + 4000 + 6000 + 8000);
        }
        
        // Transition between scenes
        function goToScene(index) {
            scenes.forEach(scene => scene.classList.remove('active-scene'));
            scenes[index].classList.add('active-scene');
            currentScene = index;
        }
        
        // Show photos one by one
        function showNextPhoto() {
            photos.forEach((photo, i) => {
                photo.style.display = i === photoIndex ? 'block' : 'none';
            });
        }
        
        // Create confetti effect
        function createConfetti() {
            // Clear existing confetti
            confettiContainer.innerHTML = '';
            
            // Create new confetti pieces
            for (let i = 0; i < 80; i++) { // More confetti
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDuration = (Math.random() * 4 + 3) + 's'; // Slower falling
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.opacity = Math.random() * 0.7 + 0.3;
                
                // Random confetti shape
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                } else {
                    confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                }
                
                // Random pink shades
                const pinkShades = ['#f472b6', '#f9a8d4', '#ec4899', '#fbcfe8', '#db2777', '#fda4af'];
                confetti.style.backgroundColor = pinkShades[Math.floor(Math.random() * pinkShades.length)];
                
                // Random size
                const size = Math.random() * 12 + 6;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                
                confettiContainer.appendChild(confetti);
            }
        }
        
        // Replay the whole sequence
        function replay() {
            currentScene = 0;
            photoIndex = 0;
            
            // Reset all scenes
            scenes.forEach((scene, i) => {
                scene.classList.toggle('active-scene', i === 0);
            });
            
            // Hide all photos
            photos.forEach(photo => {
                photo.style.display = 'none';
            });
            
            // Start again
            startSequence();
        }
        
        // Start the countdown check on page load
        document.addEventListener('DOMContentLoaded', checkCountdownStatus);
        
        // Replay button
        replayBtn.addEventListener('click', replay);
