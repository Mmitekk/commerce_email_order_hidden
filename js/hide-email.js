((Drupal, once) => {
  Drupal.behaviors.commerceEmailHidden = {
    attach(context) {
      const isAnon = document.body.classList.contains('user-logged-out') || !document.body.classList.contains('user-logged-in');
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
      once('ceoh-heading', 'body', context).forEach(() => {
        if (!isAnon) return;
        document.querySelectorAll('*').forEach(el => {
          if (el.childElementCount !== 0) return;
          const t = (el.textContent || '').trim();
          if (t === 'Контактная информация (Редактировать)' || t === 'Контактная информация') {
            const pane = el.closest('.checkout-pane, .panel, .layout-region, div') || el.parentElement;
            const block = el.closest('div, section') || el;
            const nextHeading = el.parentElement ? el.parentElement.textContent : '';
            const hasEmailOnly = pane ? pane.textContent.includes('@example.invalid') || pane.textContent.trim() === t : false;
            if (pane && (hasEmailOnly || pane.querySelectorAll('*').length < 5)) {
              let cur = el;
              for (let i = 0; i < 5 && cur; i++) {
                if (cur.textContent.includes('Контактная информация') && cur.textContent.length < 80) {
                  const sib = cur.nextElementSibling;
                  if (!sib || sib.textContent.includes('Информация о доставке')) {
                    cur.style.display = 'none';
                    if (cur.parentElement && cur.parentElement.children.length === 1) cur.parentElement.style.display = 'none';
                  }
                }
                cur = cur.parentElement;
                if (cur && cur.classList && cur.classList.contains('checkout-pane')) {
                  if (cur.textContent.includes('Контактная информация') && !cur.textContent.includes('+7')) {
                    cur.style.display = 'none';
                  }
                  break;
                }
              }
            }
          }
        });
        document.querySelectorAll('strong, b, h2, h3, h4, div').forEach(el => {
          const t = (el.textContent || '').trim();
          if (t.startsWith('Контактная информация') && t.length < 50 && isAnon) {
            const parent = el.parentElement;
            const txt = parent ? parent.textContent : '';
            if (!txt.includes('@') || txt.includes('@example.invalid')) {
              const hasOnlyHeading = parent && parent.textContent.trim().split('\n').filter(x=>x.trim()).length <= 2;
              if (hasOnlyHeading || txt.includes('@example.invalid')) {
                el.style.display = 'none';
                if (el.nextElementSibling && el.nextElementSibling.textContent.trim() === '') el.nextElementSibling.style.display='none';
                let cur = el;
                for(let i=0;i<3;i++){
                  cur = cur.parentElement;
                  if(!cur) break;
                  if(cur.textContent.trim() === t) cur.style.display='none';
                }
              }
            }
          }
        });
      });
      once('ceoh-review', 'body', context).forEach(() => {
        document.querySelectorAll('*').forEach(el => {
          if (el.childElementCount === 0 && el.textContent && el.textContent.includes('@example.invalid')) {
            let cur = el;
            for (let i = 0; i < 4 && cur; i++) {
              if (cur.textContent.trim().startsWith('guest+') || cur.textContent.includes('@example.invalid')) {
                const paneWrap = cur.closest('.checkout-pane, .layout-region, .pane, [class*="contact-information"]');
                if (paneWrap) {
                  paneWrap.style.display = 'none';
                  break;
                }
                cur.style.display = 'none';
              }
              cur = cur.parentElement;
            }
          }
        });
      });
    }
  };
})(Drupal, once);
