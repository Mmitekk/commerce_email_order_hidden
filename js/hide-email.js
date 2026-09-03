((Drupal, once) => {
  Drupal.behaviors.commerceEmailHidden = {
    attach(context) {
      const sels = [
        '[name="contact_information[email]"]',
        '[name="contact_information[mail]"]',
        '#edit-contact-information-email',
        '#edit-contact-information-mail',
        '[data-drupal-selector="edit-contact-information-email"]',
        '[data-drupal-selector="edit-contact-information-mail"]'
      ];
      sels.forEach(sel => {
        once('ceoh', sel, context).forEach(el => {
          const wrap = el.closest('.form-item, .field, .checkout-pane, .checkout-pane-contact-information') || el;
          wrap.style.display = 'none';
          el.required = false;
          el.removeAttribute('required');
          if (!el.value || el.value.includes('example.invalid')) {
            el.value = 'guest+' + Date.now() + '@example.invalid';
          }
        });
      });
      const pane = once('ceoh-pane', '.checkout-pane-contact-information', context);
      pane.forEach(p => {
        if (p.querySelector('input[type="email"]') && !p.querySelector('input:not([type="hidden"]):not([type="email"])')) {
          p.style.display = 'none';
        }
      });
      once('ceoh-review', 'body', context).forEach(() => {
        document.querySelectorAll('*').forEach(el => {
          if (el.childElementCount === 0 && el.textContent && el.textContent.includes('@example.invalid')) {
            let cur = el;
            for (let i = 0; i < 4 && cur; i++) {
              if (cur.textContent.trim().startsWith('guest+') || cur.textContent.includes('@example.invalid')) {
                const paneWrap = cur.closest('.checkout-pane, .layout-region, .pane, [class*="contact-information"]');
                if (paneWrap) {
                  const hasOnlyEmail = paneWrap.textContent.trim().split('\n').filter(t => t.trim()).length <= 2;
                  if (hasOnlyEmail || paneWrap.textContent.includes('Контактная информация')) {
                    paneWrap.style.display = 'none';
                  } else {
                    cur.style.display = 'none';
                  }
                  break;
                }
                cur.style.display = 'none';
              }
              cur = cur.parentElement;
            }
          }
        });
        document.querySelectorAll('.checkout-pane-contact-information, .pane-contact_information, [data-pane="contact_information"]').forEach(p => {
          const txt = p.textContent || '';
          if (txt.includes('@example.invalid')) {
            const hasPhoneInfo = txt.includes('+7') && txt.includes('Информация о доставке');
            if (!hasPhoneInfo && txt.split('@example.invalid').length) {
              if (p.children.length <= 3 || txt.trim().startsWith('guest+')) {
                p.style.display = 'none';
              } else {
                p.querySelectorAll('*').forEach(c => {
                  if (c.textContent && c.textContent.includes('@example.invalid') && c.childElementCount === 0) c.style.display = 'none';
                });
              }
            }
          }
        });
      });
    }
  };
})(Drupal, once);
