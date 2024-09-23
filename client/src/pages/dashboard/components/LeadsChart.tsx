import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import useLeadsStore from '../../../store/useLeadsStore';
import { RxRocket } from 'react-icons/rx';
import { getLeadsChartData } from '../../../utils/functions';

const LeadsChart = () => {
  const leads = useLeadsStore((state) => state.leads);

  // Calculate the number of leads that have been added this month
  const newLeadsCounter = (): number => {
    const currentMonth = new Date().getMonth();
    return leads.filter((lead) => lead.createdAt.getMonth() === currentMonth).length;
  };
  return (
    <>
      <h5 className='chartHeader'>
        Accumulated Leads <RxRocket />
      </h5>
      <p className='newLeadsCounterText'>New leads this month: {leads ? newLeadsCounter() : 0}</p>
      <ResponsiveContainer width='100%' height={window.innerHeight * 0.35}>
        <LineChart data={leads.length > 0 ? getLeadsChartData(leads) : []} margin={{ left: 20, bottom: 20, right: 20, top: 20 }}>
          <Line type='monotone' dataKey='sum' stroke='#ab4252' strokeWidth={3} />
          <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
          <XAxis dataKey='name' stroke='#fff' label={{ value: 'Date', position: 'insideBottom', offset: -10 }} />
          <YAxis
            stroke='#fff'
            label={{ value: 'Number of new leads', angle: -90, position: 'insideLeft', offset: 0, dy: 90 }}
            allowDecimals={false}
          />
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

export default LeadsChart;
