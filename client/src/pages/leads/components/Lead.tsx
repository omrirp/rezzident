import { Lead as ILead } from '../../../models/lead';
import { FaFireAlt, FaPhone } from 'react-icons/fa';
import { MdAlternateEmail } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { IoIosStar } from 'react-icons/io';
import useAccountStore from '../../../store/useAccountStore';
import { Account } from '../../../models/account';

interface Props {
  lead: ILead;
  index: number;
}

const Lead = ({ lead, index }: Props) => {
  // ----- Global state -----
  const account = useAccountStore((state) => state.account) as Account;
  // -----

  return (
    <div className='row leadDetailsContainer'>
      <div className='col-md-1 col-lg-1'>#{index + 1}</div>
      <div className='col-md-6 col-lg-2'>
        <IoMdPerson /> {lead.firstName} {lead.lastName}
      </div>

      <div className='col-md-5 col-lg-2'>
        <FaPhone /> {lead.phone}
      </div>
      <div className='col-md-10 col-lg-4'>
        <MdAlternateEmail /> {lead.email}
      </div>
      <div className='col-md-2 col-lg-1'>
        <FaFireAlt color={lead.isHot ? '#ff1744' : '#ffffff'} />
      </div>
      <div className='col-md-2 col-lg-1'>
        <IoIosStar color={lead.agents.includes(account?._id) ? '#e1b635' : '#2f2d48'} />
      </div>
    </div>
  );
};

export default Lead;
