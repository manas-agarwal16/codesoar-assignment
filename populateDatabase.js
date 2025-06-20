// import { faker } from '@faker-js/faker';
// import bcrypt from 'bcrypt';
// import { User, Contact, Spam } from './src/models/index.js'; // Adjust the path as needed

// const TOTAL_USERS = 30;
// const CONTACTS_PER_USER = 20;
// const SPAM_ENTRIES = 15;

// const hashPassword = async (password) => {
//    return await bcrypt.hash(password, 10);
// };

// const generateUniquePhone = (usedPhones) => {
//    let phone;
//    do {
//       const firstDigit = faker.helpers.arrayElement(['6', '7', '8', '9']); // Valid Indian starting digit
//       const restDigits = faker.string.numeric(9); // Remaining 9 digits
//       phone = firstDigit + restDigits;
//    } while (usedPhones.has(phone));
//    usedPhones.add(phone);
//    return phone;
// };

// const createUsers = async () => {
//    const usedPhones = new Set();
//    const users = [];

//    for (let i = 0; i < TOTAL_USERS; i++) {
//       const name = faker.person.fullName(); // ✅ fixed here
//       const phoneNumber = generateUniquePhone(usedPhones);
//       const email = Math.random() > 0.3 ? faker.internet.email() : null;
//       const password = await hashPassword('password123');

//       const user = await User.create({
//          name,
//          phoneNumber,
//          email,
//          password,
//       });

//       users.push(user);
//    }

//    return users;
// };

// const createContacts = async (users, usedPhones) => {
//    for (const user of users) {
//       const contacts = [];

//       for (let i = 0; i < CONTACTS_PER_USER; i++) {
//          const contactNumber = generateUniquePhone(usedPhones);
//          const contactName = faker.person.fullName();

//          contacts.push({
//             userId: user.id,
//             contactNumber,
//             contactName,
//          });
//       }

//       await Contact.bulkCreate(contacts);
//    }
// };

// const markSpamNumbers = async (users, usedPhones) => {
//    for (let i = 0; i < SPAM_ENTRIES; i++) {
//       const phoneNumber = generateUniquePhone(usedPhones);
//       const randomUser = users[Math.floor(Math.random() * users.length)];

//       await Spam.create({
//          userId: randomUser.id,
//          spamNumber: phoneNumber,
//       });
//    }
// };

// const populate = async () => {
//    try {
//       console.log('Clearing old data...');
//       await Spam.destroy({ where: {} });
//       await Contact.destroy({ where: {} });
//       await User.destroy({ where: {} });

//       console.log('Creating users...');
//       const users = await createUsers();

//       console.log('Creating contacts...');
//       const usedPhones = new Set(users.map((u) => u.phoneNumber));
//       await createContacts(users, usedPhones);

//       console.log('Marking spam numbers...');
//       await markSpamNumbers(users, usedPhones);

//       console.log('✅ Database populated successfully!');
//    } catch (err) {
//       console.error('❌ Error populating database:', err);
//    }
// };

// export default populate;
