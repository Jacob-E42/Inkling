
INSERT INTO users (first_name, last_name, email, password, interests)
VALUES
  ('John', 'Doe',  'johndoe@example.com', 'password123', '["Self-reflection", "Habit tracking"]'),
  ('Jane', 'Smith',  'janesmith@example.com', 'password456', '["Creative writing", "Personal growth"]'),
  ('Mike', 'Johnson', 'mikejohnson@example.com', 'password789', '["Goal setting", "Gratitude"]'),
  ('Jacob', 'Eiferman',  'jacobeiferman@example.com', 'password', '["Personal growth, Self-reflection"]')
  ;

INSERT INTO journal_entries (user_id, title, entry_text, entry_date, emotions)
VALUES
  (1, 'First Entry', 'Lorem ipsum dolor sit amet.', '2023-01-01', '{"emotions":"joy"}'),
  (1, 'Second Entry', 'Consectetur adipiscing elit.', '2023-01-02', '{"emotions":"sadness"}'),
  (2, 'Third Entry', 'Sed do eiusmod tempor incididunt.', '2023-01-03', '{"emotions":"anger"}'),
  (3, 'Fourth Entry', 'Ut enim ad minim veniam.', '2023-01-04', '{"emotions":"fear"}');
