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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const useAuth_1 = require("../hooks/useAuth");
const api_1 = require("../services/api");
const AddPlayerForm_1 = __importDefault(require("../components/AddPlayerForm"));
const ParentDashboard = () => {
    const { user, logout } = (0, useAuth_1.useAuth)();
    const [players, setPlayers] = (0, react_1.useState)([]);
    const [payments, setPayments] = (0, react_1.useState)([]);
    const [selectedPlayer, setSelectedPlayer] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)('players');
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [showAddPlayerForm, setShowAddPlayerForm] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            const [playersData, paymentsData] = await Promise.all([
                api_1.playersAPI.findMyPlayers(),
                api_1.paymentsAPI.findMyPayments(),
            ]);
            setPlayers(playersData);
            setPayments(paymentsData);
            if (playersData.length > 0) {
                setSelectedPlayer(playersData[0]);
            }
        }
        catch (error) {
            console.error('Error loading data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getPlayerPayments = (playerId) => {
        return payments.filter(payment => payment.player.id === playerId);
    };
    if (isLoading) {
        return (<div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>);
    }
    if (!user) {
        return (<div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Utilisateur non connecté</div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Espace Parent
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Bienvenue, {user?.firstName || ''} {user?.lastName || ''}
              </div>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
            { id: 'players', name: 'Mes Enfants' },
            { id: 'payments', name: 'Paiements' },
            { id: 'profile', name: 'Mon Profil' },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {tab.name}
              </button>))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'players' && (<div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Enfants</h2>
              {showAddPlayerForm && (<AddPlayerForm_1.default onPlayerAdded={() => {
                    setShowAddPlayerForm(false);
                    loadData();
                }} onCancel={() => setShowAddPlayerForm(false)}/>)}
              
              {players.length === 0 ? (<div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-500">Aucun enfant enregistré</p>
                </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {players.map((player) => (<div key={player.id} className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {player?.firstName || ''} {player?.lastName || ''}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${player.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {player.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Date de naissance:</span>
                          <span className="text-gray-900">
                            {player.birthDate ? new Date(player.birthDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Âge:</span>
                          <span className="text-gray-900">
                            {player.birthDate ? Math.floor((new Date().getTime() - new Date(player.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 'N/A'} ans
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Taille:</span>
                          <span className="text-gray-900">{player.height || 0} cm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Poids:</span>
                          <span className="text-gray-900">{player.weight || 0} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Position:</span>
                          <span className="text-gray-900">{player.position || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500">Statut des paiements:</span>
                          <div className="flex space-x-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {getPlayerPayments(player.id).filter(p => p.status === 'paid').length} payés
                            </span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              {getPlayerPayments(player.id).filter(p => p.status === 'pending').length} en attente
                            </span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              {getPlayerPayments(player.id).filter(p => p.status === 'overdue').length} en retard
                            </span>
                          </div>
                        </div>
                        
                        <button onClick={() => {
                        setSelectedPlayer(player);
                        setActiveTab('payments');
                    }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Voir les paiements
                        </button>
                      </div>
                    </div>))}
                </div>)}
            </div>)}

          {activeTab === 'payments' && (<div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Paiements</h2>
              
              {players.length > 1 && (<div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un enfant
                  </label>
                  <select value={selectedPlayer?.id || ''} onChange={(e) => {
                    const player = players.find(p => p.id === Number(e.target.value));
                    setSelectedPlayer(player || null);
                }} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {players.map((player) => (<option key={player.id} value={player.id}>
                        {player?.firstName || ''} {player?.lastName || ''}
                      </option>))}
                  </select>
                </div>)}

              {selectedPlayer ? (<div>
                  <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {selectedPlayer?.firstName || ''} {selectedPlayer?.lastName || ''}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {getPlayerPayments(selectedPlayer.id).filter(p => p.status === 'paid').length}
                        </p>
                        <p className="text-sm text-gray-500">Payés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {getPlayerPayments(selectedPlayer.id).filter(p => p.status === 'pending').length}
                        </p>
                        <p className="text-sm text-gray-500">En attente</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {getPlayerPayments(selectedPlayer.id).filter(p => p.status === 'overdue').length}
                        </p>
                        <p className="text-sm text-gray-500">En retard</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Détail des paiements - {selectedPlayer?.firstName || ''} {selectedPlayer?.lastName || ''}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type de paiement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date de paiement
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fin du mois
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getPlayerPayments(selectedPlayer.id).map((payment) => (<tr key={payment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {payment.type === 'monthly' ? 'Mensuel' :
                        payment.type === 'competition' ? 'Compétition' : 'Équipement'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(payment.dueDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payment.amount}€
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                                  {payment.status === 'paid' ? 'Payé' :
                        payment.status === 'overdue' ? 'En retard' : 'En attente'}
                                </span>
                              </td>
                            </tr>))}
                        </tbody>
                      </table>
                    </div>
                    
                    {getPlayerPayments(selectedPlayer.id).length === 0 && (<div className="text-center py-8">
                        <p className="text-gray-500">Aucun paiement enregistré pour cet enfant</p>
                      </div>)}
                  </div>
                </div>) : (<div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-500">
                    {players.length === 0
                    ? "Aucun joueur enregistré"
                    : "Veuillez sélectionner un enfant pour voir ses paiements"}
                  </p>
                </div>)}
            </div>)}
          
          {activeTab === 'profile' && (<div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                          <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                          <p className="mt-1 text-sm text-gray-900">{user?.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rôle</label>
                          <p className="mt-1 text-sm text-gray-900">
                            <span className={`px-2 py-1 text-xs rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {user?.role === 'admin' ? 'Admin' : 'Parent'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé des Paiements</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-600">
                                {payments.filter(p => p.status === 'paid').length}
                              </p>
                              <p className="text-sm text-gray-500">Payés</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-yellow-600">
                                {payments.filter(p => p.status === 'pending').length}
                              </p>
                              <p className="text-sm text-gray-500">En attente</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-red-600">
                                {payments.filter(p => p.status === 'overdue').length}
                              </p>
                              <p className="text-sm text-gray-500">En retard</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-gray-900 mb-2">Total des paiements</h4>
                          <div className="space-y-2">
                            {payments.map((payment) => (<div key={payment.id} className="flex justify-between items-center p-3 bg-white rounded border">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {payment.type} - {payment.amount}€
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Échéance: {new Date(payment.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                                  {payment.status === 'paid' ? 'Payé' :
                    payment.status === 'overdue' ? 'En retard' : 'En attente'}
                                </span>
                              </div>))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.default = ParentDashboard;
//# sourceMappingURL=ParentDashboard.js.map