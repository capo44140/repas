-- Suppression de la table si elle existe déjà
DROP TABLE IF EXISTS repas;

-- Création de la table repas
CREATE TABLE repas (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    saison VARCHAR(50) NOT NULL,
    temps_preparation INTEGER,
    temps_cuisson INTEGER,
    temps_repos INTEGER,
    temps_total INTEGER,
    difficulte VARCHAR(50),
    cout VARCHAR(10),
    calories INTEGER,
    ingredients TEXT[],
    instructions TEXT[],
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 