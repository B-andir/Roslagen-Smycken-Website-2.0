# Roslagen Smycken Website 2.0
Website URL: https://roslagensmycken.com/

This is the second version/iteration of the website for an imaginary jewelry company, with purpose of practicing using different methods for communication. Specific focus on EJS, JavaScript and Database operations.

The future plan is to create a web-shop, for testing implementation of different payment methods, to optimize user experience through the whole transaction.
Currently, the only progress on this is an admin page for semi-easily (needs more work) adding new products to the database. Later on, the EJS code will then build the shop page using information from the database.

Want to test the website locally? Clone the repository, and make sure you have Node.js installed on your computer. Install all the required packages with the command "npm i" in the terminal, inside the project root directory. Then, in the root directory, create a file named ".env" and add the following:

JWT_SECRET=[A random string of characters, suggested at *least* 10 characters long]

MONGODB_URI=[Your MongoDB URL for using with the website]

CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

STRIPE_SECRET=[Stripe secret API key]
