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
          const wrap = el.closest('.form-item, .field, .checkout-pane') || el;
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
    }
  };
})(Drupal, once);
