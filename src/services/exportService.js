import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportService = {
  /**
   * Exporte un menu hebdomadaire au format PDF
   * @param {Array} menuItems - Éléments du menu
   * @param {Object} options - Options d'export
   */
  exportMenuToPDF(menuItems, options = {}) {
    try {
      const doc = new jsPDF();
      const title = options.title || 'Menu hebdomadaire';
      const startDate = options.startDate ? new Date(options.startDate) : new Date();
      
      // Titre du document
      doc.setFontSize(20);
      doc.text(title, 105, 15, { align: 'center' });
      
      // Sous-titre avec dates
      doc.setFontSize(12);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      const dateFormat = new Intl.DateTimeFormat('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      const dateRange = `Du ${dateFormat.format(startDate)} au ${dateFormat.format(endDate)}`;
      doc.text(dateRange, 105, 25, { align: 'center' });
      
      // Organiser les repas par jour
      const mealsByDay = this.organizeMealsByDay(menuItems);
      
      // Créer le tableau
      const tableData = [];
      const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      
      days.forEach(day => {
        const dayMeals = mealsByDay[day] || { midi: '-', soir: '-' };
        tableData.push([
          day,
          dayMeals.midi,
          dayMeals.soir
        ]);
      });
      
      // Générer le tableau
      doc.autoTable({
        startY: 35,
        head: [['Jour', 'Midi', 'Soir']],
        body: tableData,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        styles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold' }
        }
      });
      
      // Liste des ingrédients si disponible
      if (options.includeIngredients && options.ingredients) {
        const finalY = doc.lastAutoTable.finalY || 35;
        doc.setFontSize(14);
        doc.text('Liste de courses', 14, finalY + 15);
        
        const ingredientsData = [];
        Object.entries(options.ingredients).forEach(([category, items]) => {
          ingredientsData.push([{ content: category.toUpperCase(), colSpan: 2, styles: { fontStyle: 'bold' } }]);
          
          items.forEach(item => {
            ingredientsData.push([
              `${item.quantity} ${item.unit}`,
              item.name
            ]);
          });
          
          // Ligne vide entre catégories
          ingredientsData.push([{ content: '', colSpan: 2 }]);
        });
        
        doc.autoTable({
          startY: finalY + 20,
          body: ingredientsData,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 3
          },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 'auto' }
          }
        });
      }
      
      // Pied de page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          'Généré par l\'application de gestion des repas',
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Télécharger le PDF
      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export du menu en PDF:', error);
      return false;
    }
  },
  
  /**
   * Organise les repas par jour de la semaine
   */
  organizeMealsByDay(menuItems) {
    const mealsByDay = {};
    
    menuItems.forEach(item => {
      if (!mealsByDay[item.day]) {
        mealsByDay[item.day] = {};
      }
      
      mealsByDay[item.day][item.moment_journee] = item.nom;
    });
    
    return mealsByDay;
  },  // Ajout de la virgule ici
  
  /**
   * Partage un menu ou une recette sur les réseaux sociaux
   * @param {Object} content - Contenu à partager (menu ou recette)
   * @param {string} platform - Plateforme de partage (facebook, twitter, etc.)
   * @param {Object} options - Options supplémentaires
   */
  shareContent(content, platform, options = {}) {
    try {
      let shareUrl = '';
      let shareText = '';
      
      // Préparer le texte à partager
      if (content.type === 'recipe') {
        shareText = `Découvrez cette délicieuse recette: ${content.nom}`;
      } else if (content.type === 'menu') {
        shareText = `Mon menu de la semaine généré avec l'application Repas`;
      }
      
      // URL de l'application (à remplacer par votre URL réelle)
      const appUrl = window.location.origin;
      
      // Construire l'URL de partage selon la plateforme
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent('Partage depuis l\'application Repas')}&body=${encodeURIComponent(shareText + '\n\n' + appUrl)}`;
          break;
        default:
          throw new Error('Plateforme de partage non supportée');
      }
      
      // Ouvrir la fenêtre de partage
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      return true;
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      return false;
    }
  },
};