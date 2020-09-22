const userService = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const crypto = require("crypto");
const dateFormat = require("dateformat");

module.exports = {
  //Create a New User
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    var errorMessage = "";
    var saveUser = true;

    userService.fetchUsers((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }

      if (!err) {
        results.filter(function (item) {
          if (item.emailAddress == body.emailAddress) {
            errorMessage = "This Email Address already exists.";
            saveUser = false;
            return res.status(200).json({
              success: 0,
              message: errorMessage,
              data: err,
            });
          } else if (item.nationalId == body.nationalId) {
            errorMessage = "This National ID already exists.";
            saveUser = false;
            return res.status(200).json({
              success: 0,
              message: errorMessage,
              data: err,
            });
          }
        });
        if (saveUser) {
          //Call the Create User Function in User Service
          userService.createUser(body, (err, results) => {
            if (err) {
              console.log("Error Occurred :: ", err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
                data: err,
              });
            } else {
              userService.createUserDetails(body, (err, results) => {
                console.log("body::" + body.password);
                if (err) {
                  console.log("Error Occurred :: ", err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    data: err,
                  });
                }

                return res.status(200).json({
                  success: 1,
                  message:
                    "Account Created Successfully. Please proceed to Login.",
                  data: results,
                });
              });
            }
          });
        }
      }
    });
  },

  //Fetch All Users
  fetchAllUser: (req, res) => {
    //Call the Fetch All Users Function in User Service
    userService.fetchUsers((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      console.log(results)
      return res.status(200).json({
        success: 1,
        message: "Accounts Fetched Successfully",
        data: results,
      });
    });
  },

  //Fetch Single User by ID
  fetchUserById: (req, res) => {
    const nationalId = req.body.nationalId;

    //Call the Create User Function in User Service
    userService.fetchUserById(nationalId, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(500).json({
          success: 0,
          message: "No record found",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Account Details Found",
        data: results,
      });
    });
  },

  //Create a New User
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    // body.password = hashSync(body.password, salt);
    console.log("Edit user information " + JSON.stringify(req.body))

    //Call the Create User Function in User Service
    userService.updateUserInfo(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(500).json({
          success: 0,
          message: "Failed to Update User",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "User Information Updated Successfully",
        data: results,
      });
    });
  },

  //Login Function
  loginUser: (req, res) => {
    const body = req.body;
    userService.fetchUserByEmail(body.emailAddress, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "User Record not found",
          token: null,
          data: {
            nationalIdd: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
      if (results.status != "Active") {
        return res.status(200).json({
          success: 0,
          message: "User is Deactivated, Please contact System Administrator.",
          token: null,
          data: {
            nationalIdd: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsonToken = sign({ result: results }, process.env.TOKEN_ENC_KEY, {
          // expiresIn: "2h",
          expiresIn: "2h",
        });
        return res.status(200).json({
          success: 1,
          message: "User Successfully Logged in",
          token: jsonToken,
          data: results,
        });
      } else {
        return res.status(200).json({
          success: 0,
          message: "Invalid User Email or Password",
          token: null,
          data: {
            nationaId: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
    });
  },

  //Fetch Single User by ID
  fetchUserDetailsById: (req, res) => {
    const user_id = req.body.user_id;

    //Call the Create User Function in User Service
    userService.fetchUserDetailsById(user_id, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(500).json({
          success: 0,
          message: "No record found",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Account Details Found",
        data: results,
      });
    });
  },

  //Login Function
  fetcAllUsers: (req, res) => {
    const body = req.body;
    userService.fetchUserDetails((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "No user records found",
          token: null,
          data: {
            userId: null,
            fullName: null,
            emailAddress: null,
            phoneNumber: null,
            rank: null,
            createdDate: null,
          },
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Account Details Found",
        data: results,
      });
    });
  },

  //Update User Details by ID
  updateUserDetailsByID: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    //Call the Create User Function in User Service
    userService.updateUserDetailsByID(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(500).json({
          success: 0,
          message: "Failed to Update User",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Account Updated Successfully",
        data: results,
      });
    });
  },

  //Create new video
  createVideo: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    console.log("Random ID :: " + id);
    req.body.id = id;
    console.log("data is "+JSON.stringify(req.body))
    req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    const body = req.body;
    userService.createVideo(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Video successfully added.",
          data: results,
        });
      }
    });
  },

  //Update video
  updateVideo: (req, res) => {
    // const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    // console.log("Random ID :: " + id);
    // req.body.id = id;
    console.log("data is "+JSON.stringify(req.body))
    // req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    const body = req.body;
    userService.updateVideo(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Video updated successfully.",
          data: results,
        });
      }
    });
  },

  //Fetch all videos
  fetchAllVideos: (req, res) => {
    const body = req.body;
    userService.fetchAllVideos(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "No video found",
          token: null,
          data: {
            id: null,
            title: null,
            length: null,
            dateCreated: null,
          },
        });
      }
      return res.status(200).json({
        success: 1,
        message: "All videos fetched",
        data: results,
      });
    });
  },

  //Create new publication
  createPublication: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    console.log("Random ID :: " + id);
    req.body.id = id;
    req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    const body = req.body;
    userService.createPublication(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Video successfully added.",
          data: results,
        });
      }
    });
  },

  //Fetch all videos
  fetcAllPublications: (req, res) => {
    const body = req.body;
    userService.fetchAllPublications((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "No publication found",
          token: null,
          data: {
            id: null,
            title: null,
            pages: null,
            dateCreated: null,
          },
        });
      }
      return res.status(200).json({
        success: 1,
        message: "All publications fetched",
        data: results,
      });
    });
  },

  //Fetch all signals
  fetcAllSignals: (req, res) => {
    const body = req.body;
    userService.fetchAllSignals((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "No signal found",
          token: null,
          data: {
            id: null,
            title: null,
            pages: null,
            dateCreated: null,
          },
        });
      }
      return res.status(200).json({
        success: 1,
        message: "All signals fetched",
        data: results,
      });
    });
  },

  //Create new signal
  createSignal: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    console.log("Random ID :: " + id);
    req.body.id = id;
    // req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    req.body.dateCreated = new Date();
    const body = req.body;
    userService.createSignal(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Video successfully added.",
          data: results,
        });
      }
    });
  },
};
