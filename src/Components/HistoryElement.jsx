
const HistoryElement = (props) => {
    return(
        <li className="HistoryElement" key={props.key}><p>{props.item}</p></li>
    )
}

export default HistoryElement;