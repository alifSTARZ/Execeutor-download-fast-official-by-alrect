
// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const executorItems = document.querySelectorAll('.executor-item');

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    executorItems.forEach(item => {
      const executorName = item.getAttribute('data-name').toLowerCase();
      const executorTitle = item.querySelector('h3').textContent.toLowerCase();
      
      if (executorName.includes(searchTerm) || executorTitle.includes(searchTerm)) {
        item.style.display = 'block';
        item.classList.remove('hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    updateSearchStats();
  });
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  const executorItems = document.querySelectorAll('.executor-item');
  
  searchInput.value = '';
  
  executorItems.forEach(item => {
    item.style.display = 'block';
    item.classList.remove('hidden');
  });

  updateSearchStats();
  searchInput.focus();
}

function updateSearchStats() {
  const visibleItems = document.querySelectorAll('.executor-item:not(.hidden)');
  const onlineCount = document.getElementById('onlineCount');
  
  if (onlineCount) {
    onlineCount.textContent = visibleItems.length;
  }
}

function downloadExecutor(url) {
  const button = event.target.closest('.download-btn');
  const executorName = button.closest('.executor-item').querySelector('h3').textContent;
  
  // Play Roblox click sound effect
  playRobloxSound('click');
  
  // Create custom modal
  createDownloadModal(executorName, url, button);
}

function createDownloadModal(executorName, url, button) {
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'download-modal';
  modal.style.cssText = `
    background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
    border: 2px solid #00f5ff;
    border-radius: 20px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 0 50px rgba(0, 245, 255, 0.3);
    animation: modalSlide 0.3s ease;
    color: white;
  `;

  modal.innerHTML = `
    <div class="modal-header">
      <i class="fas fa-download" style="font-size: 3em; color: #00f5ff; margin-bottom: 20px;"></i>
      <h2 style="color: #00f5ff; margin-bottom: 10px; font-family: 'Orbitron', monospace;">Download Confirmation</h2>
      <p style="color: #ccc; margin-bottom: 20px;">${executorName}</p>
    </div>
    
    <div class="modal-body">
      <p style="margin-bottom: 20px; color: #fff;">Are you sure you want to download this executor?</p>
      <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 3px solid #00f5ff;">
        <small style="color: #ccc; word-break: break-all;">${url}</small>
      </div>
      <div style="color: #ff6b6b; font-size: 0.9em; margin: 15px 0;">
        <i class="fas fa-exclamation-triangle"></i>
        Always scan downloaded files for safety!
      </div>
    </div>
    
    <div class="modal-actions" style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
      <button class="modal-btn confirm-btn" style="
        background: linear-gradient(45deg, #00f5ff, #0080ff);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 245, 255, 0.3);
      ">
        <i class="fas fa-download"></i> Download
      </button>
      <button class="modal-btn cancel-btn" style="
        background: linear-gradient(45deg, #ff4757, #ff3742);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
      ">
        <i class="fas fa-times"></i> Cancel
      </button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Add styles for animations
  if (!document.querySelector('#modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalSlide {
        from { transform: translateY(-50px) scale(0.9); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      .modal-btn:hover {
        transform: translateY(-2px) scale(1.05);
      }
    `;
    document.head.appendChild(style);
  }

  // Event listeners
  const confirmBtn = modal.querySelector('.confirm-btn');
  const cancelBtn = modal.querySelector('.cancel-btn');

  confirmBtn.addEventListener('click', () => {
    // Play confirm sound
    playRobloxSound('success');
    
    // Start download animation on original button
    startDownloadAnimation(button);
    
    // Open download link
    window.open(url, '_blank');
    
    // Close modal
    closeModal(backdrop);
    
    // Show success notification
    showNotification(`Download started for ${executorName}`, 'success');
  });

  cancelBtn.addEventListener('click', () => {
    // Play cancel sound
    playRobloxSound('click');
    closeModal(backdrop);
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop);
    }
  });

  // ESC key to close
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal(backdrop);
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function closeModal(backdrop) {
  backdrop.style.animation = 'fadeOut 0.3s ease';
  setTimeout(() => {
    if (backdrop.parentElement) {
      backdrop.parentElement.removeChild(backdrop);
    }
  }, 300);
}

