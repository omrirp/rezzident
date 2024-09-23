import { useState } from 'react';
import useAccountStore from '../../../store/useAccountStore';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import { isAxiosError } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Client } from '../../../models/client';
import { createNewClient } from '../../../services/clientsServices';

// ----- Global states -----
import useAssetsStore from '../../../store/useAssetsStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useCompanyStore from '../../../store/useCompanyStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';

/**
 * This component holds a form for creating a new Client
 */
const NewClientForm = () => {
  // ----- Global states -----
  const navigate = useNavigate();
  const { account, removeAccount } = useAccountStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const { clearCompany, setClients, clients } = useCompanyStore();
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  // -----

  // ----- Local states -----
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  // -----

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account) {
      return;
    }

    if (!account.companyId) {
      toast.warning('Please submit your company details before adding any clients');
      return;
    }

    try {
      const clientData: Omit<Client, '_id' | 'createdAt' | 'updatedAt'> = {
        firstName,
        lastName,
        email,
        phone,
        companyId: account.companyId,
      };

      const newClient = await createNewClient(clientData, account.token);

      // Update global memory
      setClients([...clients, newClient]);

      toast.success('Client Created successfully!');
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

  return (
    <div className='container-fluid'>
      <form action='' onSubmit={submitHandler}>
        <div className='row' style={{ justifyContent: 'center' }}>
          <div style={{ width: '45%' }}>
            <h1 className='page-title'>Create a new Client</h1>
            <div className='col-md-12'>
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
            <div className='col-md-12'>
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
            <div className='col-md-12'>
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
            <div className='col-md-12'>
              <PrimaryInput value={email} setState={setEmail} placeHolder='Email' type='email' id='email' name='Email' mandatory />
            </div>
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

export default NewClientForm;
