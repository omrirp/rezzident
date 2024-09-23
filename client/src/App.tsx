import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/appFrames/Header';
import SideMenu from './components/appFrames/SideMenu';
import MainActivity from './components/appFrames/MainActivity';
import { ToastContainer } from 'react-toastify';
import Agents from './pages/agents/Agents';
import Auth from './pages/authentication/Auth';
import Clients from './pages/clients/Clients';
import Dashboard from './pages/dashboard/Dashboard';
import Assets from './pages/assets/Assets';
import Files from './pages/files/Files';
import Leads from './pages/leads/Leads';
import Settings from './pages/settings/Settings';
import useAccountStore from './store/useAccountStore';
import AssetsContainer from './pages/assets/components/AssetsContainer';
import AddAssetForm from './pages/assets/components/AddAssetForm';
import LeadsContainer from './pages/leads/components/LeadsContainer';
import AddLeadForm from './pages/leads/components/AddLeadForm';
import PersonalDetailsForm from './pages/settings/components/PersonalDetailsForm';
import CompanyForm from './pages/settings/components/CompanyForm';
import ChooseAPlanForm from './pages/settings/components/ChooseAPlanForm';
import AgentList from './pages/agents/components/AgentList';
import NewAgentForm from './pages/agents/components/NewAgentForm';
import NewClientForm from './pages/clients/components/NewClientForm';
import ClientList from './pages/clients/components/ClientList';

const App = () => {
  // ----- Global states -----
  const { account, setAccount } = useAccountStore();
  // -----

  // Attempt to get the logged in account data from local storage
  useEffect(() => {
    const storedAccount = JSON.parse(localStorage.getItem('loggedInAccount') as string);
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  // Keep the logged in account data up to date
  useEffect(() => {
    localStorage.setItem('loggedInAccount', JSON.stringify(account));
  }, [account]); // Run whenever the account state changes

  return (
    <>
      <ToastContainer />
      <Router>
        {account ? (
          <div className='container-fluid'>
            <div className='row'>
              <Header />
            </div>
            <div className='row'>
              <SideMenu />
              <MainActivity>
                <Routes>
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route path='/clients' element={<Clients />}>
                    <Route path='addclient' element={<NewClientForm />} />
                    <Route path='allclients' element={<ClientList />} />
                  </Route>
                  {/* <Route path='/files' element={<Files />} /> */}
                  <Route path='/agents' element={<Agents />}>
                    <Route path='agentslist' element={<AgentList />} />
                    <Route path='newagent' element={<NewAgentForm />} />
                  </Route>
                  <Route path='assets' element={<Assets />}>
                    <Route path='myassets' element={<AssetsContainer />} />
                    <Route path='addasset' element={<AddAssetForm />} />
                  </Route>
                  <Route path='settings' element={<Settings />}>
                    <Route path='personaldetails' element={<PersonalDetailsForm />} />
                    <Route path='companydetails' element={<CompanyForm />} />
                    <Route path='chooseaplan' element={<ChooseAPlanForm />} />
                  </Route>
                  <Route path='leads' element={<Leads />}>
                    <Route path='myleads' element={<LeadsContainer />} />
                    <Route path='addlead' element={<AddLeadForm />} />
                  </Route>
                </Routes>
              </MainActivity>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path='/' element={<Auth />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
