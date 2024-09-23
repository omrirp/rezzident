import useSelectedDatatStores from '../../../store/useSelectedDataStore';
import LeadFullDetails from './LeadFullDetails';
import useLeadsStore from '../../../store/useLeadsStore';
import Lead from './Lead';
import { useState } from 'react';
import { Lead as ILead } from '../../../models/lead';
import LeadsFilter from './LeadsFilter';

const LeadsContainer = () => {
  // ----- Global states -----
  const { selectedLead, setSelectedLead } = useSelectedDatatStores();
  const leads = useLeadsStore((state) => state.leads);
  // -----

  const [filteredLeads, setFilteredLeads] = useState<ILead[]>(leads);

  return (
    <div className='container-fluid'>
      <div className='row'>
        {!selectedLead && <LeadsFilter leads={leads} setFilteredLeads={setFilteredLeads} />}
        {!selectedLead ? (
          leads &&
          filteredLeads
            .sort((a, b) => {
              const fullNameA = `${a.firstName} ${a.lastName}`;
              const fullNameB = `${b.firstName} ${b.lastName}`;
              return fullNameA.localeCompare(fullNameB);
            })
            .map((lead, index) => (
              <div className='col-12 leadsContainer' key={lead._id}>
                <button className='leadsBtn' onClick={() => setSelectedLead(lead)}>
                  <Lead lead={lead} index={index} />
                </button>
              </div>
            ))
        ) : (
          <LeadFullDetails lead={selectedLead} />
        )}
      </div>
    </div>
  );
};

export default LeadsContainer;
