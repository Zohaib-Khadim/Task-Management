interface UsersProps {
  searchTerm: string;
  setSearchTerm: any;
  filteredUsers: any;
}
const Users: React.FC<UsersProps> = ({
  searchTerm,
  setSearchTerm,
  filteredUsers,
}) => {
  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          Users
        </h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name..."
          className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base mb-4"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: any) => (
              <div
                key={user.id}
                className="p-2 sm:p-3 bg-gray-50 rounded-lg mb-2 flex justify-between items-center"
              >
                <span className="text-sm sm:text-base text-gray-800">
                  {user.full_name} ({user.email})
                </span>
                {/* Add edit/delete actions if needed */}
              </div>
            ))
          ) : (
            <p className="text-sm sm:text-base text-gray-500 text-center">
              No users found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;
