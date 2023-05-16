CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  interests JSON
);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title TEXT NOT NULL,
  entry_text TEXT NOT NULL,
  entry_date TIMESTAMP NOT NULL,
  emotions JSON
);
