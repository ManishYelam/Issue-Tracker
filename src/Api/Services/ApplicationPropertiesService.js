const { ApplicationProperties } = require('../Models/Association');

module.exports = {
  createOrUpdateProperty: async (propertyData) => {
    try {
      const existingProperty = await ApplicationProperties.findOne({
        where: {
          property_name: propertyData.property_name,
          property_value: propertyData.property_value,
        },
      });

      if (existingProperty) {
        const result = await existingProperty.update(propertyData);
        return {
          message: 'Application property updated successfully.',
          result,
        };
      } else {
        const result = await ApplicationProperties.create(propertyData);
        return {
          message: 'Application property created successfully.',
          result,
        };
      }
    } catch (error) {
      throw new Error(
        'Error while creating/updating application property: ' + error.message
      );
    }
  },

  createOrUpdateBulkProperties: async (propertiesData) => {
    try {
      const result = [];
      for (const propertyData of propertiesData) {
        const existingProperty = await ApplicationProperties.findOne({
          where: {
            property_name: propertyData.property_name,
            property_value: propertyData.property_value,
          },
        });

        if (existingProperty) {
          const updatedProperty = await existingProperty.update(propertyData);
          result.push({
            message: 'Application property updated successfully.',
            property: updatedProperty,
          });
        } else {
          const createdProperty =
            await ApplicationProperties.create(propertyData);
          result.push({
            message: 'Application property created successfully.',
            property: createdProperty,
          });
        }
      }

      return result;
    } catch (error) {
      throw new Error(
        'Error while creating/updating application properties: ' + error.message
      );
    }
  },

  getAllProperties: async () => {
    try {
      return await ApplicationProperties.findAll();
    } catch (error) {
      throw new Error(
        'Error while fetching application properties: ' + error.message
      );
    }
  },

  getPropertyById: async (id) => {
    try {
      return await ApplicationProperties.findOne({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        'Error while fetching the application property: ' + error.message
      );
    }
  },

  deleteProperty: async (id) => {
    try {
      const property = await ApplicationProperties.findOne({ where: { id } });
      if (property) {
        await property.destroy();
        return { message: 'Property deleted successfully' };
      }
      throw new Error('Property not found');
    } catch (error) {
      throw new Error(
        'Error while deleting the application property: ' + error.message
      );
    }
  },
};
