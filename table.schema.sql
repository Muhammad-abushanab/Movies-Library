create table if not exists movie(
    id serial primary key,
    title varchar(200) NOT NULL ,
    lang varchar(200) NOT NULL,
    type varchar(200) NOT NULL
);

ALTER TABLE movie ADD CONSTRAINT unique_movie_title UNIQUE (title);

-- Dummy Data
INSERT INTO movie (title, lang, type)
SELECT 'Extraction', 'EN', 'Action'
WHERE NOT EXISTS (
  SELECT 1 FROM movie WHERE title = 'Extraction'
);

INSERT INTO movie (title, lang, type)
SELECT 'Split', 'EN', 'Comedy'
WHERE NOT EXISTS (
  SELECT 1 FROM movie WHERE title = 'Split'
);

INSERT INTO movie (title, lang, type)
SELECT 'World War Z', 'EN', 'Horror'
WHERE NOT EXISTS (
  SELECT 1 FROM movie WHERE title = 'World War Z'
);