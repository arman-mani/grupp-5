import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatBot from "./components/ChatBot"; // Import the ChatBot component

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Footer />
        <ChatBot /> 
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
