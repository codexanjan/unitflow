<div align="center">

  <img src="./.github/assets/banner.svg" alt="UNITFLOW Banner" width="100%" />

  <br />
  <br />

  <h1>⚡ UNITFLOW — The Next-Gen Smart Unit & Currency Converter</h1>

  <p>
    <strong>Ultra-fast, high-precision measurement conversion engine with real-time mathematical expression evaluation, live currency exchange rates, step-by-step formula breakdowns, and 36+ categories.</strong>
  </p>

  <p>
    <a href="https://github.com/codexanjan/unitflow/stargazers"><img src="https://img.shields.io/github/stars/codexanjan/unitflow?color=6366f1&style=for-the-badge&logo=star" alt="GitHub Stars" /></a>
    <a href="https://github.com/codexanjan/unitflow/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-38bdf8?style=for-the-badge" alt="MIT License" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_6-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Tests-38%2F38%20Passing-10b981?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Passed" /></a>
  </p>

  <h3>
    <a href="https://unitflow-alpha.vercel.app">🌐 Live Demo (unitflow-alpha.vercel.app)</a>
    <span> &bull; </span>
    <a href="https://github.com/codexanjan/unitflow">🌟 Star on GitHub</a>
    <span> &bull; </span>
    <a href="#-quick-start">🚀 Quick Start</a>
    <span> &bull; </span>
    <a href="#-key-features">💎 Features</a>
    <span> &bull; </span>
    <a href="#-supported-categories-36">📐 Categories</a>
  </h3>

</div>

---

## 🌟 Why UNITFLOW?

Most unit converters are outdated, clunky, ad-riddled, and restricted to simple static number inputs. 

**UNITFLOW** is engineered from scratch for engineers, physicists, developers, students, and everyday power users. It blends **sub-millisecond conversion accuracy**, an **AST mathematical expression parser**, **live global currency rates**, and a **sleek glassmorphic UI**.

```
    ┌────────────────────────────────────────────────────────┐
    │  INPUT: "(15 * 4.5) + sin(pi/4)"  [Miles / Kilometers] │
    └──────────────────────────┬─────────────────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │  Smart Lexer + AST Expression Engine│
            └──────────────────┬──────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌────────────────────────────┐          ┌────────────────────────────┐
│ High-Precision Base Engine │          │ Multi-Unit Live Grid Matrix│
│ Result: 108.57144 km       │          │ [m, ft, mi, yd, nm, au...] │
└────────────────────────────┘          └────────────────────────────┘
```

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🧮 **Live Math Expression Parser** | Type complex math expressions like `(120 * 2.5) / 4`, `sin(pi/2)`, or `10^3 * 4.2` directly into any input field. |
| ⚡ **Multi-Unit Live Matrix Grid** | Converts your value to **every single sibling unit** in the category simultaneously in real-time. |
| 📐 **Interactive Formula Breakdown** | View the exact scientific formulas, multipliers, and intermediate calculations step-by-step. |
| 🌐 **160+ Live Global Currencies** | Real-time exchange rate sync with smart fallback caching for instant offline availability. |
| 🔍 **Global Quick Search (`Ctrl + K`)** | Blazing-fast fuzzy search across 300+ units, symbols, abbreviations, and direct conversion pairs. |
| 🎨 **Ultra-Modern Glassmorphic UI** | Fully responsive dark and light modes with fluid animations and Tailwind CSS v4 styling. |
| 🧪 **High-Precision Scientific Formatting** | Standard decimal, scientific notation (`1.24e+8`), custom precision selector (up to 12 decimal places). |
| 🔒 **100% Privacy-First & Offline Ready** | Zero telemetry, zero external trackers, PWA manifest, and persistent local storage. |
| ⭐ **Bookmarks & History Tracking** | Pin frequently used conversion pairs and quickly revisit past conversions with timestamps. |

---

## 📐 Supported Categories (36+)

UNITFLOW supports over **300+ units** categorized across scientific and real-world disciplines:

### 🔹 Fundamental & Everyday
- **Length & Distance**: Meter, Kilometer, Centimeter, Millimeter, Nanometer, Mile, Yard, Foot, Inch, Nautical Mile, Light Year, Astronomical Unit (AU), Parsec, Angstrom, Furlong.
- **Mass & Weight**: Kilogram, Gram, Milligram, Microgram, Metric Ton, Pound (lb), Ounce (oz), Stone, Carat, Grain, Troy Ounce.
- **Temperature**: Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), Delisle, Newton, Réaumur, Rømer.
- **Area**: Square Meter, Square Kilometer, Square Mile, Square Yard, Square Foot, Square Inch, Hectare, Acre.
- **Volume & Capacity**: Liter, Milliliter, Cubic Meter, Gallon (US & UK), Quart, Pint, Cup, Fluid Ounce, Tablespoon, Teaspoon, Barrel.
- **Time**: Second, Millisecond, Microsecond, Nanosecond, Minute, Hour, Day, Week, Month, Year, Decade, Century.
- **Speed & Velocity**: m/s, km/h, mph, Knot, Mach, Speed of Light ($c$).

### 🔹 Engineering & Applied Physics
- **Pressure**: Pascal, Kilopascal, Megapascal, Bar, PSI, Atmosphere (atm), Torr, mmHg.
- **Energy & Work**: Joule, Kilojoule, Calorie, Kilocalorie, Watt-hour, Kilowatt-hour (kWh), Electronvolt (eV), BTU, Foot-pound.
- **Power**: Watt, Kilowatt, Megawatt, Horsepower (hp), Metric HP, Foot-pounds/min, BTU/hour.
- **Force**: Newton, Kilonewton, Dyne, Pound-force (lbf), Kilogram-force (kgf).
- **Torque**: Newton-meter (N·m), Pound-foot (lb-ft), Pound-inch (lb-in), Kilogram-meter.
- **Angle**: Degree, Radian, Gradian, Arcminute, Arcsecond, Revolution.
- **Fuel Economy**: MPG (US), MPG (UK), L/100km, km/L.
- **Density**: kg/m³, g/cm³, lb/ft³, lb/in³.
- **Volumetric Flow Rate**: m³/s, L/min, Gallons per minute (GPM), CFM.

