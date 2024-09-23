import { Client as IClient } from '../../../models/client';
import { FaPhone } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';

interface Props {
  client: IClient;
  index: number;
}

/***
 * This component display a Client data in a row.
 */
const Client = ({ client, index }: Props) => {
  return (
    <div className='row'>
      <div className='col-2'>#{index + 1}</div>
      <div className='col-3'>
        <IoMdPerson /> {client.firstName} {client.lastName}
      </div>
      <div className='col-4'>
        <MdAlternateEmail /> {client.email}
      </div>
      <div className='col-3'>
        <FaPhone /> {client.phone}
      </div>
    </div>
  );
};

export default Client;
