"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskForm from "../../components/TaskForm";
import ConfirmModal from "../../components/ConfirmModal";
import { FaPlus, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import { Task } from "../../types";

export default function ProjectTasksPage() {
  const { id } = useParams();
  const token = Cookies.get("token");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtered, setFiltered] = useState<Task[]>([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (id && token) fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?projectId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(
      status === "all"
        ? filteredTasks
        : filteredTasks.filter((task) => task.status === status)
    );
  };

  const handleFilter = (value: string) => {
    setStatus(value);
    const filteredByStatus =
      value === "all" ? tasks : tasks.filter((task) => task.status === value);
    setFiltered(
      filteredByStatus.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await fetch(`/api/tasks/${selected.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowConfirm(false);
      setSelected(null);
      fetchTasks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Tasks</h1>
        <button
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
        >
          <FaPlus /> New Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 bg-white/10 backdrop-blur border border-gray-600 text-white rounded focus:outline-none"
          />
          <FaSearch className="absolute top-3 right-4 text-gray-400" />
        </div>
        <select
          value={status}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-gray-600 text-white rounded"
        >
          <option value="all" className="bg-[#1f2937] text-white">All Status</option>
          <option value="todo" className="bg-[#1f2937] text-white">To Do</option>
          <option value="in-progress" className="bg-[#1f2937] text-white">In Progress</option>
          <option value="done" className="bg-[#1f2937] text-white">Done</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center">No tasks found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="bg-white/10 p-4 rounded-xl shadow group hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-yellow-300 group-hover:text-yellow-400">
                  {task.title}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    task.status === "todo"
                      ? "bg-red-500"
                      : task.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2 line-clamp-3">{task.description}</p>
              <p className="text-xs text-gray-400 mb-4">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setSelected(task);
                    setShowModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => {
                    setSelected(task);
                    setShowConfirm(true);
                  }}
                  className="text-red-400 hover:text-red-500 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskForm
          task={selected}
          projectId={id as string}
          token={token ?? ""}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
            fetchTasks();
          }}
        />
      )}

      {showConfirm && selected && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${selected.title}"?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
