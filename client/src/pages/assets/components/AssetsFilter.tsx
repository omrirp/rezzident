import { Asset } from '../../../models/asset';
import { useEffect, useState } from 'react';
import { getExchangeRates, ExchangeRates } from '../../../services/others';
import { RxBorderSolid } from 'react-icons/rx';
import SecondaryInput from '../../../components/inputs/SecondaryInput';
import useAccountStore from '../../../store/useAccountStore';
import { Account } from '../../../models/account';

interface Props {
  assets: Asset[];
  setFilteredAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

/**
 * This component hold a real time filter for the Assets on the assets page.
 */
const AssetsFilter = ({ assets, setFilteredAssets }: Props) => {
  // ----- Global states -----
  const account: Account = useAccountStore((state) => state.account) as Account;

  // State for each filter
  const [assetStatus, setAssetStatus] = useState<string>('');
  const [dealType, setDealType] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [bedrooms, setBedrooms] = useState<{ min: number; max: number }>({ min: 0, max: 10 });
  const [bathrooms, setBathrooms] = useState<{ min: number; max: number }>({ min: 0, max: 10 });
  const [numberOfParkings, setNumberOfParkings] = useState<{ min: number; max: number }>({ min: 0, max: 10 });
  const [numberOfBalconies, setNumberOfBalconies] = useState<{ min: number; max: number }>({ min: 0, max: 10 });
  const [entryType, setEntryType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000000 });
  const [personalTag, setPersonalTag] = useState<boolean>(false);

  useEffect(() => {
    handleFilterChange();
  }, [
    assetStatus,
    dealType,
    availability,
    currency,
    bedrooms,
    bathrooms,
    numberOfParkings,
    numberOfBalconies,
    entryType,
    priceRange,
    personalTag,
  ]);

  const handleFilterChange = async () => {
    const exchangeRateObject: ExchangeRates = await getExchangeRates();

    const filteredAssets = assets.filter((asset) => {
      // Convert asset price to selected currency
      const assetPriceInSelectedCurrency =
        asset.dealCost * exchangeRateObject[asset.currency as keyof ExchangeRates][currency as keyof ExchangeRates];

      return (
        (assetStatus === '' || asset.assetStatus === assetStatus) &&
        (dealType === '' || asset.dealType === dealType) &&
        (availability === '' || asset.availability === availability) &&
        assetPriceInSelectedCurrency >= priceRange.min &&
        assetPriceInSelectedCurrency <= priceRange.max &&
        asset.bedrooms >= bedrooms.min &&
        asset.bedrooms <= bedrooms.max &&
        asset.bathrooms >= bathrooms.min &&
        asset.bathrooms <= bathrooms.max &&
        asset.numberOfParkings >= numberOfParkings.min &&
        asset.numberOfParkings <= numberOfParkings.max &&
        asset.numberOfBalconies >= numberOfBalconies.min &&
        asset.numberOfBalconies <= numberOfBalconies.max &&
        (entryType === '' || asset.entryType === entryType) &&
        (!personalTag || asset.agents.includes(account._id))
      );
    });

    setFilteredAssets(filteredAssets);
  };

  const resetFilterHandler = () => {
    setAssetStatus('');
    setDealType('');
    setAvailability('');
    setCurrency('USD');
    setBedrooms({ min: 0, max: 10 });
    setBathrooms({ min: 0, max: 10 });
    setNumberOfParkings({ min: 0, max: 10 });
    setNumberOfBalconies({ min: 0, max: 10 });
    setEntryType('');
    setPriceRange({ min: 0, max: 100000000 });
    setFilteredAssets(assets);
    setPersonalTag(false);
  };

