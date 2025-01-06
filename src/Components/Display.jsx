
const Display = ({value, lastOperation}) => {
    return (
        <div className="calculatorDisplay">
            <p className="lastOperation">{lastOperation}</p>
            {value}
        </div>
    );
}

export default Display;
