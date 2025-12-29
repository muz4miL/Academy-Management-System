# 🎯 Technical Brief for UI Specialist (GLM-4.7)
**Project:** Academy Sparkle UI - Student Management System  
**Date:** December 27, 2025  
**Lead Engineer:** Antigravity  
**Prepared For:** UI Specialist (GLM-4.7)

---

## 1. 🛠️ **Tech Stack Overview**

### **Frontend**
- **Build Tool:** Vite 7.3.0
- **Framework:** React 18.3.1 + TypeScript
- **Styling:** Tailwind CSS 3.4.17
- **Icons:** Lucide React 0.462.0
- **Component Library:** shadcn/ui (Radix UI primitives)
- **State Management:** TanStack React Query 5.83.0
- **Routing:** React Router DOM 6.30.1
- **Form Handling:** React Hook Form 7.61.1 + Zod 3.25.76

### **Backend**
- **Runtime:** Node.js + Express
- **Database:** MongoDB (Mongoose ODM)
- **Architecture:** MERN Stack
- **Status:** ✅ **Fully Active** (Backend running on port 5000, Frontend on port 8080)

### **Development**
- **Package Manager:** npm
- **Dev Server:** Vite (HMR enabled)
- **TypeScript:** 5.8.3
- **ESLint:** Configured for React/TypeScript

---

## 2. 📊 **Student Data Schema**

### **Core Fields**
```typescript
interface Student {
  // Identity
  _id: string                    // MongoDB ObjectId
  studentId: string               // Unique ID (e.g., "STU-001")
  name: string                    // Full name
  fatherName: string              // Father's name
  
  // Academic
  class: '9th' | '10th' | '11th' | '12th' | 'MDCAT' | 'ECAT'
  group: 'Pre-Medical' | 'Pre-Engineering' | 'Medical'
  subjects: string[]              // Array of subject names
  
  // Contact
  phone: string
  email?: string                  // Optional
  address?: string                // Optional
  
  // Status & Financial
  status: 'active' | 'inactive' | 'graduated'    // Default: 'active'
  feeStatus: 'paid' | 'partial' | 'pending'      // Default: 'pending'
  totalFee: number                // Required, min: 0
  paidAmount: number              // Default: 0, min: 0
  balance: number                 // Virtual field (totalFee - paidAmount)
  
  // Timestamps
  admissionDate: Date             // Default: current date
  createdAt: Date                 // Auto-generated
  updatedAt: Date                 // Auto-generated
}
```

### **Enum Values (Use EXACTLY as shown)**
- **class:** `'9th'`, `'10th'`, `'11th'`, `'12th'`, `'MDCAT'`, `'ECAT'`
- **group:** `'Pre-Medical'`, `'Pre-Engineering'`, `'Medical'`
- **status:** `'active'`, `'inactive'`, `'graduated'`
- **feeStatus:** `'paid'`, `'partial'`, `'pending'`

---

## 3. 🎨 **Design System & Color Palette**

### **Primary Brand Colors**
```css
/* Sky Blue Academy Theme */
--primary: hsl(199, 89%, 48%)           /* #0EA5E9 - Sky Blue */
--primary-hover: hsl(199, 89%, 40%)     /* Darker variant */
--primary-light: hsl(199, 100%, 95%)    /* Light background */
--primary-foreground: hsl(0, 0%, 100%)  /* White text */
```

### **Grayscale & Neutrals**
```css
--background: hsl(0, 0%, 98%)           /* #FAFAFA - Light mode */
--foreground: hsl(222, 47%, 11%)        /* #0F172A - Dark text */
--card: hsl(0, 0%, 100%)                /* #FFFFFF - Card background */
--muted: hsl(215, 20%, 95%)             /* Muted backgrounds */
--muted-foreground: hsl(215, 16%, 47%)  /* Muted text */
```

### **Slate Palette (For Dark UIs)**
```css
--slate-900: hsl(222, 47%, 11%)         /* #0F172A - Darkest */
--slate-800: hsl(222, 47%, 16%)         /* #1E293B */
--slate-700: hsl(222, 47%, 24%)         /* #334155 */
--slate-600: hsl(222, 47%, 32%)         /* #475569 */
--slate-500: hsl(215, 16%, 47%)         /* #64748B */
--slate-400: hsl(215, 20%, 65%)         /* #94A3B8 */
```

### **Status Colors**
```css
/* Success (Active, Paid) */
--success: hsl(142, 76%, 36%)           /* #16A34A - Green */
--success-light: hsl(142, 76%, 95%)     /* Light green bg */

/* Warning (Partial) */
--warning: hsl(38, 92%, 50%)            /* #F59E0B - Orange */
--warning-light: hsl(38, 92%, 95%)      /* Light orange bg */

/* Destructive/Pending */
--pending: hsl(0, 84%, 60%)             /* #F87171 - Red */
--pending-light: hsl(0, 84%, 95%)       /* Light red bg */
```

### **Accent Colors (For Cards)**
```css
--cyan-500: hsl(189, 94%, 43%)          /* #06B6D4 */
--purple-500: hsl(271, 81%, 56%)        /* #A855F7 */
--pink-500: hsl(330, 81%, 60%)          /* #EC4899 */
--green-400: hsl(142, 76%, 56%)         /* #4ADE80 */
--yellow-400: hsl(45, 93%, 58%)         /* #FACC15 */
```

