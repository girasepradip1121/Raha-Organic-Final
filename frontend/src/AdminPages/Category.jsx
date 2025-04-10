import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, userToken } from "../Components/Variable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const userData = userToken();
  const token = userData?.token;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/category/getall`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const categoryData = { name: name.trim() };
    setIsLoading(true);

    try {
      if (editingCategory) {
        await axios.put(
          `${API_URL}/category/update/${editingCategory.categoryId}`,
          categoryData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category updated successfully");
      } else {
        await axios.post(`${API_URL}/category/create`, categoryData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Category added successfully");
      }

      fetchCategories();
      setName("");
      setEditingCategory(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Category already exists!");
      } else {
        toast.error(editingCategory ? "Failed to update category" : "Failed to add category");
        console.error("Error saving category", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/category/delete/${categoryToDelete.categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Error deleting category", error);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">Manage Categories</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-gray-700 p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded-md font-medium ${
              editingCategory 
                ? "bg-yellow-600 hover:bg-yellow-700" 
                : "bg-purple-600 hover:bg-purple-700"
            } transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingCategory ? "Updating..." : "Adding..."}
              </span>
            ) : editingCategory ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </button>
        </div>
      </form>

      {/* Category List */}
      {isLoading && !categories.length ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No categories found. Add your first category!
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Categories List</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => (
              <li 
                key={category.categoryId} 
                className="flex justify-between items-center p-4 border border-gray-700 rounded-md bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <span className="font-medium truncate">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setName(category.name);
                    }}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(category)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-red-400">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the category: 
              <span className="font-semibold text-white"> {categoryToDelete?.name}</span>?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;