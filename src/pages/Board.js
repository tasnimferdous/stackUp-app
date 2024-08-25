import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState, useRef } from 'react';

import Header from "../components/Header";
import TitleSection from "../components/TitleSection";

export default function Board() {
    const [showItem, setShowItem] = useState(false); //input box to create an issue
    const newCardRef = useRef(null); // Reference for the new card form
    const [formSubmit, setFormSubmit] = useState(false);
    const [currentSprint, setCurrentSprint] = useState(null);
    const [boardList, setBoardList] = useState(null);
    const [issueList, setIssueList] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });


    const fetchData = async () => {
        try {
            const sprintResponse = await fetch("http://localhost:8080/stackUp/sprint/getAll");
            const issueResponse = await fetch("http://localhost:8080/stackUp/issue/getAll");
            const boardResponse = await fetch("http://localhost:8080/stackUp/board/getAll");
            if (!sprintResponse.ok) {
                throw new Error('Failed to fetch sprint list');
            }
            if (!issueResponse.ok) {
                throw new Error('Failed to fetch issue list');
            }
            if (!boardResponse.ok) {
                throw new Error('Failed to fetch board list');
            }
            const sprintData = await sprintResponse.json();
            const issueData = await issueResponse.json();
            const boardData = await boardResponse.json();
            setIssueList(issueData);
            setBoardList(boardData);
            setCurrentSprint(sprintData[sprintData.length - 1]);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (showItem && newCardRef.current) {
            newCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        const postData = async () => {
            if (formSubmit) {
                try {
                    const dataToSend = { ...formData };

                    const response = await fetch("http://localhost:8080/stackUp/board/createOrUpdate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataToSend),
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setBoardList(prevData => [
                        ...prevData,
                        data
                    ]);
                    setFormData({
                        name: "",
                        description: ""
                    })

                    setShowItem(false);
                    //whenever this post call is successfully done i want to get all the board in boardList
                } catch (error) {
                    console.error("Error posting data: ", error);
                }
                setFormSubmit(false);
            }
        };

        postData();
    }, [showItem, formSubmit, formData, boardList]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value === "" ? null : value,
            };
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formData.name) {
            setFormSubmit(true);
        } else {
            console.log("Fill up the form properly");
        }
    }

    const handleCreateButton = () => {
        setShowItem(!showItem);
    };

    const handleDelete = async(id) => {
            try {
                const confirmed = window.confirm("Are you sure you want to delete this item?");
                if(confirmed){
                const response = await fetch(`http://localhost:8080/stackUp/board/delete?id=${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log('Board deleted successfully');
                setBoardList(boardList.filter(board => board.id !== id));
                }else{
                    console.log("Deletion cancelled")
                }
            } catch (error) {
                console.error("Error posting data: ", error);
            }
    };

    return (
        <div className="board">
            <Header />
            <TitleSection title="Board" />
            <section className='board-box'>
                {
                    boardList && [...boardList].map((board, index) => (

                        <div className="card board-card" key={index}>
                            <div className='card-header'>
                                <h6>{board.name}</h6>
                                <span className='close-btn' onClick={() => handleDelete(board.id)}><CloseIcon /></span>
                            </div>
                            <div className="card-body">
                                {issueList && [...issueList]
                                .filter(issue => issue.sprint && issue.sprint.id === currentSprint.id)
                                .filter(issue => issue.progressMap && issue.progressMap.id === board.id)
                                .map((issue, issueIndex) => (
                                    <h5 className="card-title" key={issueIndex}>{issue.name}</h5>
                                ))}
                            </div>
                        </div>

                    ))
                }

                <div className="card" ref={newCardRef} style={{ display: showItem ? "" : "none" }}>
                    <div className='card-header text-end'>
                        <span className='close-btn' onClick={handleCreateButton}><CloseIcon /></span>
                    </div>
                    <div className="card-body">
                        <form className='board-form' onSubmit={handleSubmit}>
                            <label htmlFor='name'>Board Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Board Name"
                            />
                            <label htmlFor='description'>Board Description</label>
                            <textarea
                                id="description"
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Board Description"
                            />
                            <button className='btn btn-primary mt-3'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
                <button className='add-board btn btn-primary'
                    onClick={handleCreateButton}
                    style={{ display: showItem ? "none" : "" }}
                >
                    +
                </button>
            </section>

            <button className='scroll-btn'></button>
        </div>
    )
}