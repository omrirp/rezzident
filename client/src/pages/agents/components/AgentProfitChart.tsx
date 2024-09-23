import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useCompanyStore from '../../../store/useCompanyStore';
import useAccountStore from '../../../store/useAccountStore';
import { getDealsChartData, DealChartFormat } from '../../../utils/functions';
import { useEffect, useState } from 'react';
import { TbPigMoney } from 'react-icons/tb';
import { Agent } from '../../../models/account';
import { PiHandshakeLight } from 'react-icons/pi';

interface Props {
  agentId: Agent['_id'];
  firstName: Agent['firstName'];
}

/**
 * This component display a line chart that shows the agent
 * and the company's profit by month.
 */
const AgentProfitChart = ({ agentId, firstName }: Props) => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account);
  const { deals } = useCompanyStore();
  // -----

  // ----- Local states -----
  const [chartData, setChartData] = useState<DealChartFormat[]>([]);
  const [togglePersonalProfit, setTogglePersonalProfit] = useState<boolean>(true);
  const [toggleCOmpanyProfit, setToggleCompanyProfit] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('NIS');
  const [totalDeals, setTotalDeals] = useState<number>(0);
  // -----

  // Fetch and set the chart data
  useEffect(() => {
    const fetchData = async () => {
      if (agentId && deals.length > 0) {
        const data = await getDealsChartData(deals, agentId, currency as 'NIS' | 'USD' | 'UER');
        if (data.length > 0) {
          setChartData(data.sort((a, b) => a.name.localeCompare(b.name)));
        }
      }
    };

    fetchData();
  }, [account, deals, currency]);

  useEffect(() => {
    setTotalDeals(deals.filter((deal) => deal.accountId === agentId).length);
  }, [deals, account]);

  return (
    <>
      <h5 className='chartHeader'>
        {firstName}'s Profit <TbPigMoney />
      </h5>
      <div className='flexRow spaceBetween' style={{ alignItems: 'center' }}>
        <p className='context-white totalDeals'>
          <PiHandshakeLight size={20} /> Total Deals: {totalDeals}
        </p>

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

export default AgentProfitChart;
