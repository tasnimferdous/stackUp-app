import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from "../components/Header";
import TitleSection from "../components/TitleSection";

export default function Board({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [showItem, setShowItem] = useState(false); //input box to create an issue
    const newCardRef = useRef(null); // Reference for the new card form
    const [formSubmit, setFormSubmit] = useState(false);
    const [currentSprint, setCurrentSprint] = useState(null);
    const [boardList, setBoardList] = useState(null);
    const [issueList, setIssueList] = useState([]);
    const boardRef = useRef(null);
    const [scrollDirection, setScrollDirection] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });


    const fetchData = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const issueResponse = await fetch("http://localhost:8080/stackUp/issue/getAll", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const sprintResponse = await fetch("http://localhost:8080/stackUp/sprint/getAll", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const boardResponse = await fetch("http://localhost:8080/stackUp/board/getAll", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (issueResponse.status === 401 || issueResponse.status === 403 ||
                sprintResponse.status === 401 || sprintResponse.status === 403 ||
                boardResponse.status === 401 || boardResponse.status === 401
            ) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
                navigate('/login');
            }

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
                const token = localStorage.getItem('authToken');
                try {
                    const dataToSend = { ...formData };

                    const response = await fetch("http://localhost:8080/stackUp/board/createOrUpdate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (response.status === 401 || response.status === 403
                    ) {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('isAuthenticated');
                        setIsAuthenticated(false);
                        navigate('/login');
                    }

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

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this item?");
            if (confirmed) {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8080/stackUp/board/delete?id=${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403
                ) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('isAuthenticated');
                    setIsAuthenticated(false);
                    navigate('/login');
                }

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log('Board deleted successfully');
                setBoardList(boardList.filter(board => board.id !== id));
            } else {
                console.log("Deletion cancelled")
            }
        } catch (error) {
            console.error("Error posting data: ", error);
        }
    };


    const handleScroll = () => {
        if (boardRef.current) {
            boardRef.current.scrollLeft += scrollDirection;
        }
    };

    const handleMouseMove = (e) => {
        const buttonWidth = e.currentTarget.offsetWidth;
        const mouseX = e.nativeEvent.offsetX;

        if (mouseX < buttonWidth / 2) {
            setScrollDirection(-5);
        } else {
            setScrollDirection(5);
        }
    };

    const stopScroll = () => {
        setScrollDirection(0);
    };

    React.useEffect(() => {
        const interval = setInterval(() => handleScroll(), 15);
        return () => clearInterval(interval);
    }, [scrollDirection]);


    return (
        <>
            <div className="board">
                <Header />
                <TitleSection title="Board" />
                <section className='board-box' ref={boardRef}>
                    {
                        boardList && [...boardList].map((board, index) => (

                            <div className="card board-card" key={index}>
                                <div className='card-header'>
                                    <h6>{board.name}</h6>
                                    <span className='close-btn' onClick={() => handleDelete(board.id)}><CloseIcon /></span>
                                </div>
                                <div className="card-body">
                                    {issueList && [...issueList]
                                        .filter(issue => issue.assignedTo && issue.assignedTo.username === localStorage.getItem('sessionUser'))
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
            </div>
            <div className='control-scroll'>
                <button className='scroll-btn'
                    onMouseMove={handleMouseMove}
                    onMouseLeave={stopScroll}></button>
            </div>
        </>
    )
}