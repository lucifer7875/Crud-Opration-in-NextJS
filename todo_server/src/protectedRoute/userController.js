const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');
const UserIntresedArea = require('../models/UserIntrestedArea');
const IntresedArea = require('../models/IntrestedArea');
const fs = require('fs');
const mv = require('mv');


// Get All route handler

// exports.getAllUser = async (req, res) => {
//   try {
//     const users = await User.findAll();
//    res.status(201).json({ message: 'Record fetched successfully', users });
//   } catch ({ message }) {
//     throw new Error(message);
//   }
// }
// exports.createUser = async (req, res) => {
//   try {
//     const { name, email, mobileNumber, interestArea, country, state, city, currentLocation, status, hobbies, file } = req.body;

//     // Check if the user with the same email already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.json({ status: 403, message: 'User with this email already exists' });
//     }

//     // Generate a unique user ID using the first 3 letters of the name and a number
//     const userId = await generateUniqueUserId(name);

//     // Create a new user with the generated userId
//     // const newUser = await User.create({ userId, name, email, status });
//     const newUser = await User.create({ userId, name, email, mobileNumber, country, state, city, currentLocation, status, file });

//     if (interestArea !== null) {
//       for (let i = 0; i < interestArea.length; i++) {
//         if (interestArea[i] && interestArea[i].__isNew__ === true) {
//           await IntresedArea.create({
//             name: interestArea[i].label,
//           });
//         }
//         const tagById = await IntresedArea.findIdByName(interestArea[i].label).then(
//           (tagId) => {
//             return tagId;
//           },
//         );

//         await UserIntresedArea.create({
//           id: newUser.id,
//           intrestedAreaId: tagById,
//         });
//       }
//     }
//     res.status(201).json({ status: 200, message: 'User Create successfully', userId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };
const createUser = async (req, res) => {
  try {
    const { name, email, mobileNumber, interestArea, country, state, city, currentLocation, hobbies, images } = req.body.values;
    const { status } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(403).json({ status: 403, message: 'User with this email already exists' });
    }

    const userId = await generateUniqueUserId(name);
    const newUser = await User.create({ userId, name, email, mobileNumber, country, state, city, currentLocation, status, images, hobbies: JSON.stringify(hobbies) });

    if (interestArea && interestArea.length > 0) {
      for (let i = 0; i < interestArea.length; i++) {
        if (interestArea[i] && interestArea[i].__isNew__ === true) {
          await IntresedArea.create({
            name: interestArea[i].label,
          });
        }
        const tagById = await findIdByName(interestArea[i].label).then(
          (tagId) => {
            return tagId;
          },
        );

        await UserIntresedArea.create({
          userId: newUser.id,
          intrestedAreaId: tagById,
        });
      }
    }

    res.status(201).json({ status: 200, message: 'User created successfully', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.createUser = createUser;


// Function to generate a unique user ID
async function generateUniqueUserId(name) {
  const prefix = name.substring(0, 3).toUpperCase(); // Take the first 3 letters and make them uppercase
  let userId;
  let isUnique = false;

  // Generate a unique user ID by appending a number
  let count = 1;
  while (!isUnique) {
    userId = prefix + count.toString().padStart(4, '0'); // You can change the padding to match your needs
    // Check if the generated userId is unique in the database
    const existingUser = await User.findOne({ where: { userId } });
    if (!existingUser) {
      isUnique = true;
    } else {
      count++;
    }
  }

  return userId;
}

async function findIdByName(nameToFind) {

  try {
    const tag = await IntresedArea.findOne({
      where: {
        name: nameToFind,
      },
    });
    return tag.id;
  } catch (error) {
    console.error('Error finding ID by name:', error);
    return error;
  }
}
exports.getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID parameter is missing' });
    }

    const user = await User.findOne({
      where: {
        id: id,
        deleted: 0
      },
      include: [{
        model: UserIntresedArea,
        as: 'userIntresedArea',
        attributes: ['intrestedAreaId'],
        include: [
          {
            model: IntresedArea,
            as: 'tag',
            attributes: [
              ['name', 'value'],
              ['name', 'label'],
            ],
          },
        ],
      },]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Record fetched successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Can\'t fetch record' });
  }
};
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params
//     const { name, email, status } = req.body;

