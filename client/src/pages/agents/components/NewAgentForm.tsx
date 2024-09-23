import React, { useState } from 'react';
import useAccountStore from '../../../store/useAccountStore';
import { useNavigate } from 'react-router-dom';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import { Account } from '../../../models/account';
import useCompanyStore from '../../../store/useCompanyStore';
import { toast } from 'react-toastify';
import { createAgentAccount } from '../../../services/agentsServices';
import { isAxiosError } from '../../../utils/functions';
import useAssetsStore from '../../../store/useAssetsStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';

/**
 * This component holds a form for creating a new Agent.
 */
const NewAgentForm = () => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { company, agents, setAgents, clearCompany } = useCompanyStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  const navigate = useNavigate();
  // -----

  // ----- Local states -----
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  // -----

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!company) {
      toast.warning('Please submit your company details before adding any agents');
      return;
    }

    if (!account) {
      return;
    }

    if (password !== confirmedPassword) {
      toast.warning('Password mismatch');
    }

    try {
      const newAgentAccountData: Omit<Account, '_id' | 'isLocked' | 'avatar' | 'token' | 'createdAt' | 'plan'> = {
        email,
        firstName,
        lastName,
        phone,
        position,
        isActive,
        role: 'Agent',
        companyId: company._id,
      };
      const createdAgent = await createAgentAccount(newAgentAccountData, password, account.token);
      if (createdAgent) {
        toast.success(`Agent ${firstName} ${lastName} created!`);
        setAgents([...agents, createdAgent]);
        navigate('agentslist');
      } else {
        toast.error('Something went wrong while attempting to create a new agent');
      }
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
        toast.error('Something went wrong while attempting to create a new agent');
      }
    }
  };

  return (
    <div className='container-fluid'>
      <form action='' onSubmit={submitHandler}>
        <div className='row'>
          <div className='col-md-4'>
            <h1 className='page-title'>Create a new Agent</h1>
          </div>
          <div className='col-md-8 topRightBtns'></div>
          <p className='context-white'>
            <b>Agent account details:</b>
          </p>
          <div className='col-md-4'>
            <PrimaryInput value={email} setState={setEmail} placeHolder='Email' id='Email' name='Email' type='email' mandatory />
          </div>
          <div className='col-md-4'>
            <PrimaryInput
              value={firstName}
              setState={setFirstName}
              placeHolder='First Name'
              type='text'
              id='FirstName'
              name='First Name'
              mandatory
            />
          </div>
          <div className='col-md-4'>
            <PrimaryInput
              value={lastName}
              setState={setLastName}
              placeHolder='Last Name'
              id='LastName'
              name='Last Name'
              type='text'
              mandatory
            />
          </div>
          <div className='col-md-4'>
            <PrimaryInput value={phone} setState={setPhone} placeHolder='Phone' id='Phone' name='Phone' type='tel' />
          </div>
          <div className='col-md-4'>
            <PrimaryInput value={position} setState={setPosition} placeHolder='Position' id='Position' name='Position' type='text' />
          </div>
          <div className='col-md-4'>
            <label htmlFor='' className='formLbl'>
              Active Account:
            </label>
            <button
              type='button'
              className='btn btn-success radioBtn'
              style={{ backgroundColor: isActive ? '#00897b' : '#ec6378' }}
              onClick={() => setIsActive((prevIsActive) => !prevIsActive)}
            >
              Active Account
            </button>
          </div>
          <div className='col-md-4'>
            <PrimaryInput
              value={password}
              setState={setPassword}
              placeHolder='Password'
              id='Password'
              name='Password'
              type='password'
              mandatory
            />
          </div>
          <div className='col-md-4'>
            <PrimaryInput
              value={confirmedPassword}
              setState={setConfirmedPassword}
              placeHolder='Confirmed Password'
              id='ConfirmedPassword'
              name='Confirmed Password'
              type='password'
              mandatory
            />
          </div>
          <div className='col-12' style={{ textAlign: 'center' }}>
            <button className='btn btn-success submitBtn' type='submit'>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewAgentForm;
