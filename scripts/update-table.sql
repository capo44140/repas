-- Ajouter la colonne moment_journee à la table repas
ALTER TABLE repas ADD COLUMN moment_journee VARCHAR(10) CHECK (moment_journee IN ('midi', 'soir'));

-- Mettre à jour les données existantes (optionnel, à adapter selon vos besoins)
UPDATE repas SET moment_journee = 'midi' WHERE moment_journee IS NULL; 