
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AppLayout = () => {
  const location = useLocation();
  
  // List of public paths where header/footer should not appear
  const publicPaths = ['/', '/login', '/register'];
  
  // Check if current path is a public path
  const isPublicPath = publicPaths.includes(location.pathname);
  
  return (
    <div className="app-layout">
      {!isPublicPath && <Header />}
      <main className="main-content">
        <Outlet />
      </main>
      {!isPublicPath && <Footer />}
    </div>
  );
};

export default AppLayout;