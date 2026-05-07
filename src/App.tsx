import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import AppWrapper from "./AppWrapper";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Contact from "./pages/Contact.tsx";
import Blog from "./pages/Blog.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import TaxCalculator from "./pages/TaxCalculator.tsx";
import InternalSystem from "./pages/InternalSystem.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminArticles from "./pages/AdminArticles.tsx";
import AdminContent from "./pages/AdminContent.tsx";
import AdminButtonSettings from "./pages/AdminButtonSettings.tsx";
import AdminSetup from "./pages/AdminSetup.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <SiteContentProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppWrapper>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/tax-calculator" element={<TaxCalculator />} />
                      <Route path="/internal" element={<InternalSystem />} />
                      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                      <Route path="/admin/setup" element={<AdminSetup />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/content" element={
                        <ProtectedRoute>
                          <AdminContent />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/settings" element={
                        <ProtectedRoute>
                          <AdminButtonSettings />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/articles" element={
                        <ProtectedRoute>
                          <AdminArticles />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppWrapper>
                </BrowserRouter>
              </TooltipProvider>
            </SiteContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