// Roblox Sound Effects
function playRobloxSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'click') {
      // Roblox UI click sound (synthesized)
      playTone(audioContext, 800, 0.1, 0.3, 'square');
      setTimeout(() => playTone(audioContext, 1000, 0.05, 0.2, 'sine'), 50);
    } else if (type === 'download') {
      // Roblox success/download sound
      playTone(audioContext, 600, 0.1, 0.4, 'sine');
      setTimeout(() => playTone(audioContext, 800, 0.1, 0.3, 'sine'), 100);
      setTimeout(() => playTone(audioContext, 1000, 0.15, 0.5, 'sine'), 200);
    } else if (type === 'hover') {
      // Roblox hover sound
      playTone(audioContext, 400, 0.05, 0.2, 'triangle');
    } else if (type === 'success') {
      // Roblox achievement sound
      playTone(audioContext, 523.25, 0.2, 0.6, 'sine'); // C5
      setTimeout(() => playTone(audioContext, 659.25, 0.2, 0.5, 'sine'), 150); // E5
      setTimeout(() => playTone(audioContext, 783.99, 0.3, 0.7, 'sine'), 300); // G5
    }
  } catch (error) {
    console.log('Audio not supported');
  }
}

function playTone(audioContext, frequency, duration, volume, waveType = 'sine') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = waveType;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function startDownloadAnimation(button) {
  const originalContent = button.innerHTML;
  const steps = [
    '<i class="fas fa-spinner fa-spin"></i> Preparing...',
    '<i class="fas fa-download"></i> Downloading...',
    '<i class="fas fa-check"></i> Started!'
  ];
  
  let currentStep = 0;
  button.disabled = true;
  button.style.opacity = '0.8';
  
  // Play download sound effect
  playRobloxSound('download');
  
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      button.innerHTML = steps[currentStep];
      currentStep++;
      
      // Play step sound
      if (currentStep < steps.length) {
        playRobloxSound('hover');
      }
    } else {
      clearInterval(interval);
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
        button.style.opacity = '1';
        
        // Play success sound
        playRobloxSound('success');
      }, 1000);
    }
  }, 500);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(45deg, #4caf50, #45a049)' : 'linear-gradient(45deg, #f44336, #d32f2f)'};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 11000;
    animation: slideIn 0.3s ease;
    border: 1px solid ${type === 'success' ? '#4caf50' : '#f44336'};
    backdrop-filter: blur(10px);
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Interactive effects
function initializeInteractiveEffects() {
  const executorItems = document.querySelectorAll('.executor-item');
  
  executorItems.forEach(item => {
    // Add hover sound effect (visual feedback)
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      playRobloxSound('hover');
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
    
    // Add click ripple effect
    item.addEventListener('click', function(e) {
      if (!e.target.classList.contains('download-btn')) {
        createRippleEffect(e, this);
      }
    });
  });

  // Add glow effect to stats on hover
  const statCards = document.querySelectorAll('.stat-card');
  statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.4)';
      this.style.borderColor = '#00f5ff';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.1)';
      this.style.borderColor = 'rgba(0, 255, 255, 0.3)';
    });
  });
}

