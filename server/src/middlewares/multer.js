import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/images"
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage });
