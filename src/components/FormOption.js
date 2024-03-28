export default function FormOption(props){
    if (!props.dataList) {
        return;
    }
    return(
        <select 
            id={props.id} 
            value={props.value}
            onChange={props.handleChange} 
            name={props.name}
        >
            <option key="---" value="">Select an option</option>
            {
            props.dataList.map(data => (
                <option
                key={data.id}
                value={props.name === "epic" || props.name === "parentIssue" || props.name === "sprint"?data.id : data.name}
                >
                    {data.name}
                </option>
            ))}
        </select>
    )
}