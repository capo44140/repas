<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full p-0 relative overflow-hidden max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Close button -->
      <button 
        @click="close" 
        class="absolute top-3 right-3 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-full p-1 z-10" 
        aria-label="Fermer"
      >
        <Icon icon="ph:x" class="h-5 w-5" />
      </button>
      
      <!-- Recipe image -->
      <div class="relative h-64">
        <img :src="recipe.image" :alt="recipe.name" class="w-full h-full object-cover">
        
        <!-- Tags overlay -->
        <div class="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span 
            v-if="isVegetarian()" 
            class="recipe-tag vegetarian-tag flex items-center"
          >
            <Icon icon="ph:leaf" class="w-3 h-3 mr-1" />
            Végétarien
          </span>
          
          <span 
            class="recipe-tag"
            :class="{
              'difficulty-easy': getDifficultyLevel() === 'Facile',
              'difficulty-medium': getDifficultyLevel() === 'Moyen',
              'difficulty-hard': getDifficultyLevel() === 'Difficile'
            }"
          >
            <Icon icon="ph:cooking-pot" class="w-3 h-3 mr-1" />
            {{ getDifficultyLevel() }}
          </span>
        </div>
      </div>
      
      <!-- Recipe content -->
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ recipe.name }}</h2>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
            {{ recipe.season }}
          </span>
          <span class="inline-block px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-200">
            {{ recipe.type }}
          </span>
        </div>
        
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Icon icon="ph:clock" class="w-4 h-4 mr-2" />
          <span>Temps de préparation: environ {{ recipe.prepTime }} minutes</span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ recipe.description }}</p>
        
        <!-- Valeurs nutritionnelles -->
        <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Valeurs nutritionnelles</h3>
          <div class="grid grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ getNutritionalValues().calories }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Calories</div>
            </div>
            <div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ getNutritionalValues().proteines }}g</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Protéines</div>
            </div>
            <div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ getNutritionalValues().glucides }}g</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Glucides</div>
            </div>
            <div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ getNutritionalValues().lipides }}g</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Lipides</div>
            </div>
          </div>
        </div>
        
        <!-- Ingrédients -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Ingrédients</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
            <li v-for="(ingredient, index) in getIngredients()" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </div>
        
        <!-- Instructions pas à pas -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Instructions</h3>
          <ol class="list-decimal pl-5 space-y-4">
            <li v-for="(step, index) in getInstructions()" :key="index" class="text-gray-600 dark:text-gray-400">
              <p>{{ step }}</p>
            </li>
          </ol>
        </div>
        
        <!-- Après la section des conseils de préparation -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Conseils de préparation</h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ getCookingTips() }}
          </p>
        </div>
        
        <!-- Galerie de photos -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Galerie de photos</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="(photo, index) in getRecipePhotos()" :key="index" class="relative aspect-square overflow-hidden rounded-lg cursor-pointer" @click="openFullImage(photo)">
              <img :src="photo" :alt="`${recipe.name} - photo ${index + 1}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- À la fin du template, juste avant la balise de fermeture </div> principale -->
    </div>
    
    <!-- Visualiseur d'image en plein écran -->
    <div v-if="fullScreenImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" @click="closeFullImage">
      <button class="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-10" aria-label="Fermer">
        <Icon icon="ph:x" class="h-6 w-6" />
      </button>
      <img :src="fullScreenImage" :alt="recipe.name" class="max-w-[90%] max-h-[90vh] object-contain">
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  recipe: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

