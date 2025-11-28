// // types/study.ts

// export interface StudySet {
//   id: string;
//   topic: string;
//   emoji: string;

//   // 1. Notes Module (HTML content)
//   notes: {
//     title: string;
//     summary: string;
//     content: string; // This will contain the H1, H2, bold tags, lists etc.
//   };

//   // 2. Flashcards Module
//   flashcards: Array<{
//     id: string;
//     front: string;
//     back: string;
//     status: "unfamiliar" | "learning" | "familiar" | "mastered"; // Default: unfamiliar
//   }>;

//   // 3. Multiple Choice Module
//   quiz: Array<{
//     id: string;
//     question: string;
//     options: string[];
//     correctIndex: number;
//   }>;

//   // 4. Fill in the Blanks Module
//   fillInBlanks: Array<{
//     id: string;
//     sentence: string; // e.g. "Philosophy literally means 'the ______ of wisdom.'"
//     correctAnswer: string; // e.g. "love"
//   }>;

//   // 5. Written Test Module
//   writtenQuestions: Array<{
//     id: string;
//     question: string; // e.g. "From what ancient civilization..."
//     sampleAnswer: string; // For the user to compare against later
//   }>;
// }
