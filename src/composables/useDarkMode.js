import { ref, watch, computed } from "vue";

// État global du thème
const isDarkMode = ref(false);
const currentTheme = ref("blue");
const customPrimaryColor = ref("blue");
const saturation = ref(60);

// Thèmes prédéfinis
const themes = [
  { id: "blue", name: "Bleu", primary: "#0ea5e9", secondary: "#22c55e" },
  { id: "purple", name: "Violet", primary: "#a855f7", secondary: "#ec4899" },
  { id: "green", name: "Vert", primary: "#22c55e", secondary: "#6366f1" },
  { id: "red", name: "Rouge", primary: "#ef4444", secondary: "#f59e0b" },
  { id: "amber", name: "Ambre", primary: "#f59e0b", secondary: "#0ea5e9" },
  {
    id: "custom",
    name: "Personnalisé",
    primary: "#0ea5e9",
    secondary: "#22c55e",
  },
];

// Couleurs principales disponibles
const primaryColors = [
  { id: "blue", value: "#0ea5e9" },
  { id: "purple", value: "#a855f7" },
  { id: "green", value: "#22c55e" },
  { id: "red", value: "#ef4444" },
  { id: "amber", value: "#f59e0b" },
  { id: "pink", value: "#ec4899" },
  { id: "indigo", value: "#6366f1" },
  { id: "teal", value: "#14b8a6" },
  { id: "cyan", value: "#06b6d4" },
  { id: "orange", value: "#f97316" },
];

// Fonction pour ajuster la couleur (clair/foncé)
const adjustColor = (r, g, b, lightnessFactor, satFactor) => {
  // Ajuster la luminosité
  r = Math.min(255, Math.round(r + (255 - r) * lightnessFactor));
  g = Math.min(255, Math.round(g + (255 - g) * lightnessFactor));
  b = Math.min(255, Math.round(b + (255 - b) * lightnessFactor));

  // Convertir en hexa
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// Fonction pour mettre à jour les variables CSS
const updateRootCSSVariables = (color, sat) => {
  // Convertir la couleur hexadécimale en valeurs RGB
  const hex = color.replace("#", "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Ajuster la saturation
  const factor = sat / 100;

  // Mettre à jour les variables CSS pour la couleur primaire
  document.documentElement.style.setProperty(
    "--primary-50",
    adjustColor(r, g, b, 0.95, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-100",
    adjustColor(r, g, b, 0.9, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-200",
    adjustColor(r, g, b, 0.8, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-300",
    adjustColor(r, g, b, 0.7, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-400",
    adjustColor(r, g, b, 0.6, factor)
  );
  document.documentElement.style.setProperty("--primary-500", color);
  document.documentElement.style.setProperty(
    "--primary-600",
    adjustColor(r, g, b, 0.4, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-700",
    adjustColor(r, g, b, 0.3, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-800",
    adjustColor(r, g, b, 0.2, factor)
  );
  document.documentElement.style.setProperty(
    "--primary-900",
    adjustColor(r, g, b, 0.1, factor)
  );

  // Créer un événement de modification du thème
  const event = new CustomEvent("theme-updated", {
    detail: {
      primary: color,
      saturation: sat,
    },
  });
  window.dispatchEvent(event);
};

// Fonction pour appliquer un thème
const applyTheme = (themeId, primaryColorId = null, sat = null) => {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;

  currentTheme.value = themeId;

  if (primaryColorId) {
    customPrimaryColor.value = primaryColorId;
  }

  if (sat !== null) {
    saturation.value = sat;
  }

  // Mettre à jour le thème personnalisé si nécessaire
  if (themeId === "custom" && primaryColorId) {
    const color = primaryColors.find((c) => c.id === primaryColorId);
    if (color) {
      theme.primary = color.value;
    }
  }

  // Appliquer les variables CSS
  updateRootCSSVariables(theme.primary, saturation.value);

  // Sauvegarder les préférences
  saveThemePreferences();
};

// Fonction pour sauvegarder les préférences
const saveThemePreferences = () => {
  const preferences = {
    theme: currentTheme.value,
    primaryColor: customPrimaryColor.value,
    saturation: saturation.value,
    darkMode: isDarkMode.value,
  };

  localStorage.setItem("themePreferences", JSON.stringify(preferences));
};

// Fonction pour charger les préférences
const loadThemePreferences = () => {
  try {
    const saved = localStorage.getItem("themePreferences");
    if (saved) {
      const preferences = JSON.parse(saved);
      currentTheme.value = preferences.theme || "blue";
      customPrimaryColor.value = preferences.primaryColor || "blue";
      saturation.value = preferences.saturation || 60;
      isDarkMode.value =
        preferences.darkMode !== undefined ? preferences.darkMode : false;

      // Appliquer le thème chargé
      applyTheme(
        currentTheme.value,
        customPrimaryColor.value,
        saturation.value
      );
    }
  } catch (error) {
    console.error("Erreur lors du chargement des préférences de thème:", error);
  }
};

// Fonction pour réinitialiser aux valeurs par défaut
const resetToDefault = () => {
  currentTheme.value = "blue";
  customPrimaryColor.value = "blue";
  saturation.value = 60;
  applyTheme("blue", "blue", 60);
};

// Vérifier la préférence initiale du mode sombre
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
isDarkMode.value = prefersDark;

// Écouter les changements de préférence système
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    isDarkMode.value = e.matches;
    saveThemePreferences();
  });

// Surveiller les changements de mode sombre
watch(
  isDarkMode,
  (newValue) => {
    if (newValue) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    saveThemePreferences();
  },
  { immediate: true }
);

// Charger les préférences au démarrage
loadThemePreferences();

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return {
    // Mode sombre
    isDarkMode: computed(() => isDarkMode.value),
    toggleDarkMode,

    // Gestion des thèmes
    currentTheme: computed(() => currentTheme.value),
    customPrimaryColor: computed(() => customPrimaryColor.value),
    saturation: computed(() => saturation.value),
    themes: computed(() => themes),
    primaryColors: computed(() => primaryColors),

    // Fonctions
    applyTheme,
    resetToDefault,
    updateRootCSSVariables,
  };
}
