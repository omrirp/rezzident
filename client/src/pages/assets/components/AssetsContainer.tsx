import { useState } from 'react';
import useAssetsStore from '../../../store/useAssetsStore';
import Asset from './Asset';
import AssetFullDetails from './AssetFullDetails';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import { Asset as IAsset } from '../../../models/asset';
import AssetsFilter from './AssetsFilter';

/**
 * This component is the root component of the Assets screen.
 * The component holds the assets filter on the left and assets on the right.
 * this component also render the Selected Asset full details in a form for modifications.
 */
const AssetsContainer = () => {
  // ----- Global states -----
  const assets = useAssetsStore((state) => state.assets);
  const { selectedAsset, setSelectedAsset } = useSelectedDataStore();
  // -----

  // ----- Local states -----
  const [filteredAssets, setFilteredAssets] = useState<IAsset[]>(assets);
  // -----

  return (
    <div className='container-fluid'>
      <div className='row'>
        {!selectedAsset ? (
          <AssetsFilter assets={assets} setFilteredAssets={setFilteredAssets} />
        ) : (
          <AssetFullDetails asset={selectedAsset} />
        )}
        {
          // Check if the user have yet to selected an asset
          !selectedAsset && (
            <div className='col-md-9 wrapper'>
              <div className='row assetsContainer'>
                {
                  //Render all related assets if true and if there are any
                  assets &&
                    filteredAssets.map((asset) => (
                      <div className='col-md-6 col-xl-4 assetContainer' key={asset._id}>
                        <button className='assetBtn' onClick={() => setSelectedAsset(asset)}>
                          <Asset asset={asset} />
                        </button>
                      </div>
                    ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AssetsContainer;
