import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { NotificationContainer } from './NotificationToast';

const Layout = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Fixed Navbar - fetches its own categories from /api/Categories/navbar */}
      <Navbar />
      
      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Fixed Footer */}
      <Footer />
      
      {/* Notification System */}
      <NotificationContainer />
    </div>
  );
};

export default Layout;
