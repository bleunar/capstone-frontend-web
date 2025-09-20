import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import LoginPage from './pages/LoginPage.jsx'
import RecoveryPage from './pages/RecoveryPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ErrorPage from './pages/Error.jsx'
import ComponentProtector from './components/general/ComponentProtector.jsx';
import NavigationBarOffcanvas from './components/general/NavigationBarOffCanvas.jsx';
import LoadingPage from './components/general/LoadingPage.jsx';
import AccountRolesManagement from './components/forms_manager/Manage_AccountRoles.jsx';
import AccountsManagement from './components/forms_manager/Manage_Accounts.jsx';
import History_Accounts from './components/forms_manager/History_Accounts.jsx';
import LocationsManagement from './components/forms_manager/Manage_Locations.jsx';
import OverviewAccounts from './components/overview/Overview_Accounts.jsx';
import ManageEntityPage from './pages/ManageEntityPage.jsx';
import ManagerController from './components/general/ManagerController.jsx';

function App() {
  const { authenticated, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingPage />
  }

  return (
    <>
      {
        authenticated ? (
          <>
            {
              <NavigationBarOffcanvas />
            }
            <div style={{ height: "8vh" }} className='w-100'></div>
          </>
        ) : ""
      }



      <Routes>
        <Route path="/"
          element={
            <LoginPage />
          }
        />

        <Route path="/recovery"
          element={
            <RecoveryPage />
          }
        />

        <Route path="/dashboard"
          element={
            <Dashboard />
          }
        />

        <Route path="/profile"
          element={
            <ProfilePage />
          }
        />

        <Route path="/settings"
          element={
            <SettingsPage />
          }
        />

        <Route path="/dashboard/manage"
          element={
            <ManagerController showReturnButton />
          }
        />



        <Route path="/dashboard/manage/accounts"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <AccountsManagement />
              }
            />
          }
        />

        <Route path="/dashboard/manage/accounts/overview"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <OverviewAccounts />
              }
            />
          }
        />

        <Route path="/dashboard/manage/accounts/role"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <AccountRolesManagement />
              }
            />
          }
        />


        <Route path="/dashboard/manage/accounts/history"
          element={
            <ComponentProtector
              required_access_level={[0,1]}
              component={
                <History_Accounts />
              }
            />
          }
        />





        <Route path="/dashboard/manage/lab"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <LocationsManagement />
              }
            />
          }
        />

        <Route path="/dashboard/manage/lab/overview"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <>
                  Lab overview
                </>
              }
            />
          }
        />

        <Route path="/dashboard/manage/lab/equipments"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <>
                  Equipment Management
                </>
              }
            />
          }
        />

        <Route path="/dashboard/manage/lab/equipments/history"
          element={
            <ComponentProtector
              required_access_level={[0, 1]}
              component={
                <>
                  Equipment History
                </>
              }
            />
          }
        />



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