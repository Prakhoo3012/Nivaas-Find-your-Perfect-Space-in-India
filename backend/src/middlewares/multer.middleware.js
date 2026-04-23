import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("DESTINATION CALLED");
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // console.log("FILENAME CALLED");
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage });
