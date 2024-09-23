import { useLocation, useNavigate } from 'react-router-dom';
import AddAssetForm from './components/AddAssetForm';
import AssetsContainer from './components/AssetsContainer';
import useSelectedDataStore from '../../store/useSelectedDataStore';

/**
 * This component is the root of all Assets related components
 */
const Assets = () => {
  // ----- Global States -----
  const removeSelectedAsset = useSelectedDataStore((state) => state.removeSelectedAsset);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * This function render a component according to the location
   * @returns TSX
   */
  const render = () => {
    switch (location.pathname) {
      case '/assets/myassets': {
        return <AssetsContainer />;
      }
      case '/assets/addasset': {
        return <AddAssetForm />;
      }
      default:
        return <AssetsContainer />;
    }
  };

  return (
    <div>
      <div className='pageHeaderContainer'>
        <h1 className='page-title'>Assets:</h1>
        <button
          className='btn btn-link'
          onClick={() => {
            removeSelectedAsset();
            navigate('myassets');
          }}
        >
          My Asset
        </button>
        <button className='btn btn-link' onClick={() => navigate('addasset')}>
          Add Asset
        </button>
      </div>
      {render()}
    </div>
  );
};

export default Assets;
