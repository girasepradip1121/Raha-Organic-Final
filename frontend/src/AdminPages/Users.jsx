import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL, userToken } from "../Components/Variable";

const Users = () => {
  const userData = userToken();
  const token = userData?.token;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.log(err);

      // toast.error("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`${API_URL}/user/manageUser/${userId}`, {
        status: newStatus,
      });
      setUsers((prevUsers) =>
        prevUsers?.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success("User status updated successfully");
    } catch (error) {
      toast.error("Failed to update user status. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 bg-black min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users?.length > 0 ? (
              users?.map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col md:flex-row justify-between items-center"
                >
                  <div className="text-sm md:text-base w-full md:w-2/3">
                    <p>
                      <strong>User ID:</strong> {user.userId}
                    </p>
                    <p>
                      <strong>Full Name:</strong> {user.fullName}
                    </p>
                    {/* <p><strong>User Name:</strong> {user.userName}</p>

                    <p><strong>Email:</strong> {user.email}</p> */}
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded flex items-center gap-2  transition"
                    >
                      <Eye size={16} /> View Details
                    </button>
                    <select
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      onChange={(e) =>
                        handleStatusChange(user.userId, e.target.value)
                      }
                      value={user.status}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="">No users found.</p>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full text-white relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedUser(null)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p>
              <strong>User ID:</strong> {selectedUser.userId}
            </p>
            <p>
              <strong>Name:</strong> {selectedUser.fullName}
            </p>
            <p>
              <strong>User Name:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