// Fonction pour générer des ingrédients basés sur la recette
const getIngredients = () => {
  // Dans une application réelle, ces données viendraient de votre API
  const recipeType = props.recipe.type;
  const recipeName = props.recipe.name;
  
  if (recipeName === 'Gratin dauphinois') {
    return [
      '1 kg de pommes de terre à chair ferme',
      '50 cl de crème fraîche épaisse',
      '3 gousses d\'ail',
      '20 cl de lait',
      '1 noix de beurre',
      'Sel et poivre',
      'Noix de muscade râpée'
    ];
  } else if (recipeName === 'Salade niçoise') {
    return [
      '4 tomates bien mûres',
      '1 concombre',
      '1 poivron vert',
      '1 oignon rouge',
      '200g de thon en conserve',
      '4 œufs durs',
      '12 olives noires',
      '2 cuillères à soupe d\'huile d\'olive',
      'Sel et poivre'
    ];
  } else if (recipeName === 'Soupe à l\'oignon') {
    return [
      '6 oignons jaunes',
      '2 cuillères à soupe d\'huile d\'olive',
      '1 cuillère à soupe de beurre',
      '1 litre de bouillon de bœuf',
      '1 cuillère à soupe de farine',
      '100g de gruyère râpé',
      '4 tranches de pain de campagne',
      'Sel et poivre'
    ];
  } else if (recipeName === 'Ratatouille') {
    return [
      '2 aubergines',
      '3 courgettes',
      '2 poivrons (1 rouge, 1 jaune)',
      '4 tomates bien mûres',
      '2 oignons',
      '3 gousses d\'ail',
      'Huile d\'olive',
      'Herbes de Provence',
      'Sel et poivre'
    ];
  } else if (recipeName === 'Tarte Tatin') {
    return [
      '1 pâte feuilletée',
      '8 pommes Golden',
      '150g de sucre',
      '100g de beurre',
      '1 cuillère à café de cannelle'
    ];
  } else {
    // Ingrédients génériques pour les autres recettes
    return [
      'Ingrédients principaux selon la saison',
      'Épices et assaisonnements',
      'Accompagnements variés'
    ];
  }
};

