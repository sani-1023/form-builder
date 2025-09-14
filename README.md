# Dynamic No-Code Form Builder

A powerful, intuitive drag-and-drop form builder built with Next.js that allows users to visually create, customize, and preview forms without any coding knowledge.

## 🚀 Features

### ✅ Core Features Implemented
- **🎨 Dynamic Form Rendering** - Renders forms from JSON schema with support for 9 input types
- **🖱️ Drag & Drop Interface** - Reorder fields and add new elements seamlessly using native HTML5 Drag and Drop API
- **⚙️ Real-time Field Editing** - Hover actions (Settings, Delete, Duplicate) on every form element
- **🎛️ Advanced Settings Panel** - Configure field properties including requirement, options, and label editing
- **👁️ Live Preview Mode** - Switch between builder and preview modes instantly
- **✅ Form Validation** - Built-in validation with required field support
- **📊 Submission Handling** - Display submitted data in a clean table format

### 🔧 Supported Field Types
- **Text Input** - Single line text with placeholder support
- **Email Input** - Email validation built-in
- **Date Picker** - Native date selection
- **Time Picker** - Time input with proper formatting
- **File Upload** - File selection with validation
- **Select Dropdown** - Custom options with key-value pairs
- **Checkboxes** - Multiple selection options
- **Radio Buttons** - Single selection from multiple options
- **Acceptance Checkbox** - Terms and conditions acceptance

### 🎯 Interactive Features
- **Hover Actions**: Settings, Delete, and Duplicate buttons appear on hover
- **Field Palette**: Drag new fields from the left sidebar
- **Settings Sidebar**: Comprehensive field configuration panel
- **Column Width Control**: Responsive grid layout (33%, 50%, 66%, 100%)
- **Required Field Toggle**: Mark fields as mandatory
- **Custom Options**: Add/edit options for select, radio, and checkbox fields

## 🛠️ Tech Stack

- **Framework**: Next.js 15 
- **Frontend**: React 19 
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useRef, useEffect)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── FormBuilder      # Main form builder logic
│   ├── FormHeader       # Navigation and preview toggle
│   ├── Header           # App header component
│   ├── Sidebar          # Left sidebar with field palette
│   ├── Settings         # Right sidebar settings panel
│   └── FormField        # Individual form field components
├── constants/           # Application constants
│   └── FieldConstants   # Field type definitions
└── data/                # Static data
    └── InitialFormSchema # Contains the default form schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sani-1023/form-builder.git
   cd form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### 1. **Building Forms**
- Drag field types from the left sidebar to add new fields
- Hover over any field to see action buttons (Settings, Delete, Duplicate)
- Drag fields up and down to reorder them
- Use the Clear Canvas button to remove all fields and start fresh

### 2. **Configuring Fields**
- Click the **Settings** button on any field
- Modify properties in the right sidebar:
  - Label and name
  - Placeholder text
  - Required validation
  - Column width (responsive)
  - Options for select/radio/checkbox fields

### 3. **Preview Mode**
- Click **Preview** in the header to switch modes
- Test your form with real validation
- Submit the form to see collected data
- Toggle back to **Builder** mode to continue editing

### 4. **Form Submission**
- In preview mode, fill out and submit the form
- View submitted data in a formatted table
- See the success message defined in your schema in the formatted table

## 📋 Default Form Schema

The application starts with a comprehensive form including:
- Name (Text, Required)
- Email (Email, Required)  
- Time and Date pickers
- Radio buttons with multiple options
- Checkboxes with custom options
- File upload
- Select dropdown
- Terms acceptance checkbox

---

**Made with ❤️ using Next.js and React**