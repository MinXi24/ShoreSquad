// ==================== SHORESQUAD JAVASCRIPT ====================
// Navigation Toggle
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Animated Counter for Stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
};

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('stat__number')) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .metric, .stat__number').forEach(el => {
    observer.observe(el);
});

// Button Click Analytics (placeholder)
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        console.log(`Button clicked: ${buttonText}`);
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero__visual');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Form Validation (if forms are added later)
const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Local Storage for User Preferences
const savePreference = (key, value) => {
    try {
        localStorage.setItem(`shoresquad_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage not available');
    }
};

const getPreference = (key) => {
    try {
        const item = localStorage.getItem(`shoresquad_${key}`);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        return null;
    }
};

// Performance: Lazy Load Images (when images are added)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(lazyLoadScript);
}

// Accessibility: Focus Management
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Console Welcome Message
console.log('%c🌊 ShoreSquad ', 'background: #0EA5E9; color: white; font-size: 20px; padding: 10px;');
console.log('%cMaking eco-action fun, one beach at a time!', 'color: #10B981; font-size: 14px;');

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    console.log('ShoreSquad initialized ✓');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.scrollBehavior = 'auto';
    }
});
// ==================== WEATHER FORECAST API ====================
// Fetch 4-Day Weather Forecast from NEA via data.gov.sg
async function fetchWeatherForecast() {
    const weatherContainer = document.getElementById('weatherForecast');
    
    try {
        // Correct NEA 4-Day Weather Forecast API endpoint
        const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather API Response:', data); // Debug log
        
        // Extract forecast data from the correct structure
        const forecasts = data.items[0].forecasts;
        
        if (!forecasts || forecasts.length === 0) {
            throw new Error('No forecast data available');
        }
        
        // Clear loading state
        weatherContainer.innerHTML = '';
        
        // Display forecasts
        forecasts.forEach((forecast, index) => {
            const forecastDate = new Date(forecast.date);
            const dayName = forecastDate.toLocaleDateString('en-SG', { weekday: 'long' });
            const fullDate = forecastDate.toLocaleDateString('en-SG', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            // Determine weather icon class
            const weatherCondition = determineWeatherCondition(forecast.forecast);
            
            // Create weather card
            const card = document.createElement('div');
            card.className = `weather-card ${weatherCondition}`;
            card.innerHTML = `
                <div class="weather-card__header">
                    <div class="weather-card__date">
                        <span class="weather-card__day">${index === 0 ? 'Today' : dayName}</span>
                        <span class="weather-card__full-date">${fullDate}</span>
                    </div>
                    <div class="weather-icon"></div>
                </div>
                
                <div class="weather-card__temp">
                    <div class="temp-range">
                        <span class="temp-high">${forecast.temperature.high}</span>
                        <span class="temp-unit">°C</span>
                        <span style="color: var(--gray-400); margin: 0 0.25rem;">/</span>
                        <span class="temp-low">${forecast.temperature.low}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                </div>
                
                <div class="weather-card__details">
                    <div class="weather-detail">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                        <div>
                            <div class="weather-detail__label">Humidity</div>
                            <div class="weather-detail__value">${forecast.relative_humidity.low}% - ${forecast.relative_humidity.high}%</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                        </svg>
                        <div>
                            <div class="weather-detail__label">Wind Speed</div>
                            <div class="weather-detail__value">${forecast.wind.speed.low} - ${forecast.wind.speed.high} km/h</div>
                        </div>
                    </div>
                    
                    <div class="weather-detail">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                        <div>
                            <div class="weather-detail__label">Wind Direction</div>
                            <div class="weather-detail__value">${forecast.wind.direction}</div>
                        </div>
                    </div>
                </div>
                
                <div class="weather-card__forecast">
                    <p class="weather-card__forecast-text">${forecast.forecast}</p>
                </div>
            `;
            
            weatherContainer.appendChild(card);
            
            // Add animation
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
        
        console.log('✅ Weather forecast loaded successfully');
        
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        weatherContainer.innerHTML = `
            <div class="weather-error">
                <h3>Unable to Load Weather Forecast</h3>
                <p>We're having trouble connecting to the weather service. Please try again later.</p>
                <p style="font-size: 0.75rem; margin-top: 0.5rem;">Error: ${error.message}</p>
                <button class="btn btn--primary" onclick="fetchWeatherForecast()" style="margin-top: 1rem;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Determine weather condition from forecast text
function determineWeatherCondition(forecastText) {
    const text = forecastText.toLowerCase();
    
    if (text.includes('thundery') || text.includes('thunderstorm')) {
        return 'thunderstorm';
    } else if (text.includes('shower') || text.includes('showers')) {
        return 'showers';
    } else if (text.includes('rain') || text.includes('rainy')) {
        return 'rainy';
    } else if (text.includes('cloudy') && !text.includes('partly')) {
        return 'cloudy';
    } else if (text.includes('partly cloudy') || text.includes('fair')) {
        return 'partly-cloudy';
    } else if (text.includes('windy')) {
        return 'windy';
    } else {
        return 'sunny';
    }
}

// Initialize weather forecast on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fetch weather immediately
    fetchWeatherForecast();
    
    // Refresh weather data every 2 hours
    setInterval(fetchWeatherForecast, 2 * 60 * 60 * 1000);
});