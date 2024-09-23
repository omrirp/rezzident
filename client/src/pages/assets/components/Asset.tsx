import { Asset as IAsset, Location } from '../../../models/asset';
import { CiLocationOn } from 'react-icons/ci';
import { IoBedOutline } from 'react-icons/io5';
import { TbBath } from 'react-icons/tb';
import { IoPricetagOutline, IoCarOutline } from 'react-icons/io5';
import { toNumberWithCommas } from '../../../utils/functions';
import { GoDotFill } from 'react-icons/go';
import { RxRocket } from 'react-icons/rx';

interface Props {
  asset: IAsset;
}

interface CurrencySign {
  [currency: IAsset['currency']]: string;
}

const currencySign: CurrencySign = {
  NIS: '₪',
  USD: '$',
  EUR: 'Є',
};

/**
 * This component will display an Asset in a few details
 */
const Asset = ({ asset }: Props) => {
  const location: Location = asset.location as Location;
  const image: string = asset.images ? asset.images[0] : '';

  return (
    <div className='row assetItem' style={{ position: 'relative' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <GoDotFill size={40} style={{ position: 'absolute' }} color={asset.availability === 'Available' ? '#00897b' : '#ec6378'} />
        <p style={{ position: 'absolute', right: 16, top: 6 }} className='assetLeadCounter'>
          <RxRocket size={20} />: {asset.leads?.length || 0}
        </p>
      </div>
      <img src={image} className='assetPrimaryImageSmall' alt='' />
      <div className='col-12 addressWrapper'>
        <p>
          <CiLocationOn /> {location.city} / {location.country}
        </p>
      </div>
      <div className='col-sm-4 assetDetailWrap'>
        <p className='assetDetailText'>
          <IoBedOutline /> {asset.bedrooms} beds
        </p>
      </div>
      <div className='col-sm-4 assetDetailWrap'>
        <p className='assetDetailText'>
          <TbBath /> {asset.bathrooms} baths
        </p>
      </div>
      <div className='col-sm-4 assetDetailWrap'>
        <p className='assetDetailText'>
          <IoCarOutline /> {asset.numberOfParkings} parkings
        </p>
      </div>
      <div className='col-12 assetPriceWrapper'>
        <p className='assetPriceText'>
          <IoPricetagOutline /> {toNumberWithCommas(asset.dealCost)} {currencySign[asset.currency]}
          {asset.dealType == 'Rent' ? ' /Month' : ''}
        </p>
      </div>
    </div>
  );
};

export default Asset;
