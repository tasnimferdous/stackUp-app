import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function DeleteIssue({ issueId , issueList, setIssueList}) {
    const handleDelete = async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this item?");
            if (confirmed) {
                const response = await fetch(`http://localhost:8080/stackUp/issue/delete?id=${issueId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete issue');
                }
    
                console.log('Issue deleted successfully');
                setIssueList(issueList.filter(issue => issue.id !== issueId));
            } else {
                console.log("Deletion canceled.");
            }
        } catch (error) {
            console.error("Error deleting data: ", error);
        }
    };
    

    return (
        <div>
            <span className='delete-btn' onClick={handleDelete}><RemoveCircleIcon /></span>
        </div>
    );
}
