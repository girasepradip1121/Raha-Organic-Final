import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2, PlusCircle, Star } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL, userToken } from "../Components/Variable";

const Products = () => {
  const userData = userToken();
  const token = userData?.token;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    name: "",
    discountLabel: "",
    price: "",
    originalPrice: "",
    description: "",
    size: "",
    categoryId: "",
    images: [],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/category/getall`);
      setCategories(response.data);
      console.log("categories", response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/getall`);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed To Fetch Products");
      console.error("Failed to fetch products", error);
    }
  };

  const handleEdit = (product) => {
    console.log("Product Images:", product?.images);

    setForm({
      productId: product.productId || "",
      name: product.name || "",
      discountLabel: product.discountLabel || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      description: product.description || "",
      size: product.size || "",
      categoryId: product.categoryId || "",
      images: product.images || [],
    });

    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/product/remove/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product Deleted...");
      setProducts((prev) =>
        prev.filter((product) => product.productId !== selectedProductId)
      );
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error Deleting Product...");
      console.error("Failed to delete product", error);
    }
  };

  const handleAddProduct = () => {
    setForm({
      productId: "",
      name: "",
      discountLabel: "",
      price: "",
      originalPrice: "",
      description: "",
      size: "",
      categoryId: "",
      images: [],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setForm({ ...form, categoryId: e.target.value }); // ✅ `categoryId` set ho raha hai
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Ensure form.images is always an array
    const existingImages = Array.isArray(form.images) ? form.images : [];

    if (files.length + existingImages.length <= 4) {
      setForm({ ...form, images: [...existingImages, ...files] });
    } else {
      toast.error("You can upload a maximum of 4 images.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append only new image Files if available
    const newImages = form.images.filter((img) => img instanceof File);
    newImages.forEach((img) => {
      formData.append("images", img);
    });

    // Add other form fields
    Object.keys(form).forEach((key) => {
      if (key !== "images") {
        formData.append(key, form[key]);
      }
    });

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_URL}/product/update/${form.productId}`,
          formData,
          config
        );
      } else {
        response = await axios.post(
          `${API_URL}/product/create`,
          formData,
          config
        );
      }

      fetchProducts();
      setIsModalOpen(false);
      toast.success("Product Saved Successfully");
    } catch (error) {
      toast.error("Error saving product...");
      console.error("Failed to save product", error);
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      images: prevForm.images.filter((_, i) => i !== index),
    }));
  };
  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? "#facc15" : "none"} // Yellow if active
          stroke="#facc15"
        />
      );
    }

    return stars;
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 sm:p-6 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            Products
          </h2>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-purple-600 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <PlusCircle size={20} /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 py-6">
          {products?.map((product) => (
            <div
              key={product.productId}
              className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-2xl p-4 flex flex-col gap-3"
            >
              <img
                src={
                  product?.images && product?.images.length > 0
                    ? `${API_URL}/${product.images[0]}`
                    : "https://via.placeholder.com/150"
                }
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover rounded-xl"
              />
              <div className="flex items-center gap-1 mt-1">
                {renderStars(product.averageRating)}
                <span className="text-sm text-gray-600 ml-1">
                  {product.avgRating?.toFixed(1)} ({product.totalRatings})
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product?.description}
                </p>
                <p className="text-blue-600 text-base font-bold mt-1">
                  ₹{product.price}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 flex items-center justify-center gap-1 bg-purple-400 hover:bg-purple-500 text-black text-sm font-medium px-3 py-1.5 rounded-md transition"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedProductId(product.productId);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-black text-sm font-medium px-3 py-1.5 rounded-md transition"

                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 sm:px-0 z-50">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-white text-center">
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                <input
                  type="text"
                  name="discountLabel"
                  placeholder="Discount"
                  value={form.discountLabel}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="Original Price"
                  value={form.originalPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full p-2 rounded bg-gray-700 text-white mb-2"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                ></textarea>

                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={form.size}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
                {/* File Input */}
                <input
                  type="file"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />

                {/* Show Existing Images */}
                {Array.isArray(form?.images) && form?.images?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {form?.images?.map((img, index) => (
                      <div key={index} className="relative w-16 h-16">
                        <img
                          src={
                            img instanceof File
                              ? URL.createObjectURL(img)
                              : `${API_URL}/${img}`
                          }
                          alt={`Uploaded ${index}`}
                          className="w-full h-full object-cover rounded"
                        />

                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded text-white w-full"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-red-500 px-4 py-2 rounded text-white w-full"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delete Order
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to Delete this Product?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  No, Go Back
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Yes, Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
