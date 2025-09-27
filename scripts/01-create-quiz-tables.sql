-- Create quiz questions table
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample quiz questions
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option) VALUES
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C'),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B'),
('What is 2 + 2?', '3', '4', '5', '6', 'B'),
('Who painted the Mona Lisa?', 'Van Gogh', 'Picasso', 'Da Vinci', 'Monet', 'C'),
('What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 'D'),
('Which programming language is known for web development?', 'Python', 'JavaScript', 'C++', 'Java', 'B'),
('What year did World War II end?', '1944', '1945', '1946', '1947', 'B'),
('Which element has the chemical symbol "O"?', 'Gold', 'Silver', 'Oxygen', 'Iron', 'C'),
('What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Liechtenstein', 'B'),
('Which animal is known as the King of the Jungle?', 'Tiger', 'Elephant', 'Lion', 'Leopard', 'C');
