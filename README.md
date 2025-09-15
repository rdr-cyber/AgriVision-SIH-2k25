# Agrivision: AI & Blockchain Powered Herb Traceability

A comprehensive platform for tracking and verifying the authenticity of herbal products using AI and blockchain technology.

## Features

### Authentication System
- User registration with role-based access control (Consumer, Farmer, QC Agent, Manufacturer, Admin)
- Forgot password functionality
- Email and mobile number OTP verification system
- Multi-step verification process for enhanced security

### Role-Based Dashboards
- **Consumer**: Product verification, purchase history, batch tracking
- **Farmer**: Sample submission, collection management, notifications
- **QC Agent**: Sample review, quality assessment, approval workflows
- **Manufacturer**: Batch creation, QR code generation, supply chain management
- **Admin**: User management, system analytics, batch auditing

### Core Functionality
- **AI-Powered Analysis**: Species identification and quality scoring for herb samples
- **Blockchain Anchoring**: Immutable record of batch information for authenticity verification
- **QR Code System**: Scan to verify product authenticity and trace supply chain journey
- **E-commerce Integration**: Shopping cart, multi-step checkout, and payment processing
- **Real-time Chat**: Communication between different user roles
- **Analytics Dashboard**: Data visualization for tracking system performance
- **AI Chatbot**: Intelligent assistant for platform guidance and support

### Technical Implementation
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for responsive UI
- Genkit AI integration with Google Gemini
- LocalStorage for client-side data persistence
- Responsive design for all device sizes

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server: `npm run dev`

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/              # Utility functions and types
├── ai/               # AI integration files
└── context/          # React context providers
```

## Documentation

Detailed documentation for each feature is available in the respective markdown files:
- `ENHANCED_AUTHENTICATION_FEATURES.md`
- `FINAL_SYSTEM_VERIFICATION.md`
- `QR_CODE_FIX_SUMMARY.md`
- And more...

## Contributing

This project was developed for the Smart India Hackathon 2025. Contributions are welcome to enhance the platform further.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.