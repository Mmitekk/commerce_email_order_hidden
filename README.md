# commerce_email_order_hidden

[![Release](https://img.shields.io/github/v/release/Mmitekk/commerce_email_order_hidden?label=latest%20release&color=blue)](https://github.com/Mmitekk/commerce_email_order_hidden/releases)
[![Drupal](https://img.shields.io/badge/Drupal-10%20%7C%2011-0678BE)](https://www.drupal.org)
[![Commerce](https://img.shields.io/badge/Commerce-2.x-orange)](https://drupalcommerce.org)
[![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/Mmitekk/commerce_email_order_hidden/total)](https://github.com/Mmitekk/commerce_email_order_hidden/releases)

<div align="center">

### 🌐 Language / Язык

[![🇷🇺 Русский](https://img.shields.io/badge/🇷🇺_Русский-RU-red?style=for-the-badge)](#-русский) [![🇬🇧 English](https://img.shields.io/badge/🇬🇧_English-EN-blue?style=for-the-badge)](#-english)

*Нажмите на вкладку для переключения языка • Click tab to switch language*

</div>

---

## 🇷🇺 Русский

### Что делает модуль

Убирает обязательное поле **Email** при гостевом оформлении заказа в **Drupal Commerce (D10/D11)**.

На скриншоте как у `homutoff.pro` — блок «Контактная информация → Email» полностью скрывается для анонимов, заказ уходит без email. Модуль:

* делает поле `commerce_order.mail` необязательным (`entity_base_field_info_alter`, снимает `Required` и `Email` констрейнты);
* скрывает `contact_information[mail/email]` на всех `commerce_checkout_flow` формах для `isAnonymous()` (через `#access = FALSE`);
* автогенерирует dummy-email вида `guest+7926...@example.invalid` из телефона (или `guest+<timestamp>@example.invalid`), чтобы Commerce не падал на валидации;
* дублирует логику на `hook_entity_presave` — даже если заказ создают программно без email, он не сломается.

> **Важно:** Email всё ещё пишется в заказ, но фейковый на `@example.invalid` (домен из RFC 2606, не доставляется). Письма покупателю не уходят — отключите их в настройках типа заказа или замените на SMS.

### Требования

* Drupal `^10 || ^11`
* Commerce `^2.0` (`commerce_order`, `commerce_checkout`)

### Установка через Composer (без токена, стабильный релиз)

> Модуль ставится сразу последним стабильным билдом с GitHub Release. Никаких `dev-main` / `dev-master`.

**Вариант A — после публикации на Packagist (рекомендуется, токен не нужен):**
```bash
composer require mmitekk/commerce_email_order_hidden:^1.0
drush en commerce_email_order_hidden -y
drush cr
```

**Вариант B — до публикации на Packagist (публичный VCS, тоже без токена):**
```bash
composer config repositories.commerce_email_order_hidden vcs https://github.com/Mmitekk/commerce_email_order_hidden.git
composer require mmitekk/commerce_email_order_hidden:^1.0
drush en commerce_email_order_hidden -y
drush cr
```

Проверка — ставится именно тег `1.0.0`, а не ветка:
```bash
composer show mmitekk/commerce_email_order_hidden | grep versions
# versions : * 1.0.0
```

Обновление на последний релиз:
```bash
composer update mmitekk/commerce_email_order_hidden
```

> Почему без токена? Репозиторий публичный. Composer качает zip архива релиза `https://github.com/Mmitekk/commerce_email_order_hidden/archive/refs/tags/1.0.0.zip` по HTTPS без авторизации. Токен нужен только для приватных репозиториев или при превышении rate-limit API.

### Настройка

1. `drush en commerce_email_order_hidden`
2. Опционально: `admin/config` → настройки домена/префикса dummy-email (по умолчанию `guest+*@example.invalid`)
3. В Checkout Flow (`/admin/commerce/config/checkout-flows`) pane `Contact information` можно оставить включенным — модуль сам его скроет для гостей. Для авторизованных email остаётся видимым.

### Как это работает

```
Гость → checkout → form_alter скрывает email → #validate ставит dummy →
→ entity_presave страхует → order.mail = guest+7916...@example.invalid → order save OK
```

### FAQ

**Нужен ли патч Commerce?** Нет.  
**Что с письмами?** Отключите `Order receipt` в `/admin/commerce/config/order-types`.  
**А если нужен телефон как логин?** Совместим с `commerce_checkout_phone`.

---

## 🇬🇧 English

### What it does

Hides the required **Email** field for guest checkout in **Drupal Commerce (D10/D11)**.

As on screenshot from `homutoff.pro` — the “Contact information → Email” block is hidden for anonymous users, order is placed without email. The module:

* makes `commerce_order.mail` not required (`entity_base_field_info_alter`, removes `Required`/`Email` constraints);
* hides `contact_information[mail/email]` on all `commerce_checkout_flow` forms for `isAnonymous()` via `#access = FALSE`;
* auto-generates dummy email like `guest+7926...@example.invalid` from phone or `guest+<timestamp>@example.invalid` to pass Commerce validation;
* duplicates logic on `hook_entity_presave` — programmatic order creation without email won't fail.

> Email is still stored but fake at `@example.invalid` (RFC 2606, undeliverable). Customer receipt emails won't be sent — disable them in order type settings or replace with SMS.

### Requirements

* Drupal `^10 || ^11`
* Commerce `^2.0` (`commerce_order`, `commerce_checkout`)

### Installation via Composer (no token, stable release)

> Module installs the latest stable build from GitHub Release. No `dev-main` / `dev-master`.

**Option A — after Packagist publication (recommended, no token):**
```bash
composer require mmitekk/commerce_email_order_hidden:^1.0
drush en commerce_email_order_hidden -y
drush cr
```

**Option B — before Packagist (public VCS, also no token):**
```bash
composer config repositories.commerce_email_order_hidden vcs https://github.com/Mmitekk/commerce_email_order_hidden.git
composer require mmitekk/commerce_email_order_hidden:^1.0
drush en commerce_email_order_hidden -y
drush cr
```

Verify stable tag is installed, not branch:
```bash
composer show mmitekk/commerce_email_order_hidden | grep versions
# versions : * 1.0.0
```

Update to latest release:
```bash
composer update mmitekk/commerce_email_order_hidden
```

> Why no token? Repository is public. Composer downloads release zip `https://github.com/Mmitekk/commerce_email_order_hidden/archive/refs/tags/1.0.0.zip` over HTTPS without auth. Token is only needed for private repos or API rate-limit.

### Configuration

1. `drush en commerce_email_order_hidden`
2. Optional: `admin/config` → tweak dummy email domain/prefix (default `guest+*@example.invalid`)
3. In Checkout Flow (`/admin/commerce/config/checkout-flows`) keep `Contact information` pane enabled — module hides it for guests automatically. For authenticated users email stays visible.

### How it works

```
Guest → checkout → form_alter hides email → #validate sets dummy →
→ entity_presave fallback → order.mail = guest+...@example.invalid → order save OK
```

### FAQ

**Need Commerce patch?** No.  
**What about emails?** Disable `Order receipt` at `/admin/commerce/config/order-types`.  
**Phone as login?** Compatible with `commerce_checkout_phone`.

---

## 📦 Releases

All stable versions are tagged: `1.0.0`, `1.0.1`, etc. — see [Releases](https://github.com/Mmitekk/commerce_email_order_hidden/releases). Composer constraint `^1.0` always pulls the latest.

```bash
composer show mmitekk/commerce_email_order_hidden --all | grep -E "versions|1\.0"
```

## 📄 License

GPL-2.0-or-later
