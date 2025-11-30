/* js/script.js — cleaned & preserved logic */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- FAQ accordion (click on .faq-question toggles its answer) ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close other items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem === item) return;
        openItem.classList.remove('open');
        const ans = openItem.querySelector('.faq-answer');
        const ic = openItem.querySelector('.faq-icon');
        if (ans) { ans.style.maxHeight = null; ans.style.padding = '0'; }
        if (ic) { ic.style.transform = 'rotate(0deg)'; }
      });

      if (!isOpen) {
        item.classList.add('open');
        a.style.padding = '10px 0 6px 0';
        a.style.maxHeight = a.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(45deg)';
      } else {
        item.classList.remove('open');
        a.style.maxHeight = null;
        a.style.padding = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  /* ---------- Form validation for every form with .consultation-form ---------- */
  const forms = document.querySelectorAll('.consultation-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const requiredInputs = form.querySelectorAll('input[required]');
      requiredInputs.forEach(inp => {
        if (inp.type === 'checkbox') {
          if (!inp.checked) { valid = false; inp.classList.add('invalid'); }
          else inp.classList.remove('invalid');
        } else {
          if (!inp.value || !inp.value.trim()) { valid = false; inp.classList.add('invalid'); }
          else inp.classList.remove('invalid');
        }
      });

      if (!valid) {
        alert('Please fill in all required fields.');
        return;
      }

      // Success - in real app, you'd post to server
      alert('Thank you! Your consultation request has been submitted. We will contact you shortly.');
      form.reset();
      // regenerate captcha(s) so they look fresh after reset
      populateCaptchaBoxes();
    });
  });

  /* ---------- Smooth scroll for anchor links (if any) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- IntersectionObserver for section fade-in ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('section').forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(18px)';
    sec.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(sec);
  });

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    else header.style.boxShadow = 'none';
  });

  /* ---------- Captcha generation for all .captcha-box elements ---------- */
  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
  function populateCaptchaBoxes() {
    document.querySelectorAll('.captcha-box').forEach(box => {
      box.textContent = generateCaptcha();
    });
  }
  populateCaptchaBoxes();

  /* Also regenerate captcha on click of any captcha-box (optional UX) */
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('captcha-box')) {
      e.target.textContent = generateCaptcha();
    }
  });

  /* ---------- optional: city/treatment card interactions kept safe (no errors if missing) ---------- */
  document.querySelectorAll('.city-card').forEach(card => {
    card.addEventListener('click', () => {
      const nameEl = card.querySelector('.city-name');
      const cityName = nameEl ? nameEl.textContent.trim() : 'selected city';
      alert(`You selected ${cityName}. In a real application, this would navigate to the booking page for this city.`);
    });
  });

  document.querySelectorAll('.btn-treatment').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.treatment-card');
      const title = card ? (card.querySelector('.treatment-title') || { textContent: 'treatment' }).textContent : 'treatment';
      alert(`You selected ${title}. Redirecting to consultation form...`);
      const target = document.querySelector('.consultation-form');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
