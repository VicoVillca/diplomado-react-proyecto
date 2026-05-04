import { useState, useEffect } from 'react';
import type { Task } from '../../models';
import { IconButton, Switch, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAxios } from '../../hooks/useAxios';
import { useAlert } from '../../hooks/useAlert';

interface TasksResponse {
  total: number;
  page: number;
  pages: number;
  data: Task[];
}

export const TaskPage = () => {
  const axiosClient = useAxios();
  const { showAlert } = useAlert();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<TasksResponse>('/tasks', {
        params: {
          limit: 100,
          page: 1,
          orderby: 'id',
          orderDir: 'DESC',
        },
      });
      setTasks(res.data?.data ?? []);
    } catch (error) {
      showAlert('Error al cargar tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setTaskName('');
    setShowCreateModal(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTaskName(task.name);
    setShowEditModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedTask(null);
    setTaskName('');
  };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskName.trim()) return;

    try {
      await axiosClient.post('/tasks', { name: taskName.trim() });
      showAlert('Tarea creada', 'success');
      closeModals();
      fetchTasks();
    } catch (error) {
      showAlert('Error al crear tarea', 'error');
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTask || !taskName.trim()) return;

    try {
      await axiosClient.put(`/tasks/${selectedTask.id}`, { name: taskName.trim() });
      showAlert('Tarea actualizada', 'success');
      closeModals();
      fetchTasks();
    } catch (error) {
      showAlert('Error al actualizar tarea', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await axiosClient.delete(`/tasks/${selectedTask.id}`);
      showAlert('Tarea eliminada', 'success');
      closeModals();
      fetchTasks();
    } catch (error) {
      showAlert('Error al eliminar tarea', 'error');
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      await axiosClient.patch(`/tasks/${task.id}`, { done: !task.done });
      fetchTasks();
    } catch (error) {
      showAlert('Error al cambiar estado', 'error');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-page">
      <div className="task-header">
        <h1>Lista de Tareas</h1>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          Agregar tarea
        </button>
      </div>

      {loading && <p>Cargando tareas...</p>}

      {!loading && tasks.length === 0 && <p>No hay tareas aún.</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.done ? 'done' : 'pending'}`}>
            <div className="task-item-content">
              <div>
                <h3>{task.name}</h3>
                <span className={`task-status ${task.done ? 'done' : 'pending'}`}>
                  {task.done ? 'Finalizada' : 'Pendiente'}
                </span>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={task.done}
                    onChange={() => toggleStatus(task)}
                    color="primary"
                  />
                }
                label={task.done ? 'Finalizada' : 'Pendiente'}
                className="task-switch"
              />
            </div>
            <div className="task-actions">
              <IconButton type="button" className="edit-button" onClick={() => openEditModal(task)} aria-label="Editar tarea">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton type="button" className="danger-button" onClick={() => openDeleteModal(task)} aria-label="Eliminar tarea">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar tarea</h2>
            <form onSubmit={handleCreateSubmit}>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Nombre de la tarea"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="primary-button">
                  Guardar
                </button>
                <button type="button" onClick={closeModals}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar tarea</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Nombre de la tarea"
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="primary-button">
                  Actualizar
                </button>
                <button type="button" onClick={closeModals}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Eliminar tarea</h2>
            <p>¿Seguro que quieres eliminar <strong>{selectedTask.name}</strong>?</p>
            <div className="modal-buttons">
              <button type="button" className="danger-button" onClick={handleDelete}>
                Sí, eliminar
              </button>
              <button type="button" onClick={closeModals}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};