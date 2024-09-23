import express from 'express';
import Asset from '../models/asset.js';
import Location from '../models/location.js';
import auth from '../middleware/auth.js';
import Deal from '../models/deal.js';

const assetsRouter = express.Router();

//////////////////////////////////////// create new Asset ////////////////////////////////////////
assetsRouter.post('/newasset', auth, async (req, res) => {
  /**
   * Expected request body
   * req.body = {
   *  accountId,
   *  images,
   *  asset:{},
   *  location: {
   *    _id
   *  }
   * }
   */
  try {
    const accountId = req.body.accountId;
    // Handle location
    const location = await Location.createOrUpdateLocation({ ...req.body.location });

    // Check if an Asset already exists for the given Location
    const existingAsset = await Asset.findOne({ location: location._id });
    if (existingAsset) {
      return res.status(409).send({ message: 'An asset in the exact location already exists' });
    }

    // Create Asset
    const asset = new Asset({
      ...req.body.asset,
      agents: [accountId],
      //images: imagesUrls, // Use the imagesUrls here
      location: location._id,
    });

    const savedAsset = await asset.save();
    const plainAsset = savedAsset.toObject();
    plainAsset.location = location;

    res.status(201).send(plainAsset);
  } catch (error) {
    console.error('Error creating new asset:', error);
    res.status(500).send({ message: 'Something went wrong while trying to create an Asset' });
  }
});

//////////////////////////////////////// modify existing Asset ////////////////////////////////////////
assetsRouter.put('/asset', auth, async (req, res) => {
  /**
   * Expected request body
   * req.body = {
   *  images,
   *  asset:{},
   *  location: {
   *    _id
   *  }
   * }
   */
  try {
    // Validate the asset ID
    if (!req.body.asset._id) {
      return res.status(400).send({ message: 'Asset ID is required' });
    }

    // Handle Location
    const location = await Location.createOrUpdateLocation({ ...req.body.location });

    // Handle Asset modification
    const modifiedAsset = await Asset.findByIdAndUpdate(
      req.body.asset._id,
      { ...req.body.asset, location: location._id },
      { new: true } // Return the updated document
    ).populate('location');

    if (!modifiedAsset) {
      return res.status(404).send({ message: 'Asset not found' });
    }

    res.status(200).send(modifiedAsset);
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong while trying to fetch assets' });
  }
});

//////////////////////////////////////// Get assets by account id ////////////////////////////////////////
assetsRouter.get('/assets/:id', auth, async (req, res) => {
  const accountId = req.params.id;

  try {
    // Find assets where the agents array contains the account ID
    const assets = await Asset.find({ companyId: accountId }).populate('location');

    // Check if assets were found
    if (!assets || assets.length === 0) {
      return res.status(404).send({ message: 'No assets found for the given account ID' });
    }

    // Send the found assets as a response
    res.status(200).send(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).send({ message: 'Something went wrong while trying to fetch assets' });
  }
});

assetsRouter.delete('/asset/:id', auth, async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) {
      return res.status(404).send({ message: 'Asset not found' });
    }

    res.status(200).send(deletedAsset._id);
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong while trying to delete an asset' });
  }
});

//////////////////////////////////////// Create Deal ////////////////////////////////////////
assetsRouter.post('/deal', auth, async (req, res) => {
  try {
    // Fetch the asset to check its availability
    const asset = await Asset.findById(req.body.assetId);
    // If the asset is not found or is already occupied, return an error
    if (!asset || asset.availability === 'Occupied') {
      return res.status(400).send({ message: 'The asset is not available for a deal' });
    }

    // Handle update Asset availability
    await Asset.findByIdAndUpdate(req.body.assetId, { availability: 'Occupied' }, { runValidators: true });

    // Handle creating a deal
    const deal = new Deal(req.body.deal);
    const savedDeal = await deal.save();
    const dealObject = savedDeal.toObject();

    res.status(201).send(dealObject);
  } catch (error) {
    res.status(500).send({ message: 'Something went wrong while trying to create a deal' });
  }
});

export default assetsRouter;