function createRippleEffect(event, element) {
  const ripple = document.createElement('div');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(0, 245, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `;
  
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => {
    if (ripple.parentElement) {
      ripple.parentElement.removeChild(ripple);
    }
  }, 600);
}

// Dynamic background particles
function createDynamicParticles() {
  const particleContainer = document.querySelector('.animated-background');
  
  setInterval(() => {
    if (document.querySelectorAll('.particle').length < 8) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 20 + 10) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
      particle.style.animationDelay = '0s';
      
      particleContainer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentElement) {
          particle.parentElement.removeChild(particle);
        }
      }, 25000);
    }
  }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  initializeInteractiveEffects();
  createDynamicParticles();
  initializePremiumEffects();
  
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add loading animation with sparkles
  document.body.style.opacity = '0';
  createLoadingEffect();
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '1';
  }, 300);
  
  console.log('🚀 EXECUTOR LIST BY XF - Loaded Successfully!');
  console.log('💻 Created by: Xploit Force - alipXc HUB');
  console.log('✨ Premium effects activated!');
});

// Premium visual effects
function initializePremiumEffects() {
  // Cursor trail effect
  createCursorTrail();
  
  // Floating icons
  createFloatingIcons();
  
  // Auto-scrolling background animation
  createScrollingStars();
  
  // Premium glow on elements
  addPremiumGlow();
}

function createCursorTrail() {
  let trail = [];
  const maxTrail = 20;
  
  document.addEventListener('mousemove', function(e) {
    trail.push({
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    });
    
    if (trail.length > maxTrail) {
      trail.shift();
    }
    
    // Remove old trails
    const now = Date.now();
    trail = trail.filter(point => now - point.time < 1000);
    
    // Create trail element
    const trailElement = document.createElement('div');
    trailElement.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, rgba(0, 255, 255, 0.8), transparent);
      border-radius: 50%;
      left: ${e.clientX - 3}px;
      top: ${e.clientY - 3}px;
      pointer-events: none;
      z-index: 9999;
      animation: trailFade 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(trailElement);
    
    setTimeout(() => {
      if (trailElement.parentElement) {
        trailElement.parentElement.removeChild(trailElement);
      }
    }, 800);
  });
  
  // Add trail fade animation
  if (!document.querySelector('#trail-styles')) {
    const style = document.createElement('style');
    style.id = 'trail-styles';
    style.textContent = `
      @keyframes trailFade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.3); }
      }
    `;
    document.head.appendChild(style);
  }
}

function createFloatingIcons() {
  const icons = ['🚀', '⭐', '💎', '🔥', '⚡', '🎮', '🛡️', '🎯'];
  
  setInterval(() => {
    if (document.querySelectorAll('.floating-icon').length < 6) {
      const icon = document.createElement('div');
      icon.className = 'floating-icon';
      icon.textContent = icons[Math.floor(Math.random() * icons.length)];
      icon.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 15}px;
        left: ${Math.random() * 100}%;
        bottom: -50px;
        opacity: 0.6;
        pointer-events: none;
        z-index: 1;
        animation: floatUp ${Math.random() * 10 + 15}s linear infinite;
      `;
      
      document.body.appendChild(icon);
      
      setTimeout(() => {
        if (icon.parentElement) {
          icon.parentElement.removeChild(icon);
        }
      }, 25000);
    }
  }, 4000);
  
  // Add float animation
  if (!document.querySelector('#float-styles')) {
    const style = document.createElement('style');
    style.id = 'float-styles';
    style.textContent = `
      @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.3; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

function createScrollingStars() {
  const starContainer = document.createElement('div');
  starContainer.className = 'stars-container';
  starContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
    pointer-events: none;
  `;
  
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate;
    `;
    starContainer.appendChild(star);
  }
  
  document.body.appendChild(starContainer);
  
  // Add twinkle animation
  if (!document.querySelector('#star-styles')) {
    const style = document.createElement('style');
    style.id = 'star-styles';
    style.textContent = `
      @keyframes twinkle {
        0% { opacity: 0.3; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }
}

function addPremiumGlow() {
  // Add glow to premium elements
  const premiumElements = document.querySelectorAll('.executor-badge.premium, .download-btn.premium');
  
  premiumElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.animation = 'premiumPulse 1s ease-in-out infinite alternate';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.animation = '';
    });
  });
  
  // Add premium pulse animation
  if (!document.querySelector('#premium-styles')) {
    const style = document.createElement('style');
    style.id = 'premium-styles';
    style.textContent = `
      @keyframes premiumPulse {
        0% { 
          box-shadow: 0 0 20px rgba(255, 193, 7, 0.6);
          transform: scale(1);
        }
        100% { 
          box-shadow: 0 0 40px rgba(255, 193, 7, 0.9);
          transform: scale(1.05);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function createLoadingEffect() {
  const loadingContainer = document.createElement('div');
  loadingContainer.id = 'loading-effect';
  loadingContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(0, 4, 40, 0.9), rgba(0, 0, 0, 0.95));
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.8s ease;
  `;
  
  loadingContainer.innerHTML = `
    <div style="text-align: center; color: #00f5ff;">
      <div style="font-size: 3em; margin-bottom: 20px; animation: loadingSpin 2s linear infinite;">⚡</div>
      <div style="font-size: 1.5em; font-weight: 700; animation: loadingGlow 1.5s ease-in-out infinite alternate;">LOADING XPLOIT FORCE</div>
      <div style="margin-top: 20px;">
        <div style="width: 200px; height: 4px; background: rgba(0, 255, 255, 0.2); border-radius: 2px; overflow: hidden;">
          <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #00f5ff, #ff00ff); animation: loadingBar 2s ease-in-out infinite;"></div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(loadingContainer);
  
  // Add loading animations
  if (!document.querySelector('#loading-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
      @keyframes loadingSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes loadingGlow {
        0% { text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
        100% { text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(255, 0, 255, 0.5); }
      }
      @keyframes loadingBar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove loading effect after delay
  setTimeout(() => {
    loadingContainer.style.opacity = '0';
    setTimeout(() => {
      if (loadingContainer.parentElement) {
        loadingContainer.parentElement.removeChild(loadingContainer);
      }
    }, 800);
  }, 2500);
}

// Add notification styles
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
