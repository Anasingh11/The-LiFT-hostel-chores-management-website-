import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [addItemInput, setAddItemInput] = useState('');
  const [addAssigneeInput, setAddAssigneeInput] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const addItem = () => {
    if (addItemInput.trim() !== '') {
      const newTask = {
        item: addItemInput,
        assignee: addAssigneeInput,
        completed: false
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setAddItemInput('');
      setAddAssigneeInput('');
    }
  };

  const completeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const displayTasks = () => {
    return tasks.map((task, index) => (
      !task.completed || showCompleted ?
        <tr key={index}>
          <td>{task.item}</td>
          <td>{task.assignee}</td>
          <td><input type="checkbox" onChange={() => completeTask(index)} checked={task.completed} /></td>
          <td><button onClick={() => removeTask(index)}>Remove</button></td>
        </tr>
        : null
    ));
  };

  const showScorecard = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const assignees = completedTasks.reduce((acc, curr) => {
      if (curr.assignee) {
        acc[curr.assignee] = (acc[curr.assignee] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedAssignees = Object.entries(assignees).sort((a, b) => b[1] - a[1]);

    return (
      <div className="scorecard-container">
        <h2>Scorecard</h2>
        {sortedAssignees.map(([assignee, count], index) => (
          <p key={index}>{index + 1}. {assignee}: {count}</p>
        ))}
        <p><strong>Winner: {sortedAssignees.length > 0 ? sortedAssignees[0][0] : 'None'}</strong></p>
        <img src="congo.png" alt="Congratulations" className="scorecard-image" />
      </div>
    );
  };

  const downloadTasks = () => {
    const tasksText = tasks.map(task => `${task.item}: ${task.assignee}`).join('\n');
    const blob = new Blob([tasksText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div>
      <div className="home-link">
        <a href="home.html">HOME</a>
      </div>
      <div className="container">
        <h1>LiFT</h1>
        <div>
          <label htmlFor="addItem">Add Task:</label>
          <input type="text" id="addItem" value={addItemInput} placeholder="Enter an item" onChange={(e) => setAddItemInput(e.target.value)} />
          <label htmlFor="assignee">Assignee:</label>
          <input type="text" id="assignee" value={addAssigneeInput} placeholder="Enter assignee's name" onChange={(e) => setAddAssigneeInput(e.target.value)} />
          <button onClick={addItem}>Add</button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="showCompleted">Show Completed Tasks:</label>
          <input type="checkbox" id="showCompleted" checked={showCompleted} onChange={() => setShowCompleted(!showCompleted)} />
        </div>
        <table id="list">
          <thead>
            <tr>
              <th>Item</th>
              <th>Assignee</th>
              <th>Completed</th>
              <th>Action</th>
            </tr>
          </thead>
