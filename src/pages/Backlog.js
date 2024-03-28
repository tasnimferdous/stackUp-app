import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import TitleSection from '../components/TitleSection';
import Header from '../components/Header';
import CreateIssueForm from '../components/CreateIssueForm';
import CardComponent from '../components/CardComponent';
import DeleteForm from '../components/DeleteFormComponent';
import CreateSprint from '../components/CreateSprintComponent';

export default function Backlog() {
  const [issueList, setIssueList] = useState([]);
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
  const [showItem, setShowItem] = useState(false);
  const [showUpdateBox, setShowUpdateBox] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueResponse = await fetch("http://localhost:8080/stackUp/issue/getAll");
        if (!issueResponse.ok) {
          throw new Error('Failed to fetch issues');
        }
        const issueData = await issueResponse.json();
        setIssueList(issueData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateIssueButton = () => setShowItem(!showItem);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.issue-create-btn') && !event.target.closest('.issue-create-section')) {
        setShowItem(false); // Toggle the value of showItem
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

  if (loading) {
    return;
  }
  return (
    <div>
      <Header />
      <div className='backlog'>
        <TitleSection title="Backlog" />
        <CreateSprint />
        <div className="accordion" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <div className='sprint-detail'>
                <h6>Sprint Title</h6>
                <p>Start Date</p>
                <p>End Date</p>
                <p>Total Issues</p>
                </div>
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <div className='issue-table'>
                  <button className='btn btn-primary issue-create-btn' style={{ display: showItem ? "none" : "" }} onClick={handleCreateIssueButton}>Create Issue</button>
                  <div className="issue-create-section">
                    <CreateIssueForm showItem={showItem} setShowItem={setShowItem} setIssueList={setIssueList} />
                  </div>
                  <div className='backlog-view' style={{ display: showUpdateBox ? "flex" : "block", overflow: showUpdateBox ? "hidden" : "" }}>
                    <div className='backlog-table' style={{ width: showUpdateBox ? "50%" : "100%", transition: "all 1s" }}>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Issue No.</th>
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
                            issueList && [...issueList].reverse().map((issue, index) => (
                              <tr key={index}>
                                <td className='issue-no-td'> <DeleteForm issueId={issue.id} issueList={issueList} setIssueList={setIssueList} /> <span className='issue-no'>{index + 1}</span></td>
                                <td>{issue.issueType}</td>
                                <td className="issue-name" onClick={() => handleUpdateBox(issue)}>{issue.name}</td>
                                <td>{issue.description}</td>
                                <td>{issue.toDoType}</td>
                                <td>{issue.assignedTo}</td>
                                <td>{issue.point}</td>
                                <td>{issue.progressMap}</td>
                                <td>{issue.epic && issue.epic.name}</td>
                                <td>{issue.parentIssue && issue.parentIssue.id}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </Table>
                    </div>
                    {
                      showUpdateBox && <CardComponent setShowUpdateBox={setShowUpdateBox} currentIssue={currentIssue} issueList={issueList} setIssueList={setIssueList} />
                    }
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