import React from 'react';
import { CgAsterisk } from 'react-icons/cg';

interface Props {
  placeHolder?: string;
  value: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  type: string;
  id?: string;
  name?: string;
  mandatory?: boolean;
}

/**
 * Custom design input component
 */
const PrimaryInput = ({ placeHolder, value, setState, type, id, name, mandatory = false }: Props) => {
  return (
    <>
      <label htmlFor={id} className='formLbl'>
        {mandatory && <CgAsterisk color='#ec6378' />}
        {placeHolder + ':'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setState(e.target.value)}
        id={id}
        name={name}
        placeholder={placeHolder}
        className='form-control'
      />
    </>
  );
};

export default PrimaryInput;
