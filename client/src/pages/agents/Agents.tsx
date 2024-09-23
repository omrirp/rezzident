import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NewAgentForm from './components/NewAgentForm';
import AgentList from './components/AgentList';
import useAccountStore from '../../store/useAccountStore';
import useSelectedDataStore from '../../store/useSelectedDataStore';

const Agents = () => {
  // ----- Global states -----
  const location = useLocation();
  const navigate = useNavigate();
  const account = useAccountStore((state) => state.account);
  const removeSelectedAgent = useSelectedDataStore((state) => state.removeSelectedAgent);
  // -----

  /**
   * This function render a component according to the received string
   * @returns TSX
   */
  const render = () => {
    switch (location.pathname) {
      case '/agents/agentslist': {
        return <AgentList />;
      }
      case '/agents/newagent': {
        return <NewAgentForm />;
      }
      default: {
        return <AgentList />;
      }
    }
  };

  return (
    <div>
      <div className='pageHeaderContainer'>
        <h1 className='page-title'>Agents:</h1>
        <button
          className='btn btn-link'
          onClick={() => {
            removeSelectedAgent();
            navigate('agentslist');
          }}
        >
          Agent List
        </button>
        {account?.role === 'Admin' ? (
          <button className='btn btn-link' onClick={() => navigate('newagent')}>
            New Agent
          </button>
        ) : (
          <></>
        )}
      </div>
      {render()}
    </div>
  );
};

export default Agents;
