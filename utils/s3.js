// const aws = require("aws-sdk");
// const crypto = require("crypto");
// const util = require("util");

// const randomBytes = util.promisify(crypto.randomBytes);

// // const region = "us-east-1";
// // const bucketName = "gosocialaws";
// const accessKeyId = process.env.AWSAccessKeyId;
// const secretAccessKey = process.env.AWSSecretKey;

// const s3 = new aws.S3({
//   region: "ap-south-1",
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: "v4",
// });

// async function generateUploadURL() {
//   const rawBytes = await randomBytes(16);
//   const imageName = rawBytes.toString("hex");

//   const params = {
//     Bucket: "o-social-image-upload",
//     Key: imageName,
//     Expires: 60,
//   };

//   const uploadURL = await s3.getSignedUrlPromise("putObject", params);
//   return uploadURL;
// }

// module.exports = { generateUploadURL };

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWSSecretKey,
  accessKeyId: process.env.AWSAccessKeyId,
  region: process.env.AWSRegion,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSBucket,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Math.random().toString(36).substring(2, 8) + file.originalname);
    },
  }),
});

module.exports = upload;
