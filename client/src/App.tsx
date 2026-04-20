import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ROUTES } from "@shared/constants";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Booklet from "./pages/Booklet";
import Booking from "./pages/Booking";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Legal from "./pages/Legal";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminBlog from "./pages/AdminBlog";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path={ROUTES.HOME} component={Home} />
      <Route path={ROUTES.SERVICES} component={Services} />
      <Route path={ROUTES.BOOKLET} component={Booklet} />
      <Route path={ROUTES.BOOKING} component={Booking} />
      <Route path={ROUTES.BLOG} component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path={ROUTES.ABOUT} component={About} />
      <Route path={ROUTES.FAQ} component={FAQ} />
      <Route path={ROUTES.CONTACT} component={Contact} />
      <Route path={ROUTES.ADMIN_LOGIN} component={AdminLogin} />
      <Route path={ROUTES.ADMIN_BLOG} component={AdminBlog} />
      <Route path={ROUTES.ADMIN} component={AdminDashboard} />
      <Route path={ROUTES.LEGAL_MENTIONS} component={Legal} />
      <Route path={ROUTES.LEGAL_PRIVACY} component={Legal} />
      <Route path={ROUTES.PAYMENT_SUCCESS} component={PaymentSuccess} />
      <Route path={ROUTES.PAYMENT_CANCEL} component={PaymentCancel} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
