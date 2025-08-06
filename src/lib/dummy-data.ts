export type Subject = {
  id: string;
  name: string;
  description: string;
  image: string;
  noteCount: number;
  quizCount: number;
};

export type Note = {
  id: string;
  subject: string;
  title: string;
  content: string;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
};

export type QuizHistory = {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  date: string;
};

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematics', description: 'Explore the world of numbers, from algebra to calculus.', image: 'https://placehold.co/600x400', noteCount: 2, quizCount: 1 },
  { id: 'history', name: 'History', description: 'Journey through time and discover past events.', image: 'https://placehold.co/600x400', noteCount: 1, quizCount: 1 },
  { id: 'science', name: 'Science', description: 'Uncover the mysteries of the natural world.', image: 'https://placehold.co/600x400', noteCount: 1, quizCount: 0 },
];

export const notes: Note[] = [
  {
    id: 'math-1',
    subject: 'math',
    title: 'Introduction to Algebra',
    content: `
      <h2>What is Algebra?</h2>
      <p>Algebra is a branch of mathematics that deals with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables.</p>
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Variables:</strong> Symbols that represent numbers.</li>
        <li><strong>Constants:</strong> Numbers with fixed values.</li>
        <li><strong>Expressions:</strong> Combinations of variables, constants, and operators.</li>
        <li><strong>Equations:</strong> Statements that two expressions are equal.</li>
      </ul>
      <p>For example, in the equation <code>x + 5 = 10</code>, 'x' is a variable. The goal is to find the value of 'x' that makes the statement true.</p>
    `,
  },
    {
    id: 'math-2',
    subject: 'math',
    title: 'The Pythagorean Theorem',
    content: `
      <h2>The Pythagorean Theorem</h2>
      <p>In a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides.</p>
      <h3>The Formula</h3>
      <p>The theorem can be written as an equation relating the lengths of the sides a, b, and c, often called the "Pythagorean equation":</p>
      <p><code>a² + b² = c²</code></p>
      <p>where c represents the length of the hypotenuse and a and b the lengths of the triangle's other two sides.</p>
    `,
  },
  {
    id: 'history-1',
    subject: 'history',
    title: 'The Renaissance',
    content: `
      <h2>The Renaissance</h2>
      <p>The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. It was characterized by a surge of interest in Classical scholarship and values.</p>
      <h3>Major Developments</h3>
      <ul>
        <li><strong>Art:</strong> Artists like Leonardo da Vinci and Michelangelo created masterpieces.</li>
        <li><strong>Science:</strong> Advances in astronomy, anatomy, and other fields.</li>
        <li><strong>Literature:</strong> Writers like Shakespeare and Petrarch emerged.</li>
      </ul>
    `,
  },
  {
    id: 'science-1',
    subject: 'science',
    title: 'The Water Cycle',
    content: `
      <h2>The Water Cycle</h2>
      <p>The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth.</p>
      <h3>Stages of the Water Cycle</h3>
      <ol>
        <li><strong>Evaporation:</strong> Water turns from a liquid to a gas (water vapor).</li>
        <li><strong>Condensation:</strong> Water vapor in the air gets cold and changes back into liquid, forming clouds.</li>
        <li><strong>Precipitation:</strong> When so much water has condensed that the air cannot hold it anymore, the clouds get heavy and water falls back to the earth in the form of rain, hail, sleet or snow.</li>
        <li><strong>Collection:</strong> Water collects in rivers, lakes, oceans, or soaks into the ground.</li>
      </ol>
    `,
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'math-quiz-1',
    title: 'Basic Algebra Quiz',
    subject: 'math',
    questions: [
      { id: 'q1', text: 'What is the value of x in the equation x + 5 = 12?', options: ['5', '7', '10', '17'], correctAnswer: 1 },
      { id: 'q2', text: 'Simplify the expression: 3(x + 2)', options: ['3x + 2', 'x + 6', '3x + 6', '3x + 5'], correctAnswer: 2 },
      { id: 'q3', text: 'If a=3 and b=4, what is c in a² + b² = c²?', options: ['5', '6', '7', '25'], correctAnswer: 0 },
    ],
  },
  {
    id: 'history-quiz-1',
    title: 'Renaissance History Quiz',
    subject: 'history',
    questions: [
      { id: 'q1', text: 'Which artist painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correctAnswer: 2 },
      { id: 'q2', text: 'The Renaissance began in which country?', options: ['France', 'Spain', 'England', 'Italy'], correctAnswer: 3 },
    ],
  },
];

export const userProfile = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    role: 'Student',
    quizHistory: [
        { id: 'h1', quizId: 'math-quiz-1', quizTitle: 'Basic Algebra Quiz', subject: 'math', score: 66, date: '2023-10-26' },
        { id: 'h2', quizId: 'history-quiz-1', quizTitle: 'Renaissance History Quiz', subject: 'history', score: 100, date: '2023-10-25' },
    ]
}
