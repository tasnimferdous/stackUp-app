import { useEffect, useState } from 'react';

import {issueTypeList} from './Variables';
import FormOption from './FormOption';

export default function CreateIssueForm({showItem, setShowItem, currentSprint, setIssueList}) {
    const [formSubmit, setFormSubmit] = useState(false);
    const [formData, setFormData] = useState({
        name:"",
        issueType:null,
        sprint:currentSprint
    });

    useEffect(() => {
        const postData = async () =>{
            if(formSubmit){
                try{
                    const dataToSend = { ...formData };

                    const response = await fetch("http://localhost:8080/stackUp/issue/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataToSend),
                    });
                    if(!response.ok){
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    await setIssueList(prevData => {
                        return [
                            ...prevData,
                            data
                        ]
                    });
                    setFormData({
                        name:"",
                        issueType:null,
                        sprint:currentSprint
                    });
                }catch(error){
                    console.error("Error posting data: ", error);
                }
            }
            setFormSubmit(false);
        };

        postData();
    }, [formSubmit, formData, setIssueList, currentSprint])

    function handleChange(event){
        const {name, value} = event.target;
        setFormData(prevData => {
            return{
                ...prevData,
                [name] : value === ""? null: value,
            };
        });
    }

    function handleSubmit(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if(formData.sprint){
                if(formData.name && formData.issueType){
                    setFormSubmit(true);
                    setShowItem(!setShowItem);
                }else{
                    console.log("Fill up the form properly!!");
                }
            }else{
                console.log("No sprint is created!!");
            }
        }
    }


    return (
        <div style={{display: showItem? "":"none"}}>
            <form className="issue-create-form" onSubmit={handleSubmit}>
                <FormOption 
                    name="issueType" 
                    value={formData.issueType || ""} 
                    handleChange={handleChange}
                    dataList={issueTypeList}
                />
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange} 
                    onKeyDown={handleSubmit}
                    placeholder="Issue Name"
                />
                <input
                    name="sprint"
                    type="hidden"
                    value={formData.sprint || ""}
                    onChange={handleChange} 
                    onKeyDown={handleSubmit}
                />
            </form>
        </div>
    );
}
