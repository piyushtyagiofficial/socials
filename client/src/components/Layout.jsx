import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
      <MobileMenu />
    </div>
  );
};

export default Layout;