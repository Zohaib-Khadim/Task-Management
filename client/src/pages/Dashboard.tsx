import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTasks, type TaskInput } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUser";
import ErrorBoundary from "../components/ErrorBoundary";
import TaskModal from "../components/TaskModal";
import Users from "../components/Users";
import Header from "../components/Header";

// Enhanced custom debounce function with cancel
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;

  const debounced = function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null as unknown as NodeJS.Timeout; // Reset timeout
  };

  return debounced;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const {
    tasks,
    addTaskMutation,
    updateTaskMutation,
    uploadFileMutation,
    deleteTaskMutation,
    endTaskMutation,
    isLoading,
  } = useTasks();
  const { users } = useUsers();
  const [newTask, setNewTask] = useState<Partial<TaskInput> & { title: string }>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee_id: undefined,
    due_date: "",
  });
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search term update with custom debounce
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  useEffect(() => {
    console.log("Tasks state:", tasks);
    console.log("Users state:", users);
    return () => {
      debouncedSetSearchTerm.cancel(); // Now properly typed and functional
    };
  }, [tasks, users, debouncedSetSearchTerm]);

  // Memoized event handlers
  const moveTask = useCallback(
    (taskId: number, newStatus: "todo" | "in_progress" | "done") => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTaskMutation.mutate({ id: taskId, data: { status: newStatus } });
      }
    },
    [tasks, updateTaskMutation]
  );
  console.log(moveTask);
  

  const handleAddTask = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addTaskMutation.mutate({
        data: {
          title: newTask.title,
          description: newTask.description || undefined,
          status: newTask.status || "todo",
          priority: newTask.priority || "medium",
          assignee_id: newTask.assignee_id,
          due_date: newTask.due_date || undefined,
        },
        file: uploadFile,
      });
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee_id: undefined,
        due_date: "",
      });
      setUploadFile(null);
      setIsModalOpen(false);
    },
    [newTask, uploadFile, addTaskMutation]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setUploadFile(e.target.files[0]);
      }
    },
    []
  );

  const handleUploadToTask = useCallback(() => {
    if (selectedTaskId && uploadFile) {
      uploadFileMutation.mutate({ taskId: selectedTaskId, file: uploadFile });
      setUploadFile(null);
      setSelectedTaskId(null);
    }
  }, [selectedTaskId, uploadFile, uploadFileMutation]);

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      deleteTaskMutation.mutate({ id: taskId });
    },
    [deleteTaskMutation]
  );

  const handleEndTask = useCallback(
    (taskId: number) => {
      endTaskMutation.mutate({ taskId });
    },
    [endTaskMutation]
  );

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user: any) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (isLoading)
    return <div className="p-4 text-gray-700 text-center">Loading...</div>;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Header logout={logout} setIsModalOpen={setIsModalOpen} />

          {/* Users Section */}
          <Users
            searchTerm={searchTerm}
            setSearchTerm={debouncedSetSearchTerm}
            filteredUsers={filteredUsers}
          />

          {selectedTaskId && uploadFile && (
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <input
                type="file"
                onChange={handleFileUpload}
                className="p-2 sm:p-3 border rounded-lg w-full sm:w-auto"
              />
              <button
                onClick={handleUploadToTask}
                className="bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg hover:bg-green-600 text-sm sm:text-base w-full sm:w-auto"
              >
                ↑ Upload to Task {selectedTaskId}
              </button>
              <button
                onClick={() => setSelectedTaskId(null)}
                className="bg-gray-500 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["todo", "in_progress", "done"].map((status) => (
              <div
                key={status}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-lg min-h-[150px] sm:min-h-[200px]"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-4 capitalize">
                  {status}
                </h2>
                {Array.isArray(tasks) ? (
                  tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="p-2 sm:p-3 mb-2 sm:mb-3 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <div>
                          <span className="text-gray-800 font-medium text-sm sm:text-base">
                            {task.title}
                          </span>
                          {task.description && (
                            <p className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                              {task.description}
                            </p>
                          )}
                          {task.due_date && (
                            <p className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                              Due: {task.due_date}
                            </p>
                          )}
                          {task.assignee_id && (
                            <p className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                              Assigned to:{" "}
                              {users.find((u: any) => u.id === task.assignee_id)
                                ?.full_name || "Unassigned"}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-0 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="bg-red-500 text-white px-2 py-1 sm:px-2 sm:py-1 rounded-lg hover:bg-red-600 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEndTask(task.id);
                            }}
                            className="bg-green-500 text-white px-2 py-1 sm:px-2 sm:py-1 rounded-lg hover:bg-green-600 text-xs sm:text-sm"
                          >
                            End
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-2 sm:p-4 text-gray-500 text-xs sm:text-sm">
                    Tasks data is not an array. Check console for details.
                  </div>
                )}
              </div>
            ))}
          </div>

          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            newTask={newTask}
            setNewTask={setNewTask}
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}
            handleAddTask={handleAddTask}
            handleFileUpload={handleFileUpload}
            addTaskMutation={addTaskMutation}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;