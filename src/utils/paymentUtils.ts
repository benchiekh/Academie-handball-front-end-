import { Player } from '../types';

export const calculatePaymentInfo = (player: Player): {
  lastPaymentDate?: string;
  isPaidUpToDate: boolean;
  totalPaid: number;
  totalDue: number;
} => {
  if (!player.payments || player.payments.length === 0) {
    return {
      isPaidUpToDate: false,
      totalPaid: 0,
      totalDue: 0,
    };
  }

  // Trier les paiements par date (plus récent en premier)
  const sortedPayments = [...player.payments].sort((a, b) => {
    const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
    const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
    return dateB - dateA;
  });

  // Calculer le dernier paiement
  const lastPaidPayment = sortedPayments.find(p => p.status === 'paid' && p.paymentDate);
  const lastPaymentDate = lastPaidPayment ? lastPaidPayment.paymentDate : undefined;

  // Calculer les totaux
  const totalPaid = player.payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDue = player.payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Vérifier si à jour (pas de paiements en retard)
  const overduePayments = player.payments.filter(p => 
    p.status === 'overdue' || 
    (p.status === 'pending' && new Date(p.dueDate) < new Date())
  );

  const isPaidUpToDate = overduePayments.length === 0;

  return {
    lastPaymentDate,
    isPaidUpToDate,
    totalPaid,
    totalDue,
  };
};

export const formatPaymentStatus = (player: Player): string => {
  if (!player.payments || player.payments.length === 0) {
    return 'Aucun paiement';
  }

  // Trier les paiements par date (plus récent en premier)
  const sortedPayments = [...player.payments].sort((a, b) => {
    const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : new Date(a.dueDate).getTime();
    const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : new Date(b.dueDate).getTime();
    return dateB - dateA;
  });

  // Prendre le paiement le plus récent pour l'affichage
  const latestPayment = sortedPayments[0];
  
  if (latestPayment.status === 'paid' && latestPayment.paymentDate) {
    return `Payé le ${new Date(latestPayment.paymentDate).toLocaleDateString('fr-FR')}`;
  } else if (latestPayment.status === 'pending') {
    return `En attente (${latestPayment.amount}¢)`;
  } else if (latestPayment.status === 'overdue') {
    return `En retard (${latestPayment.amount}¢)`;
  } else {
    return `${latestPayment.amount}¢ - ${latestPayment.status}`;
  }
};
