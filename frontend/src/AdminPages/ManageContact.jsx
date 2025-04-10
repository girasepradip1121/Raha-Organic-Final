import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL, userToken } from "../Components/Variable";

const ManageContact = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const userData = userToken();
  const token = userData?.token;

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/contact/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch contact requests");
    }
  };

  const deleteRequest = async (contactId) => {
    try {
      await axios.delete(`${API_URL}/contact/remove/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Contact request deleted successfully");
      fetchRequests();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete contact request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="w-full p-4 min-h-screen bg-black text-white">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Contact Requests</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700 rounded-xl shadow-md">
          <thead className="bg-gray-800 text-xs uppercase text-gray-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests?.length > 0 ? (
              requests.map((req) => (
                <tr
                  key={req.contactId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all"
                >
                  <td className="px-4 py-3">{req.name}</td>
                  <td className="px-4 py-3">{req.email}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="text-purple-400 hover:text-purple-500 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => deleteRequest(req.contactId)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-400">
                  No contact requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {requests?.length > 0 ? (
          requests.map((req) => (
            <div
              key={req.contactId}
              className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700"
            >
              <p className="text-sm text-gray-400">
                <strong className="text-white">Name:</strong> {req.name}
              </p>
              <p className="text-sm text-gray-400">
                <strong className="text-white">Email:</strong> {req.email}
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="text-purple-400 hover:text-purple-500 flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => deleteRequest(req.contactId)}
                  className="text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">
            No contact requests found.
          </p>
        )}
      </div>

      {/* Modal for Viewing Message */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 text-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
            <p className="mb-2 text-gray-300">
              <strong>Name:</strong> {selectedRequest.name}
            </p>
            <p className="mb-2 text-gray-300">
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p className="mb-4 text-gray-300">
              <strong>Message:</strong> {selectedRequest.message}
            </p>
            <button
              onClick={() => setSelectedRequest(null)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-sm rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContact;
