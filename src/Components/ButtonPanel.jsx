
import Button from './Button';
import {useState} from "react";

const btnValue = [
    ["←", "C", "%", "√"],
    ["+/-", "x²", "x^n", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    [".", "0", "="],
];


const ButtonPanel = ({onButtonClick}) => {

return(
    <div className="ButtonPanel">
        {btnValue.flat().map((btn, i) => {
        return (
            <Button
                key={i}
                className={"button"}
                value={btn}
                onClick={() => onButtonClick(btn)
                // btn === "C" ? resetClickHandler :
                // btn === "+/-" ? invertClickHandler :
                // btn === "%" ? percentClickHandler :
                // btn === "=" ? equalsClickHandler :
                // btn === "/" || btn === "X" || btn === "-" || btn === "+" ? signClickHandler :
                // btn === "." ? commaClickHandler : numClickHandler

                }
            />

                );
            })
        }
    </div>

);



}

export default ButtonPanel;