import React from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function DeleteIssue({ setIsAuthenticated, issueId , issueList, setIssueList}) {
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const confirmed = window.confirm("Are you sure you want to delete this item?");
            if (confirmed) {
                const response = await fetch(`http://localhost:8080/stackUp/issue/delete?id=${issueId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    navigate('/login');
                }
    
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