//     const existingUser = await User.findOne({ where: { email } });
//     
//     if (existingUser.id !== id) {
//       const existingEmail = await User.findOne({ where: { email } });
//       if (existingEmail) {
//         return res.json({ status: 403, message: 'User with this email already exists' });
//       }
//     } else {
//       const updatedUser = await User.update({ name, email, status }, { where: { id: id } });

//       if (updatedUser[0] === 1) {
//         res.status(200).json({ status: 200, message: 'User updated successfully' });
//       } else {
//         res.status(404).json({ status: 404, message: 'User with this ID does not exist' });
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: `Can't update record` });
//   }
// };
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobileNumber, interestArea, country, state, city, currentLocation, images, hobbies } = req.body.values;
    const { status } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.id !== +id) {
      return res.status(500).json({ status: 500, message: 'User with this email already exists' });
    }

    const [updatedRowsCount] = await User.update({ name, email, mobileNumber, country, state, city, currentLocation, images, hobbies: JSON.stringify(hobbies), status }, { where: { id } });

    // destroy table row with same id
    await UserIntresedArea.destroy({
      where: { userId: id },
    });

    // create new 
    if (interestArea && interestArea.length > 0) {
      for (let i = 0; i < interestArea.length; i++) {
        if (interestArea[i] && interestArea[i].__isNew__ === true) {
          await IntresedArea.create({
            name: interestArea[i].label,
          });
        }
        const tagById = await findIdByName(interestArea[i].label).then(
          (tagId) => {
            return tagId;
          },
        );

        await UserIntresedArea.create({
          userId: id,
          intrestedAreaId: tagById,
        });
      }
    }
    if (updatedRowsCount === 1) {
      res.status(200).json({ status: 200, message: 'User updated successfully' });
    } else {
      res.status(404).json({ status: 404, message: 'User with this ID does not exist' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: `Can't update record` });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await User.update(
      { deleted: 1 },
      {
        where: {
          id: id,
        },
        order: [['createdAt', 'DESC']]
      },
    );
    const users = await User.findAll({
      where: {
        deleted: 0
      },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ message: 'Record deleted successfully', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Can't delete record` });
  }
};
exports.getAllUser = async (req, res) => {
  const { search, orderBy, orderType } = req.query

  try {
    const whereClause = {
      deleted: 0, // Exclude deleted Projects,
    };
    if (search) {
      whereClause[Op.or] = {
        name: { [Op.like]: `%${search}%` },
        email: { [Op.like]: `%${search}%` },
        userId: { [Op.like]: `%${search}%` },
      };
    }

    const order = [];
    if (orderBy) {

      order.push([orderBy, orderType || 'ASC']);

    }
    const users = await User.findAll({
      where: whereClause,
      order
    });
    res.status(200).json({ message: 'Records fetched successfully', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Can't fetch records` });
  }
};
exports.getAllUserWithBody = async (req, res) => {
  const { search, orderBy, orderType } = req.body



  try {
    const whereClause = {
      deleted: 0, // Exclude deleted Projects,
    };
    if (search) {
      whereClause[Op.or] = {
        name: { [Op.like]: `%${search}%` },
        email: { [Op.like]: `%${search}%` },
        userId: { [Op.like]: `%${search}%` },
      };
    }

    const order = [];
    if (orderBy) {

      order.push([orderBy, orderType || 'ASC']);

    }
    const users = await User.findAll({
      where: whereClause,
      order
    });
    res.status(200).json({ message: 'Records fetched successfully', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Can't fetch records` });
  }
};
exports.getUserCountInWeek = async (req, res) => {
  const { startDate } = req.query
  try {
    const { weekStart, weekEnd } = getStartAndEndOfWeek(startDate);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const userCountsByDay = {};
    const userCountWeekWise = await User.count({
      where: {
        deleted: 0,
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    daysOfWeek.forEach(day => {
      userCountsByDay[day] = 0;
    });

    // Calculate user counts for each day of the week
    const users = await User.findAll({
      where: {
        deleted: 0,
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    users.forEach(user => {
      const createdDay = user.createdAt.getDay();
      userCountsByDay[daysOfWeek[createdDay]] += 1;
    });

    res.json({
      status: 200,
      message: 'User count for the selected week fetched successfully',
      WeeklyCount: userCountWeekWise,
      dailyCount: userCountsByDay,
      users: users
    });
  } catch (error) {
    console.error(error);
    res.json({ status: 500, message: `Can't fetch user count for the selected week` });
  }
};

exports.getAllIntrestedAre = async (req, res) => {
  try {
    const whereClause = {
      deleted: {
        [Op.eq]: 0, // Exclude deleted Projects
      }
    };

    const intresedAreas = await IntresedArea.findAll({
      attributes: [
        ['name', 'label'],
        ['name', 'value'],
      ],
      where: whereClause,
      order: [['id', 'DESC']], // Correct syntax for ordering
    });

    res.status(200).json({ message: 'Records fetched successfully', intresedAreas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Can't fetch records` });
  }
};
// Helper function to get the start and end dates of the current week
function getStartAndEndOfWeek(startDate) {

  const currentDate = new Date(startDate);
  const currentDay = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  //first day of the week (Sunday)
  startOfWeek.setDate(currentDate.getDate() - currentDay);

  const endOfWeek = new Date(currentDate);
  //last day of the week (Saturday)
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDay));

  startOfWeek.setHours(0, 0, 0, 0);
  endOfWeek.setHours(23, 59, 59, 999);

  return { weekStart: startOfWeek, weekEnd: endOfWeek };
}

/**
 * Upload Image
 * @param req
 * @param res
 * @param id
 * @param published
 * @returns
 */
// exports.getImageUpload = async (req, res) => {
//   try {

//     const result = new Promise((resolve, reject) => {
//       const imgArr = [];
//       const publicDir = 'public/uploadImage/assets';
//       if (!fs.existsSync(publicDir)) {
//         fs.mkdirSync(publicDir);
//       }
//       // eslint-disable-next-line no-plusplus
//       for (let i = 0; i < req.files.length; i++) {
//         const timeStampInMs = new Date().getTime();
//         const oldpath = req.files[i].path;
//         const filename = `${timeStampInMs}_${req.files[i].originalname}`;
//         const newpath = `public/uploadImage/assets/${timeStampInMs}_${req.files[i].originalname}`;
//         const imagePath = `http://localhost:8099/public/uploadImage/assets/${timeStampInMs}_${req.files[i].originalname}`;
//         mv(oldpath, newpath, (err) => {
//           if (err) {
//             reject(err);
//           }
//           const obj = {
//             filename,
//             originalname: req.files[i].originalname,
//             url: imagePath,
//             uploaded: 1,
//           };
//           imgArr.push(obj);
//           if (i === req.files.length - 1) {
//             resolve(imgArr);
//           }
//         });
//       }
//     });
//     if (result) {
//       res.status(200).json({ message: `Successfuly hit API`, result });
//     }
//     res.status(404).json({ message: `Something went wrong` });
//   } catch (error) {
//     console.log("841", error)
//   } res.status(500).json({ message: `Something went wrong` });
// };

exports.getImageUpload = async (req, res) => {
  try {
    const imgArr = [];
    const publicDir = 'public/uploadImage/assets';
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    for (let i = 0; i < req.files.length; i++) {
      const timeStampInMs = new Date().getTime();
      const oldpath = req.files[i].path;
      const filename = `${timeStampInMs}_${req.files[i].originalname}`;
      const newpath = `public/uploadImage/assets/${timeStampInMs}_${req.files[i].originalname}`;
      const imagePath = `http://localhost:5012/public/uploadImage/assets/${timeStampInMs}_${req.files[i].originalname}`;

      await new Promise((resolve, reject) => {
        mv(oldpath, newpath, (err) => {
          if (err) {
            reject(err);
          }
          const obj = {
            filename,
            originalname: req.files[i].originalname,
            url: imagePath,
            uploaded: 1,
          };
          imgArr.push(obj);
          resolve();
        });
      });
    }

    res.status(200).json({ message: 'Successfully uploaded images', result: imgArr });
    // console.log("519", imgArr)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




