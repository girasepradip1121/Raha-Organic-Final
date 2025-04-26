import "./App.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Navbar from "./Components/NavBar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import ShopPage from "./Pages/ShopPage";
import AllproductPage from "./Pages/AllproductPage";
import BestsellerPage from "./Pages/BestsellerPage";
import AboutPage from "./Pages/AboutPage";
import ContactusPage from "./Pages/ContactusPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import LoginPage from "./Components/Login";
import OrderSuccess from "./Pages/OrderSuccessPage";
import MyOrders from "./Pages/MyOrders";

//POLICIES
import ShippingPolicy from "./Pages/ShippingPolicy";
import TermsConditions from "./Pages/TermsCondition";
import CancellationRefund from "./Pages/CancellationAndRefund";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

import SignupPage from "./Components/Sign";
import ProductPage from "./Pages/ProductPage";
import AdminLayoutComponent from "./Components/AdminLayoutComponent";
import Dashboard from "./AdminPages/Dashboard";
import ManageContact from "./AdminPages/ManageContact";
import Orders from "./AdminPages/Orders";
import Products from "./AdminPages/Product";
import Users from "./AdminPages/Users";
import Category from "./AdminPages/Category";
import ReviewList from "./AdminPages/Review";
import AdminRoutes from "./utils/AdminRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/allproducts" element={<AllproductPage />} />
                <Route path="/bestseller" element={<BestsellerPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contactus" element={<ContactusPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/Sign" element={<SignupPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkoutpage" element={<CheckoutPage />} />
                <Route path="/myorders" element={<MyOrders />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/product/:productId" element={<ProductPage />} />

                <Route path="/shippingpolicy" element={<ShippingPolicy />} />
                <Route path="/refunds" element={<CancellationRefund />} />
                <Route path="/tandc" element={<TermsConditions />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />

              </Routes>
              <Footer />
            </>
          }
        />
        {/* ✅ Admin Panel Routes (Protected with AdminRoute) */}
        <Route
          path="/admin/*"
          element={
            <AdminRoutes>
              <AdminLayoutComponent />
            </AdminRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="manage-contact" element={<ManageContact />} />
          <Route path="category" element={<Category />} />
          <Route path="reviews" element={<ReviewList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
