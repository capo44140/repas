<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenue sur RepasFork
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Votre assistant intelligent pour la planification des repas
        </p>
      </div>

      <div class="space-y-8">
        <!-- Description principale -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Qu'est-ce que RepasFork ?
          </h2>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            RepasFork est un générateur intelligent de menus qui vous aide à planifier vos repas de la semaine.
            L'application prend en compte la saison pour vous suggérer des repas adaptés, vous permettant ainsi
            de manger des produits de saison tout en variant vos menus.
          </p>
        </div>

        <!-- Fonctionnalités principales -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Fonctionnalités principales
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div class="flex items-center mb-4">
                <Icon icon="ph:calendar-check" class="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Planification hebdomadaire
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Générez des menus pour une ou plusieurs semaines en quelques clics.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div class="flex items-center mb-4">
                <Icon icon="ph:leaf" class="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Produits de saison
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Suggestions adaptées aux saisons pour manger des produits frais toute l'année.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div class="flex items-center mb-4">
                <Icon icon="ph:fork-knife" class="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Repas variés
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Alternance entre les types de plats pour une alimentation équilibrée.
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div class="flex items-center mb-4">
                <Icon icon="ph:file-csv" class="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Import personnalisé
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300">
                Importez vos propres recettes via un fichier CSV pour des menus personnalisés.
              </p>
            </div>
          </div>
        </div>

        <!-- Comment commencer -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Comment commencer ?
          </h2>
          <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <ol class="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
              <li>Accédez à la section <router-link to="/generated-meals" class="text-primary-600 dark:text-primary-400 hover:underline">"Repas générés"</router-link> depuis le menu latéral</li>
              <li>Sélectionnez le nombre de semaines pour votre planning</li>
              <li>Choisissez la saison actuelle pour des suggestions adaptées</li>
              <li>Sélectionnez les types de repas à inclure (midi et/ou soir)</li>
              <li>Cliquez sur "Générer les repas" pour obtenir votre planning</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>