# 🏡 Finder

Finder is a full-stack web application inspired by Airbnb, built using the MEN (MongoDB, Express, Node.js) stack with EJS for server-side rendering. It follows the MVC (Model-View-Controller) architectural pattern and is deployed on Render.

**Live Demo:** https://home-finder-j5a1.onrender.com/listings

## 📸 Screenshots

![Image_1](.ss/ss1.png)
![Image_2](.ss/ss2.png)
![Image_3](.ss/ss3.png)
![Image_4](.ss/ss4.png)

## ✨ Key Features

- **Full CRUD Operations:** Users can create, read, update, and delete property listings.
- **User Authentication:** Secure user sign-up, login, and logout functionality implemented using Passport.js.
- **Authorization:** Listings and reviews can only be edited or deleted by their authenticated owners.
- **Reviews System:** Logged-in users can post and delete reviews for each listing.
- **Cloud Image Uploads:** Integrates with Cloudinary and Multer for seamless image uploads to the cloud, not the local server.
- **Responsive Design:** Built with Bootstrap for a clean and responsive UI that works on all devices.
- **Flash Notifications:** Provides user feedback for actions like creating a listing or logging in, using `connect-flash`.
- **Error Handling:** Features custom middleware for handling both async errors and 404 "Page Not Found" errors.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose and MongoDB Atlas)
- **View Engine:** EJS (Embedded JavaScript), ejs-mate (for layouts)
- **Authentication:** Passport.js, Express-Session
- **Image Storage:** Cloudinary, Multer
- **Styling:** Bootstrap, CSS
- **Deployment:** Render

## 📁 Project Structure

The project follows the Model-View-Controller (MVC) design pattern to keep the code organized and scalable.
