import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// ----- Global states -----
import useAssetsStore from '../../../store/useAssetsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import useCompanyStore from '../../../store/useCompanyStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useAccountStore from '../../../store/useAccountStore';

// ----- Interfaces -----
import { Account, Agent } from '../../../models/account';
import { Asset, Location } from '../../../models/asset';
import { Lead } from '../../../models/lead';

// ----- Icons -----
import { IoMdAdd } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoArrowBack, IoCalendarOutline, IoImagesOutline } from 'react-icons/io5';
import { PiHandshakeLight } from 'react-icons/pi';

// ----- Components -----
import PrimaryRadioButtons from '../../../components/inputs/PrimaryRadioButtons';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import CurrencySelector from './CurrencySelector';
import MultiEntitySelect from '../../../components/inputs/MultiEntitySelect';
import Modal from '../../../components/Modal';
import { spinner } from '../../../utils/elements';
import Gallery from './Gallery';

// ----- Functions -----
import { closeDeal, deleteAsset, updateAsset } from '../../../services/assetServices';
import { capitalize, isAxiosError } from '../../../utils/functions';
import { getCurrencyExchange } from '../../../services/others';
import { Deal } from '../../../models/deal';
import { Client } from '../../../models/client';

interface Props {
  asset: Asset;
}

/**
 * This component holds a form for display or edit an asset
 */
