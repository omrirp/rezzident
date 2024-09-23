import React from 'react';
import Select from 'react-select';
import { Agent } from '../../../models/account';

interface Props {
  agents: Agent[];
  selectedAgents: Agent['_id'][]; // Array to hold multiple selected agent IDs
  setSelectedAgents: React.Dispatch<React.SetStateAction<Agent['_id'][]>>;
}

// Convert agents to options format required by react-select
const agentOptions = (agents: Agent[]) =>
  agents.map((agent) => ({
    value: agent._id,
    label: `${agent.firstName} ${agent.lastName}`,
  }));

  /**
 * Select input from a dynamic list of agents.
 */
const MultiAgentsSelect = ({ agents, selectedAgents, setSelectedAgents }: Props) => {
  const handleChange = (selectedOptions: any) => {
    setSelectedAgents(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  return (
    <>
      <label htmlFor='agents' className='formLbl'>
        Agents:
      </label>
      <Select
        id='agents'
        options={agentOptions(agents)}
        value={agentOptions(agents).filter((option) => selectedAgents.includes(option.value))}
        onChange={handleChange}
        classNamePrefix='select'
        placeholder='Select agents...'
        isClearable
        isSearchable
        isMulti // Enable multi-selection
      />
    </>
  );
};

export default MultiAgentsSelect;
