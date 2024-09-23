import React, { useState } from 'react';
import useAccountStore from '../../../store/useAccountStore';
import { toast } from 'react-toastify';
import { changePlan } from '../../../services/accountServices';
import { Account } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/Modal';

// ----- Icons -----
import { RxCube, RxBackpack, RxPerson, RxRocket } from 'react-icons/rx';
import { CiGlobe } from 'react-icons/ci';
import { LiaCrownSolid } from 'react-icons/lia';
import { IoDiamondOutline } from 'react-icons/io5';

const ChooseAPlanForm = () => {
  // ----- Global states -----
  const { account, setAccount } = useAccountStore();
  const navigate = useNavigate();
  // -----

  // ----- Local states -----
  const [plan, setPlan] = useState<'Basic' | 'Premium' | 'Platinum'>(account?.plan || 'Basic');
  // -----

  const middleWare = async (e: React.MouseEvent<HTMLButtonElement>, chosenPlan: 'Basic' | 'Premium' | 'Platinum') => {
    setPlan(chosenPlan);
    e.preventDefault();
  };

  const submitHandler = async () => {
    if (!account) {
      return;
    }

    // Store the token
    const token: Account['token'] = account.token;

    try {
      let updatedAccount: Account = await changePlan(account._id, plan, token);

      // Reset token
      updatedAccount.token = token;

      setAccount(updatedAccount);
      toast.success(`Plan successfully updated to ${plan}`);
      navigate('/dashboard');
    } catch (error) {}
  };

  return (
    <form>
      <Modal
        id='chooseAPlanModal'
        onYesCLick={submitHandler}
        header=''
        body={`You are about to change your plan to ${plan}, do you like to confirm?`}
      />
      <div className='row wrapper'>
        <div className='col-md-4 planContainer'>
          <div className='planInnerContainer'>
            <div className='planDescription'>
              <h3>
                Basic <CiGlobe />
              </h3>
              <p>
                <RxCube size={20} /> 30 Assets Limit
              </p>
              <p>
                <RxPerson size={20} /> 40 Agents Limit
              </p>
              <p>
                <RxRocket size={20} /> 40 Leads Limit
              </p>
              <p>
                <RxBackpack size={20} /> 30 Clients Limit
              </p>
            </div>
            {account?.plan !== 'Basic' ? (
              <button
                onClick={(e) => {
                  middleWare(e, 'Basic');
                }}
                className='btn btn-success submitBtn'
                data-bs-toggle='modal'
                data-bs-target='#chooseAPlanModal'
                type='submit'
              >
                Basic
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className='col-md-4 planContainer'>
          <div className='planInnerContainer'>
            <div className='planDescription'>
              <h3>
                Premium <LiaCrownSolid />
              </h3>
              <p>
                <RxCube size={20} /> 100 Assets Limit
              </p>
              <p>
                <RxPerson size={20} /> 80 Agents Limit
              </p>
              <p>
                <RxRocket size={20} /> 150 Leads Limit
              </p>
              <p>
                <RxBackpack size={20} /> 100 Clients Limit
              </p>
            </div>
            {account?.plan !== 'Premium' ? (
              <button
                onClick={(e) => {
                  middleWare(e, 'Premium');
                }}
                className='btn btn-success submitBtn'
                data-bs-toggle='modal'
                data-bs-target='#chooseAPlanModal'
                type='submit'
              >
                Premium
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className='col-md-4 planContainer'>
          <div className='planInnerContainer'>
            <div className='planDescription'>
              <h3>
                Platinum <IoDiamondOutline />
              </h3>
              <p>
                <RxCube size={20} /> 500 Assets Limit
              </p>
              <p>
                <RxPerson size={20} /> 300 Agents Limit
              </p>
              <p>
                <RxRocket size={20} /> 1000 Leads Limit
              </p>
              <p>
                <RxBackpack size={20} /> 500 Clients Limit
              </p>
            </div>
            {account?.plan !== 'Platinum' ? (
              <button
                onClick={(e) => {
                  middleWare(e, 'Platinum');
                }}
                className='btn btn-success submitBtn'
                data-bs-toggle='modal'
                data-bs-target='#chooseAPlanModal'
                type='submit'
              >
                Platinum
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChooseAPlanForm;
