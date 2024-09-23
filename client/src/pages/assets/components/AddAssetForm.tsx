import React, { useState } from 'react';
import { storage } from '../../../services/firebaseConfig';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';

// ----- Global states -----
import useAccountStore from '../../../store/useAccountStore';
import useAssetsStore from '../../../store/useAssetsStore';
import useSelectedDataStore from '../../../store/useSelectedDataStore';
import useLeadsStore from '../../../store/useLeadsStore';
import useCompanyStore from '../../../store/useCompanyStore';

// ----- Interfaces -----
import { Asset, Location } from '../../../models/asset';

// ----- Components -----
import PrimaryRadioButtons from '../../../components/inputs/PrimaryRadioButtons';
import PrimaryInput from '../../../components/inputs/PrimaryInput';
import CurrencySelector from './CurrencySelector';
import { spinner } from '../../../utils/elements';

// ----- Icons -----
import { IoMdAdd } from 'react-icons/io';

// ----- Functions -----
import { createAsset } from '../../../services/assetServices';
import { isAxiosError } from '../../../utils/functions';
import { useNavigate } from 'react-router-dom';
import { capitalize } from '../../../utils/functions';

/**
 * This component holds a form for adding a new Asset
 */
const AddAssetForm = () => {
  // ----- Global states -----
  const { account, removeAccount } = useAccountStore();
  const { addAsset, clearAssets } = useAssetsStore();
  const clearLeads = useLeadsStore((state) => state.clearLeads);
  const { clearCompany, company } = useCompanyStore();
  const { removeSelectedAsset, clearSelectedData } = useSelectedDataStore();
  const navigate = useNavigate();
  // -----

  // ----- Local states -----

  // --- ui ---
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Basic information ---
  const [assetType, setAssetType] = useState<string>('');
  const [dealCost, setDealCost] = useState<number | null>(null);
  const [commissionFee, setCommissionFee] = useState<number | null>(null);
  const [assetStatus, setAssetStatus] = useState<string>('New');
  const [dealType, setDealType] = useState<string>('Rent');
  const [currency, setCurrency] = useState<string>('NIS');

  // --- Location states ---
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<string>('');
  const [entry, setEntry] = useState<string>('');

  // --- Property details ---
  const [numberOFBedrooms, setNumberOfBedrooms] = useState<number | null>(null);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<number | null>(null);
  const [numberOfParkings, setNumberOfParkings] = useState<number | null>(null);
  const [NumberOfBalconies, setNUmberOFBalconies] = useState<number | null>(null);
  const [assetSquare, setAssetSquare] = useState<number | null>(null);
  const [gardenSquare, setGardenSquare] = useState<number | null>(null);

  // --- Additional information ---
  const [floor, setFloor] = useState<number | null>(null);
  const [NumberOfFloors, setNumberOfFloors] = useState<number | null>(null);
  const [numberOfAirDirections, setNumberOFAirDirections] = useState<number | null>(null);
  const [viewType, setViewType] = useState<string>('');
  const [dateOfEntry, setDateOFEntry] = useState<Date | null>(null);
  const [exclusiveDateExtension, setExclusiveDateExtension] = useState<Date | null>(null);
  const [newAmenity, setNewAmenity] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [entryType, setEntryType] = useState<string>('Immediately');
  const [isExclusive, setIsExclusive] = useState<boolean>(true);
  const [assetDescription, setAssetDescription] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  // -----

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
      setImages(fileList);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!account) {
      return;
    }
    if (!company) {
      toast.warning('Please submit your company details before adding any assets');
      return;
    }

    setIsLoading(true);

    const location: Omit<Location, '_id'> = {
      country,
      city,
      street,
      houseNumber,
      entry,
    };

    let newAsset: Omit<Asset, '_id' | 'location' | 'updatedAt' | 'createdAt' | 'availability' | 'availability' | 'clients' | 'leads'> = {
      assetType,
      dealCost: dealCost || 0,
      commissionFee: commissionFee || 0,
      assetStatus,
      dealType,
      currency,
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
      dateOfEntry: dateOfEntry || new Date(),
      exclusiveDateExt: exclusiveDateExtension || new Date(),
      amenities,
      entryType,
      isExclusive,
      assetDescription,
      images: [],
      agents: [account._id as string],
      companyId: account.companyId || '',
    };

    // Handle send the new asset to the DB
    try {
      // Handle uploading the asset's images to firebase
      const locationStr = `${capitalize(location.city)}.${capitalize(location.street)}.${location.houseNumber}.${location.entry}`;
      for (let i = 0; i < images.length; i++) {
        // Set the images directory in firebase storage as: files/companyId/fullLocation/images..
        const storageRef = ref(storage, `files/${account.companyId}/${locationStr}/${images[i].name}`);
        const snapshot = await uploadBytesResumable(storageRef, images[i]);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newAsset.images.push(downloadURL);
      }

      // Handle posting the new asset to the DB
      const asset: Asset = await createAsset(newAsset, location, account._id, account.token);

      // Handle adding the created asset to global state
      addAsset(asset);

      // Handle navigating back to My Assets screen
      removeSelectedAsset();
      navigate('myassets');
      toast.success('Asset created successfully');
    } catch (error) {
      // Check unauthorized action
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
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className='container-fluid'>
      <form action='' id='newAssetForm' onSubmit={submitHandler}>
        <h1 className='page-title'>Create a new Asset</h1>
        <div className='row'>
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
            <CurrencySelector currency={currency} setCurrency={setCurrency} />
          </div>
          <p className='context-white'>
            <b>Location Details:</b>
          </p>
          <div className='col-lg-4'>
            <PrimaryInput value={country} setState={setCountry} placeHolder='Country' id='Country' name='Country' type='text' />
          </div>
          <div className='col-lg-4'>
            <PrimaryInput value={city} setState={setCity} placeHolder='City' id='City' name='City' type='text' />
          </div>
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
              mandatory
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
              {images.map((image, index) => (
                <img key={index} src={URL.createObjectURL(image)} alt={`Image ${index}`} className='uploadedImage' />
              ))}
            </div>
          </div>
          <div className='col-12' style={{ textAlign: 'center' }}>
            {!isLoading ? (
              <button className='btn btn-success submitBtn' type='submit'>
                Submit
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

export default AddAssetForm;
