// const path = require("path");
// const multer = require("multer");

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// var upload = multer({
//   storage: storage,
//   fileFilter: async function (req, file, callback) {
//     try {
//       console.log(file, "====");
//       if (
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpg" ||
//         file.mimetype == "image/jpeg"
//       ) {
//         await callback(null, true);
//       } else {
//         console.log("only jpg & png file supported");
//         await callback(null, false);
//       }
//     } catch (e) {
//       console.log(file, "====");
//     }
//   },
//   //   limits: {
//   //     fileSize: 1024 * 1024 * 2,
//   //   },
// });

// module.exports = upload;

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

module.exports = upload;