// Fonction pour générer des instructions pas à pas
const getInstructions = () => {
  const recipeName = props.recipe.name;
  
  if (recipeName === 'Gratin dauphinois') {
    return [
      'Préchauffez le four à 180°C (thermostat 6).',
      'Épluchez les pommes de terre et coupez-les en fines rondelles.',
      'Frottez un plat à gratin avec une gousse d\'ail puis beurrez-le généreusement.',
      'Disposez les pommes de terre en couches dans le plat.',
      'Dans un bol, mélangez la crème, le lait, l\'ail émincé, le sel, le poivre et la muscade.',
      'Versez ce mélange sur les pommes de terre.',
      'Enfournez pour 1h à 1h15, jusqu\'à ce que le dessus soit bien doré et que les pommes de terre soient tendres.'
    ];
  } else if (recipeName === 'Salade niçoise') {
    return [
      'Lavez et coupez les tomates en quartiers.',
      'Épluchez et tranchez le concombre.',
      'Épépinez et coupez le poivron en lanières.',
      'Émincez l\'oignon rouge.',
      'Écalez et coupez les œufs durs en quartiers.',
      'Dans un grand saladier, disposez tous les légumes, le thon émietté et les œufs.',
      'Ajoutez les olives noires.',
      'Assaisonnez avec l\'huile d\'olive, le sel et le poivre.',
      'Mélangez délicatement et servez frais.'
    ];
  } else if (recipeName === 'Soupe à l\'oignon') {
    return [
      'Émincez finement les oignons.',
      'Dans une grande casserole, faites chauffer l\'huile et le beurre.',
      'Ajoutez les oignons et faites-les revenir à feu doux pendant 30 minutes jusqu\'à ce qu\'ils soient bien dorés et caramélisés.',
      'Saupoudrez de farine et mélangez bien.',
      'Versez le bouillon de bœuf chaud et laissez mijoter 20 minutes.',
      'Préchauffez le gril du four.',
      'Disposez la soupe dans des bols allant au four.',
      'Placez une tranche de pain sur chaque bol et couvrez généreusement de gruyère râpé.',
      'Passez sous le gril jusqu\'à ce que le fromage soit fondu et doré.',
      'Servez immédiatement.'
    ];
  } else if (recipeName === 'Ratatouille') {
    return [
      'Lavez et coupez tous les légumes en cubes de taille moyenne.',
      'Dans une grande poêle ou une cocotte, faites chauffer 3 cuillères à soupe d\'huile d\'olive.',
      'Faites revenir les oignons émincés jusqu\'à ce qu\'ils soient translucides.',
      'Ajoutez l\'ail émincé et faites revenir 1 minute.',
      'Ajoutez les poivrons et faites-les cuire 5 minutes.',
      'Incorporez les aubergines et les courgettes, puis laissez cuire 10 minutes en remuant régulièrement.',
      'Ajoutez les tomates coupées en dés, les herbes de Provence, le sel et le poivre.',
      'Couvrez et laissez mijoter à feu doux pendant 30 à 40 minutes en remuant de temps en temps.',
      'La ratatouille est prête lorsque tous les légumes sont tendres mais pas trop cuits.',
      'Servez chaud ou à température ambiante.'
    ];
  } else if (recipeName === 'Tarte Tatin') {
    return [
      'Préchauffez le four à 200°C (thermostat 6-7).',
      'Épluchez les pommes, retirez les cœurs et coupez-les en quartiers.',
      'Dans un moule à tarte tatin (ou un moule à manqué), faites fondre le beurre.',
      'Ajoutez le sucre et laissez caraméliser légèrement.',
      'Disposez les quartiers de pommes en rosace dans le caramel, saupoudrez de cannelle.',
      'Faites cuire à feu moyen pendant 15 minutes jusqu\'à ce que les pommes soient tendres et caramélisées.',
      'Étalez la pâte feuilletée et posez-la sur les pommes en rentrant les bords à l\'intérieur du moule.',
      'Enfournez pour 25 à 30 minutes jusqu\'à ce que la pâte soit dorée.',
      'Laissez tiédir 5 minutes, puis retournez délicatement la tarte sur un plat de service.',
      'Servez tiède, éventuellement avec une boule de glace à la vanille.'
    ];
  } else {
    // Instructions génériques pour les autres recettes
    return [
      'Préparez tous les ingrédients nécessaires.',
      'Suivez les étapes de préparation spécifiques à cette recette.',
      'Cuisez selon les indications de température et de temps.',
      'Vérifiez la cuisson et ajustez si nécessaire.',
      'Dressez et servez selon les recommandations.'
    ];
  }
};

// Fonction pour générer des conseils de préparation
const getCookingTips = () => {
  const recipeSeason = props.recipe.season;
  const recipeType = props.recipe.type;
  const recipeName = props.recipe.name;
  
  let tips = `Ce plat est idéal pour ${recipeSeason === 'Été' ? 'les journées chaudes' : 
    recipeSeason === 'Hiver' ? 'se réchauffer pendant les journées froides' : 
    recipeSeason === 'Automne' ? 'profiter des saveurs automnales' : 
    'profiter des saveurs printanières'}.`;
    
  if (recipeName === 'Gratin dauphinois') {
    tips += ' Pour un gratin encore plus savoureux, utilisez un mélange de crème et de lait entier. Vous pouvez également ajouter du fromage râpé sur le dessus pendant les 15 dernières minutes de cuisson.';
  } else if (recipeName === 'Salade niçoise') {
    tips += ' Pour une salade niçoise authentique, utilisez des ingrédients frais et de saison. Vous pouvez ajouter des haricots verts blanchis pour plus de saveur et de texture.';
  } else if (recipeName === 'Soupe à l\'oignon') {
    tips += ' La clé d\'une bonne soupe à l\'oignon est de prendre le temps de bien caraméliser les oignons. N\'hésitez pas à utiliser un bon bouillon fait maison pour plus de saveur.';
  } else if (recipeName === 'Ratatouille') {
    tips += ' Pour une ratatouille parfaite, cuisez chaque légume séparément avant de les assembler. Cela permet à chaque légume de conserver sa texture et sa saveur propre.';
  } else if (recipeName === 'Tarte Tatin') {
    tips += ' Choisissez des pommes qui tiennent bien à la cuisson comme les Golden ou les Reinettes. Laissez reposer la tarte quelques minutes avant de la retourner pour éviter que le caramel ne coule trop.';
  }
  
  return tips;
};

