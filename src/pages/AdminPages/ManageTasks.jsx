import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "pending", "completed"
  const [searchTerm, setSearchTerm] = useState("");

  // Load tasks from localStorage (same as User Dashboard)
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // ✅ Mark task as completed
  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, status: "Completed", progress: 100 } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // ❌ Delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    // Filter by completion status
    const statusMatch = 
      filterStatus === "all" || 
      (filterStatus === "pending" && task.progress < 100) ||
      (filterStatus === "completed" && task.progress === 100);
    
    // Filter by search term (title only)
    const searchMatch = searchTerm === "" || 
                       task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Separate pending and completed tasks for display
  const pendingTasks = filteredTasks.filter((task) => task.progress < 100);
  const completedTasks = filteredTasks.filter((task) => task.progress === 100);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Tasks</h1>

        {/* Filter and Search Controls */}
        <div className="bg-white p-4 shadow rounded-lg mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending Tasks</option>
                <option value="completed">Completed Tasks</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Search:</label>
              <input
                type="text"
                placeholder="Search by task title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
              />
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="bg-white p-4 shadow rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">Pending Tasks ({pendingTasks.length})</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.email}</td>
                    <td className="p-2">{task.priority}</td>
                    <td className="p-2">{task.deadline}</td>
                    <td className="p-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => completeTask(task.id)}
                      >
                        ✅ Mark as Completed
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                        onClick={() => deleteTask(task.id)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Completed Tasks ({completedTasks.length})</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.email}</td>
                    <td className="p-2">{task.priority}</td>
                    <td className="p-2">{task.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No results message */}
        {filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="bg-white p-8 shadow rounded-lg text-center">
            <p className="text-gray-500 text-lg">
              No tasks match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="mt-2 text-blue-500 hover:text-blue-700 underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* No tasks at all */}
        {tasks.length === 0 && (
          <div className="bg-white p-8 shadow rounded-lg text-center">
            <p className="text-gray-500 text-lg">
              No tasks found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
