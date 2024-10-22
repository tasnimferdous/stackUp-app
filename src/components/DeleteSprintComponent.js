import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';

export default function DeleteSprint({ setIsAuthenticated, sprintId, sprintList, setSprintList }) {
    const navigate = useNavigate();
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const confirmed = window.confirm("Are you sure you want to delete the sprint?");
            if (confirmed) {
                const response = await fetch(`http://localhost:8080/stackUp/sprint/delete?id=${sprintId}`, {
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
                    throw new Error('Failed to delete sprint');
                }
                const data = await response.json();
                if (data.hasError) {
                    throw new Error('Failed to delete sprint! Dependency with Issues!');
                }
                console.log('Sprint deleted successfully');
                setSprintList(sprintList.filter(sprint => sprint.id !== sprintId));
            } else {
                console.log("Deletion cancelled.");
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
