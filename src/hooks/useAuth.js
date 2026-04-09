"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.useAuth = void 0;
const react_1 = __importStar(require("react"));
const api_1 = require("../services/api");
const AuthContext = (0, react_1.createContext)(undefined);
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api_1.authAPI.getProfile()
                .then(userData => {
                setUser(userData);
            })
                .catch(() => {
                localStorage.removeItem('token');
            })
                .finally(() => {
                setIsLoading(false);
            });
        }
        else {
            setIsLoading(false);
        }
    }, []);
    const login = async (credentials) => {
        try {
            const response = await api_1.authAPI.login(credentials);
            localStorage.setItem('token', response.access_token);
            setUser(response.user);
        }
        catch (error) {
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    const value = {
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
    };
    return react_1.default.createElement(AuthContext.Provider, { value }, children);
};
exports.AuthProvider = AuthProvider;
//# sourceMappingURL=useAuth.js.map