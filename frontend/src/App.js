import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import NotFound from './pages/NotFound';
import BuyerOrders from './pages/BuyerOrders'; 
import PurchaseHistory from './pages/PurchaseHistory';
import AdminDashboard from './pages/AdminDashboard';
import Wishlist from './pages/Wishlist';
import AdminProducts from './pages/AdminProducts';
import SellerAnalytics from './pages/SellerAnalytics';



function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
              <div
                className="w-full h-full bg-no-repeat bg-cover bg-center blur-sm"
                style={{
                  backgroundImage: "url('/bg.png')",
                  transform: "rotate(60deg) scale(1.5)",
                }}
              ></div>
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60"></div>
            </div>

            {/* Layout */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/my-orders" element={<BuyerOrders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/signup" element={<Signup />} />

                  <Route
  path="/dashboard/analytics"
  element={
    <ProtectedRoute allowedRoles={['seller']}>
      <SellerAnalytics />
    </ProtectedRoute>
  }
/>


                  <Route
                    path="/admin/products"
                     element={
                     <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProducts />
                     </ProtectedRoute>
                       }
                    />


                  <Route
                    path="/product/:id"
                    element={
                      <ProtectedRoute allowedRoles={['buyer']}>
                        <ProductDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-product/:id"
                    element={
                      <ProtectedRoute allowedRoles={['seller']}>
                        <EditProduct />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['seller']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/add-product"
                    element={
                      <ProtectedRoute allowedRoles={['seller']}>
                        <AddProduct />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute allowedRoles={['buyer']}>
                        <ProductList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/purchase-history"
                    element={
                      <ProtectedRoute allowedRoles={['buyer']}>
                        <PurchaseHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;