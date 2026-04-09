"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useAuth_1 = require("./hooks/useAuth");
const Login_1 = __importDefault(require("./pages/Login"));
const AdminDashboard_1 = __importDefault(require("./pages/AdminDashboard"));
const ParentDashboard_1 = __importDefault(require("./pages/ParentDashboard"));
const AppRoutes = () => {
    const { user, isAuthenticated, isLoading } = (0, useAuth_1.useAuth)();
    if (isLoading) {
        return (<div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>);
    }
    if (!isAuthenticated) {
        return <Login_1.default />;
    }
    if (user?.role === 'admin') {
        return <AdminDashboard_1.default />;
    }
    if (user?.role === 'parent') {
        return <ParentDashboard_1.default />;
    }
    return <Login_1.default />;
};
function App() {
    return (<useAuth_1.AuthProvider>
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/*" element={<AppRoutes />}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </useAuth_1.AuthProvider>);
}
exports.default = App;
//# sourceMappingURL=App.js.map