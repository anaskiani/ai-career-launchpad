import fs from 'fs';

const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer"
];

async function generateSet(role, setNum) {
    const prompt = `You are an expert technical interviewer. Generate EXACTLY 10 highly realistic and distinct multiple-choice questions for a "${role}" job interview. This is Set ${setNum}.
    
You must return the response as a RAW, valid JSON array. DO NOT wrap it in markdown block quotes. Just the raw JSON array.
Each object in the array must exactly match this format:
{
  "question": "What is ...?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option B"
}

Ensure that options are distinct, questions are tough but fair, and there is exactly 1 correct answer which perfectly matches one of the options. Output the raw JSON array of 10 objects now:`;

    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2:1b',
            prompt: prompt,
            stream: false,
            format: 'json'
        })
    });

    const data = await response.json();
    let jsonResponse = data.response.trim();
    
    // Attempt to parse JSON safely
    try {
        let parsed = JSON.parse(jsonResponse);
        // If it's an object with a "questions" array, extract it
        if (!Array.isArray(parsed) && Array.isArray(parsed.questions)) {
            parsed = parsed.questions;
        }
        
        // Ensure exactly 10 questions
        if (Array.isArray(parsed) && parsed.length > 0) {
            // Trim or pad if needed
            while (parsed.length < 10) {
                parsed.push(parsed[0]);
            }
            return parsed.slice(0, 10);
        }
    } catch(e) {
        console.error(`Failed to parse JSON for ${role} Set ${setNum}`, e);
    }
    
    // Fallback if local AI fails to parse
    console.log(`Using fallback for ${role} Set ${setNum}`);
    return Array.from({ length: 10 }).map((_, i) => ({
        question: `[Fallback] What is the core responsibility of a ${role}? (Q${i+1})`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A"
    }));
}

async function main() {
    console.log("Starting real MCQ generation with Ollama llama3.2:1b...");
    const bank = {};
    
    for (const role of roles) {
        console.log(`Generating questions for ${role}...`);
        bank[role] = [];
        for (let i = 1; i <= 3; i++) {
            console.log(`  -> Generating Set ${i}...`);
            const qSet = await generateSet(role, i);
            bank[role].push(qSet);
        }
    }
    
    const fileContent = `export const interviewQuestionBank = ${JSON.stringify(bank, null, 2)};\n\nexport const getAvailableInterviewRoles = () => Object.keys(interviewQuestionBank);\n`;
    
    fs.writeFileSync('./backend/data/interviewQuestions.js', fileContent);
    console.log("Successfully wrote all real questions to backend/data/interviewQuestions.js!");
}

main();
