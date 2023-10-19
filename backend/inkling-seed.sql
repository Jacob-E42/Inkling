
INSERT INTO users (first_name, last_name, email, password)
VALUES
  ('John', 'Doe',  'johndoe@example.com', 'password123'),
  ('Jane', 'Smith',  'janesmith@example.com', 'password456'),
  ('Mike', 'Johnson', 'mikejohnson@example.com', 'password789'),
  ('Jacob', 'Eiferman',  'jacobeiferman@example.com', 'password');

INSERT INTO journal_entries (user_id, title, entry_text, entry_date, emotions, journal_type)
VALUES
  (1, 'First Entry', 'Lorem ipsum dolor sit amet.', '2023-01-01', '{"emotions":"joy"}', '{"Self-reflection", "Habit tracking"}'),
  (1, 'Second Entry', 'Consectetur adipiscing elit.', '2023-01-02', '{"emotions":"sadness"}', '{"Creative writing", "Personal growth"}'),
  (2, 'Third Entry', 'Sed do eiusmod tempor incididunt.', '2023-01-03', '{"emotions":"anger"}', '{"Goal setting", "Gratitude"}'),
  (3, 'Fourth Entry', 'Ut enim ad minim veniam.', '2023-01-04', '{"emotions":"fear"}', '{"Personal growth, Self-reflection"}');
