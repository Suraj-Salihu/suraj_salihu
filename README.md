# Suraj Salihu Portfolio

## First Release

This repository contains the first release of Suraj Salihu's personal portfolio website, built with React and Vite.

The app includes:
- Responsive portfolio sections for hero, about, skills, projects, design works, CV, contact, and footer
- Dark mode with localStorage persistence
- Admin CMS at `/admin` for managing portfolio content with Supabase auth
- Cloudinary image uploads for cover, profile, projects, and designs
- Email contact form using EmailJS

---

## Project Structure

- `public/` — static assets and fallback `index.html`
- `src/`
  - `App.jsx` — app shell with hash-based routing and theme handling
  - `main.jsx` — React entry point
  - `index.css` — global styles
  - `data.js` — default portfolio data and site settings
  - `supabaseClient.js` — Supabase client initialization
  - `siteSettingsContext.jsx` — portfolio settings loader
  - `AdminPage.jsx` — authenticated admin panel
  - `components/` — portfolio sections and UI components

---

## Features

- Responsive design for desktop and mobile
- Theme toggle with dark / light mode and localStorage persistence
- Scroll reveal animations for sections
- Admin dashboard support via Supabase auth
- Cloudinary-powered image upload in admin
- Contact form via EmailJS
- Single-file content source for default data in `src/data.js`

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root or copy `.env.example`.

Required variables:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anonymous key
- `VITE_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name used for uploads
- `VITE_CLOUDINARY_UPLOAD_PRESET` — unsigned Cloudinary upload preset
- `VITE_EMAILJS_PUBLIC_KEY` — EmailJS public key for the contact form

Example:

```env
VITE_SUPABASE_URL=https://example.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_EMAILJS_PUBLIC_KEY=your-emailjs-key
```

---

## Supabase Setup

This project expects a Supabase table named `portfolio` with:
- `id` (primary key)
- `data` (JSON)

The app uses this table for:
- site settings (`site-settings`)
- project entries
- design entries

The admin page uses Supabase auth to sign in with email/password.

### Admin Panel

Open `/admin` in your browser to access the dashboard.

The admin panel provides:
- secure login
- upload and update functionality for portfolio assets
- content editing for projects and design categories
- sign-out support

---

## Contact Form

The contact section uses EmailJS with the public key configured in `.env`.

If you use your own EmailJS account, update the service and template IDs in `src/components/Contact.jsx`.

---

## Notes

- Default portfolio data is defined in `src/data.js`.
- The site uses `siteSettingsContext.jsx` to load live settings from Supabase and fall back to defaults.
- The admin image upload flow saves assets to Cloudinary and stores metadata in Supabase.

---

## Release Notes

- Version: `1.0.0`
- Release: First public release of the portfolio and admin interface

---

## License

This repository is released under the terms defined by the project owner.
