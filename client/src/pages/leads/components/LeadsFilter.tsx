import { useEffect, useState } from 'react';
import { Lead } from '../../../models/lead';
import { CiSearch } from 'react-icons/ci';
import { IoIosStar } from 'react-icons/io';
import useAccountStore from '../../../store/useAccountStore';
import { Account } from '../../../models/account';

interface Props {
  leads: Lead[];
  setFilteredLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const LeadsFilter = ({ leads, setFilteredLeads }: Props) => {
  // ----- Global states -----
  const account = useAccountStore((state) => state.account) as Account;
  // -----

  const [search, setSearch] = useState<string>('');
  const [isTagged, setIsTagged] = useState<boolean>(true);

  useEffect(() => {
    const filteredLeads = leads.filter((lead) => {
      const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
      const isMatch = search === '' || fullName.includes(search.toLowerCase());
      const tagged = !isTagged || lead.agents.includes(account?._id);

      return isMatch && tagged;
    });

    setFilteredLeads(filteredLeads);
  }, [leads, search, isTagged, account]);

  return (
    <>
      <div className='col-md-9 flexRow' style={{ position: 'relative', marginTop: 16 }}>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id='leadSearchBar'
          name='leadSearchBar'
          placeholder='Search by name...'
          className='form-control'
        />
        <CiSearch size={43} style={{ position: 'absolute', right: 18 }} />
      </div>
      <div className='col-md-3'>
        <button
          type='button'
          className='btn btn-success radioBtn'
          style={{ backgroundColor: isTagged ? '#00897b' : '#ec6378', marginTop: 16 }}
          onClick={() => setIsTagged((prevIsExclusive) => !prevIsExclusive)}
        >
          TAG only <IoIosStar />
        </button>
      </div>
    </>
  );
};

export default LeadsFilter;
