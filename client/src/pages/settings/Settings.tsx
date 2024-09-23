import { useLocation, useNavigate } from 'react-router-dom';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import CompanyForm from './components/CompanyForm';
import ChooseAPlanForm from './components/ChooseAPlanForm';
import useAccountStore from '../../store/useAccountStore';

const Settings = () => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account);
  const location = useLocation();
  const navigate = useNavigate();
  // -----

  /**
   * This function render a component according to the received string
   * @returns TSX
   */
  const render = () => {
    switch (location.pathname) {
      case '/settings/personaldetails': {
        return <PersonalDetailsForm />;
      }
      case '/settings/companydetails': {
        return <CompanyForm />;
      }
      case '/settings/chooseaplan': {
        return <ChooseAPlanForm />;
      }
      default: {
        return <PersonalDetailsForm />;
      }
    }
  };

  return (
    <div>
      <div className='pageHeaderContainer'>
        <h1 className='page-title'>Settings:</h1>
        <button className='btn btn-link' onClick={() => navigate('personaldetails')}>
          Personal Details
        </button>
        <button className='btn btn-link' onClick={() => navigate('companydetails')}>
          Company Details
        </button>
        {account && account.role === 'Admin' ? (
          <button className='btn btn-link' onClick={() => navigate('chooseaplan')}>
            Choose a Plan
          </button>
        ) : (
          <></>
        )}
      </div>
      {render()}
    </div>
  );
};

export default Settings;
