interface HeaderProps {
  logout: () => void;
  setIsModalOpen: any;
}
const Header: React.FC<HeaderProps> = ({ logout, setIsModalOpen }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Task Management Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base  flex justify-center items-center w-full sm:w-auto"
        >
          × Logout
        </button>
      </div>
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base mb-4 w-full sm:w-auto"
        >
          + Add New Task
        </button>
      </div>
    </>
  );
};

export default Header;
