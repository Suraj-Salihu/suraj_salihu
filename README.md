# Sooraj Portfolio – React (Vite) Conversion

## File Structure to Copy Into Your Project

```
suraj-salihu/
├── public/
│   └── images/         ← copy your original images/ folder here
│   └── cv/             ← copy your original cv/ folder here
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Slideshow.jsx
│   │   ├── DesignWorks.jsx
│   │   ├── CV.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── MobileNotification.jsx
│   ├── data.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── index.html          ← keep the existing Vite one
```

## Setup Steps

### 1. Copy the src files
Replace the entire contents of your `src/` folder with the files provided.

### 2. Move your images & CV to public/
In the original project, images were relative (e.g. `images/cover01.png`).
In Vite/React, static assets go in the `public/` folder and are referenced from root:

```
# Copy your images folder:
cp -r /path/to/original/images  suraj-salihu/public/images

# Copy your cv folder:
cp -r /path/to/original/cv  suraj-salihu/public/cv
```

### 3. Update index.html title (optional)
Open `index.html` and change the `<title>` tag:
```html
<title>Sooraj | Full-Stack Developer | Graphics Designer</title>
```

### 4. Run the dev server
```bash
npm run dev
```

## Notes on the Contact Form
The form still targets `send.php`. Since React (Vite) is a static frontend,
you'll need to either:
- Keep a PHP backend server alongside it, OR
- Replace with EmailJS (free): https://www.emailjs.com/

## That's it!
Your portfolio is now a clean React app with:
- Dark mode via React state + localStorage
- Scroll animations via IntersectionObserver
- Reusable Slideshow component
- All data (skills, projects, designs) in one `data.js` file for easy editing
