import { computed } from "vue";
import { useDarkMode } from "./useDarkMode";

export function useThemeClasses() {
  const { isDarkMode } = useDarkMode();

  // Classes pour les arrière-plans
  const bgClasses = computed(() => ({
    primary: isDarkMode.value ? "bg-gray-900" : "bg-white",
    secondary: isDarkMode.value ? "bg-gray-800" : "bg-gray-50",
    tertiary: isDarkMode.value ? "bg-gray-700" : "bg-gray-100",
    card: isDarkMode.value ? "bg-gray-800" : "bg-white",
    sidebar: isDarkMode.value ? "bg-gray-900" : "bg-white",
    header: isDarkMode.value ? "bg-gray-800" : "bg-white",
  }));

  // Classes pour le texte
  const textClasses = computed(() => ({
    primary: isDarkMode.value ? "text-gray-100" : "text-gray-900",
    secondary: isDarkMode.value ? "text-gray-300" : "text-gray-600",
    tertiary: isDarkMode.value ? "text-gray-400" : "text-gray-500",
    muted: isDarkMode.value ? "text-gray-500" : "text-gray-400",
  }));

  // Classes pour les bordures
  const borderClasses = computed(() => ({
    primary: isDarkMode.value ? "border-gray-700" : "border-gray-200",
    secondary: isDarkMode.value ? "border-gray-600" : "border-gray-300",
    divider: isDarkMode.value ? "divide-gray-700" : "divide-gray-200",
  }));

  // Classes pour les inputs
  const inputClasses = computed(() => ({
    background: isDarkMode.value ? "bg-gray-700" : "bg-white",
    border: isDarkMode.value ? "border-gray-600" : "border-gray-300",
    text: isDarkMode.value ? "text-white" : "text-gray-900",
    placeholder: isDarkMode.value
      ? "placeholder-gray-400"
      : "placeholder-gray-500",
    focus: isDarkMode.value
      ? "focus:border-primary-400 focus:ring-primary-400"
      : "focus:border-primary-500 focus:ring-primary-500",
  }));

  // Classes pour les boutons
  const buttonClasses = computed(() => ({
    primary: "bg-primary-500 hover:bg-primary-600 text-white",
    secondary: isDarkMode.value
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-orange-600 hover:bg-orange-700 text-white",
  }));

  // Classes pour les tableaux
  const tableClasses = computed(() => ({
    header: isDarkMode.value ? "bg-gray-700" : "bg-gray-50",
    row: isDarkMode.value ? "bg-gray-800" : "bg-white",
    divider: isDarkMode.value ? "divide-gray-700" : "divide-gray-200",
  }));

  // Classes pour les cartes
  const cardClasses = computed(() => ({
    background: isDarkMode.value ? "bg-gray-800" : "bg-white",
    border: isDarkMode.value ? "border-gray-700" : "border-gray-200",
    shadow: isDarkMode.value ? "shadow-lg" : "shadow-md",
  }));

  // Classes pour les icônes
  const iconClasses = computed(() => ({
    primary: "text-primary-500",
    muted: isDarkMode.value ? "text-gray-400" : "text-gray-500",
    light: isDarkMode.value ? "text-gray-300" : "text-gray-600",
  }));

  // Fonction utilitaire pour combiner des classes
  const combineClasses = (...classObjects) => {
    return classObjects
      .reduce((acc, classObj) => {
        if (typeof classObj === "string") {
          return acc + " " + classObj;
        }
        if (classObj && typeof classObj === "object") {
          return acc + " " + Object.values(classObj).filter(Boolean).join(" ");
        }
        return acc;
      }, "")
      .trim();
  };

  // Classes communes pour les transitions
  const transitionClasses = "transition-all duration-200 ease-in-out";

  return {
    isDarkMode,
    bgClasses,
    textClasses,
    borderClasses,
    inputClasses,
    buttonClasses,
    tableClasses,
    cardClasses,
    iconClasses,
    combineClasses,
    transitionClasses,
  };
}
