import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ErrorPage from './pages/Error.jsx'
import RequireAuth from './components/general/RequireAuth.jsx';
import LoadingPage from './components/general/LoadingPage.jsx';
import { LayoutController } from './components/controller/LayoutController.jsx';
import { DashboardController } from './components/controller/DashboardController.jsx';
import LabManagement from './components/manager/Manage_Laboratory.jsx';

function App() {
  const { initialized } = useAuth();

  if (!initialized) {
    return <LoadingPage />
  }

  return (
    <>
      <Routes>
        <Route path="/"
          element={
            <LoginPage />
          }
        />

        <Route path="/dashboard"
          element={
            <RequireAuth>
              <LayoutController />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardController />} />
          <Route path="labs" element={<LabManagement />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={
            <ErrorPage
              title="Page not Found"
              description="The page you are looking for does not exist"
            />
          } />
        </Route>




        <Route path="/unauthorized"
          element={
            <ErrorPage
              title="Unauthorized"
              description="The content you are looking for is not available"
            />
          }
        />

        <Route path="*"
          element={
            <ErrorPage
              title="Page not Found"
              description="The page you are looking for does not exist"
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;