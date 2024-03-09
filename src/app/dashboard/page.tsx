'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const Page = () => {
    const { push } = useRouter();
    const [showSidebar, setShowSidebar] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [username, setUsername] = useState('');
    const [profile, setProfile] = useState('');

    if (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === undefined || localStorage.getItem('accessToken') === ''){
        push('/');
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const logOutHandler = () => {
        localStorage.removeItem('accessToken');
        push('/');
    };

    const onDragEnd = async (result) => {
        // If dropped outside the list
        if (!result.destination) {
            return;
        }

        const { source, destination } = result;

        // If dropped in the same droppable
        if (source.droppableId === destination.droppableId) {
            const newTasks = Array.from(tasks);
            const movedTask = newTasks.find(task => task._id === result.draggableId);

            if (movedTask) {
                newTasks.splice(source.index, 1);
                newTasks.splice(destination.index, 0, movedTask);
                setTasks(newTasks);
            }
        } else {
            // Move task to a different droppable
            const movedTask = tasks.find(task => task._id === result.draggableId);

            if (movedTask) {
                movedTask.status = destination.droppableId;
                setTasks(prevTasks => {
                    const updatedTasks = [...prevTasks];
                    const index = updatedTasks.findIndex(task => task._id === movedTask._id);
                    updatedTasks.splice(index, 1, movedTask);
                    return updatedTasks;
                });
                await handleStatus(movedTask._id, destination.droppableId);
            }
        }
    };


    const handleAddTask = async () => {
        const newTitle = prompt("Enter task title:");
        const newDescription = prompt("Enter task description:");
        const newDueDate = prompt("Enter due date (YYYY-MM-DD):");
        const newTags = prompt("Enter tags (comma-separated):").split(',');
        const newChecklistItem = prompt("Enter checklist item:");
        const newAttachmentLink = prompt("Enter attachment link:");
        const newAttachmentDisplayText = prompt("Enter attachment display text:");
    
        const newTaskData = {
            title: newTitle,
            description: newDescription,
            dueDate: newDueDate,
            tags: newTags,
            checklists: [{ checklistItem: newChecklistItem, isDone: false }],
            attachments: [{ link: newAttachmentLink, displayText: newAttachmentDisplayText }]
        };
    
        try {
            const response = await fetch('https://oprec-api.labse.in/api/task', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTaskData)
            });
            if (response.ok) {
                console.log('Task created successfully');
                fetchUser();
            } else {
                console.error('Failed to create task');
                toast.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
      };  

    const handleStatus = async (taskId, newStatus) => {
      try {
        const response = await fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus
            })
        });
        if (response.ok) {
            console.log('Task updated successfully');
            fetchUser();
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
    };

    const handleEditTitle = async (taskId, newTitle) => {
      try {
        const response = await fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle
            })
        });
        if (response.ok) {
            console.log('Task updated successfully');
            fetchUser();
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
    };

    const handleEditDesc = async (taskId, newdesc) => {
      try {
        const response = await fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              description: newdesc
            })
        });
        if (response.ok) {
            console.log('Task updated successfully');
            fetchUser();
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
    };

    const handleDelete = async (taskId) => {
      try {
        const response = await fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        if (response.ok) {
            handleDeletedTask(taskId);
            console.log('Task deleted successfully');
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
    };

    const handleDeletedTask = async (taskId) => {
      try {
        const response = await fetch(`https://oprec-api.labse.in/api/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'deleted'
            })
        });
        if (response.ok) {
            console.log('Task updated successfully');
            fetchUser();
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch('https://oprec-api.labse.in/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setTasks(userData.user.tasks);
                setProfile(userData.user.photoUrl);
                setUsername(userData.user.username);
                console.log('User data:', userData.user.tasks);
            } else {
                // Handle error response
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Group tasks by status
    const filteredTasks = tasks.filter(task => task.status !== 'deleted');
    const groupedTasks = filteredTasks.reduce((acc, task) => {
        acc[task.status] = [...(acc[task.status] || []), task];
        return acc;
    }, {});

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`sm:block ${showSidebar ? 'block' : 'hidden'} w-64 bg-gray-800 text-white flex flex-col justify-between md:flex md:flex-col`}>
                <div className="p-4 mt-12 flex items-center justify-center flex-col">
                    <img src={profile} alt="" className="mt-5 h-16 w-16" />
                    <h1 className="text-base font-bold mt-3">{username}</h1>
                </div>
                <div className="flex items-center justify-center md:mt-80 lg:mt-96">
                    <svg onClick={() => logOutHandler()} className="h-10 w-10 mb-10 bg-white rounded-md items-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="logout">
                        <g data-name="Layer 2">
                            <path d="M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6zm13.82 5.42-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z" data-name="log-out"></path>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Main Container */}
            <div className="flex-1 bg-gray-200 mt-20 md:mt-0">
                <div className="p-4 bg-white hidden md:block">
                    <h1 className="text-2xl font-bold text-center text-slate-900">Task Management App</h1>
                </div>
                <div className="p-4 flex flex-col justify-around md:flex-row">
                    {Object.keys(groupedTasks).map(status => (
                        <div key={status} className="flex-1 md:max-w-xs mx-4 md:mx-0 mb-4 md:mb-0">
                            <h2 className="text-lg font-semibold mb-4 text-center md:text-left text-slate-900">{status}</h2>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {groupedTasks[status].map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <div key={task._id} className="p-4 border-b border-gray-200">
                                                            <div className='flex flex-row justify-between'>
                                                            <button onClick={() => 
                                                                handleDelete(task._id)
                                                                }>Delete Task</button>
                                                            <button onClick={() => {
                                                                const newStatus = prompt("Enter new Status");
                                                                if (newStatus) {
                                                                    handleStatus(task._id, newStatus);
                                                                }
                                                            }}
                                                            >Edit Status</button>
                                                            </div>
                                                            <div className='flex flex-row'>
                                                            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                                                            <button onClick={() => {
                                                                const newTitle = prompt("Enter new Title");
                                                                if (newTitle) {
                                                                    handleEditTitle(task._id, newTitle);
                                                                }
                                                            }}
                                                            >✏️</button>
                                                            </div>
                                                            <div className='flex flex-row'>
                                                            <p className="text-sm text-gray-600">{task.description}</p>
                                                            <button onClick={() => {
                                                                const newdesc = prompt("Enter new Description");
                                                                if (newdesc) {
                                                                    handleEditDesc(task._id, newdesc);
                                                                }
                                                            }}
                                                            >✏️</button>
                                                            </div>
                                                            <div className="flex justify-between mt-2">
                                                                <span className="text-xs text-gray-500">{task.dueDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </div>

            {/* Button to show sidebar on small screens */}
            <button className="sm:hidden absolute top-0 left-0 m-4 p-2 bg-gray-800 text-white rounded-md" onClick={toggleSidebar}>
                ≡ TaskApp
            </button>

            {/* Floating Button */}
            <button className="absolute bottom-10 right-10 bg-blue-500 text-white rounded-full py-4 px-8 text-lg shadow-md hover:bg-blue-600 focus:outline-none" onClick={handleAddTask}>
              +
            </button>
        </div>
        </DragDropContext>
    );
};

export default Page;