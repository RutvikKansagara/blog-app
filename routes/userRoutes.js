const express = require("express");

const router = express.Router();

const {
  register,
  login,
  deleteUser,
  getUserDetails,
  updateUserDetails,
  logout
} = require("../controllers/userController");

const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter,
});

router.post("/register", upload.single("pic"), register);
router.post("/login", login);
router.delete("/delete/:userId", deleteUser);
router.get("/user-details/:userId", getUserDetails);
router.put("/update-user-details/:userId", upload.single("pic"), updateUserDetails);
router.post("/logout", logout)
module.exports = router;
