import useCompanyStore from '../../../store/useCompanyStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import Client from './Client';
import ClientFullDetails from './ClientFullDetails';

/**
 * This component maps the clients to buttons that displays a full detail
 * form for modifications by click.
 */
const ClientList = () => {
  // ----- Global states -----
  const clients = useCompanyStore((state) => state.clients);
  const { selectedClient, setSelectedClient } = useSelectedDataStore();
  // -----
  return (
    <div className='row'>
      {!selectedClient ? (
        clients &&
        clients
          .sort((a, b) => {
            const fullNameA = `${a.firstName} ${a.lastName}`;
            const fullNameB = `${b.firstName} ${b.lastName}`;
            return fullNameA.localeCompare(fullNameB);
          })
          .map((client, index) => (
            <div className='col-12 leadsContainer' key={client._id}>
              <button onClick={() => setSelectedClient(client)} className='leadsBtn'>
                <Client client={client} index={index} />
              </button>
            </div>
          ))
      ) : (
        <ClientFullDetails client={selectedClient} />
      )}
    </div>
  );
};

export default ClientList;
