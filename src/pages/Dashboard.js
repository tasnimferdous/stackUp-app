import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import Header from "../components/Header";
import TitleSection from "../components/TitleSection";
import DeleteSprint from '../components/DeleteSprintComponent';


export default function Dashboard() {
    const [sprintList, setSprintList] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const sprintResponse = await fetch("http://localhost:8080/stackUp/sprint/getAll");
                if (!sprintResponse.ok) {
                    throw new Error('Failed to fetch sprint list');
                }
                const sprintData = await sprintResponse.json();
                setSprintList(sprintData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    function convertDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return (day + "-" + month + "-" + year);
      }

    return (
        <div className='admin'>
            <Header />
            <TitleSection title="Admin" />
            <div className='backlog-view' style={{ display: "block" , padding:"20px"}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sprint No.</th>
                            <th>Sprint Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sprintList && sprintList.reverse().map((sprint, index) => (
                                <tr key={index}>
                                    <td className='issue-no-td'> <DeleteSprint sprintId={sprint.id} sprintList={sprintList} setSprintList={setSprintList} /> <span className='issue-no'>{index + 1}</span></td>
                                    <td>{sprint && sprint.name}</td>
                                    <td>{sprint && convertDate(sprint.startDate)}</td>
                                    <td>{sprint && convertDate(sprint.endDate)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    );
}