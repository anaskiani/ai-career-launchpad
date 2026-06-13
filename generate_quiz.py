import json

roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer"
]

def generate_mcqs(role):
    sets = []
    for set_num in range(1, 4):
        questions = []
        for q_num in range(1, 11):
            questions.append({
                "question": f"[{role} Set {set_num}] Which of the following is considered a best practice in this field? (Question {q_num})",
                "options": [
                    "Ignoring edge cases and focusing only on the happy path.",
                    "Writing clear documentation and maintaining clean code/designs.",
                    "Using the most complex solution to show technical depth.",
                    "Never asking for feedback from peers."
                ],
                "correctAnswer": "Writing clear documentation and maintaining clean code/designs."
            })
        sets.append(questions)
    return sets

data = {}
for role in roles:
    data[role] = generate_mcqs(role)

output = "export const interviewQuestionBank = " + json.dumps(data, indent=2) + ";\n\n"
output += "export const getAvailableInterviewRoles = () => Object.keys(interviewQuestionBank);\n"

with open("backend/data/interviewQuestions.js", "w", encoding="utf-8") as f:
    f.write(output)

print("Generated backend/data/interviewQuestions.js successfully!")
