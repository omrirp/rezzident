import { Agent as IAgent } from '../../../models/account';
import avatar from '../../../assets/avatar.png';
import { LuPhone } from 'react-icons/lu';
import { MdAlternateEmail } from 'react-icons/md';
import { BsFillLightningFill } from 'react-icons/bs';
import { FaLock, FaLockOpen } from 'react-icons/fa6';

interface Props {
  agent: IAgent;
}

/**
 * Display an Agent details in a row.
 */
const Agent = ({ agent }: Props) => {
  return (
    <div className='row agentContainer'>
      <div className='col-md-3 agentImgContainer'>
        <img src={agent.avatar ? agent.avatar : avatar} className='agentImg' alt='' />
      </div>
      <div className='col-md-9 agentBody'>
        <p className='agentName'>
          {agent.firstName} {agent.lastName}
        </p>
        <p className='agentContactText'>
          <LuPhone /> {agent.phone}
        </p>
        <p className='agentContactText'>
          <MdAlternateEmail /> {agent.email}
        </p>
        <div className='row'>
          <div className='col-6'>
            <BsFillLightningFill size={20} color={agent.isActive ? '#e1b635' : '#b71c1c'} />
          </div>
          <div className='col-6'>{!agent.isLocked ? <FaLockOpen size={20} color='#2e7d32' /> : <FaLock size={20} color='#b71c1c' />}</div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
