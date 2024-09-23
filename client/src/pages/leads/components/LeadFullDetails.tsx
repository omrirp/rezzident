import { useState } from 'react';
import { Lead, LogMessage } from '../../../models/lead';
import { updateLead, addMEssageTOLog, deleteLead } from '../../../services/leadServices';
import { toast } from 'react-toastify';
import { isAxiosError } from '../../../utils/functions';
// ----- Components -----
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import LogMessageItem from './LogMessageItem';
import Modal from '../../../components/Modal';
import MultiEntitySelect from '../../../components/inputs/MultiEntitySelect';

// ----- Icons -----
import { FaFireAlt } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';
import { PiBroom } from 'react-icons/pi';
import { HiOutlineDocumentAdd } from 'react-icons/hi';

// ----- Global states -----
import useAccountStore from '../../../store/useAccountStore';
import { useNavigate } from 'react-router-dom';
import useLeadsStore from '../../../store/useLeadsStore';
import useAssetsStore from '../../../store/useAssetsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import useCompanyStore from '../../../store/useCompanyStore';
import { Agent } from '../../../models/account';

interface Props {
  lead: Lead;
}

const LeadFullDetails = ({ lead }: Props) => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const { clearCompany, company, agents } = useCompanyStore();
  const { removeSelectedLead, clearSelectedData } = useSelectedDataStore();
  const { modifyLead, removeLead, clearLeads } = useLeadsStore();
  const navigate = useNavigate();
  // -----
  console.log(lead);

  // ----- Local states -----
  const [firstName, setFirstName] = useState<string>(lead.firstName || '');
  const [lastName, setLastName] = useState<string>(lead.lastName || '');
  const [phone, setPhone] = useState<string>(lead.phone || '');
  const [email, setEmail] = useState<string>(lead.email || '');
  const [isHot, setIsHot] = useState<boolean>(lead.isHot || false);
  const [log, setLog] = useState<LogMessage[]>(lead.log || []);
  const [selectedAgents, setSelectedAgents] = useState<Agent['_id'][]>(lead.agents || []);

  const [logMessage, setLogMessage] = useState<string>('');
  // -----

  const submitUpdateHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account || !company) {
      return;
    }

    const leadToUpdate: Omit<Lead, 'createdAt' | 'updatedAt'> = {
      _id: lead._id,
      companyId: company._id,
      firstName,
      lastName,
      phone,
      email,
      isHot,
      agents: selectedAgents,
      log,
    };

    try {
      // Update lead in the DB
      const updatedLead = await updateLead(leadToUpdate, account.token);

      // Update global memory
      modifyLead(updatedLead);

      toast.success('Lead Updated successfully!');
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
      } else {
        toast.warning('Something went wrong while attempting to update lead');
      }
    }
  };

  const addToLogHandler = async () => {
    if (!account) {
      return;
    }

    try {
      // Updated lead in the DB
      const updatedLead = await addMEssageTOLog(lead._id, logMessage, account.token);

      // Update global memory
      setLogMessage('');
      modifyLead(updatedLead);
      setLog(updatedLead.log);
      toast.success('Message added!');
    } catch (error) {
      toast.warning('Something went wrong while attempting to add a massage to log');
    }
  };

  const removeLeadHandler = async () => {
    if (!account) {
      return;
    }

    try {
      // Handle delete the lead from DB
      const deletedLeadId = await deleteLead(lead._id, account.token);

      // Handle remove selected lead to prevent rerendering
      removeSelectedLead();

      // Handle remove the lead from the global state
      removeLead(deletedLeadId);

      toast.success('Lead deleted');
    } catch (error) {
      toast.warning('Something went wrong while attempting to delete a lead');
    }
  };

  const clearAllFieldsHandler = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setIsHot(false);
  };

  return (
    <div className='container-fluid wrapper'>
      <Modal
        header={`Remove ${lead.firstName} ${lead.lastName}`}
        body={`You are about to remove ${lead.firstName} ${lead.lastName} permanently. do you like to proceed?`}
        onYesCLick={removeLeadHandler}
        id='removeLeadModal'
      />
      <form action='' id='newLeadForm' className='' onSubmit={submitUpdateHandler}>
        <div className='row'>
          <div className='col-md-3'>
            <h1 className='page-title'>Lead Details:</h1>
          </div>
          <div className='col-md-9 topRightBtns'>
            <button onClick={removeSelectedLead} className='btn btn-link' type='button'>
              <IoArrowBack /> back
            </button>
            <button onClick={clearAllFieldsHandler} className='btn btn-link' type='button'>
              <PiBroom /> clear all fields
            </button>
            <button className='btn btn-link' type='button' data-bs-toggle='modal' data-bs-target='#removeLeadModal'>
              <FaRegTrashAlt /> remove lead
            </button>
          </div>
          <div className='col-md-10'>
            <div className='row'>
              <div className='col-md-10'>
                <MultiEntitySelect<Agent>
                  items={agents}
                  selectedItems={selectedAgents}
                  placeholder='Select Agents'
                  setSelectedItems={setSelectedAgents}
                />
              </div>
              <div className='col-md-2'>
                <label className='formLbl'>Hot Lead:</label>
                <button
                  type='button'
                  className='btn btn-success radioBtn'
                  style={{ backgroundColor: isHot ? '#00897b' : '#ec6378' }}
                  onClick={() => setIsHot((prevIsExclusive) => !prevIsExclusive)}
                >
                  Hot Lead <FaFireAlt />
                </button>
              </div>
              <div className='col-md-3'>
                <PrimaryInput
                  value={firstName}
                  setState={setFirstName}
                  placeHolder='First Name'
                  type='text'
                  id='firstName'
                  name='First Name'
                  mandatory
                />
              </div>
              <div className='col-md-3'>
                <PrimaryInput
                  value={lastName}
                  setState={setLastName}
                  placeHolder='Last Name'
                  type='text'
                  id='lastName'
                  name='Last Name'
                  mandatory
                />
              </div>
              <div className='col-md-3'>
                <PrimaryInput
                  value={phone}
                  setState={setPhone}
                  placeHolder='Phone Number'
                  type='tel'
                  id='phoneNumber'
                  name='Phone Number'
                  mandatory
                />
              </div>
              <div className='col-md-3'>
                <PrimaryInput value={email} setState={setEmail} placeHolder='Email' type='email' id='email' name='Email' />
              </div>
            </div>
          </div>

          <div className='col-md-2'>
            <div className='row' style={{ height: '100%' }}>
              <div className='col-md-12 addToLogBtnContainer' style={{ display: 'flex', alignItems: 'center' }}>
                <button className='btn btn-success addToLogBtn' type='submit'>
                  Submit Changes
                </button>
              </div>
            </div>
          </div>

          <h1 className='page-title'>Log:</h1>
          <div className='col-lg-8'>
            <label htmlFor='logMessage' className='formLbl'>
              New Log Message:
            </label>
            <textarea
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
              id='logMessage'
              name='log Message'
              className='form-control'
            ></textarea>
          </div>
          <div className='col-lg-4 addToLogBtnContainer'>
            <button className='btn btn-success addToLogBtn' onClick={addToLogHandler} type='button'>
              Add to Log <HiOutlineDocumentAdd />
            </button>
          </div>
          {log && log.map((logMsg) => <LogMessageItem key={logMsg._id} logMessage={logMsg} />)}
        </div>
      </form>
    </div>
  );
};

export default LeadFullDetails;
