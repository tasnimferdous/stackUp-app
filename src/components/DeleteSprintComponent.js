import React from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export default function DeleteSprint({ sprintId , sprintList, setSprintList}) {
    const handleDelete = async () => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete the sprint?");
            if (confirmed) {
                const response = await fetch(`http://localhost:8080/stackUp/sprint/delete?id=${sprintId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to delete sprint');
                }
                const data = await response.json();
                if(data.hasError){
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
