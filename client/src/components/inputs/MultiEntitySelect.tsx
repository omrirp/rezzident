import React from 'react';
import Select from 'react-select';
import { Client } from '../../models/client';
import { Agent } from '../../models/account';
import { Lead } from '../../models/lead';

// Generic type for the props, allowing the component to be flexible
interface Props<T extends Client | Agent | Lead> {
  items: T[]; // The generic list of items (could be leads, clients, or agents)
  selectedItems: T['_id'][]; // The generic selected item IDs
  placeholder: string;
  setSelectedItems: React.Dispatch<React.SetStateAction<T['_id'][]>>; // The generic setter for selected item IDs
}

// Function to create options for react-select from a generic list of items
const createOptions = <T extends Client | Agent | Lead>(items: T[]) =>
  items.map((item) => ({
    value: item._id,
    label: `${item.firstName} ${item.lastName}`,
  }));

/**
 * Generic MultiSelect component for a dynamic list of items (leads, clients, or agents).
 */
const MultiEntitySelect = <T extends Client | Agent | Lead>({ items, selectedItems, placeholder, setSelectedItems }: Props<T>) => {
  const handleChange = (selectedOptions: any) => {
    setSelectedItems(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  return (
    <>
      <label htmlFor='multi-select' className='formLbl'>
        {placeholder}
      </label>
      <Select
        id='multi-select'
        options={createOptions(items)}
        value={createOptions(items).filter((option) => selectedItems.includes(option.value))}
        onChange={handleChange}
        classNamePrefix='select'
        placeholder={placeholder}
        isClearable
        isSearchable
        isMulti // Enable multi-selection
      />
    </>
  );
};

export default MultiEntitySelect;
