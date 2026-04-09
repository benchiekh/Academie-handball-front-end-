import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Player, Payment, Stats } from '../types';
import { usersAPI, playersAPI, paymentsAPI } from '../services/api';
import AddParentForm from '../components/AddParentForm';
import AddChildModal from '../components/AddChildModal';
import AddMonthlyPaymentModal from '../components/AddMonthlyPaymentModal';
import MarkPaymentAsPaidModal from '../components/MarkPaymentAsPaidModal';
import { calculatePaymentInfo, formatPaymentStatus } from '../utils/paymentUtils';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0 });
  const [players, setPlayers] = useState<Player[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'monthly' | 'users' | 'add-parent'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]); // Pour suivre quels utilisateurs sont étendus
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState<{id: number, name: string} | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalMonth, setPaymentModalMonth] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playersStats, playersData, paymentsStats, paymentsData, usersData] = await Promise.all([
        playersAPI.getStats(),
        playersAPI.findAll(),
        paymentsAPI.getStats(),
        paymentsAPI.findAll(),
        usersAPI.findAll(),
      ]);

      console.log('Players data received:', playersData);
      console.log('First player with parent:', playersData[0]);
      console.log('First player payments:', playersData[0]?.payments);
      console.log('Users data received:', usersData);
      console.log('Users with players:', usersData.filter(u => u.role === 'parent' && u.players && u.players.length > 0));

      // Enrichir les joueurs avec les informations de paiement
      const enrichedPlayers = playersData.map(player => ({
        ...player,
        ...calculatePaymentInfo(player),
      }));

      setStats({ ...playersStats, ...paymentsStats });
      setPlayers(enrichedPlayers);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Organiser les joueurs par mois de paiement
  const getPlayersByMonth = () => {
    const months: { [key: string]: Player[] } = {};
    
    players.forEach(player => {
      if (player.payments && player.payments.length > 0) {
        player.payments.forEach(payment => {
          // Inclure tous les paiements mensuels (payés ou en attente)
          if (payment.type === 'monthly') {
            // Utiliser la date d'échéance si pas de date de paiement
            const dateToUse = payment.paymentDate || payment.dueDate;
            const date = new Date(dateToUse);
            const monthKey = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
            
            if (!months[monthKey]) {
              months[monthKey] = [];
            }
            
            if (!months[monthKey].find(p => p.id === player.id)) {
              months[monthKey].push(player);
            }
          }
        });
      }
    });
    
    return months;
  };

  const getMonthsWithPlayerCount = () => {
    const months = getPlayersByMonth();
    return Object.entries(months).map(([month, monthPlayers]) => ({
      month,
      count: monthPlayers.length,
      players: monthPlayers
    })).sort((a, b) => {
      // Trier par date (plus récent d'abord)
      return new Date(b.month).getTime() - new Date(a.month).getTime();
    });
  };

  const openPaymentModal = (month: string) => {
    setPaymentModalMonth(month);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentModalMonth('');
  };

  const openMarkPaidModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowMarkPaidModal(true);
  };

  const closeMarkPaidModal = () => {
    setShowMarkPaidModal(false);
    setSelectedPayment(null);
  };

  // Trouver le paiement en attente le plus récent pour un joueur
  const getLatestPendingPayment = (player: Player): Payment | null => {
    if (!player.payments || player.payments.length === 0) return null;
    
    const pendingPayments = player.payments
      .filter(p => p.status === 'pending')
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    
    return pendingPayments.length > 0 ? pendingPayments[0] : null;
  };

  const handleMarkPaymentAsPaid = async (paymentId: number) => {
    try {
      await paymentsAPI.markAsPaid(paymentId);
      loadData();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await usersAPI.remove(userId);
        loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleDeletePlayer = async (playerId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) {
      try {
        await playersAPI.remove(playerId);
        loadData();
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Erreur lors de la suppression du joueur');
      }
    }
  };

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const openAddChildModal = (userId: number, userName: string) => {
    setSelectedParent({ id: userId, name: `${userName}` });
    setShowAddChildModal(true);
  };

  const closeAddChildModal = () => {
    setShowAddChildModal(false);
    setSelectedParent(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Utilisateur non connecté</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Administrateur
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Bienvenue, {user?.firstName || ''} {user?.lastName || ''}
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
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
              { id: 'overview', name: 'Aperçu' },
              { id: 'players', name: 'Joueurs' },
              { id: 'monthly', name: 'Mensuel' },
              { id: 'users', name: 'Utilisateurs' },
              { id: 'add-parent', name: 'Ajouter Parent' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Aperçu général</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Total Joueurs</h3>
                  <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Joueurs Actifs</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Revenus Totaux</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalRevenue?.toFixed(2)} €</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Paiements en Attente</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Liste des Joueurs par Mois</h2>
              </div>
              
              <div className="space-y-6">
                {getMonthsWithPlayerCount().map(({ month, count, players }) => (
                  <div key={month} className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header du mois */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold">{month}</h3>
                          <p className="text-blue-100">{count} joueur{count > 1 ? 's' : ''} payé{count > 1 ? 's' : ''}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPaymentModal(month);
                          }}
                          className="px-3 py-1 bg-white text-blue-600 text-sm rounded hover:bg-gray-100 font-medium"
                        >
                          + Ajouter Paiement
                        </button>
                      </div>
                    </div>
                    
                    {/* Liste des joueurs pour ce mois */}
                    <div className="divide-y divide-gray-200">
                      {players.map((player) => (
                        <div key={player.id} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {player.firstName} {player.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Parent: {player.parent?.firstName} {player.parent?.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    <span className="inline-flex items-center space-x-4">
                                      <span>:{formatPaymentStatus(player)}</span>
                                      <span>Actif: {player.isActive ? 'Oui' : 'Non'}</span>
                                      {getLatestPendingPayment(player) && (
                                        <button
                                          onClick={() => openMarkPaidModal(getLatestPendingPayment(player)!)}
                                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                          Marquer comme payé
                                        </button>
                                      )}
                                    </span>
                                  </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    player.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {player.isActive ? 'Actif' : 'Inactif'}
                                  </span>
                                  <button
                                    onClick={() => handleDeletePlayer(player.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {getMonthsWithPlayerCount().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Aucun paiement enregistré</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add-parent' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un Parent</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <AddParentForm onParentAdded={loadData} />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Utilisateurs</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {users.map((userItem) => (
                    <li key={userItem.id}>
                      <div className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {userItem?.firstName || ''} {userItem?.lastName || ''}
                            </p>
                            <p className="text-sm text-gray-500">
                              Email: {userItem.email} | 
                              Téléphone: {userItem.phone} | 
                              Username: {userItem.username}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.role === 'admin' ? 'Admin' : 'Parent'}
                            </span>
                            {userItem.role === 'parent' && (
                              <>
                                <button
                                  onClick={() => toggleUserExpansion(userItem.id)}
                                  className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  title="Voir les enfants"
                                >
                                  👁️
                                </button>
                                <button
                                  onClick={() => openAddChildModal(userItem.id, `${userItem.firstName} ${userItem.lastName}`)}
                                  className="ml-3 text-green-600 hover:text-green-800 text-sm font-medium"
                                  title="Ajouter un enfant"
                                >
                                  ➕
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Supprimer
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Affichage des enfants si l'utilisateur est étendu */}
                        {userItem.role === 'parent' && expandedUsers.includes(userItem.id) && (
                          <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Enfants associés ({userItem.players?.length || 0})
                            </h4>
                            {userItem.players && userItem.players.length > 0 ? (
                              <div className="space-y-2">
                                {userItem.players.map((player) => {
                                  const paymentInfo = calculatePaymentInfo(player);
                                  return (
                                    <div key={player.id} className="p-3 bg-white rounded border border-gray-200">
                                      <p className="text-sm font-medium text-gray-900">
                                        {player.firstName} {player.lastName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        📅 {new Date(player.birthDate).toLocaleDateString()} | 
                                        👤 {player.height}cm | 
                                        ⚖️ {player.weight}kg | 
                                        📍 {player.position}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        💳 {formatPaymentStatus(player)}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">Aucun enfant associé</p>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'monthly' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vue Mensuelle des Paiements</h2>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Réinitialiser
                </button>
              </div>
              
              {!selectedMonth ? (
                <div className="space-y-6">
                  {getMonthsWithPlayerCount().map(({ month, count, players }) => (
                    <div key={month} className="bg-white shadow rounded-lg overflow-hidden">
                      {/* Header du mois */}
                      <div 
                        className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-colors"
                        onClick={() => setSelectedMonth(month)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold">{month}</h3>
                            <p className="text-indigo-100">{count} joueur{count > 1 ? 's' : ''} payé{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openPaymentModal(month);
                              }}
                              className="px-3 py-1 bg-white text-indigo-600 text-sm rounded hover:bg-gray-100 font-medium"
                            >
                              + Ajouter Paiement
                            </button>
                            <div className="text-white">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Liste des joueurs pour ce mois */}
                      <div className="divide-y divide-gray-200">
                        {players.map((player) => (
                          <div key={player.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {player.firstName} {player.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Parent: {player.parent?.firstName} {player.parent?.lastName}
                                    </p>
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    <span className="inline-flex items-center">
                                      <span className="mr-1">:</span>
                                      {formatPaymentStatus(player)}
                                      {getLatestPendingPayment(player) && (
                                        <button
                                          onClick={() => openMarkPaidModal(getLatestPendingPayment(player)!)}
                                          className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                        >
                                          Marquer comme payé
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {getMonthsWithPlayerCount().length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Aucun paiement enregistré</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Retour aux mois
                  </button>
                  
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Joueurs payés en {selectedMonth}
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {getMonthsWithPlayerCount()
                        .find(m => m.month === selectedMonth)?.players
                        .map((player) => (
                          <li key={player.id} className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {player.firstName} {player.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  📅 {new Date(player.birthDate).toLocaleDateString('fr-FR')} | 
                                  👤 {player.height}cm | 
                                  ⚖️ {player.weight}kg | 
                                  📍 {player.position}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Parent: {player.parent?.firstName} {player.parent?.lastName}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-600">
                                  {formatPaymentStatus(player)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter un enfant */}
      {selectedParent && (
        <AddChildModal
          isOpen={showAddChildModal}
          onClose={closeAddChildModal}
          onChildAdded={loadData}
          parentId={selectedParent.id}
          parentName={selectedParent.name}
        />
      )}

      {/* Modal pour ajouter un paiement mensuel */}
      {showPaymentModal && (
        <AddMonthlyPaymentModal
          isOpen={showPaymentModal}
          onClose={closePaymentModal}
          onPaymentAdded={loadData}
          month={paymentModalMonth}
          existingPlayers={players}
        />
      )}

      {/* Modal pour marquer un paiement comme payé */}
      {showMarkPaidModal && (
        <MarkPaymentAsPaidModal
          isOpen={showMarkPaidModal}
          onClose={closeMarkPaidModal}
          onPaymentUpdated={loadData}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
