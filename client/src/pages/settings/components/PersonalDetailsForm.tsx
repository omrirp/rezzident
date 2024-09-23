import React, { useState } from 'react';
import { Account } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from '../../../utils/functions';
import { updateAccount } from '../../../services/accountServices';
import { toast } from 'react-toastify';
import { updateAvatar } from '../../../services/firebaseServices';
import PrimaryInput from '../../../components/inputs/PrimaryInput';

// ----- Global states -----
import useAccountStore from '../../../store/useAccountStore';
import useCompanyStore from '../../../store/useCompanyStore';
import useAssetsStore from '../../../store/useAssetsStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';

/**
 * This component holds a form for updating the signed in user personal details
 */
const PersonalDetailsForm = () => {
  // ----- Global states -----
  const { account, setAccount, removeAccount } = useAccountStore();
  const clearCompany = useCompanyStore((state) => state.clearCompany);
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  const navigate = useNavigate();

  // -----

  // ----- Local states -----
  const [email, setEmail] = useState<string>(account?.email || '');
  const [firstName, setFirstName] = useState<string>(account?.firstName || '');
  const [lastName, setLastName] = useState<string>(account?.lastName || '');
  const [phone, setPhone] = useState<string>(account?.phone || '');
  const [position, setPosition] = useState<string>(account?.position || '');
  const [isActive, setIsActive] = useState<boolean>(account?.isActive || true);
  const [avatar, setAvatar] = useState<File>();
  // -----

  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) {
      return;
    }

    let accountData: Account = {
      ...account,
      email,
      firstName,
      lastName,
      phone,
      position,
      isActive,
    } as Account;

    try {
      // Handle updating avatar image with Firebase
      if (avatar) {
        accountData.avatar = await updateAvatar(account._id, account.avatar, avatar);
      }

      // Save token
      const token = account.token;
      // Call update request
      let updatedAccount = await updateAccount(accountData, account.token);
      // Set the saved token to the updated account
      updatedAccount.token = token;
      // Set the updated account details to the account global state
      setAccount(updatedAccount);
      toast.success('Personal details updated successfully');
    } catch (error) {
      // Check unauthorized action
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
        toast.warning('Something went wrong while attempting to update your personal details');
      }
    }
  };

  return (
    <div className='container-fluid'>
      <form action='' onSubmit={submitHandler} id='personalDetailsForm'>
        <div className='row'>
          <div className='col-md-4'>
            <h1 className='page-title'>Personal Details Update</h1>
          </div>
          <div className='col-md-8 topRightBtns'></div>
          <p className='context-white'>
            <b>Account details:</b>
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
            <label htmlFor='IsExclusive' className='formLbl'>
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
            <label htmlFor='AddImage' className='formLbl'>
              Add new Avatar image: (recommended ration 1:1)
            </label>
            <input type='file' id='AddImage' name='Add Image' className='form-control' accept='image/*' onChange={imageChangeHandler} />
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

export default PersonalDetailsForm;
