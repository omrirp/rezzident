import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import { updateCompany } from '../../../services/companyServices';
import { isAxiosError } from '../../../utils/functions';
import { toast } from 'react-toastify';

// ----- Interfaces -----
import { Account } from '../../../models/account';
import { Location } from '../../../models/asset';
import { Company } from '../../../models/company';

// ----- Global states -----
import useAccountStore from '../../../store/useAccountStore';
import useCompanyStore from '../../../store/useCompanyStore';
import useAssetsStore from '../../../store/useAssetsStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';

interface Response {
  company: Company;
  location: Location;
}

const CompanyForm = () => {
  // ----- Global states -----
  const { account, setAccount, removeAccount } = useAccountStore();
  const { company, location, setCompany, setLocation, clearCompany } = useCompanyStore();
  const clearAssets = useAssetsStore((state) => state.clearAssets);
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const clearSelectedData = useSelectedDataStore((state) => state.clearSelectedData);
  const navigate = useNavigate();
  // -----

  // ----- Local states -----

  // --- Personal information ---
  const [companyName, setCompanyName] = useState<string>(company?.companyName || '');
  const [companyPhone, setCompanyPhone] = useState<string>(company?.companyPhone || '');
  const [companyEmail, setCompanyEmail] = useState<string>(company?.companyEmail || '');
  const [companyWebsite, setCompanyWebsite] = useState<string>(company?.companyWebsite || '');
  const [isActive, setIsActive] = useState<boolean>(company?.isActive || true);

  // --- company information ---
  const [country, setCountry] = useState<string>(location?.country || '');
  const [city, setCity] = useState<string>(location?.city || '');
  const [street, setStreet] = useState<string>(location?.street || '');
  const [houseNumber, setHouseNumber] = useState<string>(location?.houseNumber || '');
  const [entry, setEntry] = useState<string>(location?.entry || '');
  // -----

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!account) {
      return;
    }

    const location: Omit<Location, '_id'> = {
      country,
      city,
      street,
      houseNumber,
      entry,
    };

    const companyData: Omit<Company, 'companyLocation'> = {
      _id: company?._id || '',
      companyName,
      companyEmail,
      companyPhone,
      companyWebsite,
      isActive,
    };

    try {
      // Update company request
      const res: Response = await updateCompany(companyData, location, account._id, account.token);

      // Handle personal global states: account, company and the location of the company
      setAccount({ ...account, companyId: res.company._id } as Account);
      const updatedCompany: Company = res.company;
      const updatedLocation: Location = res.location;
      setCompany({ ...updatedCompany });
      setLocation({ ...updatedLocation });
      toast.success('Company updated successfully');
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
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className='container-fluid'>
      <form action='' onSubmit={submitHandler} id='personalDetailsForm'>
        <h1 className='page-title'>Company Details Update</h1>
        <div className='row'>
          <p className='context-white'>
            <b>Company details:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput
              value={companyName}
              setState={setCompanyName}
              placeHolder='Company Name'
              id='CompanyName'
              name='Company Name'
              type='text'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={companyPhone}
              setState={setCompanyPhone}
              placeHolder='Company Phone'
              id='CompanyPhone'
              name='Company Phone'
              type='tel'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={companyEmail}
              setState={setCompanyEmail}
              placeHolder='Company Email'
              id='CompanyEmail'
              name='Company Email'
              type='tel'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={companyWebsite}
              setState={setCompanyWebsite}
              placeHolder='Company Website'
              id='CompanyWebsite'
              name='Company Website'
              type='url'
            />
          </div>
          <div className='col-lg-4'>
            <label htmlFor='IsExclusive' className='formLbl'>
              Active Company:
            </label>
            <button
              type='button'
              className='btn btn-success radioBtn'
              style={{ backgroundColor: isActive ? '#00897b' : '#ec6378' }}
              onClick={() => setIsActive((prevIsActive) => !prevIsActive)}
            >
              Active Company
            </button>
          </div>
          <p className='context-white'>
            <b>Company's location details:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput value={country} setState={setCountry} placeHolder='Country' id='Country' name='Country' type='text' mandatory />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={city} setState={setCity} placeHolder='City' id='City' name='City' type='text' mandatory />
          </div>{' '}
          <div className='col-lg-4'>
            <PrimaryInput value={street} setState={setStreet} placeHolder='Street' id='Street' name='Street' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={houseNumber}
              setState={setHouseNumber}
              placeHolder='House Number'
              id='HouseNumber'
              name='HouseNumber'
              type='text'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={entry} setState={setEntry} placeHolder='Entry' id='Entry' name='Entry' type='text' />
          </div>
        </div>
        <div className='col-12' style={{ textAlign: 'center' }}>
          {account && account.role === 'Admin' ? (
            <button className='btn btn-success submitBtn' type='submit'>
              Submit
            </button>
          ) : (
            <></>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
