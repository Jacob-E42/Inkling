CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1) UNIQUE,
  password TEXT NOT NULL 
);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  entry_text TEXT NOT NULL,
  entry_date DATE NOT NULL,
  emotions JSON,
  journal_type text[] NOT NULL CHECK (cardinality(journal_type) > 0),
  UNIQUE(user_id, entry_date)
);
