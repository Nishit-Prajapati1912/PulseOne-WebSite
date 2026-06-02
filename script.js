/* =========================================
   PULSEONE GLOBAL FRONTEND CONTROLLER
========================================= */

/* =========================================
   GLOBAL FEEDBACK HELPER
========================================= */
function showFeedback(message, type = 'error') {
  const feedback = document.getElementById('formFeedback');
  if (!feedback) return;

  if (!message) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    return;
  }

  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
}

/* =========================================
   PASSWORD VISIBILITY TOGGLE
========================================= */
function togglePw() {
  const pw = document.getElementById('password');
  if (!pw) return;
  pw.type = pw.type === 'password' ? 'text' : 'password';
}

/* =========================================
   LOGIN CONTROLLER
========================================= */
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    showFeedback('', '');

    if (!email || !password) {
      showFeedback('Please provide both email and password.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Authenticating...';

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      // Safely read the response body as text first to avoid parsing drops
      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('Server returned non-JSON response payload text:', responseText);
        throw new Error('Server infrastructure returned an unexpected error profile formatting standard.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('pulseone_token', data.token);
      localStorage.setItem('pulseone_user', JSON.stringify(data.user));

      showFeedback('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);

    } catch (error) {
      console.error(error);
      showFeedback(error.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Login
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      `;
    }
  });
}

/* =========================================
   SIGNUP CONTROLLER
========================================= */
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const role = document.getElementById('profile').value;
    const password = document.getElementById('password').value;
    const termsAccepted = document.getElementById('terms').checked;

    showFeedback('', '');

    if (!name || !email || !role || !password) {
      showFeedback('Please fill all required fields.', 'error');
      return;
    }

    if (password.length < 8) {
      showFeedback('Password must be at least 8 characters.', 'error');
      return;
    }

    if (!termsAccepted) {
      showFeedback('Please accept the terms.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Creating Account...';

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, role, password })
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error('Server interface returned an unexpected tracking profile format.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed.');
      }

      localStorage.setItem('pulseone_token', data.token);
      localStorage.setItem('pulseone_user', JSON.stringify(data.user));

      showFeedback('Account created successfully!', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (error) {
      console.error(error);
      showFeedback(error.message, 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Account';
    }
  });
}

/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* =========================================
   MOBILE NAVIGATION
========================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

/* =========================================
   FADE IN ANIMATION
========================================= */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

/* =========================================
   COUNTER ANIMATION
========================================= */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const animate = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}

const statCards = document.querySelectorAll('.stat-card');
if (statCards.length > 0) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-number');
        if (!numEl) return;
        const raw = numEl.textContent.trim();
        const suffix = raw.replace(/[\d,.]/g, '');
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) {
          animateCounter(numEl, num, suffix);
        }
        statObserver.unobserve(entry.target); // Fixed script breakpoint layout
      }
    });
  }, { threshold: 0.4 });

  statCards.forEach(card => {
    statObserver.observe(card);
  });
}

/* =============================================
   PULSEONE – GLOBAL USER STATE ROUTINE MIDDLEWARE
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('authActionContainer');
  
  if (authContainer) {
    const rawUserData = localStorage.getItem('pulseone_user');
    const token = localStorage.getItem('pulseone_token');

    if (rawUserData && token) {
      try {
        const user = JSON.parse(rawUserData);
        
        // Isolate or keep user first name text footprint clean
        const displayName = user.name ? user.name.split(' ')[0] : 'User';

        // Reconstruct the inner navigation matrix nodes
        authContainer.innerHTML = `
          <div class="user-profile-menu">
            <span class="user-welcome-text">
              <i class="fa-regular fa-user" style="margin-right: 5px;"></i> Hello, ${displayName}
            </span>
            <span class="logout-action-link" id="platformLogoutTrigger">Logout</span>
          </div>
          <button class="hamburger" id="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        `;

        // Re-bind the logout event action logic context path dynamically
        document.getElementById('platformLogoutTrigger').addEventListener('click', () => {
          localStorage.removeItem('pulseone_token');
          localStorage.removeItem('pulseone_user');
          window.location.reload(); // Refresh viewport state immediately
        });

        // Re-bind mobile menu toggles to the newly injected hamburger node instance
        initializeMobileMenu();

      } catch (e) {
        console.error("Session evaluation state corrupt. Purging local storage maps.", e);
        localStorage.removeItem('pulseone_token');
        localStorage.removeItem('pulseone_user');
      }
    }
  }
});

function initializeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }
}