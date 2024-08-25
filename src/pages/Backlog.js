import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import TitleSection from '../components/TitleSection';
import Header from '../components/Header';
import CreateIssueForm from '../components/CreateIssueForm';
import FilterBySprint from '../components/FilterBySprint';
import CardComponent from '../components/CardComponent';
import DeleteIssue from '../components/DeleteIssueComponent';
import CreateSprint from '../components/CreateSprintComponent';

export default function Backlog() {
  const [issueList, setIssueList] = useState([]);
  const [boardList, setBoardList] = useState(null);
  const [filteredIssueList, setFilteredIssueList] = useState([]);
  const [sprintList, setSprintList] = useState(null);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [filteredSprint, setFilteredSprint] = useState(null);
  const [currentIssue, setCurrentIssue] = useState({
    name: "",
    description: "",
    issueType: null,
    toDoType: null,
    progressMap: null,
    assignedTo: null,
    assignedBy: null,
    point: 0,
    epic: null,
    parentIssue: null,
    sprint: null,
  });
  const [showItem, setShowItem] = useState(false); //input box to create an issue
  const [showFilteredItem, setShowFilteredItem] = useState(false); // input box to filter by sprint
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await fetch("http://localhost:8080/stackUp/issue/getAll");
        const sprintResponse = await fetch("http://localhost:8080/stackUp/sprint/getAll");
        const boardResponse = await fetch("http://localhost:8080/stackUp/board/getAll");
        if (!issueResponse.ok) {
          throw new Error('Failed to fetch issues');
        }
        if (!sprintResponse.ok) {
          throw new Error('Failed to fetch sprint list');
        }
        if (!boardResponse.ok) {
          throw new Error('Failed to fetch board list');
        }
        const issueData = await issueResponse.json();
        const sprintData = await sprintResponse.json();
        const boardData = await boardResponse.json();
        setIssueList(issueData);
        setFilteredIssueList(issueData);
        setSprintList(sprintData);
        setBoardList(boardData);
        setCurrentSprint(sprintData[sprintData.length - 1]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateIssueButton = () => setShowItem(!showItem);
  const handleFilterIssueButton = () => setShowFilteredItem(!showFilteredItem);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.issue-create-btn') && !event.target.closest('.issue-create-section')) {
        setShowItem(false); // Toggle the value of showItem
      }
      if (!event.target.closest('.issue-filter-btn') && !event.target.closest('.issue-filter-section')) {
        setShowFilteredItem(false); // Toggle the value of showItem
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleUpdateBox = (issue) => {
    setCurrentIssue({
      id: issue.id,
      name: issue.name,
      description: issue.description,
      issueType: issue.issueType,
      toDoType: issue.toDoType,
      progressMap: issue.progressMap,
      assignedTo: issue.assignedTo,
      assignedBy: issue.assignedBy,
      point: issue.point,
      epic: issue.epic,
      parentIssue: issue.parentIssue,
      sprint: issue.sprint,
    });
    setShowUpdateBox(true);
  };


  function convertDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return (day + "-" + month + "-" + year);
  }

  if (loading) {
    return;
  }

  return (
    <div>
      <div className='backlog'>
        <Header />
        <TitleSection title="Backlog" />
        <CreateSprint />

        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <div className='sprint-detail'>
                  <h6>{currentSprint && currentSprint.name}</h6>
                  <p>Start Date: {currentSprint && convertDate(currentSprint.startDate)}</p>
                  <p>End Date: {currentSprint && convertDate(currentSprint.endDate)}</p>
                  <p>Total Issues</p>
                </div>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className='issue-table'>
                  <button className='btn btn-primary issue-create-btn' style={{ display: showItem ? "none" : "" }} onClick={handleCreateIssueButton}>Create Issue</button>
                  <div className="issue-create-section">
                    <CreateIssueForm showItem={showItem} setShowItem={setShowItem} currentSprint={currentSprint} setIssueList={setIssueList} />
                  </div>
                  <div className='backlog-view' style={{ display: showUpdateBox ? "flex" : "block", overflow: showUpdateBox ? "hidden" : "" }}>
                    <div className='backlog-table' style={{ width: showUpdateBox ? "50%" : "100%", transition: "all 1s" }}>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Issue No.</th>
                            <th>Sprint No.</th>
                            <th>Issue Type</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>To-Do Type</th>
                            <th>Assigned To</th>
                            <th>Point</th>
                            <th>Progression</th>
                            <th>Client</th>
                            <th>Parent Issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            issueList && [...issueList].filter(issue => issue.sprint && issue.sprint.id === currentSprint.id).reverse().map((issue, index) => (
                              <tr key={index}>
                                <td className='issue-no-td'> <DeleteIssue issueId={issue.id} issueList={issueList} setIssueList={setIssueList} /> <span className='issue-no'>{index + 1}</span></td>
                                <td>{issue.sprint && issue.sprint.name}</td>
                                <td>{issue.issueType}</td>
                                <td className="issue-name" onClick={() => handleUpdateBox(issue)}>{issue.name}</td>
                                <td>{issue.description}</td>
                                <td>{issue.toDoType}</td>
                                <td>{issue.assignedTo}</td>
                                <td>{issue.point}</td>
                                <td>{issue.progressMap && issue.progressMap.name}</td>
                                <td>{issue.epic && issue.epic.name}</td>
                                <td>{issue.parentIssue && issue.parentIssue.name}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table>
                    </div>
                    {
                      showUpdateBox && <CardComponent setShowUpdateBox={setShowUpdateBox} sprintList={sprintList} setSprintList={setSprintList} 
                      currentIssue={currentIssue} issueList={issueList} setIssueList={setIssueList} boardList={boardList}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>






      <div className='backlog'>
        <TitleSection title="Other Sprint Details" />

        <div className="accordion" id="accordionExample2">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                <div className='sprint-detail'>
                  <h6>{filteredSprint && filteredSprint.name}</h6>
                  <p>Start Date: {filteredSprint && convertDate(filteredSprint.startDate)}</p>
                  <p>End Date: {filteredSprint && convertDate(filteredSprint.endDate)}</p>
                  <p>Total Issues</p>
                </div>
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample2">
              <div className="accordion-body">
                <div className='issue-table'>
                  <button className='btn btn-primary issue-filter-btn' onClick={handleFilterIssueButton}>Filter Issue</button>
                  <div className="issue-filter-section" style={{ display: showFilteredItem ? "" : "none" }}>
                    <FilterBySprint showFilteredItem={showFilteredItem} setShowFilteredItem={setShowFilteredItem} setFilteredIssueList={setFilteredIssueList} setFilteredSprint={setFilteredSprint} />
                  </div>
                  <div className='backlog-view' style={{ display: "block" }}>
                    <div className='backlog-table'>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Issue No.</th>
                            <th>Sprint No.</th>
                            <th>Issue Type</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>To-Do Type</th>
                            <th>Assigned To</th>
                            <th>Point</th>
                            <th>Progression</th>
                            <th>Client</th>
                            <th>Parent Issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            filteredIssueList && [...filteredIssueList].reverse().map((issue, index) => (
                              <tr key={index}>
                                <td>{issue.sprint && issue.sprint.name}</td>
                                <td>{issue.issueType}</td>
                                <td style={{ fontWeight: 600 }}>{issue.name}</td>
                                <td>{issue.description}</td>
                                <td>{issue.toDoType}</td>
                                <td>{issue.assignedTo}</td>
                                <td>{issue.point}</td>
                                <td>{issue.progressMap && issue.progressMap.name}</td>
                                <td>{issue.epic && issue.epic.name}</td>
                                <td>{issue.parentIssue && issue.parentIssue.id}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}