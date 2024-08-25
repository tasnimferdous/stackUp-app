import { useEffect, useState } from 'react';
export default function FilterBySprint({ showFilteredItem, setShowFilteredItem, setFilteredIssueList, setFilteredSprint }) {
    const [formSubmit, setFormSubmit] = useState(false);
    const [clearedInput, setClearedInput] = useState(false);
    const [formData, setFormData] = useState({
        id: ""
    });

    useEffect(() => {
        const postData = async () => {
            if (formSubmit) {
                try {
                    const dataToSend = { ...formData };
                    const url = clearedInput ? 'http://localhost:8080/stackUp/issue/getAll' : `http://localhost:8080/stackUp/issue/getBySprint?id=${dataToSend.id}`;
                    const issueResponse = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!issueResponse.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const issueData = await issueResponse.json();
                    await setFilteredIssueList(issueData);
                    if (!clearedInput) {
                        const sprintResponse = await fetch(`http://localhost:8080/stackUp/sprint/get?id=${dataToSend.id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (!sprintResponse.ok) {
                            // setFilteredSprint(null);
                            throw new Error("Network response was not ok");
                        } else {
                            const sprintText = await sprintResponse.text();
                            if (sprintText.trim() !== '') {
                                const newResponse = new Response(sprintText, sprintResponse);
                                const sprintData = await newResponse.json();
                                await setFilteredSprint(sprintData);
                            } else {
                                setTimeout(() => {
                                    alert("Sprint doesn't exist"); // Delayed alert
                                }, 100);
                                setFilteredSprint(null);
                            }
                        }
                    }

                    setFormData({
                        id: dataToSend.id
                    });
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            }
            setFormSubmit(false);
        };

        postData();
    }, [formSubmit, formData, setFilteredIssueList, clearedInput, setFilteredSprint])

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value === "" ? "" : value
            };
        });
        setClearedInput(value === "");
        if (value === "") {
            setFormSubmit(true);
        }
    }

    function handleSubmit(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            setFormSubmit(true);
        }
    }


    return (
        <div >
            <form className="issue-filter-form" onSubmit={handleSubmit}>
                <input
                    name="id"
                    type="text"
                    value={formData.id || ''}
                    onChange={handleChange}
                    onKeyDown={handleSubmit}
                    placeholder="Filter By Sprint ID"
                />
            </form>
        </div>
    );
}
