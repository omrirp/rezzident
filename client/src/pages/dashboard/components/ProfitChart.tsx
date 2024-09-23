import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useCompanyStore from '../../../store/useCompanyStore';
import useAccountStore from '../../../store/useAccountStore';
import { getDealsChartData, DealChartFormat } from '../../../utils/functions';
import { useEffect, useState } from 'react';
import { TbPigMoney } from 'react-icons/tb';
import { PiHandshakeLight } from 'react-icons/pi';

const dummyChartData: DealChartFormat[] = [
  { name: '01/2024', personal: 1500, company: 3000 },
  { name: '02/2024', personal: 1200, company: 2500 },
  { name: '03/2024', personal: 1800, company: 3400 },
  { name: '04/2024', personal: 2000, company: 4000 },
  { name: '05/2024', personal: 1700, company: 3200 },
  { name: '06/2024', personal: 2200, company: 4500 },
  { name: '07/2024', personal: 1900, company: 3800 },
  { name: '08/2024', personal: 2100, company: 4200 },
  { name: '09/2024', personal: 1600, company: 3100 },
  { name: '10/2024', personal: 2300, company: 4700 },
  { name: '11/2024', personal: 2000, company: 4100 },
  { name: '12/2024', personal: 2500, company: 5000 },
];

const ProfitChart = () => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account);
  const { deals } = useCompanyStore();
  // -----

  // ----- Local states -----
  const [chartData, setChartData] = useState<DealChartFormat[]>(dummyChartData);
  const [togglePersonalProfit, setTogglePersonalProfit] = useState<boolean>(true);
  const [toggleCOmpanyProfit, setToggleCompanyProfit] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('NIS');
  // -----

  // Fetch and set the chart data
  useEffect(() => {
    const fetchData = async () => {
      if (account && deals.length > 0) {
        const data = await getDealsChartData(deals, account._id, currency as 'NIS' | 'USD' | 'UER'); // Replace 'USD' with the desired currency
        setChartData(data.sort((a, b) => a.name.localeCompare(b.name)));
      }
    };

    fetchData();
  }, [account, deals, currency]);

  return (
    <>
      <h5 className='chartHeader'>
        Profit <TbPigMoney />
      </h5>
      <div className='flexRow spaceBetween' style={{ alignItems: 'center' }}>
        <div className='flexRow'>
          <p className='context-white totalDeals'>
            <PiHandshakeLight size={20} /> Company Deals: {deals.length}
          </p>
          <p className='context-white totalDeals' style={{ marginLeft: 6 }}>
            <PiHandshakeLight size={20} /> Personal Deals: {deals.filter((deal) => deal.accountId === account?._id).length}
          </p>
        </div>

        <div className='flexRow profitChartActions'>
          <div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} name='Currency' id='currency' className='form-control'>
              <option value='NIS'>NIS</option>
              <option value='USD'>USD</option>
              <option value='EUR'>EUR</option>
            </select>
          </div>
          <button
            type='button'
            className='btn btn-success chartBtb'
            style={{ backgroundColor: togglePersonalProfit ? '#00897b' : '#ec6378' }}
            onClick={() => setTogglePersonalProfit((prevIsActive) => !prevIsActive)}
          >
            Personal
          </button>
          <button
            type='button'
            className='btn btn-success chartBtb'
            style={{ backgroundColor: toggleCOmpanyProfit ? '#00897b' : '#ec6378' }}
            onClick={() => setToggleCompanyProfit((prevIsActive) => !prevIsActive)}
          >
            Company
          </button>
        </div>
      </div>
      <ResponsiveContainer width='100%' height={window.innerHeight * 0.35}>
        <LineChart data={chartData} margin={{ left: 20, bottom: 20, right: 20, top: 20 }}>
          {toggleCOmpanyProfit && <Line type='monotone' dataKey='company' stroke='#42ab9e' strokeWidth={3} />}
          {togglePersonalProfit && <Line type='monotone' dataKey='personal' stroke='#ab4252' strokeWidth={3} />}
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='name' stroke='#fff' label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
          <YAxis stroke='#fff' label={{ value: 'Profit', angle: -90, position: 'insideLeft', offset: 0, dy: 0 }} />
          <Tooltip
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#fff' }}
            contentStyle={{ backgroundColor: '#504e6c', borderRadius: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ProfitChart;
