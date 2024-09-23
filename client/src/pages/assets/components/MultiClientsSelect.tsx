import React from 'react';
import Select from 'react-select';
import { Client } from '../../../models/client';

interface Props {
  clients: Client[];
  selectedClients: Client['_id'][];
  setSelectedClients: React.Dispatch<React.SetStateAction<Client['_id'][]>>;
}

const clientOptions = (clients: Client[]) =>
  clients.map((client) => ({
    value: client._id,
    label: `${client.firstName} ${client.lastName}`,
  }));

/**
 * Select input from a dynamic list of clients.
 */
const MultiClientsSelect = ({ clients, selectedClients, setSelectedClients: setSelectedClients }: Props) => {
  const handleChange = (selectedOptions: any) => {
    setSelectedClients(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };
  return (
    <>
      <label htmlFor='clients' className='formLbl'>
        Clients:
      </label>
      <Select
        id='clients'
        options={clientOptions(clients)}
        value={clientOptions(clients).filter((option) => selectedClients.includes(option.value))}
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

export default MultiClientsSelect;
