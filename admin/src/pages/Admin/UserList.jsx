import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { toast } from 'react-toastify';

const UserList = () => {
  const { users, getUsers, usersPageNum, setUsersPageNum, usersTotalPages, deleteUser } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        await getUsers(usersPageNum);
      } catch (error) {
        toast.error('Failed to load users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, [usersPageNum]);

  const handlePrevPage = () => {
    if (usersPageNum > 1) {
      setUsersPageNum(usersPageNum - 1);
    }
  };

  const handleNextPage = () => {
    if (usersPageNum < usersTotalPages) {
      setUsersPageNum(usersPageNum + 1);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingUserId(userId);
      try {
        await deleteUser(userId);
      } catch (error) {
        toast.error('Failed to delete user');
      }
      setDeletingUserId(null);
    }
  };

  return (

        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-semibold mb-6">User Management</h1>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="py-3 px-6 bg-gray-200 font-bold text-left">Image</th>
                    <th className="py-3 px-6 bg-gray-200 font-bold text-left">Name</th>
                    <th className="py-3 px-6 bg-gray-200 font-bold text-left">Email</th>
                    <th className="py-3 px-6 bg-gray-200 font-bold text-left">Phone</th>
                    <th className="py-3 px-6 bg-gray-200 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <img
                            src={user.image || '/assets/profile_pic.png'}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-3 px-6">{user.name}</td>
                        <td className="py-3 px-6">{user.email}</td>
                        <td className="py-3 px-6">{user.phone || 'N/A'}</td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingUserId === user._id}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            title="Delete User"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={usersPageNum === 1}
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400`}
                >
                  Previous
                </button>
                <span>
                  Page {usersPageNum} of {usersTotalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={usersPageNum === usersTotalPages}
                  className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>

  );
};

export default UserList;
