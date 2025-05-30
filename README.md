# Transformer Oil Expansion Tool

A web-based calculator that helps transformer designers determine oil level rise due to thermal expansion — built using modern web tools and grounded in real-world engineering needs.

Live Demo: [https://transformer-tool-tailwind.vercel.app](https://transformer-tool-tailwind.vercel.app)

---

## 🔧 What It Does

Given:
- Transformer shape (rectangular or cylindrical)
- Tank dimensions
- Volume of insulating oil
- Ambient and maximum hot oil temperatures

The tool calculates:
- Expected oil expansion (volume)
- Vertical rise of the oil level

It assumes a fixed thermal expansion coefficient (default: 0.00075 /°C) and treats the oil-air interface as free-rising, ignoring core displacement for now.

---

## 🎯 Who It's For

Engineers designing or reviewing distribution transformers who need to:

- Ensure thermal sensors like IFDs are placed above the hot oil level
- Estimate oil behavior at elevated temperatures
- Avoid manual spreadsheet calculations or guesswork

---

## 🧰 Tech Stack

- **Next.js 15** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Vercel** for deployment

---

## 📂 Project Structure

- `src/app/page.tsx`: Main form and logic
- Fully client-side; no backend dependencies

---

## 🚀 Future Features (Planned)

- Input validation and error handling
- Option to enter oil level height at ambient temperature
- Optional core displacement modeling
- Export results as PDF or image

---

## 👨‍💻 Author

Stephen Gilbert – Mechatronics Engineer pivoting into software development  
[LinkedIn](https://www.linkedin.com/in/stephenjgilbert)  
