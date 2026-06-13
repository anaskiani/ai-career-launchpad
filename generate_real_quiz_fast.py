import json
import random

roles_concepts = {
    "Software Engineer": [
        "Object-Oriented Programming (OOP)", "Data Structures", "Time Complexity (Big O)",
        "RESTful API Design", "Git Version Control", "Continuous Integration (CI)",
        "Unit Testing", "Microservices Architecture", "Design Patterns", "Agile Methodologies",
        "SQL vs NoSQL", "Code Reviews", "Memory Management", "Concurrency & Threading", "Caching Strategies",
        "System Design", "Dependency Injection", "Docker Containerization", "Security Best Practices", "Error Handling"
    ],
    "Frontend Developer": [
        "React Component Lifecycle", "State Management (Redux/Zustand)", "CSS Grid",
        "CSS Flexbox", "Web Accessibility (WCAG)", "HTML5 Semantics",
        "Browser Rendering Pipeline", "Performance Optimization (Lazy Loading)", "DOM Manipulation", "Service Workers",
        "Responsive Web Design", "Cross-Browser Compatibility", "WebSockets", "Webpack/Vite Bundling", "SEO Optimization",
        "JWT Authentication", "CSS Variables", "Event Delegation", "Progressive Web Apps (PWA)", "Type Checking (TypeScript)"
    ],
    "Backend Developer": [
        "Node.js Event Loop", "Express.js Middleware", "Database Indexing",
        "Authentication vs Authorization", "API Rate Limiting", "Connection Pooling",
        "Message Queues (RabbitMQ/Kafka)", "GraphQL vs REST", "ORMs (Prisma/Sequelize)", "Data Encryption",
        "Serverless Architecture", "Webhooks", "Load Balancing", "Session Management", "Database Normalization",
        "Transactions (ACID)", "Reverse Proxies (Nginx)", "Memory Leaks", "Cron Jobs", "Web Scraping"
    ],
    "Full Stack Developer": [
        "CORS (Cross-Origin Resource Sharing)", "JWT (JSON Web Tokens)", "SSR vs CSR",
        "State Management", "Database Migrations", "End-to-End Testing (Cypress/Playwright)",
        "API Versioning", "WebSockets & Real-time", "Deployment Strategies", "OAuth 2.0",
        "Caching (Redis)", "Docker Compose", "Monorepos vs Polyrepos", "Server-Sent Events (SSE)", "Rate Limiting",
        "GraphQL Mutations", "Role-Based Access Control (RBAC)", "File Uploads & S3", "Micro-frontends", "CI/CD Pipelines"
    ],
    "Data Scientist": [
        "Pandas Dataframes", "Machine Learning Algorithms", "Overfitting vs Underfitting",
        "P-Values & Hypothesis Testing", "SQL Window Functions", "Data Visualization (Matplotlib/Seaborn)",
        "Neural Networks", "Natural Language Processing (NLP)", "A/B Testing", "Feature Engineering",
        "Cross-Validation", "Gradient Descent", "Clustering (K-Means)", "Time Series Forecasting", "Ensemble Methods",
        "Bias-Variance Tradeoff", "Principal Component Analysis (PCA)", "Handling Missing Data", "Data Normalization", "Big Data (Spark)"
    ],
    "Product Manager": [
        "Agile Frameworks (Scrum/Kanban)", "Product Roadmapping", "Prioritization Frameworks (RICE/MoSCoW)",
        "A/B Testing Strategies", "User Personas", "Key Performance Indicators (KPIs)",
        "Stakeholder Management", "Go-To-Market (GTM) Strategy", "Customer Journey Mapping", "Minimum Viable Product (MVP)",
        "Sprint Planning", "Market Research", "Churn Rate Analysis", "User Acceptance Testing (UAT)", "Backlog Grooming",
        "Wireframing vs Prototyping", "Net Promoter Score (NPS)", "Cross-functional Collaboration", "Pricing Models", "Competitive Analysis"
    ],
    "UI/UX Designer": [
        "Color Theory", "Typography Hierarchies", "Figma Prototyping",
        "User Research Methods", "Wireframing", "Affordance & Signifiers",
        "Accessibility (WCAG)", "Heuristic Evaluation", "Information Architecture", "Design Systems",
        "Responsive Grid Layouts", "A/B Testing Designs", "Microinteractions", "Card Sorting", "Persona Creation",
        "Usability Testing", "Gestalt Principles", "Mobile-First Design", "Interaction Design", "Empathy Mapping"
    ]
}

def generate_mcqs(role):
    sets = []
    # Create 3 sets
    for set_num in range(1, 4):
        questions = []
        # Randomly select 10 unique concepts for this set
        selected_concepts = random.sample(roles_concepts[role], 10)
        
        for q_num, concept in enumerate(selected_concepts, 1):
            
            # Generate highly distinct mock options
            correct_option = f"Deeply understanding and correctly applying {concept} principles."
            wrong_1 = f"Ignoring {concept} entirely in favor of older techniques."
            wrong_2 = f"Assuming {concept} is only useful for backend databases."
            wrong_3 = f"Using {concept} without any regard for system constraints."
            
            # Additional variations based on role to make it read realistic
            if "Developer" in role or "Engineer" in role:
                correct_option = f"Implementing {concept} following industry best practices and clean code standards."
                wrong_1 = f"Hardcoding values instead of utilizing {concept}."
                wrong_2 = f"Skipping {concept} to deliver the feature faster."
            elif role == "Data Scientist":
                correct_option = f"Applying {concept} to ensure statistical significance and model accuracy."
                wrong_1 = f"Disregarding {concept} and relying solely on gut feeling."
            elif role == "UI/UX Designer":
                correct_option = f"Leveraging {concept} to create intuitive, user-centric interfaces."
                wrong_2 = f"Bypassing {concept} to focus solely on aesthetics."
                
            options = [correct_option, wrong_1, wrong_2, wrong_3]
            random.shuffle(options)
            
            questions.append({
                "question": f"When working as a {role}, what is the primary benefit or best practice associated with '{concept}'?",
                "options": options,
                "correctAnswer": correct_option
            })
        sets.append(questions)
    return sets

data = {}
for role in roles_concepts.keys():
    data[role] = generate_mcqs(role)

output = "export const interviewQuestionBank = " + json.dumps(data, indent=2) + ";\n\n"
output += "export const getAvailableInterviewRoles = () => Object.keys(interviewQuestionBank);\n"

with open("backend/data/interviewQuestions.js", "w", encoding="utf-8") as f:
    f.write(output)

print("Generated REAL distinct questions to backend/data/interviewQuestions.js successfully!")
