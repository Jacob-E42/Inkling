CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL ,
  interests text[] NOT NULL CHECK (cardinality(interests) > 0)

);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  entry_text TEXT NOT NULL,
  entry_date TIMESTAMP NOT NULL,
  emotions JSON
);
