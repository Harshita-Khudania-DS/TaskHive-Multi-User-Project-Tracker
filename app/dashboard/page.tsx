"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  status: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  const addOrUpdateProject = async () => {
    if (!title || !description || !techStack || !status) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          description,
          techStack,
          status,
        }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, techStack, status }),
      });
    }

    setTitle("");
    setDescription("");
    setTechStack("");
    setStatus("");

    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setTechStack(project.techStack);
    setStatus(project.status);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Project Dashboard</h1>
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md relative">

  {/* LOGOUT BUTTON */}
  <button
    onClick={() => {
      // Clear auth token or session
      localStorage.removeItem("token"); // example, adjust per your auth flow
      window.location.href = "/login"; // redirect to login
    }}
    className="absolute top-5 right-5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
  >
    Logout
  </button>

  <h1 className="text-3xl font-bold mb-8 text-gray-900">Project Dashboard</h1>

  {/* FORM AND PROJECT LIST BELOW */}
  ...
</div>


        {/* FORM */}
        <div className="space-y-4 mb-10">
          <input
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Tech Stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <button
            onClick={addOrUpdateProject}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </div>

        {/* PROJECT LIST */}
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-700">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 p-5 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                <p className="text-gray-800">{project.description}</p>
                <p className="text-sm mt-2 text-gray-700">
                  <strong>Tech:</strong> {project.techStack}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {project.status}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
