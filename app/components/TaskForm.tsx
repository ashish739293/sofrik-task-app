"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Task } from "../types";

type Props = {
  projectId: string;
  token: string;
  task?: Task | null;
  onClose: () => void;
};

export default function TaskForm({ projectId, token, task, onClose }: Props) {
  const [form, setForm] = useState({
    title: "",
    projectId,
    description: "",
    status: "todo",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        projectId,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tasks${task ? `/${task.id}` : ""}`, {
        method: task ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save task");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            required
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded-md focus:outline-indigo-500"
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded-md focus:outline-indigo-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded-md focus:outline-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 text-black border border-gray-300 rounded-md focus:outline-indigo-500"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 bg-gray-100 text-black border border-gray-300 py-2 rounded hover:bg-indigo-700 transition"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
