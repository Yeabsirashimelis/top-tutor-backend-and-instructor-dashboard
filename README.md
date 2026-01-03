# australiamines admin

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Then update `.env.local` with your actual values:
   - `NEXT_PUBLIC_BASE_URL`: Your app URL (e.g., http://localhost:3001)
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`
   - Add other required API keys as needed

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3001](http://localhost:3001)

## Important Notes

- The `.env.local` file contains sensitive information and should never be committed to version control
- Make sure all required environment variables are set before running the application
- The `NEXT_PUBLIC_BASE_URL` variable is critical for API calls to work properly
