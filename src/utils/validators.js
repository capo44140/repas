export const validators = {
  required: (value) => !!value || 'Ce champ est requis',
  minLength: (min) => (value) => 
    !value || value.length >= min || `Minimum ${min} caractères`,
  maxLength: (max) => (value) => 
    !value || value.length <= max || `Maximum ${max} caractères`,
  numeric: (value) => 
    !value || !isNaN(value) || 'Ce champ doit être numérique',
  email: (value) => 
    !value || /^\S+@\S+\.\S+$/.test(value) || 'Email invalide'
}