// Fonction pour obtenir les valeurs nutritionnelles (simulées)
const getNutritionalValues = () => {
  const recipeName = props.recipe.name;
  
  // Valeurs nutritionnelles simulées pour chaque recette
  const nutritionalInfo = {
    'Gratin dauphinois': {
      calories: 320,
      proteines: 8,
      glucides: 35,
      lipides: 18
    },
    'Salade niçoise': {
      calories: 220,
      proteines: 15,
      glucides: 12,
      lipides: 14
    },
    'Soupe à l\'oignon': {
      calories: 180,
      proteines: 6,
      glucides: 22,
      lipides: 8
    },
    'Ratatouille': {
      calories: 150,
      proteines: 3,
      glucides: 18,
      lipides: 9
    },
    'Tarte Tatin': {
      calories: 280,
      proteines: 3,
      glucides: 45,
      lipides: 12
    }
  };
  
  // Retourner les valeurs nutritionnelles pour la recette spécifique ou des valeurs par défaut
  return nutritionalInfo[recipeName] || {
    calories: 200,
    proteines: 5,
    glucides: 25,
    lipides: 10
  };
};

// Fonction pour déterminer si la recette est végétarienne
const isVegetarian = () => {
  const recipeName = props.recipe.name;
  const vegetarianRecipes = ['Ratatouille', 'Gratin dauphinois', 'Tarte Tatin'];
  
  return vegetarianRecipes.includes(recipeName);
};

// Fonction pour déterminer le niveau de difficulté
const getDifficultyLevel = () => {
  const recipeName = props.recipe.name;
  const difficultyMap = {
    'Gratin dauphinois': 'Facile',
    'Salade niçoise': 'Facile',
    'Soupe à l\'oignon': 'Moyen',
    'Ratatouille': 'Moyen',
    'Tarte Tatin': 'Difficile'
  };
  
  return difficultyMap[recipeName] || 'Moyen';
};

// Après la fonction getDifficultyLevel()

// Fonction pour obtenir les photos supplémentaires de la recette
const getRecipePhotos = () => {
  const recipeName = props.recipe.name;
  
  // Photos simulées pour chaque recette
  const recipePhotos = {
    'Gratin dauphinois': [
      'https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhdGluJTIwZGF1cGhpbm9pc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    'Salade niçoise': [
      'https://images.unsplash.com/photo-1595587870672-c79b47875c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FsYWRlJTIwbmljb2lzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    'Soupe à l\'oignon': [
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b25pb24lMjBzb3VwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1605709303005-0fddfcbba9ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583608564770-462a84ebd99a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    'Ratatouille': [
      'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ],
    'Tarte Tatin': [
      'https://images.unsplash.com/photo-1562963115-f95311c7aab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    ]
  };
  
  // Retourner les photos pour la recette spécifique ou un tableau vide
  return recipePhotos[recipeName] || [];
};

// État pour l'image en plein écran
const fullScreenImage = ref(null);

// Fonction pour ouvrir une image en plein écran
const openFullImage = (imageUrl) => {
  fullScreenImage.value = imageUrl;
};

// Fonction pour fermer l'image en plein écran
const closeFullImage = () => {
  fullScreenImage.value = null;
};
</script>

<style scoped>
.recipe-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.vegetarian-tag {
  background-color: #dcfce7;
  color: #166534;
}

.difficulty-easy {
  background-color: #e0f2fe;
  color: #0369a1;
}

.difficulty-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.difficulty-hard {
  background-color: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 640px) {
  .recipe-modal-content {
    padding: 1rem;
  }
  
  .recipe-image {
    height: 12rem;
  }
}
</style>