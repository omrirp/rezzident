import React from 'react';
interface Props {
  placeHolder?: string;
  value: any;
  setState: React.Dispatch<any>;
  type: string;
  id?: string;
  name?: string;
}
const SecondaryInput = ({ placeHolder, value, setState, type, id, name }: Props) => {
  return (
    <input
      type={type}
      value={value}
      onChange={setState}
      id={id}
      name={name}
      placeholder={placeHolder}
      className='form-control form-control2'
    />
  );
};
export default SecondaryInput;
