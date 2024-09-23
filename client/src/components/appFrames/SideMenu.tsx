import { RxDashboard, RxFile, RxCube, RxBackpack, RxPerson, RxRocket, RxMixerVertical, RxExit } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import useAccountStore from '../../store/useAccountStore';
import Modal from '../Modal';
import useAssetsStore from '../../store/useAssetsStore';
import useCompanyStore from '../../store/useCompanyStore';
import useLeadsStore from '../../store/useLeadsStore';
import useSelectedDataStore from '../../store/useSelectedDataStore';

/**
 * This component serves as a navigator between the app features
 */
const SideMenu = () => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const clearCompany = useCompanyStore((state) => state.clearCompany);
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  const navigate = useNavigate();

  // -----

  const logoutAction = async () => {
    // Clear all global states
    removeAccount();
    clearAssets();
    clearCompany();
    clearLeads();
    clearSelectedData();

    // Remove account data from locals storage
    localStorage.removeItem('loggedInAccount');

    navigate('/');
  };

  const menuItems = [
    { route: '/dashboard', title: 'Dashboard', icon: <RxDashboard color='#ffffff' size={22} /> },
    { route: '/assets/myassets', title: 'Assets', icon: <RxCube color='#ffffff' size={22} /> },
    { route: '/agents/agentslist', title: 'Agents', icon: <RxPerson color='#ffffff' size={22} /> },
    { route: '/leads/myleads', title: 'Leads', icon: <RxRocket color='#ffffff' size={22} /> },
    { route: '/clients/allclients', title: 'Clients', icon: <RxBackpack color='#ffffff' size={22} /> },
    // { route: '/files', title: 'Files', icon: <RxFile color='#ffffff' size={22} /> },
    { route: '/settings/personaldetails', title: 'Settings', icon: <RxMixerVertical color='#ffffff' size={22} /> },
  ];

  return (
    <div className='col-lg-2'>
      <Modal header='Log out' body='Are you sure you would like to log out?' onYesCLick={logoutAction} id='logOutModal' />
      <div className='side-container'>
        <div className='sideMenuHeader'>
          <img src={account?.avatar} className='avatar' alt='' />
        </div>
        <div className='sideMenuBody'>
          {menuItems.map((item) => (
            <Link key={item.route} className='sidemenu-link' to={item.route} onClick={clearSelectedData}>
              {item.icon} <span style={{ marginLeft: 10 }}>{item.title}</span>
            </Link>
          ))}
        </div>
        <div className='sideMenuFooter'>
          <Link data-bs-toggle='modal' data-bs-target='#logOutModal' className='sidemenu-link' to={'/'}>
            <RxExit color='#ffffff' size={22} /> <span style={{ marginLeft: 10 }}>Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
