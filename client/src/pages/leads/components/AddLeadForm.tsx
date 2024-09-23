import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAxiosError } from '../../../utils/functions';
import { createLead } from '../../../services/leadServices';
import { FaFireAlt } from 'react-icons/fa';
// ----- Components -----
import PrimaryInput from '../../../components/inputs/PrimaryInput';

// ----- Interfaces -----
import { Lead } from '../../../models/lead';

// ----- Global states -----
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import useAssetsStore from '../../../store/useAssetsStore';
import useAccountStore from '../../../store/useAccountStore';
import useCompanyStore from '../../../store/useCompanyStore';
import useLeadsStore from '../../../store/useLeadsStore';

const AddLeadForm = () => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { addLead, clearLeads } = useLeadsStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const { clearCompany, company } = useCompanyStore();
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  const navigate = useNavigate();
  // -----

  // ----- Local states -----
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isHot, setIsHot] = useState<boolean>(false);
  // -----

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account) {
      return;
    }

    if (!company) {
      toast.warning('Please submit your company details before adding any leads');
      return;
    }

    const newLead: Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'log'> = {
      companyId: company._id,
      firstName,
      lastName,
      phone,
      email,
      agents: [account._id],
      isHot: true,
    };

    // Handle send the new lead to the DB
    try {
      const lead: Lead = await createLead(newLead, account.token);
      if (lead) {
        // Add lead to Global storage
        addLead(lead);
        // Message and navigate
        toast.success('New Lead Created!');
        navigate('myleads');
      } else {
        toast.warning('Cannot create a new lead. please check the phone number or email address');
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
        } else {
          //console.log(error.response);
          // toast.warning(error.response?.data.message);
        }
      } else {
        toast.warning('Something went wrong while creating a new Lead');
      }
    }
  };

  return (
    <div className='container-fluid'>
      <form action='' id='newLeadForm' onSubmit={submitHandler}>
        <div className='row'>
          <h1 className='page-title'>Create a new Lead</h1>
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          <div className='col-md-4'>
            <PrimaryInput value={email} setState={setEmail} placeHolder='Email' type='email' id='email' name='Email' />
          </div>
          <div className='col-lg-4'>
            <label htmlFor='IsExclusive' className='formLbl'>
              Hot Lead:
            </label>
            <button
              type='button'
              className='btn btn-success radioBtn'
              style={{ backgroundColor: isHot ? '#00897b' : '#ec6378' }}
              onClick={() => setIsHot((prevIsExclusive) => !prevIsExclusive)}
            >
              Hot Lead <FaFireAlt />
            </button>
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

export default AddLeadForm;
