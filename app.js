/**
 * INVEST Platform - Pure Vanilla JavaScript Application
 * Zero dependencies, completely browser-native.
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide icons if loaded
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavPanel = document.getElementById('mobileNavPanel');

  if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavPanel.classList.toggle('open');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.remove('open');
      });
    });
  }

  // 3. Navigation Highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Modal System (Login & Register)
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  window.openAuthModal = (type) => {
    closeAllModals();
    if (type === 'login' && loginModal) {
      loginModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else if (type === 'register' && registerModal) {
      registerModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  };

  // Close when clicking outside modal content
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // 5. Interactive Form Submission Handlers
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('loginFeedback');
      if (feedback) {
        feedback.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; text-align: center; margin-top: 1rem;">
            ✓ تم اختبار النموذج بنجاح (المرحلة الأولى — واجهة فقط بدون قاعدة بيانات).
          </div>
        `;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = document.getElementById('registerFeedback');
      if (feedback) {
        feedback.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; text-align: center; margin-top: 1rem;">
            ✓ تم اختبار النموذج بنجاح (المرحلة الأولى — واجهة فقط بدون قاعدة بيانات).
          </div>
        `;
      }
    });
  }

  // 6. Interactive Financial Chart Bars
  const bars = document.querySelectorAll('.growth-bars .bar');
  bars.forEach((bar, index) => {
    bar.addEventListener('mouseenter', () => {
      bars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');
    });
  });
});