### 🔹 Computing & Digital
- **Digital Storage**: Bit, Byte, Kilobyte (KB), Megabyte (MB), Gigabyte (GB), Terabyte (TB), Petabyte (PB), Kibibyte (KiB), Mebibyte (MiB), Gibibyte (GiB), Tebibyte (TiB).
- **Data Transfer Rate**: bps, Kbps, Mbps, Gbps, Tbps, B/s, KB/s, MB/s, GB/s.

### 🔹 Electrical & Magnetism
- **Electric Current**: Ampere (A), Milliampere (mA), Microampere, Kiloampere.
- **Voltage**: Volt (V), Millivolt, Kilovolt, Megavolt.
- **Resistance**: Ohm (Ω), Milliohm, Kilohm, Megohm.
- **Capacitance**: Farad (F), Millifarad, Microfarad, Nanofarad, Picofarad.
- **Frequency**: Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), Terahertz, RPM.
- **Electric Charge**: Coulomb (C), Milliampere-hour (mAh), Ampere-hour (Ah).

### 🔹 Specialized & Niche
- **Culinary / Cooking**: Cups, Spoons, Fluid Ounces, Pinches, Dashes, Drops.
- **Typography**: Point (pt), Pica (pc), Pixel (px @ 96 DPI), Millimeter, Em / Rem.
- **Radiation Dose**: Sievert (Sv), Millisievert, Rem, Gray (Gy), Rad.
- **Radioactivity**: Becquerel (Bq), Curie (Ci), Rutherford.
- **Illuminance & Light**: Lux (lx), Foot-candle (fc), Phot.
- **Sound Level**: Decibel (dB), Neper.
- **Numeral Systems**: Binary (BIN), Octal (OCT), Decimal (DEC), Hexadecimal (HEX).
- **Live Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, CNY, BRL, and 150+ more.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codexanjan/unitflow.git

# 2. Enter directory
cd unitflow

# 3. Install dependencies
npm install

# 4. Start the local Vite development server
npm run dev
```

Visit `http://localhost:5173` to see UNITFLOW in action!

---

## 🛠️ Scripts & Tooling

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local development server with Hot Module Replacement (HMR) |
| `npm run build` | Compile TypeScript and produce production build in `dist/` |
| `npm run preview` | Locally preview production build |
| `npm run lint` | Run ultra-fast Oxlint linter checks across all source files |
| `npm test` | Run complete unit test suite with Vitest |
| `npm run test:watch` | Run Vitest in interactive watch mode |

---

## 🧠 Architecture & Math Engine

UNITFLOW uses a modular three-tier architecture:

```
src/
├── engine/              # Core conversion and computation layer
│   ├── converter.ts     # High-precision base normalization and formula generator
│   ├── expressionParser.ts # Tokenizer, Shunting-Yard AST math evaluator
│   ├── formatter.ts     # Scientific, decimal, and fractional output formatters
│   └── types.ts         # Strictly typed unit, category, and conversion contracts
├── units/               # Complete unit registries & scientific constants
│   ├── basic.ts         # Length, mass, temp, area, volume, time, speed
│   ├── physics.ts       # Pressure, energy, power, force, torque, density
│   ├── electrical.ts    # Current, voltage, resistance, capacitance, frequency
│   ├── data.ts          # Storage and transfer rate (binary & decimal)
│   ├── lightSound.ts    # Lux, foot-candles, decibels
│   └── specialized.ts   # Typography, cooking, radiation, numeral systems
├── components/          # Reusable glassmorphic UI components
│   ├── converter/       # Primary converter card & live preview grid
│   ├── currency/        # Live currency converter with rate cache
│   ├── search/          # Global search modal (Ctrl+K)
│   ├── seo/             # Category hub, formula tables & trivia
│   └── layout/          # Navbar, footer, theme toggle
└── context/             # Global state (Favorites, History, Settings)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open global search modal across all units & categories |
| `Esc` | Close search modal or floating dialogs |
| `Enter` | Trigger calculation & add to history |

---

## 🧪 Testing & Validation

UNITFLOW is strictly tested with **100% test pass rate** across core conversion mathematics, edge-case temperature offsets, numeral systems, math expression parsing, and currency fallbacks.

```bash
npm test
```

```text
 ✓ src/__tests__/currency.test.ts (3 tests)
 ✓ src/__tests__/formatter.test.ts (6 tests)
 ✓ src/__tests__/expressionParser.test.ts (9 tests)
 ✓ src/__tests__/numeralSystems.test.ts (3 tests)
 ✓ src/__tests__/temperature.test.ts (5 tests)
 ✓ src/__tests__/engine.test.ts (12 tests)

 Test Files  6 passed (6)
      Tests  38 passed (38)
```

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, create, and build. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.

---

## 👨‍💻 Author

**Anjan Shetty**
- GitHub: [@codexanjan](https://github.com/codexanjan)
- Project Link: [https://github.com/codexanjan/unitflow](https://github.com/codexanjan/unitflow)

---

<div align="center">
  <p>If you find <strong>UNITFLOW</strong> useful, please give it a ⭐️ on GitHub!</p>
</div>
