import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  </div>
);
