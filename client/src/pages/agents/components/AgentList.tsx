import useCompanyStore from '../../../store/useCompanyStore';
import Agent from './Agent';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import AgentFullDetails from './AgentFullDetails';
import useAccountStore from '../../../store/useAccountStore';

/**
 * This component maps the All the Agents except for the
 * logged in user to buttons that displays the agent
 * full details by click.
 */
const AgentList = () => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account);
  const agents = useCompanyStore((state) => state.agents);
  const { selectedAgent, setSelectedAgent } = useSelectedDataStore();
  // -----

  return (
    <div className='row wrapper'>
      {!selectedAgent ? (
        agents &&
        agents.map(
          (agent, index) =>
            agent._id !== account?._id && (
              <div className='col-md-4 col-sm-6 agentContainer' key={index}>
                <button onClick={() => setSelectedAgent(agent)} className='agentBtn'>
                  <Agent agent={agent} />
                </button>
              </div>
            )
        )
      ) : (
        <AgentFullDetails agent={selectedAgent} />
      )}
    </div>
  );
};

export default AgentList;
