import { useEffect, useState } from 'react';
import { Client } from '../../../models/client';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import useAccountStore from '../../../store/useAccountStore';
import { editClient, deleteClient } from '../../../services/clientsServices';
import useCompanyStore from '../../../store/useCompanyStore';
import { toast } from 'react-toastify';
import { isAxiosError } from '../../../utils/functions';
import useAssetsStore from '../../../store/useAssetsStore';
import useLeadsStore from '../../../store/useLeadsStore';
import { useNavigate } from 'react-router-dom';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import { IoArrowBack } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';
import { PiBroom } from 'react-icons/pi';
import Modal from '../../../components/Modal';
import Asset from '../../assets/components/Asset';
import { Asset as IAsset } from '../../../models/asset';

interface Props {
  client: Client;
}

/**
 * This component holds a form for client modification and display all the related assets of that client
 */
const ClientFullDetails = ({ client }: Props) => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { updateClient, clearCompany, removeClient } = useCompanyStore();
  const { assets, clearAssets } = useAssetsStore();
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const { clearSelectedData, removeSelectedClient, setSelectedAsset } = useSelectedDataStore();
  const navigate = useNavigate();
  // -----

  // ----- Local states -----
  const [firstName, setFirstName] = useState<string>(client.firstName || '');
  const [lastName, setLastName] = useState<string>(client.lastName || '');
  const [email, setEmail] = useState<string>(client.email || '');
  const [phone, setPhone] = useState<string>(client.phone || '');
  const [clientsAssets, setClientsAsset] = useState<IAsset[]>([]);
  // -----

  useEffect(() => {
    setClientsAsset(assets.filter((asset) => asset.clients.includes(client._id)));
  }, [assets]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account) {
      return;
    }

    try {
      const clientData: Omit<Client, 'createdAt' | 'updatedAt' | 'companyId'> = {
        _id: client._id,
        firstName,
        lastName,
        email,
        phone,
      };

      // Handle update the client on the DB
      const updatedClient = await editClient(clientData, account.token);

      // Handle update global memory
      updateClient(updatedClient);

      removeSelectedClient();
      toast.success('Client updated successfully');
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
        toast.warning('Something went wrong while attempting to update client');
      }
    }
  };

  const deleteClientHandler = async () => {
    if (!account) {
      return;
    }

    try {
      await deleteClient(client._id, account.token);
      toast.success('Client deleted successfully!');
      removeClient(client._id);
      removeSelectedClient();
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
        toast.warning(`Something went wrong while attempting to delete ${firstName} ${lastName} from the company's clients`);
      }
    }
  };

  const clearAllFieldsHandler = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className='container-fluid'>
      <Modal
        id='removeClientModal'
        header='Remove Client'
        body={`You are about to remove ${firstName} ${lastName} from the company's clients. Would you like t oproceed?`}
        onYesCLick={deleteClientHandler}
      />
      <div className='row'>
        <div className='col-md-3'>
          <h1 className='page-title'>Client Details & Assets:</h1>
        </div>
        <div className='col-md-9 topRightBtns'>
          <button onClick={removeSelectedClient} className='btn btn-link' type='button'>
            <IoArrowBack /> back
          </button>
          <button onClick={clearAllFieldsHandler} className='btn btn-link' type='button'>
            <PiBroom /> clear all fields
          </button>
          <button className='btn btn-link' type='button' data-bs-toggle='modal' data-bs-target='#removeClientModal'>
            <FaRegTrashAlt /> remove client
          </button>
        </div>
        <div className='col-md-3'>
          <form action='' onSubmit={submitHandler}>
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
            <div className='col-12' style={{ textAlign: 'center' }}>
              <button className='btn btn-success submitBtn' type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className='col-md-9 '>
          <div className='row' style={{ height: '75vh', overflowY: 'scroll' }}>
            {clientsAssets.map((asset) => (
              <div className='col-md-6 col-xl-4 assetContainer' key={asset._id}>
                <button
                  className='assetBtn'
                  onClick={() => {
                    setSelectedAsset(asset);
                    navigate('/assets/myassets');
                  }}
                >
                  <Asset asset={asset} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientFullDetails;
