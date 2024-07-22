import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { Error, showSwalDialog, Success } from '../../common/swal';
import axios from 'axios';
import ImportedURL from '../../common/api';
import moment from 'moment';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [draggingOverIndex, setDraggingOverIndex] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ task: { title: '', description: '' }, type: '' });
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [spinner, setSpinner] = useState(true);
  const history = useHistory();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = (query) => {
    setSpinner(true);
    axios.get(ImportedURL.API.getTask, { params: { date: (query && query.date) ? query.date : -1, search: (query && query.search) ? query.search : '' } })
      .then((res) => {
        setTasks(res.data);
        closeModal();
        setSpinner(false);
      }).catch((response) => {
        Error(response.statusMessage);
        setSpinner(false);
      });
  };

  const filteredAndSortedTasks = tasks

  const handleDragStart = (index, task) => {
    setDraggedItem(task);
    setDraggedItemIndex(index);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedItem) {
      const updatedTasks = Array.from(tasks);
      const [removedTask] = updatedTasks.splice(draggedItemIndex, 1);
      // If moving within the same column, update position only
      if (draggedItem.taskstatus === columnId) {
        let insertAt = draggingOverIndex !== null ? draggingOverIndex : updatedTasks.length;
        if (draggedItemIndex + 1 < insertAt) {
          insertAt--;
        }
        updatedTasks.splice(insertAt, 0, removedTask);
      } else {
        // If moving to a different column, update taskstatus
        removedTask.taskstatus = columnId;
        let insertAt = draggingOverIndex !== null ? draggingOverIndex : updatedTasks.length;
        if (draggedItemIndex + 1 < insertAt) {
          insertAt--;
        }
        updatedTasks.splice(insertAt, 0, removedTask);
      }
      // Add order field to tasks
      updatedTasks.forEach((task, index) => {
        task.order = index; // Order based on the current position
      });
      setTasks(updatedTasks);
      setDraggedItem(null);
      setDraggedItemIndex(null);
      setDraggingOverIndex(null);

      // Send updated tasks to backend
      axios.post(ImportedURL.API.updateTasksOrder, { tasks: updatedTasks })
        .then(response => {
          Success(response.statusText);
        })
        .catch(({ response }) => {
          Error(response.statusText);
        });
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (index) => {
    setDraggingOverIndex(index);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value)
    fetchTasks({ search: event.target.value })
  };
  const handleSortByChange = (event) => {
    setSortBy(event.target.value)
    fetchTasks({ date: event.target.value == 'recent' ? -1 : 1 })
  };

  const columns = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  };

  // -----modal------
  const openModal = (task, type) => {
    setModalContent({ task: task || { title: '', description: '' }, type });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent({ task: { title: '', description: '' }, type: '' });
    setErrors({ title: '', description: '' });
  };

  const handleLogout = () => {
    showSwalDialog('Are you sure you want to logout ?', '', 'Yes', 'No').then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('vooshtoken');
        window.location.href = "/";
      }
    });
  };

  const validateForm = (task, field = null) => {
    if (!task) {
      task = modalContent.task; // Fallback to the current task in state if not provided
    }
    const { title, description } = task;
    const newErrors = { ...errors }; // Keep existing errors

    if (!field || field === 'title') {
      newErrors.title = title.trim() ? '' : 'Title is required';
    }
    if (!field || field === 'description') {
      newErrors.description = description.trim() ? '' : 'Description is required';
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalContent((prevState) => {
      const updatedTask = {
        ...prevState.task,
        [name]: value,
      };
      validateForm(updatedTask, name);
      return {
        ...prevState,
        task: updatedTask,
      };
    });
  };

  const handleModalSubmit = () => {
    if (!validateForm()) return;
    if (modalContent.type === 'add') {
      axios.post(ImportedURL.API.addTask, modalContent.task)
        .then((res) => {
          Success(res.statusText);
          fetchTasks();
          closeModal();
        }).catch(({ response }) => {
          Error(response.statusText);
        });
    } else if (modalContent.type === 'edit') {
      axios.post(ImportedURL.API.editTask + "/" + modalContent.task._id, modalContent.task)
        .then((res) => {
          Success(res.statusText);
          fetchTasks();
          closeModal();
        }).catch(({ response }) => {
          Error(response.statusText);
        });
    }
  };

  const handleDelete = (task) => {
    showSwalDialog('Are you sure you want to delete ?', '', 'Yes', 'No').then((result) => {
      if (result.isConfirmed) {
        axios.get(ImportedURL.API.softDeleteTask + "/" + task._id)
          .then((res) => {
            Success(res.statusText);
            fetchTasks();
          }).catch(({ response }) => {
            Error(response.statusText);
          });
        fetchTasks();
      }
    });
  };

  return (
    <>
      <div className="app">
        <header>
          <h2>Taskboard</h2>
        </header>

        <div className='main-control'>
          <div className="controls">
            <button className="btn" onClick={() => openModal("", 'add')}>Add Task</button>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearch}
              className="search-input"
            />
            <select value={sortBy} onChange={handleSortByChange} className="sort-select">
              <option value="recent">Sort By Recent Task</option>
              <option value="old">Sort By Old Task</option>
            </select>
          </div>
          <div className='logout'>
            <button className="btn btn-profile" onClick={() => history.push('/profile')}>Profile</button>
            <button className="btn btn-logout" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        <div className="columns">
          {Object.entries(columns).map(([columnId, columnName]) => (
            <div
              key={columnId}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId, draggingOverIndex !== null ? draggingOverIndex : 0)}
            >
              <h2>{columnName}</h2>
              {filteredAndSortedTasks
                .filter(task => task.taskstatus === columnId) // Ensure the taskstatus matches your columnId
                .map((task) => (
                  <div
                    key={task.id}
                    className={`task ${draggedItem && draggedItem.id === task.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(task.order, task)}
                    onDragEnter={() => handleDragEnter(task.order)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, columnId, task.order)}
                  >
                    <h5>{task.title}</h5>
                    <p className='font-description'>{task.description}</p>
                    <p className='font-createdat'><span>Created at : </span>{moment(task.createdAt).format('DD-MM-YYYY hh:mm A')}</p>
                    <div className="task-actions">
                      <button className="btn btn-info" onClick={() => openModal(task, 'edit')}>Edit</button>
                      <button className="btn btn-info" onClick={() => handleDelete(task)}>Delete</button>
                      <button className="btn btn-info" onClick={() => openModal(task, 'view')}>View Details</button>
                    </div>
                  </div>
                ))}
              {filteredAndSortedTasks.filter(task => task.taskstatus === columnId).length === 0 && (
                <p className="no-tasks">No tasks available</p>
              )}
            </div>
          ))}
        </div>
        <div id="overlay" style={{ display: spinner ? 'block' : 'none' }}></div>
        {spinner ? <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div> : ""}
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalContent && modalContent.type === 'edit' ? 'Edit Task' : modalContent && modalContent.type === 'add' ? 'Add Task' : 'Task Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent && (
            <Form>
              <Form.Group controlId="formTaskTitle">
                <Form.Label><strong>Title:</strong></Form.Label>
                {modalContent.type === 'view' ? (
                  <p>{modalContent.task.title}</p>
                ) : (
                  <>
                    <Form.Control
                      type="text"
                      name="title"
                      value={modalContent.task.title}
                      onChange={handleModalChange}
                    />
                    {errors.title && <small className="text-danger">{errors.title}</small>}
                  </>
                )}
              </Form.Group>
              <Form.Group controlId="formTaskDescription" className="mt-3">
                <Form.Label><strong>Description:</strong></Form.Label>
                {modalContent.type === 'view' ? (
                  <p>{modalContent.task.description}</p>
                ) : (
                  <>
                    <Form.Control
                      type="text"
                      name="description"
                      value={modalContent.task.description}
                      onChange={handleModalChange}
                    />
                    {errors.description && <small className="text-danger">{errors.description}</small>}
                  </>
                )}
              </Form.Group>
              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={closeModal} className="me-2">
                  {modalContent.type === 'view' ? 'Close' : 'Cancel'}
                </Button>
                {modalContent.type !== 'view' && (
                  <Button variant="primary" onClick={handleModalSubmit}>
                    Save
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default App;
