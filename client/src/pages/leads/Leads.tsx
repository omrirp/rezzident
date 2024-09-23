import { useLocation, useNavigate } from 'react-router-dom';
import LeadsContainer from './components/LeadsContainer';
import AddLeadForm from './components/AddLeadForm';
import useSelectedDataStore from '../../store/useSelectedDataStore';

/**
 * This component is the root of all Assets related components
 */
const Leads = () => {
  // ----- Global states -----
  const removeSelectedLead = useSelectedDataStore((state) => state.removeSelectedLead);
  const location = useLocation();
  const navigate = useNavigate();
  // -----

  /**
   * This function render a component according to the received string
   * @returns TSX
   */
  const render = () => {
    switch (location.pathname) {
      case '/leads/myleads': {
        return <LeadsContainer />;
      }
      case '/leads/addlead': {
        return <AddLeadForm />;
      }
      default:
        return <LeadsContainer />;
    }
  };

  return (
    <div>
      <div className='pageHeaderContainer'>
        <h1 className='page-title'>Leeds:</h1>
        <button
          className='btn btn-link'
          onClick={() => {
            removeSelectedLead();
            navigate('myleads');
          }}
        >
          My Leeds
        </button>
        <button
          className='btn btn-link'
          onClick={() => {
            removeSelectedLead();
            navigate('addlead');
          }}
        >
          Add Leed
        </button>
      </div>
      {render()}
    </div>
  );
};

export default Leads;
