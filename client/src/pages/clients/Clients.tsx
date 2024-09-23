import { useLocation, useNavigate } from 'react-router-dom';
import ClientList from './components/ClientList';
import NewClientForm from './components/NewClientForm';
import useSelectedDataStore from '../../store/useSelectedDataStore';

const Clients = () => {
  // ----- Global states -----
  const navigate = useNavigate();
  const location = useLocation();
  const removeSelectedClient = useSelectedDataStore((state) => state.removeSelectedClient);
  // -----

  /**
   * This function render a component according to the location
   * @returns TSX
   */
  const render = () => {
    switch (location.pathname) {
      case '/clients/allclients': {
        return <ClientList />;
      }
      case '/clients/addclient': {
        return <NewClientForm />;
      }
      default:
        return <ClientList />;
    }
  };

  return (
    <div>
      <div className='pageHeaderContainer'>
        <h1 className='page-title'>Clients:</h1>
        <button
          className='btn btn-link'
          onClick={() => {
            removeSelectedClient();
            navigate('allclients');
          }}
        >
          All Clients
        </button>
        <button className='btn btn-link' onClick={() => navigate('addclient')}>
          Add Client
        </button>
      </div>
      {render()}
    </div>
  );
};

export default Clients;