const AssetFullDetails = ({ asset }: Props) => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { agents, company, clients, deals, clearCompany, setDeals } = useCompanyStore();
  const { modifyAsset, removeAsset, clearAssets, localCloseADeal } = useAssetsStore();
  const { leads, clearLeads } = useLeadsStore();
  const location: Location = asset.location as Location;
  const { removeSelectedAsset, clearSelectedData } = useSelectedDataStore();
  const navigate = useNavigate();
  // -----

  // ----- Local states -----

  // --- ui ---
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);

  // --- partners ---
  const [selectedAgents, setSelectedAgents] = useState<Account['_id'][]>(asset.agents);
  const [selectedClients, setSelectedClients] = useState<Client['_id'][]>(asset.clients || []);
  const [selectedLeads, setSelectedLeads] = useState<Lead['_id'][]>(asset.leads || []);

  // --- Basic Information ---
  const [assetType, setAssetType] = useState<string>(asset.assetType || '');
  const [dealCost, setDealCost] = useState<number | null>(asset.dealCost || 0);
  const [commissionFee, setCommissionFee] = useState<number | null>(asset.commissionFee || 0);
  const [dealType, setDealType] = useState<string>(asset.dealType || 'Rent');
  const [assetStatus, setAssetStatus] = useState<string>(asset.assetStatus || 'New');
  const [currency, setCurrency] = useState<string>(asset.currency || 'NIS');
  const [newCurrency, setNEwCurrency] = useState<string>(asset.currency || 'NIS');

  // --- Location states ---
  const [country, setCountry] = useState<string>(location.country || '');
  const [city, setCity] = useState<string>(location.city || '');
  const [street, setStreet] = useState<string>(location.street || '');
  const [houseNumber, setHouseNumber] = useState<string>(location.houseNumber || '');
  const [entry, setEntry] = useState<string>(location.entry || '');

  // --- Property details ---
  const [numberOFBedrooms, setNumberOfBedrooms] = useState<number | null>(asset.bedrooms || 0);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<number | null>(asset.bathrooms || 0);
  const [numberOfParkings, setNumberOfParkings] = useState<number | null>(asset.numberOfParkings || 0);
  const [NumberOfBalconies, setNUmberOFBalconies] = useState<number | null>(asset.numberOfBalconies || 0);
  const [assetSquare, setAssetSquare] = useState<number | null>(asset.assetSquare || 0);
  const [gardenSquare, setGardenSquare] = useState<number | null>(asset.gardenSquare || 0);

  // --- Additional information
  const [floor, setFloor] = useState<number | null>(asset.floor || 0);
  const [NumberOfFloors, setNumberOfFloors] = useState<number | null>(asset.numberOfFloors || 0);
  const [numberOfAirDirections, setNumberOFAirDirections] = useState<number | null>(asset.numberOfAirDirection || 0);
  const [viewType, setViewType] = useState<string>(asset.viewType || '');
  const [dateOfEntry, setDateOFEntry] = useState<string | null>(asset.dateOfEntry.toISOString().substring(0, 10) || '');
  const [exclusiveDateExtension, setExclusiveDateExtension] = useState<string | null>(
    asset.exclusiveDateExt.toISOString().substring(0, 10) || ''
  );
  const [amenities, setAmenities] = useState<string[]>(asset.amenities || []);
  const [newAmenity, setNewAmenity] = useState<string>('');
  const [entryType, setEntryType] = useState<string>(asset.entryType || 'Immediately');
  const [isExclusive, setIsExclusive] = useState<boolean>(asset.isExclusive || true);
  const [assetDescription, setAssetDescription] = useState<string>(asset.assetDescription || '');

  // --- Images ---
  const [currentImages, setCurrentImages] = useState<string[]>(asset.images || []);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  // --- Others ---
  const [availability, setAvailability] = useState<'Available' | 'Occupied'>(asset.availability || 'Available');

  // --- time stamps ---
  const [createdAt] = useState<string>(asset.createdAt.toLocaleDateString() || '');
  const [updatedAt] = useState<string>(asset.updatedAt.toLocaleDateString() || '');

  // Handle currency changes by executing this function each time the user choose a new currency
  useEffect(() => {
    // Execute anonymous asynchronous function
    (async () => {
      const exchangeRate: number = await getCurrencyExchange(currency, newCurrency);

      // Update dealCost and CommissionFee
      setDealCost((prevDealCost) => (prevDealCost ? prevDealCost * exchangeRate : null));
      setCommissionFee((prevCommissionFee) => (prevCommissionFee ? prevCommissionFee * exchangeRate : null));

      // Set currency
      setCurrency(newCurrency);
    })();
  }, [newCurrency]);

  const addAmenityHandler = (): void => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity('');
    }
  };

  const removeAmenityHandler = (index: number): void => {
    setAmenities((currentAmenities) => {
      const updatedAmenities = [...currentAmenities];
      updatedAmenities.splice(index, 1);
      return updatedAmenities;
    });
  };

  // Event for handling upload images
  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files);
      setNewImages(fileList);
    }
  };

  // Toggle on existing image will set/cancel it for delete
  const handleImageClick = (index: number) => {
    setImagesToRemove((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account) {
      return;
    }

    setIsLoading(true);

    const modifiedLocation: Omit<Location, '_id'> = {
      country,
      city,
      street,
      houseNumber,
      entry,
    };

    let modifiedAsset: Omit<Asset, 'location' | 'updatedAt' | 'createdAt'> = {
      _id: asset._id,
      assetType,
      dealCost: dealCost || 0,
      commissionFee: commissionFee || 0,
      assetStatus,
      dealType,
      currency,
      availability,
      bedrooms: numberOFBedrooms || 0,
      bathrooms: numberOfBathrooms || 0,
      numberOfParkings: numberOfParkings || 0,
      numberOfBalconies: NumberOfBalconies || 0,
      assetSquare: assetSquare || 0,
      gardenSquare: gardenSquare || 0,
      floor: floor || 0,
      numberOfFloors: NumberOfFloors || 0,
      numberOfAirDirection: numberOfAirDirections || 0,
      viewType,
      dateOfEntry: dateOfEntry ? new Date(dateOfEntry) : new Date(),
      exclusiveDateExt: exclusiveDateExtension ? new Date(exclusiveDateExtension) : new Date(),
      amenities,
      entryType,
      isExclusive,
      assetDescription,
      images: asset.images || [],
      agents: selectedAgents,
      clients: selectedClients,
      leads: selectedLeads,
      companyId: account.companyId || '',
    };

    // Handle filter current images if needed
    if (imagesToRemove.length > 0) {
      let imagesToKeep: string[] = [];
      let imagesToDelete: string[] = [];

      // Separate the images that needs to be delete from the ones to keep
      // note - complexity is O(n^2) and can be improved to O(n)
      imagesToRemove.forEach((_, index) => {
        if (imagesToRemove.includes(index)) {
          imagesToDelete.push(modifiedAsset.images[index]);
        } else {
          imagesToKeep.push(modifiedAsset.images[index]);
        }
      });

      // Update the current images to keep
      modifiedAsset.images = imagesToKeep;

      // Handle removing the images to delete from firebase storage
      try {
        await Promise.all(
          imagesToDelete.map(async (image) => {
            const imageRef = ref(storage, image);
            await deleteObject(imageRef);
          })
        );
      } catch (error) {
        toast.warning('something went wrong while attempting to remove the image');
      }
    }

    try {
      // Handle uploading the asset's images to firebase
      const locationStr = `${capitalize(location.city)}.${capitalize(location.street)}.${location.houseNumber}.${location.entry}`;
      for (let i = 0; i < newImages.length; i++) {
        // Set the images directory in firebase storage as: files/companyId/fullLocation/images..
        const storageRef = ref(storage, `files/${account.companyId}/${locationStr}/${newImages[i].name}`);
        const snapshot = await uploadBytesResumable(storageRef, newImages[i]);
        const downloadURL = await getDownloadURL(snapshot.ref);
        modifiedAsset.images.push(downloadURL);
      }

      // Send Request to update the asset in the DB
      const result: Asset = await updateAsset(modifiedAsset, modifiedLocation, account.token);

      // Handle time stamps update
      result.createdAt = new Date(asset.createdAt);
      result.updatedAt = new Date();

      // Update The the Asset locally
      modifyAsset(asset._id, result);
      toast.success('Asset modified successfully');

      // --- Reset the images ui ---
      setNewImages([]);
      setImagesToRemove([]);
      setCurrentImages(modifiedAsset.images);

      setIsLoading(false);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear all global states
          removeAccount();
          clearAssets();
          clearCompany();
          clearLeads();
          clearSelectedData();
          // Remove account data from locals storage
          localStorage.removeItem('loggedInAccount');
          navigate('/');
        }
      } else {
        setIsLoading(false);
        toast.warning('Something went wrong while attempting to modify your asset');
      }
    }
  };

  const removeAssetHandler = async () => {
    if (!account) {
      return;
    }

    try {
      // Handle delete the asset from the DB
      const deletedAssetId = await deleteAsset(asset._id, account.token);

      // Handle remove the selected asset to prevent rerendering
      removeSelectedAsset();

      // Handle remove the asset from the global state
      removeAsset(deletedAssetId);
    } catch (error) {}
  };

  const closeDealHandler = async () => {
    if (!account) {
      return;
    }
    if (!company) {
      toast.warning('Please submit your company details before closing a deal');
      return;
    }

    try {
      const dealData: Omit<Deal, 'date'> = {
        accountId: account._id,
        companyId: company._id,
        commissionFee: commissionFee || 0,
        currency: currency as 'NIS' | 'USD' | 'UER',
      };

      // Request for closing a deal
      const deal: Deal = await closeDeal(asset._id, dealData, account.token);

      // Update Global memory
      setDeals([...deals, deal]);
      localCloseADeal(asset._id);

      // Update Local memory
      setAvailability('Occupied');

      toast.success('Congrats on your deal!');
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Clear all global states
          removeAccount();
          clearAssets();
          clearCompany();
          clearLeads();
          clearSelectedData();
          // Remove account data from locals storage
          localStorage.removeItem('loggedInAccount');
          navigate('/');
        }
      } else {
        toast.warning('Something went wrong while attempting to close a deal');
      }
    }
  };

  return (
    <div className='container-fluid wrapper'>
      <Modal
        header='Remove asset'
        body='You are about to remove this asset permanently. Do you like to proceed?'
        onYesCLick={removeAssetHandler}
        id='removeAssetModal'
      />
      <Modal
        header='Close a Deal'
        body={`You are about to close a deal with that asset. Your Commission fee is ${commissionFee} ${currency}. Would you like to proceed?`}
        id='closeADeal'
        onYesCLick={closeDealHandler}
      />
      <form action='' id='updateAssetForm' onSubmit={submitHandler}>
        <div className='row'>
          <div className='col-md-2'>
            <h1 className='page-title'>Asset Details: </h1>
          </div>
          <div className='col-md-4 verticalAlign'>
            <p className='assetTimeStamps'>
              <IoCalendarOutline /> Created at: {createdAt} / Updated at: {updatedAt}
            </p>
          </div>
          <div className='col-md-2 dealContainer'>
            {availability === 'Available' ? (
              <button className='btn btn-success closeDealBtn' type='button' data-bs-toggle='modal' data-bs-target='#closeADeal'>
                <PiHandshakeLight size={25} /> Close Deal!
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className='col-md-4 topRightBtns'>
            <button onClick={removeSelectedAsset} className='btn btn-link' type='button'>
              <IoArrowBack /> back
            </button>
            <button onClick={() => setShowGallery((prev) => !prev)} className='btn btn-link' type='button'>
              <IoImagesOutline /> view/Hide gallery
            </button>
            <button className='btn btn-link' type='button' data-bs-toggle='modal' data-bs-target='#removeAssetModal'>
              <FaRegTrashAlt /> remove asset
            </button>
          </div>
          {showGallery && <Gallery images={asset.images} />}
          <p className='context-white'>
            <b>partners:</b>
          </p>
          <div className='col-lg-4'>
            <MultiEntitySelect<Agent>
              items={agents}
              selectedItems={selectedAgents}
              placeholder='Select Agents...'
              setSelectedItems={setSelectedAgents}
            />
          </div>
          <div className='col-lg-4'>
            <MultiEntitySelect<Client>
              items={clients}
              selectedItems={selectedClients}
              placeholder='Select Clients...'
              setSelectedItems={setSelectedClients}
            />
          </div>
          <div className='col-lg-4'>
            <MultiEntitySelect<Lead>
              items={leads}
              selectedItems={selectedLeads}
              placeholder='Select Leads...'
              setSelectedItems={setSelectedLeads}
            />
          </div>
          <p className='context-white'>
            <b>Basic Information:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput value={assetType} setState={setAssetType} placeHolder='Asset Type' id='AssetType' name='Asset Type' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={dealCost} setState={setDealCost} placeHolder='Deal Cost' id='DealCost' name='Deal Cost' type='number' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={commissionFee}
              setState={setCommissionFee}
              placeHolder='Commission Fee'
              id='CommissionFee'
              name='Commission Fee'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryRadioButtons
              options={['New', 'Old']}
              selectedOption={assetStatus}
              placeHolder='Asset Status:'
              setOption={setAssetStatus}
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryRadioButtons options={['Rent', 'Sell']} selectedOption={dealType} placeHolder='Deal Type:' setOption={setDealType} />
          </div>
          <div className='col-lg-4'>
            <CurrencySelector currency={currency} setCurrency={setNEwCurrency} />
          </div>
          <p className='context-white'>
            <b>Location Details:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput value={country} setState={setCountry} placeHolder='Country' id='Country' name='Country' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={city} setState={setCity} placeHolder='City' id='City' name='City' type='text' />
          </div>{' '}
          <div className='col-lg-4'>
            <PrimaryInput value={street} setState={setStreet} placeHolder='Street' id='Street' name='Street' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={houseNumber}
              setState={setHouseNumber}
              placeHolder='House Number'
              id='HouseNumber'
              name='HouseNumber'
              type='text'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={entry} setState={setEntry} placeHolder='Entry' id='Entry' name='Entry' type='text' />
          </div>
          <p className='context-white'>
            <b>Property Details:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput
              value={numberOFBedrooms}
              setState={setNumberOfBedrooms}
              placeHolder='Number Of Bedrooms'
              id='NumberOfBedrooms'
              name='Number Of Bedrooms'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={numberOfBathrooms}
              setState={setNumberOfBathrooms}
              placeHolder='Number Of Bathrooms'
              id='NumberOfBathrooms'
              name='Number Of Bathrooms'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={numberOfParkings}
              setState={setNumberOfParkings}
              placeHolder='Number Of Parkings'
              id='NumberOfParkings'
              name='Number Of Parkings'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={NumberOfBalconies}
              setState={setNUmberOFBalconies}
              placeHolder='Number Of Balconies'
              id='NumberOfBalconies'
              name='Number Of Balconies'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={assetSquare}
              setState={setAssetSquare}
              placeHolder='Asset Square'
              id='AssetSquare'
              name='Asset Square'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={gardenSquare}
              setState={setGardenSquare}
              placeHolder='Garden Square'
              id='GardenSquare'
              name='Garden Square'
              type='number'
            />
          </div>
          <p className='context-white'>
            <b>Additional Information:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput value={floor} setState={setFloor} placeHolder='Floor' id='Floor' name='Floor' type='number' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={NumberOfFloors}
              setState={setNumberOfFloors}
              placeHolder='Number Of Floors'
              id='NumberOfFloors'
              name='Number Of Floors'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={numberOfAirDirections}
              setState={setNumberOFAirDirections}
              placeHolder='Number Of Air Directions'
              id='NumberOfAirDirections'
              name='Number Of Air Directions'
              type='number'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={viewType} setState={setViewType} placeHolder='View Type' id='ViewType' name='View Type' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={dateOfEntry}
              setState={setDateOFEntry}
              placeHolder='Date Of Entry'
              id='DateOfEntry'
              name='Date Of Entry'
              type='date'
            />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput
              value={exclusiveDateExtension}
              setState={setExclusiveDateExtension}
              placeHolder='Exclusive Date Extension'
              id='ExclusiveDateExtension'
              name='Exclusive Date Extension'
              type='date'
            />
          </div>
          <div className='col-lg-4'>
            <label htmlFor='AddAmenity' className='formLbl'>
              Add Amenity:
            </label>
            <div className='addAmenityContainer'>
              <input
                type='text'
                id='AddAmenity'
                name='Add Amenity'
                placeholder='Add Amenity'
                className='form-control'
                value={newAmenity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAmenity(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  // onKeyDown Enter
                  if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission when pressing enter
                    addAmenityHandler();
                  }
                }}
              />
              <button className='btn btn-link' id='AddAmenityBtn' type='button'>
                <IoMdAdd size={40} onClick={addAmenityHandler} />
              </button>
            </div>
          </div>
          <div className='col-lg-8 amenitiesContainer'>
            {amenities.map((a, index) => (
              <button key={index} className='btn btn-link amenity' type='button' onClick={() => removeAmenityHandler(index)}>
                {a}
              </button>
            ))}
          </div>
          <div className='col-lg-4'>
            <PrimaryRadioButtons
              options={['Immediately', 'Flexible']}
              selectedOption={entryType}
              placeHolder='Entry Type:'
              setOption={setEntryType}
            />
          </div>
          <div className='col-lg-4'>
            <label htmlFor='IsExclusive' className='formLbl'>
              Exclusive:
            </label>
            <button
              type='button'
              className='btn btn-success radioBtn'
              style={{ backgroundColor: isExclusive ? '#00897b' : '#ec6378' }}
              onClick={() => setIsExclusive((prevIsExclusive) => !prevIsExclusive)}
            >
              Exclusive
            </button>
          </div>
          <div className='col-lg-4'></div>
          <div className='col-lg-8'>
            <label htmlFor='AssetDescription' className='formLbl'>
              Asset Description:
            </label>
            <textarea
              value={assetDescription}
              onChange={(e) => setAssetDescription(e.target.value)}
              id='AssetDescription'
              name='AssetDescription'
              className='form-control'
            ></textarea>
          </div>
          <div className='col-lg-4'></div>
          <div className='col-lg-4'>
            <label htmlFor='AddImage' className='formLbl'>
              Add Image:
            </label>
            <input
              type='file'
              id='AddImage'
              name='Add Image'
              className='form-control'
              accept='image/*'
              onChange={imageChangeHandler}
              multiple // Allow multiple image selection
            />
          </div>
          <div className='col-lg-8'>
            <div className='uploadedImages'>
              {currentImages.map((image, index) => (
                <div
                  key={index}
                  className={`imageContainer ${imagesToRemove.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleImageClick(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={image} className='uploadedImage' alt={`Current Image ${index}`} />
                  {imagesToRemove.includes(index) && (
                    <div className='trashIcon'>
                      <FaRegTrashAlt color='#ec6378' size={50} />
                    </div>
                  )}
                </div>
              ))}
              {newImages.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} className='uploadedImage' />
              ))}
            </div>
          </div>
          <div className='col-12' style={{ textAlign: 'center' }}>
            {!isLoading ? (
              <button className='btn btn-success submitBtn' type='submit'>
                Submit Changes
              </button>
            ) : (
              spinner
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssetFullDetails;