  return (
    <div className='col-lg-3 assetsFilter'>
      <div>
        <button
          type='button'
          className='btn btn-success'
          style={{ backgroundColor: personalTag ? '#00897b' : '#ec6378', marginTop: 6 }}
          onClick={() => setPersonalTag((prevIsActive) => !prevIsActive)}
        >
          Personal Tag
        </button>
      </div>

      <div>
        <label className='formLbl'>Asset Status</label>
        <select className='form-control form-control2' value={assetStatus} onChange={(e) => setAssetStatus(e.target.value)}>
          <option value=''>All</option>
          <option value='New'>New</option>
          <option value='Old'>Old</option>
        </select>
      </div>

      <div>
        <label className='formLbl'>Deal Type</label>
        <select className='form-control form-control2' value={dealType} onChange={(e) => setDealType(e.target.value)}>
          <option value=''>All</option>
          <option value='Rent'>Rent</option>
          <option value='Sell'>Sell</option>
        </select>
      </div>

      <div>
        <label className='formLbl'>Availability</label>
        <select className='form-control form-control2' value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value=''>All</option>
          <option value='Available'>Available</option>
          <option value='Occupied'>Occupied</option>
        </select>
      </div>

      <div>
        <label className='formLbl'>Currency</label>
        <select className='form-control form-control2' value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value='USD'>USD</option>
          <option value='NIS'>NIS</option>
          <option value='EUR'>EUR</option>
        </select>
      </div>

      <div>
        <label className='formLbl'>Bedrooms</label>
        <div className='flexRow'>
          <SecondaryInput
            placeHolder='min bedrooms'
            value={bedrooms.min}
            setState={(e) => setBedrooms({ ...bedrooms, min: Number(e.target.value) })}
            type='number'
            name='minBedrooms'
          />
          <RxBorderSolid size={30} style={{ marginRight: 10, marginLeft: 10 }} />
          <SecondaryInput
            placeHolder='max bedrooms'
            value={bedrooms.max}
            setState={(e) => setBedrooms({ ...bedrooms, max: Number(e.target.value) })}
            type='number'
            name='maxBedrooms'
          />
        </div>
      </div>

      <div>
        <label className='formLbl'>Bathrooms</label>
        <div className='flexRow'>
          <SecondaryInput
            placeHolder='min bathrooms'
            value={bathrooms.min}
            setState={(e) => setBathrooms({ ...bathrooms, min: Number(e.target.value) })}
            type='number'
            name='minBAthrooms'
          />
          <RxBorderSolid size={30} style={{ marginRight: 10, marginLeft: 10 }} />
          <SecondaryInput
            placeHolder='max bathrooms'
            value={bathrooms.max}
            setState={(e) => setBathrooms({ ...bathrooms, max: Number(e.target.value) })}
            type='number'
            name='maxBAthrooms'
          />
        </div>
      </div>

      <div>
        <label className='formLbl'>Number of Parkings</label>
        <div className='flexRow'>
          <SecondaryInput
            placeHolder='min parkings'
            value={numberOfParkings.min}
            setState={(e) => setNumberOfParkings({ ...numberOfParkings, min: Number(e.target.value) })}
            type='number'
            name='minParkings'
          />
          <RxBorderSolid size={30} style={{ marginRight: 10, marginLeft: 10 }} />
          <SecondaryInput
            placeHolder='max parkings'
            value={numberOfParkings.max}
            setState={(e) => setNumberOfParkings({ ...numberOfParkings, max: Number(e.target.value) })}
            type='number'
            name='maxParkings'
          />
        </div>
      </div>

      <div>
        <label className='formLbl'>Number of Balconies</label>
        <div className='flexRow'>
          <SecondaryInput
            placeHolder='min balconies'
            value={numberOfBalconies.min}
            setState={(e) => setNumberOfBalconies({ ...numberOfBalconies, min: Number(e.target.value) })}
            type='number'
            name='minBalconies'
          />
          <RxBorderSolid size={30} style={{ marginRight: 10, marginLeft: 10 }} />
          <SecondaryInput
            placeHolder='max balconies'
            value={numberOfBalconies.max}
            setState={(e) => setNumberOfBalconies({ ...numberOfBalconies, max: Number(e.target.value) })}
            type='number'
            name='maxBalconies'
          />
        </div>
      </div>

      <div>
        <label className='formLbl'>Entry Type</label>
        <select className='form-control form-control2' value={entryType} onChange={(e) => setEntryType(e.target.value)}>
          <option value=''>All</option>
          <option value='Immediately'>Immediately</option>
          <option value='Flexible'>Flexible</option>
        </select>
      </div>

      <div>
        <label className='formLbl'>Price Range</label>
        <div className='flexRow'>
          <SecondaryInput
            placeHolder='min price'
            value={priceRange.min}
            setState={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            type='number'
            name='minPrice'
          />
          <RxBorderSolid size={30} style={{ marginRight: 10, marginLeft: 10 }} />
          <SecondaryInput
            placeHolder='max price'
            value={priceRange.max}
            setState={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            type='number'
            name='maxPrice'
          />
        </div>
      </div>
      <div className='flexCol filterBtnsContainer'>
        <button className='btn btn-success filterBtn' onClick={resetFilterHandler}>
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default AssetsFilter;
