const pool = require("../../config/database");

module.exports = {
  //Creates New Users
  createUser: (data, callback) => {
    console.log(data);
    pool.query(
      //remember to change back table user_information to user
      `insert into users(nationalId, fullName, emailAddress, password, createdDate)
            values(?,?,?,?,?)`,
      [
        data.nationalId,
        data.fullName,
        data.emailAddress,
        data.password,
        Date(),
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch All Users
  fetchUsers: (callback) => {
    pool.query(
      `select a.nationalId, a.fullName, a.emailAddress, a.phoneNumber, a.rank, a.dateCreated, b.status from user_information a, users b where a.nationalId = b.nationalId`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Users by User ID
  fetchUserById: (nationalId, callback) => {
    pool.query(
      `select nationalId, fullName, emailAddress, password, createdDate from users where nationalId = ?`,
      [nationalId],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  //Fetch Users by User Email
  fetchUserByEmail: (emailAddress, callback) => {
    pool.query(
      `select a.nationalId, a.fullName, a.emailAddress, a.status, a.password, a.createdDate, b.rank, b.phoneNumber from users a, user_information b where a.emailAddress = b.emailAddress and a.emailAddress = ?`,
      [emailAddress, "Active"],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  //Update User Information by User ID
  updateUserInfo: (data, callback) => {
    pool.query(
      `update users a, user_information b set a.nationalId = ?, a.fullName = ?, a.emailAddress = ?, b.nationalId = ?, b.fullName = ?, b.emailAddress = ?, b.phoneNumber = ?, b.rank = ? where a.nationalId = b.nationalId and a.nationalId = ?`,
      [
        data.nationalId,
        data.fullName,
        data.emailAddress,
        data.nationalId,
        data.fullName,
        data.emailAddress,
        data.phoneNumber,
        data.rank,
        data.nationalId,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create User Information
  createUserDetails: (data, callback) => {
    pool.query(
      `insert into user_information(nationalId, fullName, emailAddress, phoneNumber, rank, dateCreated)
            values(?,?,?,?,?,?)`,
      [
        data.nationalId,
        data.fullName,
        data.emailAddress,
        data.phoneNumber,
        data.rank,
        Date(),
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Users Details by User ID
  fetchUserDetailsById: (user_id, callback) => {
    pool.query(
      `select nationalId, fullName, emailAddress, phoneNumber, rank, dateCreated from user_information where nationalId = ?`,
      [user_id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  //Fetch all Users Details
  fetchUserDetails: (callback) => {
    pool.query(
      `select nationalId, fullName, emailAddress, phoneNumber, rank, dateCreated from user_information`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  //Update User Information by User ID
  updateUserDetailsByID: (data, callback) => {
    pool.query(
      `update user_information set nationalId =?, fullName = ?, phoneNumber = ?, emailAddress = ?, city = ?, suburb = ?, date_of_birth = ?, gender = ?, image_url = ? where user_id = ?`,
      [
        data.nationa_id,
        data.full_name,
        data.phone_number,
        data.email_address,
        data.city,
        data.suburb,
        data.date_of_birth,
        data.gender,
        data.image_url,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Creates New Users
  createVideo: (data, callback) => {
    console.log(data);
    pool.query(
      //remember to change back table user_information to user
      `insert into videos(id, title, category, length, dateCreated)
            values(?,?,?,?,?)`,
      [data.id, data.title, data.category, data.length, data.dateCreated],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Update User Information by User ID
  updateVideo: (data, callback) => {
    pool.query(
      `update videos set title =?, length = ?, category = ? where id = ?`,
      [
        data.title,
        data.length,
        data.category,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch all Users Details
  fetchAllVideos: (data, callback) => {
    pool.query(
      `select id, title, category, length, dateCreated from videos where category = ?`,
      [data.videoType],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Creates New publications
  createPublication: (data, callback) => {
    console.log(data);
    pool.query(
      //remember to change back table user_information to user
      `insert into publications(id, title, pages, dateCreated)
            values(?,?,?,?)`,
      [data.id, data.title, data.pages, data.dateCreated],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch all Publications
  fetchAllPublications: (callback) => {
    pool.query(
      `select id, title, pages, dateCreated from publications`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch all Users Details
  fetchAllSignals: (callback) => {
    pool.query(
      `select id, title, title as mediaLink, dateCreated from signals`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Creates New publications
  createSignal: (data, callback) => {
    console.log(data);
    pool.query(
      //remember to change back table user_information to user
      `insert into signals(id, title, dateCreated)
            values(?,?,?)`,
      [data.id, data.title, data.dateCreated],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
