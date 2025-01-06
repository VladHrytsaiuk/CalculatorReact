
import './App.css'
import Calculator from "./Components/Calculator.jsx";
import {useEffect, useState} from "react";

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        // Попередня перевірка теми до першого рендеру
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark; // Використовуємо системне налаштування
    });

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    useEffect(() => {
        // Збереження теми в `localStorage`
        localStorage.setItem("theme", darkMode ? "dark" : "light");
        document.body.classList.toggle("dark-mode", darkMode);
    }, [darkMode]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e) => {
            if (!localStorage.getItem("theme")) { // Враховуємо лише системну тему, якщо користувач не змінив тему вручну
                setDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);


  return (
      <div className={`CalculatorApp ${darkMode ? "dark" : "light"}`}>


          <h1 className="titleMain">C<br/>a<br/>l<br/>c<br/>u<br/>l<br/>a<br/>t<br/>o<br/>r</h1>

              <Calculator darkMode={darkMode}/>
          <div className="Switcher">
              <span className="titleSwitcher">Theme switcher</span>
              <label className="theme-switcher">
                  <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={toggleDarkMode}
                  />
                  <span className="slider"></span>
              </label>
              <button className="clearHistoryBtn" onClick={() => window.dispatchEvent(new Event("clearHistory"))}>Clear History</button>
          </div>

      </div>
  )
}

export default App
