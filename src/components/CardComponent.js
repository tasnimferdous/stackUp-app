import CloseIcon from '@mui/icons-material/Close';

import UpdateIssueForm from "./UpdateIssueForm";

export default function CardComponent({setShowUpdateBox, currentIssue, issueList, setIssueList}){
    const closeUpdateBox = () => setShowUpdateBox(false);

    return(
        <div className="card">
            <div className='card-header text-end'>
                <span className='close-btn' onClick={closeUpdateBox}><CloseIcon /></span>
            </div>
            <div className="card-body">
                <h5 className="card-title">Update Issue Form</h5>
                <UpdateIssueForm currentIssue={currentIssue} issueList={issueList} setIssueList={setIssueList} />
            </div>
        </div>
    );
}