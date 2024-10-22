export default function FormOption(props){
    if (!props.dataList) {
        return null;
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
                value={
                    props.name === "epic" || 
                    props.name === "parentIssue" || 
                    props.name === "assignedTo" ||
                    props.name === "assignedBy" ||
                    props.name === "sprint" ||
                    props.name === "progressMap" ?
                    data.id : data.name
                }
                >
                    {
                        (props.name === "assignedTo" || props.name === "assignedBy") 
                        ? data.userName 
                        : data.name
                    }
                </option>
            ))}
        </select>
    )
}