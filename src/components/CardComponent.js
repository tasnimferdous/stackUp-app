import CloseIcon from '@mui/icons-material/Close';

import UpdateIssueForm from "./UpdateIssueForm";

export default function CardComponent({setShowUpdateBox, sprintList, setSprintList, currentIssue, issueList, setIssueList, boardList}){
    const closeUpdateBox = () => setShowUpdateBox(false);

    return(
        <div className="card update-issue-card">
            <div className='card-header text-end'>
                <span className='close-btn' onClick={closeUpdateBox}><CloseIcon /></span>
            </div>
            <div className="card-body">
                <h5 className="card-title">Update Issue Form</h5>
                <UpdateIssueForm currentIssue={currentIssue} sprintList={sprintList} setSprintList={setSprintList} issueList={issueList} setIssueList={setIssueList} boardList={boardList}/>
            </div>
        </div>
    );
}