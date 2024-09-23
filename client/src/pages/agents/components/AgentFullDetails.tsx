import useAccountStore from '../../../store/useAccountStore';
import { Agent } from '../../../models/account';
import avatar from '../../../assets/avatar.png';
import { LuPhone } from 'react-icons/lu';
import { MdAlternateEmail } from 'react-icons/md';
import { RxAllSides, RxPerson, RxBackpack } from 'react-icons/rx';
import { FaLock, FaLockOpen } from 'react-icons/fa6';
import { updateLockStatus } from '../../../services/agentsServices';
import { toast } from 'react-toastify';
import useCompanyStore from '../../../store/useCompanyStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import AgentProfitChart from './AgentProfitChart';
import { isAxiosError } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';
import useLeadsStore from '../../../store/useLeadsStore';
import useAssetsStore from '../../../store/useAssetsStore';

interface Props {
  agent: Agent;
}

/**
 * This component displays an Agent data and profit performance.
 */
const AgentFullDetails = ({ agent }: Props) => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { removeSelectedAgent, clearSelectedData } = useSelectedDataStore();
  const { updateAgentLock, clearCompany } = useCompanyStore();
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const navigate = useNavigate();
  // -----

  const calculateYearsAtCompany = (startDate: Date): number => {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - new Date(startDate).getTime();
    const yearsDifference = timeDifference / (1000 * 60 * 60 * 24 * 365.25); // 365.25 accounts for leap years
    return parseFloat(yearsDifference.toFixed(1));
  };

  const lockPressHandler = async () => {
    if (!account) {
      return;
    }

    try {
      const resultMessage = await updateLockStatus(agent._id, !agent.isLocked, account.token);
      toast.success(`${agent.firstName} ${agent.lastName} is now ${resultMessage}`);
      updateAgentLock(agent._id, !agent.isLocked);
      removeSelectedAgent();
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear all global states
          removeAccount();
          clearAssets();
          clearCompany();
          clearLeads();
          clearSelectedData();
          // Remove account data from locals storage
          localStorage.removeItem('loggedInAccount');
          navigate('/');
        }
        toast.warning('Something went wrong while attempting to update lock status');
      }
    }
  };

  return (
    <>
      <div className='col-md-4 agentFDContainer'>
        <h1 className='page-title'>Agent details:</h1>
        <div className='agentFDImageContainer'>
          <img src={agent.avatar ? agent.avatar : avatar} className='agentFDImage' alt='' />
        </div>
        <div className='agentFDDetailsContainer'>
          <p className='agentFDText'>
            <RxPerson /> {agent.firstName} {agent.lastName}
          </p>
          <p>
            <MdAlternateEmail /> {agent.email}
          </p>
          <p>
            <LuPhone /> {agent.phone}
          </p>
          <p>
            <RxAllSides /> {agent.position}
          </p>
          <p>
            <RxBackpack /> Seniority: {calculateYearsAtCompany(agent.createdAt)} years
          </p>
        </div>
        <div>
          {account?.role === 'Admin' ? (
            <button onClick={lockPressHandler} type='button' className='btn btn-success submitBtn lockBtn'>
              {!agent.isLocked ? <FaLock /> : <FaLockOpen />} {!agent.isLocked ? 'Lock Agent' : 'Unlock Agent'}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='col-md-8'>
        {account?.role === 'Admin' ? (
          <>
            <h1 className='page-title'>Stats:</h1>
            <div className='dashboardWidgetInner' style={{ height: 'fit-content' }}>
              <AgentProfitChart agentId={agent._id} firstName={agent.firstName} />
            </div>{' '}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AgentFullDetails;
