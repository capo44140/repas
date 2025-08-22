<template>
  <div class="max-w-4xl mx-auto">
    <div class="rounded-lg shadow-lg p-8" :class="cardClasses.background">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4" :class="textClasses.primary">
          Bienvenue sur RepasFork
        </h1>
        <p class="text-lg" :class="textClasses.secondary">
          Votre assistant personnel pour la planification et la gestion de vos
          repas
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <h2
          class="text-2xl font-semibold mb-4 md:col-span-2"
          :class="textClasses.primary"
        >
          Fonctionnalités principales
        </h2>

        <div class="p-6 rounded-lg" :class="bgClasses.secondary">
          <div class="flex items-center mb-3">
            <Icon
              icon="ph:calendar-check"
              class="w-6 h-6 mr-3"
              :class="iconClasses.primary"
            />
            <h3 class="text-lg font-medium" :class="textClasses.primary">
              Planification des repas
            </h3>
          </div>
          <p :class="textClasses.secondary">
            Planifiez vos repas de la semaine avec notre générateur intelligent
          </p>
        </div>

        <div class="p-6 rounded-lg" :class="bgClasses.secondary">
          <div class="flex items-center mb-3">
            <Icon
              icon="ph:leaf"
              class="w-6 h-6 mr-3"
              :class="iconClasses.primary"
            />
            <h3 class="text-lg font-medium" :class="textClasses.primary">
              Recettes personnalisées
            </h3>
          </div>
          <p :class="textClasses.secondary">
            Découvrez des recettes adaptées à vos préférences et restrictions
          </p>
        </div>

        <div class="p-6 rounded-lg" :class="bgClasses.secondary">
          <div class="flex items-center mb-3">
            <Icon
              icon="ph:fork-knife"
              class="w-6 h-6 mr-3"
              :class="iconClasses.primary"
            />
            <h3 class="text-lg font-medium" :class="textClasses.primary">
              Gestion des repas
            </h3>
          </div>
          <p :class="textClasses.secondary">
            Organisez et gérez votre collection de recettes favorites
          </p>
        </div>

        <div class="p-6 rounded-lg" :class="bgClasses.secondary">
          <div class="flex items-center mb-3">
            <Icon
              icon="ph:file-csv"
              class="w-6 h-6 mr-3"
              :class="iconClasses.primary"
            />
            <h3 class="text-lg font-medium" :class="textClasses.primary">
              Import/Export
            </h3>
          </div>
          <p :class="textClasses.secondary">
            Importez vos recettes depuis des fichiers CSV et partagez-les
          </p>
        </div>
      </div>

      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-4" :class="textClasses.primary">
          Commencez dès maintenant
        </h2>
        <p class="mb-6" :class="textClasses.secondary">
          Utilisez la navigation à gauche pour explorer toutes les
          fonctionnalités
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useThemeClasses } from "../composables/useThemeClasses";

const { cardClasses, textClasses, bgClasses, iconClasses } = useThemeClasses();
</script>
