import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';


export default function CreateSprint() {
    const [show, setShow] = useState(false);
    const [formSubmit, setFormSubmit] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value === "" ? null : value,
            };
        });
    }

    function handleSubmit(event){
        event.preventDefault();
        if(formData.name && formData.startDate && formData.endDate){
            setFormSubmit(true);
        }else{
            console.log("Fill up the form properly");
        }
    }

    useEffect(() => {
        const postData = async () =>{
            if(formSubmit){
                try{
                    const dataToSend = { ...formData };

                    const response = await fetch("http://localhost:8080/stackUp/sprint/create", {
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
                    console.log(data)
                    handleClose();
                    setTimeout(() => {
                        alert("Sprint Created"); // Delayed alert
                    }, 200);
                }catch(error){
                    console.error("Error posting data: ", error);
                }
            }
            setFormSubmit(false);
        };

        postData();
    }, [formSubmit, formData])


    return (
        <div>
            <button className='btn btn-primary sprint-btn' onClick={handleShow}>New Sprint</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Sprint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="sprintForm" onSubmit={handleSubmit}>
                        <label htmlFor='name'>Sprint Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            // onKeyDown={handleSubmit}
                            placeholder="Issue Name"
                        />
                        <label htmlFor='description'>Sprint Description</label>
                        <input
                            id='description'
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={handleChange}
                            // onKeyDown={handleSubmit}
                            placeholder="description"
                        />
                        <label htmlFor='startDate'>Sprint Start Date</label>
                        <input
                            id='startDate'
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            // onKeyDown={handleSubmit}
                            placeholder="Issue Name"
                        />
                        <label htmlFor='endDate'>Sprint End Date</label>
                        <input
                            id='endDate'
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            // onKeyDown={handleSubmit}
                            placeholder="Issue Name"
                        />
                        <button className='btn btn-primary sprint-submit-btn'>
                            Submit
                        </button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
}
