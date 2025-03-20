/**
 * Service de gestion des notifications et rappels
 */

// Vérifier si les notifications sont supportées par le navigateur
const isNotificationSupported = 'Notification' in window;

/**
 * Demande la permission d'envoyer des notifications
 * @returns {Promise<string>} L'état de la permission (granted, denied, default)
 */
async function requestPermission() {
  if (!isNotificationSupported) {
    console.warn('Les notifications ne sont pas supportées par ce navigateur.');
    return 'unsupported';
  }

  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/**
 * Vérifie si l'application a la permission d'envoyer des notifications
 * @returns {boolean} True si les notifications sont autorisées
 */
function hasPermission() {
  return isNotificationSupported && Notification.permission === 'granted';
}

/**
 * Envoie une notification
 * @param {string} title - Titre de la notification
 * @param {Object} options - Options de la notification
 * @param {string} [options.body] - Corps du message
 * @param {string} [options.icon] - URL de l'icône
 * @param {Array} [options.actions] - Actions possibles
 * @param {function} [onClick] - Fonction à exécuter au clic sur la notification
 * @returns {Notification|null} L'objet Notification ou null si impossible
 */
function sendNotification(title, options = {}, onClick = null) {
  if (!hasPermission()) {
    console.warn('Permission de notification non accordée.');
    return null;
  }

  try {
    const notification = new Notification(title, {
      badge: '/img/icons/android-chrome-192x192.png',
      ...options
    });

    if (onClick && typeof onClick === 'function') {
      notification.onclick = onClick;
    }

    return notification;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return null;
  }
}

/**
 * Programme un rappel pour une date spécifique
 * @param {Date} date - Date et heure du rappel
 * @param {string} title - Titre de la notification
 * @param {Object} options - Options de la notification
 * @returns {number|null} ID du timeout ou null si impossible
 */
function scheduleReminder(date, title, options = {}) {
  if (!hasPermission()) {
    return null;
  }

  const now = new Date();
  const delay = date.getTime() - now.getTime();

  if (delay <= 0) {
    console.warn('La date du rappel est déjà passée.');
    return null;
  }

  // Limiter à un délai maximum de 24h (les timeouts peuvent être imprécis sur de longues périodes)
  const maxDelay = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
  
  if (delay > maxDelay) {
    // Pour les rappels à plus de 24h, stocker dans localStorage et vérifier lors du chargement de l'application
    const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '[]');
    const reminderId = Date.now().toString();
    
    reminders.push({
      id: reminderId,
      timestamp: date.getTime(),
      title,
      options
    });
    
    localStorage.setItem('scheduled_reminders', JSON.stringify(reminders));
    
    return reminderId;
  } else {
    // Pour les rappels à moins de 24h, utiliser setTimeout
    return setTimeout(() => {
      sendNotification(title, options);
    }, delay);
  }
}

/**
 * Annule un rappel programmé
 * @param {string|number} reminderId - ID du rappel à annuler
 * @returns {boolean} True si le rappel a été annulé
 */
function cancelReminder(reminderId) {
  if (typeof reminderId === 'number') {
    clearTimeout(reminderId);
    return true;
  } else if (typeof reminderId === 'string') {
    // Chercher dans les rappels stockés dans localStorage
    const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '[]');
    const index = reminders.findIndex(r => r.id === reminderId);
    
    if (index !== -1) {
      reminders.splice(index, 1);
      localStorage.setItem('scheduled_reminders', JSON.stringify(reminders));
      return true;
    }
  }
  
  return false;
}

/**
 * Vérifie les rappels stockés et programme ceux qui sont prévus dans les prochaines 24 heures
 */
function checkStoredReminders() {
  if (!hasPermission()) {
    return;
  }
  
  const now = new Date().getTime();
  const maxDelay = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
  const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '[]');
  const updatedReminders = [];
  
  reminders.forEach(reminder => {
    const delay = reminder.timestamp - now;
    
    if (delay <= 0) {
      // Le rappel est déjà passé, l'envoyer immédiatement
      sendNotification(reminder.title, reminder.options);
    } else if (delay <= maxDelay) {
      // Le rappel est prévu dans les prochaines 24h, le programmer avec setTimeout
      setTimeout(() => {
        sendNotification(reminder.title, reminder.options);
      }, delay);
    } else {
      // Le rappel est prévu plus tard, le conserver pour plus tard
      updatedReminders.push(reminder);
    }
  });
  
  localStorage.setItem('scheduled_reminders', JSON.stringify(updatedReminders));
}

/**
 * Programme un rappel de préparation de repas
 * @param {Date} date - Date du repas
 * @param {string} mealName - Nom du repas
 * @param {number} hoursInAdvance - Nombre d'heures à l'avance pour le rappel
 * @returns {string|number|null} ID du rappel ou null si impossible
 */
function scheduleMealPreparationReminder(date, mealName, hoursInAdvance = 3) {
  const reminderDate = new Date(date);
  reminderDate.setHours(date.getHours() - hoursInAdvance);
  
  if (reminderDate < new Date()) {
    return null; // La date du rappel est déjà passée
  }
  
  return scheduleReminder(
    reminderDate,
    `Préparation du repas : ${mealName}`,
    {
      body: `N'oubliez pas de préparer ${mealName} pour ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      icon: '/img/icons/android-chrome-192x192.png',
      tag: `meal-prep-${date.getTime()}`,
      requireInteraction: true
    }
  );
}

/**
 * Programme des rappels hebdomadaires pour vérifier les menus
 * @param {number} dayOfWeek - Jour de la semaine (0 = dimanche, 1 = lundi, etc.)
 * @param {number} hour - Heure du rappel
 * @param {number} minute - Minute du rappel
 * @returns {string|null} ID du rappel ou null si impossible
 */
function scheduleWeeklyMenuReminder(dayOfWeek = 5, hour = 18, minute = 0) {
  const now = new Date();
  const reminderDate = new Date();
  
  reminderDate.setDate(now.getDate() + (dayOfWeek + 7 - now.getDay()) % 7);
  reminderDate.setHours(hour, minute, 0, 0);
  
  if (reminderDate <= now) {
    reminderDate.setDate(reminderDate.getDate() + 7);
  }
  
  return scheduleReminder(
    reminderDate,
    'Planification des repas',
    {
      body: 'Avez-vous planifié vos repas pour la semaine prochaine?',
      icon: '/img/icons/android-chrome-192x192.png',
      tag: 'weekly-menu-reminder',
      requireInteraction: true
    }
  );
}

// Vérifier les rappels stockés au chargement du service
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    requestPermission().then(permission => {
      if (permission === 'granted') {
        checkStoredReminders();
      }
    });
  });
}

export default {
  requestPermission,
  hasPermission,
  sendNotification,
  scheduleReminder,
  cancelReminder,
  scheduleMealPreparationReminder,
  scheduleWeeklyMenuReminder
}; 