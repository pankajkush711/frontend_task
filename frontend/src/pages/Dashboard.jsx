import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Profile (Secure Handling)
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setProfile(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Add or Update Task
  const addOrUpdateTask = async () => {
    if (!title.trim()) return;

    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, { title });
        setEditingId(null);
      } else {
        await API.post("/tasks", { title });
      }

      setTitle("");
      fetchTasks();
    } catch (err) {
      alert("Error saving task");
    }
  };

  // Edit Task
  const editTask = (task) => {
    setTitle(task.title);
    setEditingId(task._id);
  };

  // Delete Task with Confirmation
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Error deleting task");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar profile={profile} />

      <div className="p-6 max-w-3xl mx-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-2 mb-4 w-full rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Add / Update */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            placeholder="New task"
            className="border p-2 flex-grow rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            disabled={!title.trim()}
            onClick={addOrUpdateTask}
            className={`px-4 rounded text-white ${
              title.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* Loading State */}
        {loading && <p>Loading tasks...</p>}

        {/* Empty State */}
        {!loading && filteredTasks.length === 0 && (
          <p className="text-gray-500">No tasks found.</p>
        )}

        {/* Task List */}
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center bg-white shadow p-4 mb-3 rounded"
          >
            <span>{task.title}</span>

            <div className="flex gap-4">
              <button
                onClick={() => editTask(task)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
