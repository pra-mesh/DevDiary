# DevDiary# DevDiary

DevDiary is a personal development diary application designed to help developers and learners keep track of their coding journey, thoughts, and technical notes. It allows users to create, categorize, and manage diary entries with rich content support using Markdown.

## Features

- **Entry Management**: Create, view, and edit diary entries.
- **Categorization**: Organize entries into custom categories with distinct names and colors.
- **Search & Filter**: Easily find entries using a search bar or by filtering through categories.
- **Markdown Support**: Write rich content using Markdown syntax, with a live preview feature to see how your entry will look.
- **Draft/Published Status**: Mark entries as drafts or published.
- **Theme Toggle**: Switch between light and dark themes for a comfortable viewing experience.
- **Category Management**: Add and delete categories directly from the application interface.

## Tech Stack

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: A fast build tool that provides an extremely quick development experience.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Lucide React**: A collection of beautiful and customizable SVG icons.
- **Marked**: A Markdown parser and compiler.
- **DOMPurify**: A DOM sanitizer to prevent XSS attacks when rendering Markdown.
- **React Context API**: For managing global state across components.

### Backend

- **ASP.NET Core**: A cross-platform, high-performance, open-source framework for building modern, cloud-enabled, Internet-connected applications.
- **C#**: A modern, object-oriented, and type-safe programming language.
- **Entity Framework Core**: An object-relational mapper (ORM) that enables .NET developers to work with a database using .NET objects.
- **SQL Server**: A relational database management system.
- **AutoMapper**: A convention-based object-to-object mapper.
- **Swagger/OpenAPI**: For API documentation and testing.

## Setup Instructions

Follow these steps to get the DevDiary project up and running on your local machine.

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (version 8.0 or later)
- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js) or [Yarn](https://yarnpkg.com/getting-started/install)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or a compatible SQL Server instance accessible from your machine)

### Backend Setup

1. **Navigate to the Backend Directory**:

   ```bash
   cd DevDiary
   ```

2. **Restore NuGet Packages**:

   ```bash
   dotnet restore
   ```

3. **Update Database Migrations**:
   Ensure your database connection string is correctly configured in `DevDiary/appsettings.json`.

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=your_server_name;Database=DevDiaryDB;User Id=your_username;Password=your_password;TrustServerCertificate=True;"
     }
     // ... other settings
   }
   ```

   Then, apply the database migrations:

   ```bash
   dotnet ef database update
   ```

4. **Run the Backend Application**:

   ```bash
   dotnet run
   ```

   The backend API will typically run on `https://localhost:7267` or `http://localhost:5234`.

### Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd front_end
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API URL**:
   Ensure the `VITE_API_URL` environment variable is set in a `.env` file in the `front_end` directory, pointing to your backend API.
   Create a file named `.env` in `front_end/` with the following content:

   ```env
   VITE_API_URL=http://localhost:5234 # Or your backend API URL
   ```

4. **Run the Frontend Development Server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend application will typically open in your browser at `http://localhost:5173`.

## Possible Feature Enhancements

- **User Authentication**: Implement a robust user authentication system (e.g., using ASP.NET Core Identity or a third-party service like Supabase Auth) to allow multiple users to have their own diaries.
- **Rich Text Editor**: Integrate a more advanced rich text editor (e.g., TinyMCE, Quill, or TipTap) to provide a more intuitive content creation experience beyond Markdown.
- **Pagination/Infinite Scrolling**: Implement proper pagination or infinite scrolling for the entry list to improve performance and user experience with a large number of entries.
- **Tag Management UI**: Create a dedicated interface for managing tags (adding, editing, deleting tags globally).
- **Image/File Uploads**: Allow users to upload images or other files directly into their diary entries.
- **Advanced Search Filters**: Enhance the search functionality with more specific filters, such as searching by date range, published status, or multiple tags.
- **Backend API Enhancements**: Implement soft deletes for entries and categories instead of permanent deletion.
- **Frontend Routing**: Implement client-side routing (e.g., using React Router) for dedicated pages for entry details, category management, etc., instead of modals.
