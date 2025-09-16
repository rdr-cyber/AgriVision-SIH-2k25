# AgriVision - User Guide

This guide will help you download, set up, and run the AgriVision project on your local machine using GitHub Desktop and VS Code.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Downloading the Repository](#downloading-the-repository)
3. [Setting up the Development Environment](#setting-up-the-development-environment)
4. [Installing Dependencies](#installing-dependencies)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - This will also install npm (Node Package Manager)

2. **GitHub Desktop**
   - Download from: https://desktop.github.com/

3. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/

4. **Git** (usually installed with GitHub Desktop)
   - Verify installation by opening Command Prompt and typing: `git --version`

## Downloading the Repository

### Using GitHub Desktop:

1. Open GitHub Desktop
2. Click on "File" → "Clone Repository" or press `Ctrl+Shift+O`
3. Select the "URL" tab
4. Enter the repository URL in the "Repository URL" field
5. Choose the local path where you want to clone the repository
6. Click "Clone"

### Alternative Method (Using Git in VS Code):

1. Open VS Code
2. Press `Ctrl+Shift+P` to open the command palette
3. Type "Git: Clone" and select it
4. Enter the repository URL when prompted
5. Choose the destination folder
6. Click "Open" when cloning is complete

## Setting up the Development Environment

### Opening the Project in VS Code:

1. Open VS Code
2. Click "File" → "Open Folder"
3. Navigate to the cloned repository folder
4. Select the folder and click "Select Folder"

### Installing Recommended Extensions:

VS Code may suggest installing recommended extensions. If prompted, click "Install All" or install these manually:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- TypeScript Importer
- Auto Rename Tag

## Installing Dependencies

1. Open the terminal in VS Code:
   - Press `Ctrl+`` ` (backtick) or
   - Click "Terminal" → "New Terminal" in the menu

2. Run the following command to install all dependencies:
   ```bash
   npm install
   ```

3. Wait for the installation to complete. This may take a few minutes.

## Environment Configuration

### Setting up Environment Variables:

1. In the root of the project, create a file named `.env`
2. Add the following content to the file:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Replace `your_actual_gemini_api_key_here` with your actual Google Gemini API key
   - If you don't have one, you can get it from: https://aistudio.google.com/

### Note on API Key:
- The application will still run without a valid API key, but AI features will be limited
- For full functionality, obtain and use a valid Gemini API key

## Running the Application

### Development Server:

1. In the VS Code terminal, run:
   ```bash
   npm run dev
   ```

2. The application will start on port 9002
   - Open your browser and navigate to: http://localhost:9002

### Building for Production:

If you want to create a production build:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```

## Application Features

### User Roles:
The application supports 5 user roles:
1. **Consumer** - Purchase herbal products
2. **Farmer** - Upload herb samples for analysis
3. **QC Agent** - Review and verify herb samples
4. **Manufacturer** - Create batches from verified samples
5. **Admin** - Manage users and system analytics

### Key Features:
- AI-powered herb species identification
- Blockchain-based traceability
- Peer-to-peer payment system
- Role-based dashboards
- Real-time chat support
- QR code verification system

### Default User Accounts:
After running the application, you can log in with these default accounts:

1. **Admin User**:
   - Email: admin@agrivision.co
   - Password: password123
   - Role: Admin

2. **Manufacturer**:
   - Email: contact@medileaf.co
   - Password: password123
   - Role: Manufacturer

3. **QC Agent**:
   - Email: dave@qlabs.co
   - Password: password123
   - Role: QC

4. **Farmer**:
   - Email: alice@farm.co
   - Password: password123
   - Role: Farmer

5. **Consumer**:
   - Email: carol@consumer.co
   - Password: password123
   - Role: Consumer

## Troubleshooting

### Common Issues and Solutions:

1. **Port 9002 already in use**:
   - Solution: Close other applications using port 9002 or change the port in the next.config.js file

2. **TypeScript errors**:
   - Solution: Run `npm run build` to check for compilation errors and fix them

3. **Missing dependencies**:
   - Solution: Run `npm install` again to ensure all dependencies are installed

4. **Font or styling issues**:
   - Solution: Ensure you have an internet connection as Google Fonts are loaded from CDN

5. **LocalStorage data conflicts**:
   - Solution: Use the "Clear All User Data" button on the homepage or user menu to reset user data

### Clearing User Data:

If you encounter issues with user accounts or want to start fresh:
1. Visit http://localhost:9002
2. Click the "Clear All User Data" button in the header
   OR
3. When logged in, click your profile icon and select "Clear All User Data"

### Checking for Updates:

To pull the latest changes from the repository:
1. Open GitHub Desktop
2. Select your repository
3. Click "Fetch origin"
4. If updates are available, click "Pull origin"

## Development Notes

### Project Structure:
- `src/app/` - Next.js app router pages
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and types
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks

### Technology Stack:
- Next.js 15 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Genkit AI with Google Gemini
- Lucide React Icons

### Code Quality:
- The project follows TypeScript best practices
- Components are organized by feature
- Context API is used for state management
- Responsive design with Tailwind CSS

## Support

For issues not covered in this guide:
1. Check the browser console for error messages (`Ctrl+Shift+I` in most browsers)
2. Check the VS Code terminal for build errors
3. Ensure all prerequisites are properly installed
4. Verify environment variables are correctly set

Developed by Team 404 Not Found for Smart India Hackathon 2025