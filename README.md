# Carb Tracker

This is a web application designed to help users track their carbohydrate intake through a user-friendly interface. The application allows users to log their meals, view nutritional information, and manage their dietary habits effectively.

## Technologies Used

This project was developed using the following technologies:

- **Next.js**: A React framework that enables server-side rendering and static site generation for building fast and scalable web applications.
- **Firebase**: A platform that provides backend services such as authentication and Firestore for real-time database capabilities.
- **API Ninjas**: A third-party API used to fetch nutritional information about various food items.
- **Material-UI (MUI)**: A React UI framework that provides pre-designed components to create a responsive and modern user interface.
- **Vercel**: The platform used for deploying the application, ensuring fast load times and easy scalability.


## Getting Started

To run the development server locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/hasibshaif/Carb-Tracker.git
   cd carb-tracker
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add your Firebase and API Ninjas credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_NINJAS_API_KEY=your_api_ninjas_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- User authentication using Firebase.
- Meal logging with nutritional information fetched from API Ninjas.
- Responsive design using Material-UI components.
- Real-time updates of meal data.

## Deployment

The application is deployed on Vercel. You can view the project at the following link:

- [Carb Tracker on Vercel](https://vercel.com/hasib-shaifs-projects/carb-tracker)

You can also go to its domain here:

- [Sign In to Carb Tracker](https://carb-tracker.vercel.app/)

## Notes

This project is was as part of the Headstarter AI 2024 Fellowship Week 2 project.
