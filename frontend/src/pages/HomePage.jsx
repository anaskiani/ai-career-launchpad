import { Link } from 'react-router-dom';
import { Navbar } from '../components/Common/Navbar';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">AI Career Launchpad</h1>
          <p className="text-xl mb-8">Accelerate your career with AI-powered tools</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn border border-white text-white hover:bg-white/10 px-8 py-3">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Smart Resume Builder', desc: 'Create professional resumes instantly' },
              { title: 'Skill Gap Analysis', desc: 'Identify skills you need to improve' },
              { title: 'Job Finder', desc: 'Discover perfect career opportunities' },
              { title: 'Skill Quiz', desc: 'Test your knowledge with timed multiple-choice questions.' },
              { title: 'Career Chatbot', desc: 'Get personalized career guidance' },
              { title: 'Dashboard', desc: 'Track your progress and achievements' }
            ].map((feature, i) => (
              <div key={i} className="card p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
