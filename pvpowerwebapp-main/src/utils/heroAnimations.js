/**
 * heroAnimations.js
 * Handles animations for the Hero component
 * 
 * Optimized for performance to prevent layout issues with header
 */

/**
 * Animates hero content elements with a staggered delay
 * Using CSS classes rather than inline styles to improve performance
 */
export const animateHeroContent = () => {
    // Use requestAnimationFrame to avoid layout thrashing
    requestAnimationFrame(() => {
      // Elements to animate
      const elementsToAnimate = [
        document.querySelector('.hero__text-container'),
        document.querySelector('.hero__feature-badges')
      ];
    
      // Apply animation to each element with a staggered delay
      elementsToAnimate.forEach((element, index) => {
        if (!element) return;
        
        // Add classes instead of inline styles
        element.classList.remove('fade-in-up');
        
        // Force a reflow to ensure the class removal takes effect
        void element.offsetWidth;
        
        // Set the delay via data attribute
        element.dataset.animationDelay = (0.3 + (index * 0.3));
        
        // Add animation class
        element.classList.add('fade-in-up');
      });
      
      // Setup scroll animations after a slight delay to avoid overloading the main thread
      setTimeout(() => {
        setupScrollAnimations();
      }, 100);
    });
  };
  
  /**
   * Sets up scroll-based animations for when elements come into view
   */
  const setupScrollAnimations = () => {
    // Check if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) return;
    
    const options = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.15 // Trigger when at least 15% of the element is visible
    };
    
    // Create observer for scrolling animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation classes when elements come into view
          entry.target.classList.add('animate-in');
          // Stop observing after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Add additional elements to observe (below the fold)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  };
  
  /**
   * Initialize the particle background animation with performance optimizations
   * @returns {Function} Cleanup function
   */
  export const initParticleBackground = () => {
    // Create animated background with floating particles
    const container = document.querySelector('.hero__particles');
    if (!container) return null;
    
    // Reduce particle count to improve performance
    const PARTICLE_COUNT = 30; // Reduced from 50
    const particles = [];
    
    // Create a document fragment to batch DOM operations
    const fragment = document.createDocumentFragment();
    
    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      
      // Add a CSS class instead of inline styles
      particle.className = 'hero-particle';
      
      // Only set essential styles inline
      const size = Math.random() * 4 + 1; // Reduced max size
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = `${Math.random() * 0.4 + 0.1}`; // Reduced opacity
      
      // Random positioning
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      
      // Store particle info for animation
      particles.push({
        element: particle,
        x: left / 100 * container.offsetWidth,
        y: top / 100 * container.offsetHeight,
        speedX: Math.random() * 0.3 - 0.15, // Slower movement
        speedY: Math.random() * 0.3 - 0.15, // Slower movement
        size: size
      });
      
      fragment.appendChild(particle);
    }
    
    // Add all particles to DOM at once (better performance)
    container.appendChild(fragment);
    
    // Use a variable to throttle updates
    let throttleCount = 0;
    const THROTTLE_RATE = 2; // Only update visually every 2nd frame
    
    // Animate particles with performance optimizations
    let animationFrameId;
    const animateParticles = () => {
      // Update position calculations every frame
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x <= 0 || particle.x >= container.offsetWidth) {
          particle.speedX *= -1;
        }
        
        if (particle.y <= 0 || particle.y >= container.offsetHeight) {
          particle.speedY *= -1;
        }
        
        // Only update DOM elements every THROTTLE_RATE frames
        if (throttleCount === 0) {
          // Use transform instead of left/top for better performance
          particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        }
      });
      
      // Update throttle counter
      throttleCount = (throttleCount + 1) % THROTTLE_RATE;
      
      animationFrameId = requestAnimationFrame(animateParticles);
    };
    
    // Start animation
    animateParticles();
    
    // Return cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Clear particles
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  };
  
  /**
   * Apply parallax effect to hero background with debounce for performance
   * @param {Event} e - Mouse movement event
   */
  export const applyParallaxEffect = (() => {
    // Debounce function to limit how often we update
    let ticking = false;
    
    return (e) => {
      // Skip if we're already processing a frame
      if (ticking) return;
      
      // Request a new animation frame
      ticking = true;
      
      requestAnimationFrame(() => {
        const heroContainer = document.querySelector('.hero__container');
        if (!heroContainer) {
          ticking = false;
          return;
        }
        
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;
        
        // Use transform instead of backgroundPosition for better performance
        heroContainer.style.transform = `translate3d(${xPos * 5}px, ${yPos * 5}px, 0)`;
        
        // Reset flag so we can process the next event
        ticking = false;
      });
    };
  })();
  
  /**
   * Helper function to create smooth typing effect
   * @param {HTMLElement} element - The element to apply typing effect to
   * @param {string} text - The text to type
   * @param {number} speed - Typing speed in milliseconds
   */
  export const typeWriter = (element, text, speed = 50) => {
    if (!element) return;
    
    // Store original text and clear element
    const originalText = text || element.textContent;
    element.textContent = '';
    let i = 0;
    
    // Type character by character
    const type = () => {
      if (i < originalText.length) {
        element.textContent += originalText.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    // Start typing
    type();
  };