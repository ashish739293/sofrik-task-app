"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaProjectDiagram,
} from "react-icons/fa";
import ProjectForm from "../components/ProjectForm";
import ConfirmModal from "../components/ConfirmModal";
import { Project } from "../types";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [token, setToken] = useState<string | undefined>("");

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");
    if (!tokenFromCookie) {
      router.push("/login");
    } else {
      setToken(tokenFromCookie);
      fetchProjects(tokenFromCookie);
    }
  }, []);

  const fetchProjects = async (authToken: string) => {
    try {
      const res = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      setProjects(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = projects.filter((p) =>
      p.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(
      status === "all"
        ? filteredData
        : filteredData.filter((p) => p.status === status)
    );
  };

  const handleFilter = (s: string) => {
    setStatus(s);
    const filteredStatus =
      s === "all" ? projects : projects.filter((p) => p.status === s);
    setFiltered(
      filteredStatus.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleDelete = async () => {
    if (!selected || !token) return;
    try {
      await fetch(`/api/projects/${selected.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects(token);
      setShowConfirm(false);
      setSelected(null);
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-tr from-[#1e293b] to-[#0f172a] text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaProjectDiagram className="text-yellow-400" />
          My Projects
        </h1>
        <button
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded flex items-center gap-2 transition"
        >
          <FaPlus /> New Project
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full px-4 py-2 rounded bg-white/10 backdrop-blur text-white border border-gray-600 placeholder:text-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        <select
  value={status}
  onChange={(e) => handleFilter(e.target.value)}
  className="px-4 py-2 bg-[#1f2937] text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
>
  <option value="all" className="bg-[#1f2937] text-white">All Status</option>
  <option value="active" className="bg-[#1f2937] text-white">Active</option>
  <option value="completed" className="bg-[#1f2937] text-white">Completed</option>
</select>

      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id}>
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur p-6 rounded-xl shadow-lg hover:shadow-2xl transition group"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-yellow-300 group-hover:text-yellow-400 transition">
                  {project.title}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    project.status === "active"
                      ? "bg-green-500 text-black"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
                    setSelected(project);
                    setShowModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-500 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
                    setSelected(project);
                    setShowConfirm(true);
                  }}
                  className="text-red-400 hover:text-red-500 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectForm
          project={selected}
          token={token}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
            if (token) fetchProjects(token);
          }}
        />
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <ConfirmModal
          title="Delete Project"
          message={`Are you sure you want to delete "${selected?.title}"?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
