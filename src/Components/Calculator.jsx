import Display from "./Display.jsx";
import ButtonPanel from "./ButtonPanel.jsx";
import {useEffect, useState} from "react";
import HistoryPanel from "./HistoryPanel.jsx";

const Calculator = () => {
    const [copyMessage, setCopyMessage] = useState("");
    const[lastOperation, setLastOperation] = useState("");

    const [history, setHistory] = useState(() => {
        const savedHistory = localStorage.getItem("calculatorHistory");
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    const addHistory = (num1, num2, operation, result) => {
        const newHistory = `${num1} ${operation} ${num2} = ${result}`;
        setHistory((prevState) => {
            const updatedHistory = [...prevState, newHistory];

            // Зберігаємо оновлену історію в localStorage
            localStorage.setItem("calculatorHistory", JSON.stringify(updatedHistory));
            return updatedHistory;
        });
    }

    useEffect(() => {
        const handleClearHistory = () => {
            setHistory([]); // Очищаємо історію
            localStorage.removeItem("calculatorHistory"); // Видаляємо з localStorage
        };

        window.addEventListener("clearHistory", handleClearHistory);

        return () => {
            window.removeEventListener("clearHistory", handleClearHistory);
        };
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyMessage("Copied!");
            setTimeout(() => setCopyMessage(""), 2000);
        }).catch((err) => {
            console.log("Error!", err);
        })
    }


    const [value, setValue] = useState({ currentValue: "0", previousValue: null, operation: null, expression: "0", });

    const toLocaleString = (num) =>
        String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

    const removeSpaces = (num) => num.toString().replace(/\s/g, "");

    const calculate = (num1, num2, operation) => {
        const a = parseFloat(removeSpaces(num1));
        const b = parseFloat(removeSpaces(num2));

        switch (operation) {
            case "+":
                return (a + b).toString();
            case "-":
                return (a - b).toString();
            case "×":
                return (a * b).toString();
            case "÷":
                return b !== 0 ? (a / b).toString() : "Error"; // Перевірка ділення на нуль
            case "%":
                return (a % b).toString();
            case "x^n":
                return Math.pow(a, b).toString();
            default:
                return "0";
        }
    }

    const [undoStack, setUndoStack] = useState([]);

    const handleUndo = () => {
        if (undoStack.length > 0) {
            setUndoStack((prevStack) => {
                const lastState = prevStack[prevStack.length - 1];
                setValue(lastState);
                return prevStack.slice(0, -1); // Видаляємо останній елемент зі стеку
            });
        }
    };

    const onButtonClick = (btn) =>{
        setValue((prevState) => {
            const { currentValue, previousValue, operation, expression } = prevState;

            if (btn === "←") {
                setLastOperation("");
                const newValue = currentValue.slice(0, -1); // Видаляємо останній символ
                const newExpression = expression.slice(0, -1); // Також змінюємо вираз

                return {
                    ...prevState,
                    currentValue: newValue === "" ? "0" : newValue, // Якщо після видалення порожньо, ставимо "0"
                    expression: newExpression === "" ? "0" : newExpression, // Якщо вираз порожній, ставимо "0"
                };
            }


            if (btn === "C"){
                setLastOperation("");
                return { currentValue: "0", previousValue: null, operation: null, expression: "0" };
            }

            if (btn === "x²") {
                setLastOperation(`${currentValue}²`);
                const result = Math.pow(parseFloat(currentValue), 2);
                addHistory(currentValue, " ", "²", result);

                return {
                    ...prevState,
                    currentValue: result.toString(),
                    expression: result.toString(),
                };
            }
            if (btn === "√") {
                setLastOperation(`√${currentValue}`);
                if (parseFloat(currentValue) > 0){
                    const result = Math.sqrt(parseFloat(currentValue));
                    addHistory(" ", currentValue, "√", result);

                    return {
                        ...prevState,
                        currentValue: result.toString(),
                        expression: result.toString(),
                    };
                }
                else{
                    return {
                        currentValue: "Error",
                        expression: "Error",
                    };
                }
            }

            if (btn === "x^n") {
                // Якщо вираз не порожній, додаємо знак "^"
                return {
                    ...prevState,
                    expression: prevState.expression + "^",  // Додаємо знак ^ до виразу
                    operation: "x^n", // Встановлюємо операцію на піднесення до степеня
                };
            }

            if (!isNaN(btn)){
                const newExpression = prevState.expression === "0" ? btn : prevState.expression + btn;
                const newValue = prevState.currentValue === "0" ? btn : prevState.currentValue + btn;


                return {
                    ...prevState,
                    currentValue: newValue,
                    expression: newExpression,
                };
            }
            if (btn === "+/-"){
                return {...prevState, currentValue: (parseFloat(prevState.currentValue) * (-1)).toString(), expression: (parseFloat(prevState.currentValue) * (-1)).toString() };
            }
            if (btn === "."){
                if (!prevState.currentValue.includes(".")){
                    return {...prevState, currentValue: prevState.currentValue + ".", expression: expression + "."};
                }
                else{
                    return prevState;
                }
            }


            if (["+", "-", "×", "÷", "%", "x^n"].includes(btn)) {
                if (prevState.previousValue && prevState.operation) {
                    const result = calculate(prevState.previousValue, prevState.currentValue, prevState.operation);
                    return {
                        currentValue: result,  // Оновлення значення на екрані
                        previousValue: result,  // Оновлення попереднього значення для наступної операції
                        operation: btn,  // Оновлення операції для подальших обчислень
                        expression: result + btn,  // Оновлення виразу
                    };
                }

                return {
                    currentValue: "0",
                    previousValue: prevState.currentValue,
                    operation: btn,
                    expression: prevState.expression + btn,
                };
            }

            if (btn === "="){
                if (prevState.operation === "x^n") {
                    // Розбираємо вираз на основу та степінь
                    const [base, exponent] = prevState.expression.split("^").map(val => parseFloat(val));

                    if (isNaN(base) || isNaN(exponent)) {
                        return {
                            ...prevState,
                            currentValue: "Error",
                            expression: "Error"
                        }; // Якщо не вдалося розібрати значення
                    }

                    // Обчислюємо піднесення до степеня
                    const result = Math.pow(base, exponent);
                    setLastOperation(`${base} ^ ${exponent}`)
                    addHistory(base, exponent, "^", result);


                    return {
                        ...prevState,
                        currentValue: result.toString(),  // Виводимо результат на екран
                        expression: result.toString(),  // Оновлюємо вираз
                        operation: null,  // Скидаємо операцію
                        previousValue: null,  // Скидаємо попереднє значення
                    };
                }
                if (prevState.previousValue && prevState.operation) {
                    const result = calculate(prevState.previousValue, prevState.currentValue, prevState.operation);
                    addHistory(prevState.previousValue, prevState.currentValue, prevState.operation, result);
                    setLastOperation(`${prevState.previousValue} ${prevState.operation} ${prevState.currentValue}`);

                    setUndoStack((prevStack) => [
                        ...prevStack,
                        { currentValue: result, previousValue: null, operation: null, expression: result },
                    ]);
                    return {
                        currentValue: result,
                        previousValue: null,
                        operation: null,
                        expression: result.toString(),
                    };
                }
                return prevState;
            }
            return prevState;
        })
    };

    useEffect(() => {

        const handleKeyPress = (e) =>{
            const key = e.key;
            if (!isNaN(key)) {
                onButtonClick(key); // Цифри
            } else if (key === "+" || key === "-" || key === "*" || key === "/") {
                const operationMap = { "*": "×", "/": "÷" };
                onButtonClick(operationMap[key] || key); // Операції
            } else if (key === "Enter") {
                onButtonClick("="); // Рівно
            } else if (key === "Backspace") {
                onButtonClick("C"); // Скидання
            } else if (key === ".") {
                onButtonClick("."); // Крапка
            }

        }


        window.addEventListener("keydown", handleKeyPress);
        return() =>{
            window.removeEventListener("keydown", handleKeyPress);
        }
    })



    return (
        <div className="Calculator">
            <div className="CalculatorBody">

                <Display lastOperation={lastOperation} value={toLocaleString(value.expression || value.currentValue)}/>
                <button className="copyButton" onClick={() => copyToClipboard(value.currentValue)}>Copy</button>
                <ButtonPanel onButtonClick={onButtonClick}/>
                {copyMessage && <p className="copyMessage">{copyMessage}</p>}

            </div>
            <HistoryPanel arr={history}/>
        </div>

    );
}

export default Calculator;