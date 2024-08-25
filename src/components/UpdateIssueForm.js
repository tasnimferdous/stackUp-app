import { useEffect, useState } from 'react';

import {issueTypeList, workTypeList, userList} from './Variables';
import FormOption from './FormOption';

export default function UpdateIssueForm({currentIssue, sprintList, setSprintList, issueList, setIssueList, boardList}) {
    const [epicList, setEpicList] = useState(null);
    const [progressList, setProgressList] = useState(null);
    const [formSubmit, setFormSubmit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        id:null,
        name:"",
        description:"",
        issueType:null,
        toDoType:null,
        progressMap:null,
        assignedTo:null,
        assignedBy:null,
        point:0,
        epic:null,
        parentIssue:null,
        sprint:null,
    });

    useEffect(() => {
        setFormData({
            id:currentIssue.id || null,
            name: currentIssue.name || "",
            description: currentIssue.description || "",
            issueType: currentIssue.issueType || null,
            toDoType: currentIssue.toDoType || null,
            progressMap: currentIssue.progressMap || null,
            assignedTo: currentIssue.assignedTo || null,
            assignedBy: currentIssue.assignedBy || null,
            point: currentIssue.point || 0,
            epic: currentIssue.epic || null,
            parentIssue: currentIssue.parentIssue || null,
            sprint: currentIssue.sprint || null,
        });
    }, [currentIssue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const epicResponse = await fetch("http://localhost:8080/stackUp/epic/getAll");
                const progressResponse = await fetch("http://localhost:8080/stackUp/board/getAll");
                if (!epicResponse.ok) {
                    throw new Error('Failed to fetch epic list');
                }
                if (!progressResponse.ok) {
                    throw new Error('Failed to fetch progress list');
                }
                const epicData = await epicResponse.json();
                const progressData = await progressResponse.json();
                setEpicList(epicData);
                setProgressList(progressData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const updateIssue = async () => {
            if (formSubmit) {
                try {
                    const epicId = parseInt(formData.epic);
                    const sprintId = parseInt(formData.sprint);
                    const parentIssueId = parseInt(formData.parentIssue);
                    const progressMapId = parseInt(formData.progressMap);
    
                    let updatedFormData = {...formData};
    
                    if (formData.epic && !isNaN(epicId)) {
                        updatedFormData.epic = {
                            id: epicId,
                        };
                    }
                    if (formData.sprint && !isNaN(sprintId)) {
                        updatedFormData.sprint = {
                            id: sprintId,
                        };
                    }
                    if (formData.parentIssue && !isNaN(parentIssueId)) {
                        updatedFormData.parentIssue = {
                            id: parentIssueId,
                        };
                    }
                    if (formData.progressMap && !isNaN(progressMapId)) {
                        updatedFormData.progressMap = {
                            id: progressMapId,
                        };
                    }
    
                    updatedFormData.point = parseInt(formData.point);
    
                    const response = await fetch("http://localhost:8080/stackUp/issue/update", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedFormData),
                    });
    
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const responseData = await response.json();
                    updatedFormData = {
                        id:responseData.id || null,
                        name: responseData.name || "",
                        description: responseData.description || "",
                        issueType: responseData.issueType || null,
                        toDoType: responseData.toDoType || null,
                        progressMap: responseData.progressMap || null,
                        assignedTo: responseData.assignedTo || null,
                        assignedBy: responseData.assignedBy || null,
                        point: responseData.point || 0,
                        epic: responseData.epic || null,
                        parentIssue: responseData.parentIssue || null,
                        sprint: responseData.sprint || null,
                    };

                    const updatedIssueIndex = issueList.findIndex(issue => issue.id === formData.id);
                    const updatedIssueList = [...issueList];
                    updatedIssueList[updatedIssueIndex] = updatedFormData;
                    setIssueList(updatedIssueList);
                    
                    setTimeout(() => {
                        alert("Sprint Updated"); // Delayed alert
                    }, 100);
    
                } catch (error) {
                    console.error("Error updating issue:", error);
                }
                setFormSubmit(false);
            }
        };
    
        updateIssue();
    }, [formSubmit, formData, issueList, setIssueList]);
    
    

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
        event.preventDefault();
        if(formData.name && formData.issueType){
            setFormSubmit(true);
        }else{
            console.log("Fill up the form properly");
        }
    }


    if (loading) {
        return;
    }

    return (
        <div className='issue-create-section'>
            <form className="issue-form" onSubmit={handleSubmit}>
                <input 
                    name="id"
                    type="hidden"
                    value={formData.id}
                />
                <label htmlFor='issueName'>Issue name</label>
                <input 
                    id='issueName'
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange} 
                    placeholder="Issue Name"
                />

                <label htmlFor='description'>Description</label>
                <input 
                    id='description'
                    name='description'
                    type="text"
                    value={formData.description}
                    onChange={handleChange} 
                    placeholder="Issue Description"
                />

                <label htmlFor='point'>Point</label>
                <input
                    id='point'
                    type="number"
                    name="point"
                    value={formData.point || 0}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    step={1}
                />

                <label htmlFor="issue_type">Issue Type</label>
                <FormOption 
                    id="issue_type" 
                    name="issueType" 
                    value={formData.issueType || ""} 
                    handleChange={handleChange}
                    dataList={issueTypeList}
                />

                <label htmlFor='to_do_type'>Work Type</label>
                <FormOption 
                    id="to_do_type" 
                    name="toDoType" 
                    value={formData.toDoType || ""} 
                    handleChange={handleChange}
                    dataList={workTypeList}
                />

                <label htmlFor='assigned_to'>Assigned To</label>
                <FormOption 
                    id="assigned_to" 
                    name="assignedTo" 
                    value={formData.assignedTo || ""} 
                    handleChange={handleChange}
                    dataList={userList}
                />

                <label htmlFor='assigned_by'>Assigned By</label>
                <FormOption 
                    id="assigned_by" 
                    name="assignedBy" 
                    value={formData.assignedBy || ""} 
                    handleChange={handleChange}
                    dataList={userList}
                />

                <label htmlFor='progress_map'>Work Progress</label>
                <FormOption 
                    id="progress_map" 
                    name="progressMap" 
                    value={formData.progressMap || ""} 
                    handleChange={handleChange}
                    dataList={progressList}
                />


                <label htmlFor='epic_name'>Epic Name</label>
                <FormOption 
                    id="epic_name" 
                    name="epic" 
                    value={formData.epic || ""} 
                    handleChange={handleChange}
                    dataList={epicList}
                />

                <label htmlFor='parent'>Parent Issue Name</label>
                <FormOption 
                    id="parent" 
                    name="parentIssue" 
                    value={formData.parentIssue || ""} 
                    handleChange={handleChange}
                    dataList={issueList}
                />

                <label htmlFor='sprint'>Sprint Name</label>
                <FormOption 
                    id="sprint" 
                    name="sprint" 
                    value={formData.sprint || ""} 
                    handleChange={handleChange}
                    dataList={sprintList}
                />

                <button className='btn btn-primary'>
                    Submit
                </button>
            </form>
        </div>
    );
}
