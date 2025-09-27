// Database utility functions for in-memory storage
export interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: "A" | "B" | "C" | "D"
}

export interface QuestionForClient {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
}

// In-memory storage for questions
let questionsData: Question[] = []
let isInitialized = false

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return

  // Expanded questions database with 50+ questions
  questionsData = [
    {
      id: 1,
      question_text: "What is the capital of France?",
      option_a: "London",
      option_b: "Berlin",
      option_c: "Paris",
      option_d: "Madrid",
      correct_option: "C",
    },
    {
      id: 2,
      question_text: "Which planet is known as the Red Planet?",
      option_a: "Venus",
      option_b: "Mars",
      option_c: "Jupiter",
      option_d: "Saturn",
      correct_option: "B",
    },
    {
      id: 3,
      question_text: "What is 2 + 2?",
      option_a: "3",
      option_b: "4",
      option_c: "5",
      option_d: "6",
      correct_option: "B",
    },
    {
      id: 4,
      question_text: "Who painted the Mona Lisa?",
      option_a: "Van Gogh",
      option_b: "Picasso",
      option_c: "Da Vinci",
      option_d: "Monet",
      correct_option: "C",
    },
    {
      id: 5,
      question_text: "What is the largest ocean on Earth?",
      option_a: "Atlantic",
      option_b: "Indian",
      option_c: "Arctic",
      option_d: "Pacific",
      correct_option: "D",
    },
    {
      id: 6,
      question_text: "Which programming language is known for web development?",
      option_a: "Python",
      option_b: "JavaScript",
      option_c: "C++",
      option_d: "Java",
      correct_option: "B",
    },
    {
      id: 7,
      question_text: "What year did World War II end?",
      option_a: "1944",
      option_b: "1945",
      option_c: "1946",
      option_d: "1947",
      correct_option: "B",
    },
    {
      id: 8,
      question_text: 'Which element has the chemical symbol "O"?',
      option_a: "Gold",
      option_b: "Silver",
      option_c: "Oxygen",
      option_d: "Iron",
      correct_option: "C",
    },
    {
      id: 9,
      question_text: "What is the smallest country in the world?",
      option_a: "Monaco",
      option_b: "Vatican City",
      option_c: "San Marino",
      option_d: "Liechtenstein",
      correct_option: "B",
    },
    {
      id: 10,
      question_text: "Which animal is known as the King of the Jungle?",
      option_a: "Tiger",
      option_b: "Elephant",
      option_c: "Lion",
      option_d: "Leopard",
      correct_option: "C",
    },
    {
      id: 11,
      question_text: "What is the speed of light in vacuum?",
      option_a: "300,000 km/s",
      option_b: "150,000 km/s",
      option_c: "299,792,458 m/s",
      option_d: "186,000 miles/s",
      correct_option: "C",
    },
    {
      id: 12,
      question_text: "Who wrote 'Romeo and Juliet'?",
      option_a: "Charles Dickens",
      option_b: "William Shakespeare",
      option_c: "Jane Austen",
      option_d: "Mark Twain",
      correct_option: "B",
    },
    {
      id: 13,
      question_text: "What is the largest mammal in the world?",
      option_a: "African Elephant",
      option_b: "Blue Whale",
      option_c: "Giraffe",
      option_d: "Polar Bear",
      correct_option: "B",
    },
    {
      id: 14,
      question_text: "Which gas makes up about 78% of Earth's atmosphere?",
      option_a: "Oxygen",
      option_b: "Carbon Dioxide",
      option_c: "Nitrogen",
      option_d: "Argon",
      correct_option: "C",
    },
    {
      id: 15,
      question_text: "What is the currency of Japan?",
      option_a: "Yuan",
      option_b: "Won",
      option_c: "Yen",
      option_d: "Rupee",
      correct_option: "C",
    },
    {
      id: 16,
      question_text: "Which continent is the Sahara Desert located in?",
      option_a: "Asia",
      option_b: "Africa",
      option_c: "Australia",
      option_d: "South America",
      correct_option: "B",
    },
    {
      id: 17,
      question_text: "What is the hardest natural substance on Earth?",
      option_a: "Gold",
      option_b: "Iron",
      option_c: "Diamond",
      option_d: "Platinum",
      correct_option: "C",
    },
    {
      id: 18,
      question_text: "Who invented the telephone?",
      option_a: "Thomas Edison",
      option_b: "Alexander Graham Bell",
      option_c: "Nikola Tesla",
      option_d: "Benjamin Franklin",
      correct_option: "B",
    },
    {
      id: 19,
      question_text: "What is the capital of Australia?",
      option_a: "Sydney",
      option_b: "Melbourne",
      option_c: "Canberra",
      option_d: "Perth",
      correct_option: "C",
    },
    {
      id: 20,
      question_text: "Which organ in the human body produces insulin?",
      option_a: "Liver",
      option_b: "Kidney",
      option_c: "Pancreas",
      option_d: "Heart",
      correct_option: "C",
    },
    {
      id: 21,
      question_text: "What is the largest planet in our solar system?",
      option_a: "Saturn",
      option_b: "Jupiter",
      option_c: "Neptune",
      option_d: "Uranus",
      correct_option: "B",
    },
    {
      id: 22,
      question_text: "Which mountain range contains Mount Everest?",
      option_a: "Andes",
      option_b: "Rocky Mountains",
      option_c: "Alps",
      option_d: "Himalayas",
      correct_option: "D",
    },
    {
      id: 23,
      question_text: "What is the chemical formula for water?",
      option_a: "CO2",
      option_b: "H2O",
      option_c: "NaCl",
      option_d: "CH4",
      correct_option: "B",
    },
    {
      id: 24,
      question_text: "Who painted 'The Starry Night'?",
      option_a: "Pablo Picasso",
      option_b: "Vincent van Gogh",
      option_c: "Claude Monet",
      option_d: "Salvador Dalí",
      correct_option: "B",
    },
    {
      id: 25,
      question_text: "What is the longest river in the world?",
      option_a: "Amazon River",
      option_b: "Nile River",
      option_c: "Mississippi River",
      option_d: "Yangtze River",
      correct_option: "B",
    },
    {
      id: 26,
      question_text: "Which programming language was created by Guido van Rossum?",
      option_a: "Java",
      option_b: "Python",
      option_c: "C++",
      option_d: "Ruby",
      correct_option: "B",
    },
    {
      id: 27,
      question_text: "What is the smallest unit of matter?",
      option_a: "Molecule",
      option_b: "Atom",
      option_c: "Electron",
      option_d: "Proton",
      correct_option: "B",
    },
    {
      id: 28,
      question_text: "Which country is known as the Land of the Rising Sun?",
      option_a: "China",
      option_b: "South Korea",
      option_c: "Japan",
      option_d: "Thailand",
      correct_option: "C",
    },
    {
      id: 29,
      question_text: "What is the study of earthquakes called?",
      option_a: "Geology",
      option_b: "Seismology",
      option_c: "Meteorology",
      option_d: "Astronomy",
      correct_option: "B",
    },
    {
      id: 30,
      question_text: "Which vitamin is produced when skin is exposed to sunlight?",
      option_a: "Vitamin A",
      option_b: "Vitamin B",
      option_c: "Vitamin C",
      option_d: "Vitamin D",
      correct_option: "D",
    },
    {
      id: 31,
      question_text: "What is the capital of Canada?",
      option_a: "Toronto",
      option_b: "Vancouver",
      option_c: "Ottawa",
      option_d: "Montreal",
      correct_option: "C",
    },
    {
      id: 32,
      question_text: "Which instrument measures atmospheric pressure?",
      option_a: "Thermometer",
      option_b: "Barometer",
      option_c: "Hygrometer",
      option_d: "Anemometer",
      correct_option: "B",
    },
    {
      id: 33,
      question_text: "What is the largest bone in the human body?",
      option_a: "Tibia",
      option_b: "Femur",
      option_c: "Humerus",
      option_d: "Fibula",
      correct_option: "B",
    },
    {
      id: 34,
      question_text: "Which ocean is the smallest?",
      option_a: "Indian Ocean",
      option_b: "Atlantic Ocean",
      option_c: "Arctic Ocean",
      option_d: "Southern Ocean",
      correct_option: "C",
    },
    {
      id: 35,
      question_text: "What does 'www' stand for?",
      option_a: "World Wide Web",
      option_b: "World Wide Website",
      option_c: "Web World Wide",
      option_d: "Website World Web",
      correct_option: "A",
    },
    {
      id: 36,
      question_text: "Which planet is closest to the Sun?",
      option_a: "Venus",
      option_b: "Earth",
      option_c: "Mercury",
      option_d: "Mars",
      correct_option: "C",
    },
    {
      id: 37,
      question_text: "What is the main ingredient in guacamole?",
      option_a: "Tomato",
      option_b: "Avocado",
      option_c: "Onion",
      option_d: "Pepper",
      correct_option: "B",
    },
    {
      id: 38,
      question_text: "Which blood type is known as the universal donor?",
      option_a: "A",
      option_b: "B",
      option_c: "AB",
      option_d: "O",
      correct_option: "D",
    },
    {
      id: 39,
      question_text: "What is the tallest mammal?",
      option_a: "Elephant",
      option_b: "Giraffe",
      option_c: "Horse",
      option_d: "Camel",
      correct_option: "B",
    },
    {
      id: 40,
      question_text: "Which metal is liquid at room temperature?",
      option_a: "Lead",
      option_b: "Mercury",
      option_c: "Tin",
      option_d: "Zinc",
      correct_option: "B",
    },
    {
      id: 41,
      question_text: "What is the most abundant gas in the universe?",
      option_a: "Oxygen",
      option_b: "Helium",
      option_c: "Hydrogen",
      option_d: "Nitrogen",
      correct_option: "C",
    },
    {
      id: 42,
      question_text: "Which country has the most time zones?",
      option_a: "Russia",
      option_b: "United States",
      option_c: "China",
      option_d: "France",
      correct_option: "D",
    },
    {
      id: 43,
      question_text: "What is the powerhouse of the cell?",
      option_a: "Nucleus",
      option_b: "Ribosome",
      option_c: "Mitochondria",
      option_d: "Cytoplasm",
      correct_option: "C",
    },
    {
      id: 44,
      question_text: "Which composer wrote 'The Four Seasons'?",
      option_a: "Mozart",
      option_b: "Beethoven",
      option_c: "Bach",
      option_d: "Vivaldi",
      correct_option: "D",
    },
    {
      id: 45,
      question_text: "What is the largest desert in the world?",
      option_a: "Sahara",
      option_b: "Gobi",
      option_c: "Antarctica",
      option_d: "Arabian",
      correct_option: "C",
    },
    {
      id: 46,
      question_text: "Which programming paradigm does JavaScript primarily support?",
      option_a: "Object-oriented",
      option_b: "Functional",
      option_c: "Procedural",
      option_d: "Multi-paradigm",
      correct_option: "D",
    },
    {
      id: 47,
      question_text: "What is the most spoken language in the world?",
      option_a: "English",
      option_b: "Mandarin Chinese",
      option_c: "Spanish",
      option_d: "Hindi",
      correct_option: "B",
    },
    {
      id: 48,
      question_text: "Which organ filters blood in the human body?",
      option_a: "Liver",
      option_b: "Lungs",
      option_c: "Kidneys",
      option_d: "Heart",
      correct_option: "C",
    },
    {
      id: 49,
      question_text: "What is the freezing point of water in Celsius?",
      option_a: "0°C",
      option_b: "32°C",
      option_c: "100°C",
      option_d: "-32°C",
      correct_option: "A",
    },
    {
      id: 50,
      question_text: "Which social media platform was founded by Mark Zuckerberg?",
      option_a: "Twitter",
      option_b: "Instagram",
      option_c: "Facebook",
      option_d: "LinkedIn",
      correct_option: "C",
    },
  ]

  isInitialized = true
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function getAllQuestions(): Promise<QuestionForClient[]> {
  await initializeDatabase()

  const shuffledQuestions = shuffleArray(questionsData).slice(0, 15)

  return shuffledQuestions.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
  }))
}

export async function getQuestionsWithAnswers(): Promise<Question[]> {
  await initializeDatabase()
  return [...questionsData]
}

export function getQuestions(): Question[] {
  if (!isInitialized) {
    throw new Error("Database not initialized. Call initializeDatabase() first.")
  }
  return [...questionsData]
}
