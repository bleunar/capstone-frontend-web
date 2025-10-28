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
import ManagerController from './components/controller/ManagerController.jsx';
import ActivitiesPage from './pages/ActivitiesPage.jsx';
import PageProtector from './components/general/PageProtector.jsx';
import AccountsManagement from './components/manager/Manage_Accounts.jsx';
import AccountRolesManagement from './components/manager/Manage_AccountRoles.jsx';
import History_Accounts from './components/manager/History_Accounts.jsx';
import OverviewAccounts from './components/visualizer/overview/Overview_Accounts.jsx';
import LocationsManagement from './components/manager/Manage_Locations.jsx';
import LandingPage from './pages/Landing.jsx';

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
            <LandingPage />
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
          <Route path="activities" element={<PageProtector component={<ActivitiesPage />} required_access_level={[0, 1, 2]} />} />
          <Route path="manage" element={<PageProtector component={<ManagerController />} required_access_level={[0, 1, 2]} />} />

          <Route
            path="manage/accounts"
            element={
              <PageProtector
                component={<AccountsManagement />}
                required_access_level={[0, 1, 2]} />} />

          <Route
            path="manage/accounts/roles"
            element={
              <PageProtector
                component={<AccountRolesManagement />}
                required_access_level={[0]} />} />

          <Route
            path="manage/accounts/activities"
            element={<PageProtector
              component={<History_Accounts />}
              required_access_level={[0, 1, 2]} />} />

          <Route
            path="manage/accounts/overview"
            element={<PageProtector
              component={<OverviewAccounts />}
              required_access_level={[0, 1, 2]} />} />

          <Route
            path="manage/lab/"
            element={<PageProtector
              component={<LocationsManagement />}
              required_access_level={[0, 1, 2]} />} />


          <Route
            path="manage/lab/equipments"
            element={<PageProtector
              component={<LabManagement />}
              required_access_level={[0, 1, 2]} />} />


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