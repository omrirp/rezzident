import React from 'react';
import Select from 'react-select';
import { Lead } from '../../../models/lead';

interface Props {
  leads: Lead[];
  selectedLeads: Lead['_id'][]; // Array to hold multiple selected lead Ids
  setSelectedLeads: React.Dispatch<React.SetStateAction<Lead['_id'][]>>;
}

const leadOptions = (leads: Lead[]) =>
  leads.map((lead) => ({
    value: lead._id,
    label: `${lead.firstName} ${lead.lastName}`,
  }));

/**
 * Select input from a dynamic list of leads.
 */
const MultiLeadsSelect = ({ leads, selectedLeads, setSelectedLeads }: Props) => {
  const handleChange = (selectedOptions: any) => {
    setSelectedLeads(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  return (
    <>
      <label htmlFor='leads' className='formLbl'>
        Leads:
      </label>
      <Select
        id='leads'
        options={leadOptions(leads)}
        value={leadOptions(leads).filter((option) => selectedLeads.includes(option.value))}
        onChange={handleChange}
        classNamePrefix='select'
        placeholder='Select leads...'
        isClearable
        isSearchable
        isMulti // Enable multi-selection
      />
    </>
  );
};

export default MultiLeadsSelect;
