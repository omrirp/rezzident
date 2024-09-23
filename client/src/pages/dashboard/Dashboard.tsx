// ----- Components -----
import ProfitChart from './components/ProfitChart';
import LeadsChart from './components/LeadsChart';

// ----- Global states -----
import useAccountStore from '../../store/useAccountStore';
import useAssetsStore from '../../store/useAssetsStore';
import useLeadsStore from '../../store/useLeadsStore';
import useCompanyStore from '../../store/useCompanyStore';

// ----- Icons -----
import { CiGlobe } from 'react-icons/ci';
import { LiaCrownSolid } from 'react-icons/lia';
import { RxAllSides } from 'react-icons/rx';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoDiamondOutline } from 'react-icons/io5';
import { RxCube, RxBackpack, RxPerson, RxRocket } from 'react-icons/rx';


type PlanType = 'Basic' | 'Premium' | 'Platinum';
const planOBject: Record<PlanType, { icon: JSX.Element; class: 'basicPlan' | 'premiumPlan' | 'platinumPlan' }> = {
  Basic: {
    icon: <CiGlobe />,
    class: 'basicPlan',
  },
  Premium: {
    icon: <LiaCrownSolid />,
    class: 'premiumPlan',
  },
  Platinum: {
    icon: <IoDiamondOutline />,
    class: 'platinumPlan',
  },
};

const Dashboard = () => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account);
  const assets = useAssetsStore((state) => state.assets);
  const leads = useLeadsStore((state) => state.leads);
  const { clients, agents } = useCompanyStore();
  // -----

  const dummyPlan: PlanType = (account?.plan || 'Basic') as PlanType;

  return (
    <div className='container-fluid'>
      <div className='row dashboardHeader'>
        <div className='col-md-3'>
          <h1 className='page-title'>
            <FaRegUserCircle /> {account?.firstName} {account?.lastName}
          </h1>
        </div>
        <div className='col-md-3 '>
          <h4 className='positionText'>
            <RxAllSides /> {account?.position}
          </h4>
        </div>
        <div className='col-md-2 '>
          <h3 className={`planText ${planOBject[dummyPlan].class}`}>
            {dummyPlan} {planOBject[dummyPlan].icon}
          </h3>
        </div>
      </div>
      <div className='row wrapper'>
        <div className='col-sm-6 col-md-3 dataCountContainer'>
          <p className='dataCount'>
            <RxCube size={36} /> Available Assets: {assets.filter((asset) => asset.availability === 'Available').length}
          </p>
        </div>
        <div className='col-sm-6 col-md-3 dataCountContainer'>
          <p className='dataCount'>
            <RxRocket size={36} /> Total Leads: {leads.length}
          </p>
        </div>
        <div className='col-sm-6 col-md-3 dataCountContainer'>
          <p className='dataCount'>
            <RxBackpack size={36} /> Number of CLients: {clients.length}
          </p>
        </div>
        <div className='col-sm-6 col-md-3 dataCountContainer'>
          <p className='dataCount'>
            <RxPerson size={36} /> Number of Agents: {agents.length}
          </p>
        </div>
        <div className='col-md-4 dashboardWidget'>
          <div className='dashboardWidgetInner'>
            <LeadsChart />
          </div>
        </div>
        <div className='col-md-8 dashboardWidget'>
          <div className='dashboardWidgetInner'>
            <ProfitChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
