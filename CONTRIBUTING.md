# Contributing to UNITFLOW 🚀

First off, thank you for considering contributing to **UNITFLOW**! It's people like you that make UNITFLOW such an incredible tool for developers, scientists, students, and engineers worldwide.

---

## 🛠️ Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/unitflow.git
cd unitflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Code Quality

Before opening a pull request, ensure all tests pass and code is formatted cleanly:

```bash
# Run unit test suite
npm test

# Run Oxlint
npm run lint

# Check type integrity & build
npm run build
```

---

## 💡 Adding New Units or Categories

1. Open `src/units/` and locate the appropriate category file (e.g. `physics.ts`, `electrical.ts`, `specialized.ts`, `basic.ts`).
2. Follow the standard unit definition interface:
   - Provide an accurate `toBase` multiplier or converter function.
   - Include clear `name`, `symbol`, and descriptive helper text.
3. If creating a new category, register it inside `src/units/index.ts`.
4. Add unit test coverage under `src/__tests__/`.

---

## 📬 Submitting Changes

1. Create a descriptive branch: `git checkout -b feat/add-quantum-units`
2. Commit your changes using semantic commit messages:
   - `feat: add pressure conversion for bar and psi`
   - `fix: resolve floating point precision issue in temperature`
   - `docs: update README with new categories`
3. Push to your fork and submit a Pull Request!

---

## 📜 Code of Conduct

Please treat everyone with respect and kindness. We are committed to providing a friendly, safe, and welcoming environment for all contributors.