### **Design Tokens**
```css
--radius: 0.75rem                       /* 12px - Border radius */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
--shadow-glow: 0 0 20px rgba(14,165,233,0.2)   /* Sky blue glow */
```

### **Typography**
- **Font Family:** Plus Jakarta Sans (Google Fonts)
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Font Smoothing:** `antialiased`

---

## 4. 🧩 **Component Guidelines**

### **Available UI Components** (shadcn/ui)
All components are located in `src/components/ui/`:
- `Button`, `Card`, `Input`, `Label`, `Select`, `Dialog`
- `Table`, `Badge`, `Avatar`, `Tooltip`, `Dropdown`
- `Tabs`, `Accordion`, `Alert`, `Toast`, `Popover`
- `Checkbox`, `Switch`, `Radio Group`, `Progress`
- `Separator`, `Scroll Area`, `Sheet`, `Collapsible`

### **Icon Usage**
```tsx
import { User, Shield, GraduationCap, DollarSign } from 'lucide-react'

// Sizes: h-4 w-4 (16px), h-5 w-5 (20px), h-6 w-6 (24px)
<User className="h-5 w-5 text-primary" />
```

### **Animation Classes (Available in index.css)**
```css
.animate-fade-in         /* Fade in effect */
.animate-slide-up        /* Slide up with fade */
.animate-scale-in        /* Scale in with fade */
.animate-shine           /* Holographic shine effect */
.animate-border-glow     /* Pulsing border glow */
```

---

## 5. 📁 **Project Structure**

```
academy-sparkle-ui/
├── backend/                    # MERN Backend (MongoDB + Express)
│   ├── models/
│   │   ├── Student.js         # ✅ Student Schema (Reference this!)
│   │   ├── Teacher.js
│   │   └── FinanceRecord.js
│   └── server.js              # Running on port 5000
│
├── src/                        # React Frontend
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── DigitalStudentCard.tsx   # Example component
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Students.tsx       # Student management page
│   │   └── StudentCard.tsx    # Digital card page
│   ├── lib/
│   ├── hooks/
│   ├── index.css              # ✅ Design system, colors, animations
│   └── App.tsx                # React Router setup
│
├── tailwind.config.ts         # Tailwind configuration
└── vite.config.ts             # Vite configuration
```

---

## 6. 🚀 **Current Status & Environment**

### **Active Services**
- ✅ **Frontend Dev Server:** `http://localhost:8080` (Vite HMR)
- ✅ **Backend API Server:** `http://localhost:5000` (Express + MongoDB)
- ✅ **Database:** MongoDB (Active connection verified)

### **Available Routes**
- `/` - Dashboard
- `/students` - Student management
- `/student-card` - **NEW** Digital Student Card (3D interactive)
- `/admissions`, `/teachers`, `/finance`, `/attendance`
- `/classes`, `/timetable`, `/sessions`, `/configuration`

### **Git Repository**
- **GitHub:** `muz4miL/Academy-Management-System`
- **Workspace:** `d:\01_Web_Development\academy-sparkle-ui`

---

## 7. 📝 **Design Task Guidelines**

### **When Creating Student UI Components:**
1. **Always use the exact field names** from the Student schema (see Section 2)
2. **Match status colors** to their semantic meaning:
   - `status: 'active'` → Green (`--success`)
   - `feeStatus: 'paid'` → Green (`--success`)
   - `feeStatus: 'partial'` → Orange (`--warning`)
   - `feeStatus: 'pending'` → Red (`--pending`)
3. **Use Lucide React icons** for consistency
4. **Follow the Sky Blue theme** (`--primary: #0EA5E9`) for all primary actions
5. **Implement smooth animations** using the provided CSS classes or Tailwind transitions
6. **Ensure mobile responsiveness** with Tailwind breakpoints (`sm:`, `md:`, `lg:`)

### **Code Style**
- Use TypeScript for type safety
- Use functional components with hooks
- Use Tailwind utility classes (avoid custom CSS unless for complex animations)
- Use `className` prop for styling (never `style` prop unless absolutely necessary)
- Follow existing component patterns in `src/components/`

---

## 8. 🎯 **Priority Features**

### **Immediate Priorities**
1. **Digital Student Cards** - Premium, interactive cards with 3D effects
2. **Student List View** - Table with sorting, filtering, status badges
3. **Student Details Modal** - Full profile view with edit capabilities
4. **Dashboard Stats** - Visual cards for key metrics (active students, revenue, fees)

### **Design Principles**
- **Premium First:** Designs should feel polished and professional
- **Data-Driven:** Show real data from the Student schema
- **Performance:** Optimize for smooth 60fps animations
- **Accessibility:** Proper ARIA labels, keyboard navigation, color contrast

---

## 9. 📞 **Points of Contact**

- **Lead Engineer:** Antigravity (Integration & Architecture)
- **Backend Status:** Fully operational, API endpoints verified
- **Design System:** Locked and enforced via `index.css` and `tailwind.config.ts`

---

## ⚡ **Quick Start Commands**

```bash
# Start Frontend Dev Server
npm run dev                # Runs on http://localhost:8080

# Start Backend Server (in /backend directory)
cd backend
npm run dev                # Runs on http://localhost:5000

# View Current Project
# Navigate to: http://localhost:8080/student-card
```

---

**End of Technical Brief**  
*Last Updated: December 27, 2025 at 5:55 PM PKT*  
*Version: 1.0*
