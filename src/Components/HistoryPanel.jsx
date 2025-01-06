import HistoryElement from "./HistoryElement.jsx";

const HistoryPanel = ({arr}) => {

    return (
        <div className="HistoryPanel">
            <ul className="HistoryList">
                {arr.map((item, index) => (
                    <HistoryElement key={index} item={item} />
                ))}
            </ul>
        </div>
    )
}

export default HistoryPanel;