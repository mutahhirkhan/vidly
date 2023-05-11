// import Joi, { StringSchema } from 'joi';
// import mongoose from 'mongoose';

// interface ExtendedStringSchema extends StringSchema {
//   objectId(): this;
// }

// interface ExtendedJoi extends Joi.Root {
//   string(): ExtendedStringSchema;
// }

// const objectIdExtension: Joi.Extension = {
//   type: 'string',
//   base: Joi.string(),
//   messages: {
//     'string.objectId': '{{#label}} must be a valid object id',
//   },
//   rules: {
//     objectId: {
//       validate(value: string, helpers) {
//         if (mongoose.Types.ObjectId.isValid(value)) {
//           return value;
//         }
//         return helpers.error('string.objectId');
//       },
//     },
//   },
//   // Extend the `StringSchema` interface to include the `objectId()` method
//   // The `this` type is used to make sure the `objectId` method returns the correct schema type
//   // in this case, an `ExtendedStringSchema`
//   coerce: (value, helpers) => {
//     if (mongoose.Types.ObjectId.isValid(value)) {
//       return { value };
//     }
//     return { value, errors: helpers.error('string.objectId') };
//   },
// };

// // Create extended Joi with the `objectId()` method added to the `string()` schema
// const joi: ExtendedJoi = Joi.extend((joi) => ({
//   type: 'string',
//   base: joi.string(),
//   // Cast the `joi` object to `ExtendedStringSchema` so that it has the `objectId()` method
//   // The `this` type is used to make sure the `objectId` method returns the correct schema type
//   // in this case, an `ExtendedStringSchema`
//   coerce: (value, helpers) => {
//     if (mongoose.Types.ObjectId.isValid(value)) {
//       return { value };
//     }
//     return { value, errors: helpers.error('string.objectId') };
//   },
//   rules: {
//     objectId: {
//       validate(value: string, helpers) {
//         if (mongoose.Types.ObjectId.isValid(value)) {
//           return value;
//         }
//         return helpers.error('string.objectId');
//       },
//     },
//   },
// }) as any);

// export default joi;

// // create extended Joi
// // const Joi: ExtendedJoi = BaseJoi.extend(stringObjectExtension);

// // export default Joi;

// // create new mongodb id
// const id = new mongoose.Types.ObjectId();

// const objIdSchema = joi.object({
//  _id: joi.string().objectId(),
//  name: joi.string(),
// });

// // will fail because it won't pass the Joi.string() validation
// const data1 = {
//   id: id,
// };
// console.log(objIdSchema.validate(data1).error);

// // will succeed
// const data2 = {
//   id: id.toHexString(),
// };
// console.log(objIdSchema.validate(data2).error);