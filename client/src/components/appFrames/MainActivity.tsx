import React, { ReactNode, useEffect } from 'react';
import { fetchCompany } from '../../services/companyServices';
import useAccountStore from '../../store/useAccountStore';
import useCompanyStore from '../../store/useCompanyStore';
import useAssetsStore from '../../store/useAssetsStore';
import useLeadsStore from '../../store/useLeadsStore';
import { getMyAssets } from '../../services/assetServices';
import { getMyLeads } from '../../services/leadServices';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { getAgents } from '../../services/agentsServices';
import { getDeals } from '../../services/dealsServices';
import { fetchClientsByCompanyId } from '../../services/clientsServices';

interface MainActivityProps {
  children: ReactNode;
}

/**
 *  This component serves as the root of the app features
 *  after the user authentication
 */
const MainActivity: React.FC<MainActivityProps> = ({ children }) => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const setAssets = useAssetsStore((state) => state.setAssets);
  const setLeads = useLeadsStore((state) => state.setLeads);
  const { setCompany, setLocation, setAgents, setDeals, setClients } = useCompanyStore();
  const navigate = useNavigate();
  // -----

  /**
   * This useEffect hook will fetch all necessary data once after the component mounts.
   * It ensures the account state is available before making any API calls.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;

      try {
        // Handle Account data
        const fetchCompanyResult = await fetchCompany(account.companyId, account.token);
        setCompany(fetchCompanyResult.company);
        setLocation(fetchCompanyResult.location);

        // Handle Agent Account data
        const fetchedAgents = await getAgents(account.companyId, account._id, account.token);
        setAgents(fetchedAgents);

        // Handle Assets data
        const fetchedAssets = await getMyAssets(account.companyId, account.token);
        setAssets(fetchedAssets);

        // Handle Leads data
        const fetchedLeads = await getMyLeads(account.companyId, account.token);
        setLeads(fetchedLeads);

        // Handle Deals data
        const fetchedDeals = await getDeals(account.companyId, account.token);
        setDeals(fetchedDeals);

        // Handle Clients Data
        const fetchedClients = await fetchClientsByCompanyId(account.companyId, account.token);
        setClients(fetchedClients);

        // Navigate to dashboard
        navigate('/dashboard');
      } catch (error) {
        // Check unauthorized action
        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            localStorage.removeItem('loggedInAccount');
            removeAccount();
            navigate('/');
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className='col-lg-10'>
      <div className='main-container'>{children}</div>
    </div>
  );
};

export default MainActivity;
