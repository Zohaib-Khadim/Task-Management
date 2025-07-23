import React from "react";
import { useTasks, type TaskInput } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUser";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: Partial<TaskInput> & { title: string };
  setNewTask: React.Dispatch<
    React.SetStateAction<Partial<TaskInput> & { title: string }>
  >;
  uploadFile: File | null;
  setUploadFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleAddTask: (e: React.FormEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addTaskMutation: ReturnType<typeof useTasks>["addTaskMutation"];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  handleAddTask,
  handleFileUpload,
}) => {
  const { users } = useUsers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleAddTask} className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
            className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
          <input
            type="text"
            value={newTask.description || ""}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description (optional)"
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <select
            value={newTask.status || "todo"}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                status: e.target.value as "todo" | "in_progress" | "done",
              })
            }
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={newTask.priority || "medium"}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={newTask.due_date || ""}
            onChange={(e) =>
              setNewTask({ ...newTask, due_date: e.target.value })
            }
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <select
            value={newTask.assignee_id?.toString() || ""}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                assignee_id: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            disabled={!users.length}
          >
            <option value="">Assign to...</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id.toString()}>
                {user.full_name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full mt-5 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <div className="flex gap-2 mt-5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base w-full sm:w-auto"
            >
              Save Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
