// INVEST Application Scripts

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal when clicking outside modal box
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on ESC key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach((modal) => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
});

// Demo form submission
function demoSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn ? submitBtn.innerText : '';

  if (submitBtn) {
    submitBtn.innerText = 'جارٍ التحقق...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerText = 'تم بنجاح ✓';
    }

    setTimeout(() => {
      const activeModal = form.closest('.modal');
      if (activeModal) {
        closeModal(activeModal.id);
      }
      form.reset();
      if (submitBtn) {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    }, 800);
  }, 600);
}

window.openModal = openModal;
window.closeModal = closeModal;
window.demoSubmit = demoSubmit;
