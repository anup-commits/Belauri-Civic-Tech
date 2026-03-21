# BELAURI FIRST - Social Activism Platform

A powerful, production-ready web platform for fighting corruption, empowering youth, and promoting transparency in Belauri Municipality, Nepal.

## Overview

BELAURI FIRST is a full-stack social activism platform that enables citizens to report corruption, access news and updates, participate in events, and drive collective action for accountability and transparency.

## Features

### Public Features
- **Landing Page**: Mission-driven hero section with impactful messaging
- **About Section**: Mission, vision, and values of the movement
- **Corruption Reports**: Public listing of verified reports with filtering
- **News & Blog**: Latest updates, campaigns, and stories
- **Events**: Upcoming activism events and past campaigns
- **Gallery**: Visual documentation of activism work
- **Statistics Dashboard**: Real-time impact metrics

### User Features
- **Authentication**: Secure email/password registration and login
- **Profile Dashboard**: Personal report tracking and statistics
- **Submit Reports**: Report corruption with optional anonymity
- **Image Upload**: Attach evidence to reports
- **Upvoting System**: Community validation of reports
- **Comment System**: Engage with posts and reports

### Admin Features
- **Admin Panel**: Comprehensive content management
- **Report Moderation**: Approve/reject submitted reports
- **Content Management**: Create and manage posts, events, and gallery
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: Platform statistics and insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for beautiful icons

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Row Level Security (RLS)** for data protection

### Security Features
- JWT-based authentication
- Row-level security policies
- Anonymous reporting capability
- Input validation and sanitization
- Secure password hashing

## Database Schema

### Tables
1. **profiles** - Extended user information
2. **reports** - Corruption and civic issue reports
3. **posts** - News articles and blog posts
4. **events** - Activism events and campaigns
5. **gallery** - Images and videos from activism work
6. **comments** - User comments on posts and reports
7. **report_votes** - Community validation system

All tables include comprehensive RLS policies ensuring data security and proper access control.

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   ├── auth/            # Login and signup forms
│   ├── dashboard/       # User dashboard
│   ├── events/          # Events listing
│   ├── gallery/         # Gallery grid
│   ├── home/            # Homepage sections
│   ├── news/            # News/blog components
│   ├── reports/         # Report submission and listing
│   ├── Footer.tsx       # Site footer
│   ├── Header.tsx       # Site header with navigation
│   └── Layout.tsx       # Main layout wrapper
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── database.types.ts # TypeScript database types
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Database migration has been applied with all tables and RLS policies

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Usage Guide

### For Citizens

1. **View Reports**: Browse corruption reports on the homepage
2. **Submit Report**: Click "Report Corruption" and fill out the form
3. **Anonymous Reporting**: Check the anonymous option for safety
4. **Create Account**: Join the movement to track your reports
5. **Upvote Reports**: Support reports that matter to you

### For Administrators

1. **Access Admin Panel**: Navigate to Admin Panel from the header menu
2. **Moderate Reports**: Review and approve/reject pending reports
3. **Create Content**: Publish news articles, events, and gallery items
4. **Manage Users**: View and manage user accounts
5. **View Analytics**: Monitor platform statistics and impact

## Creating an Admin Account

To set up your first admin:

1. Create a regular account through the signup form
2. Access your Supabase dashboard
3. Navigate to Table Editor > profiles
4. Find your user record and set `is_admin` to `true`
5. Refresh the application to see admin features

## Security Best Practices

- All sensitive operations require authentication
- Anonymous reports protect whistleblower identity
- RLS policies prevent unauthorized data access
- Admin actions are properly validated
- Input sanitization prevents injection attacks

## Design Philosophy

- **Bold & Fearless**: Unapologetic design that demands attention
- **Youth-Driven**: Modern interface appealing to young activists
- **Mission-Focused**: Every element serves the cause
- **Trustworthy**: Clean design that inspires confidence
- **Accessible**: Mobile-first, responsive on all devices

## Color Scheme

- **Red (#DC2626)**: Urgency and passion for change
- **Dark Gray (#111827)**: Seriousness and professionalism
- **White (#FFFFFF)**: Transparency and clarity

## Performance Optimizations

- Lazy loading for images
- Optimized database queries with proper indexing
- Efficient component rendering
- Production build optimization with Vite
- Minimal bundle size

## Deployment Options

### Recommended: Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy automatically

### Alternative: Netlify

1. Push code to GitHub
2. Import to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy

## Future Enhancements

- Location tagging with map integration
- Email notifications for report updates
- Dark mode toggle
- Multi-language support (Nepali/English)
- Mobile application
- Real-time updates with WebSockets
- Document upload support
- Advanced search and filtering
- Report status tracking timeline

## Contributing

This is a mission-critical platform for social change. To contribute:

1. Understand the mission and values
2. Follow the existing code style
3. Test thoroughly before submitting
4. Ensure accessibility standards
5. Maintain security best practices

## Support

For technical issues or questions:
- Email: contact@belaurifirst.org
- Community forum: [Coming soon]

## License

This project is dedicated to the public good and the fight against corruption in Belauri Municipality.

## Acknowledgments

Built with dedication by passionate developers committed to transparency and accountability in governance.

---

**BELAURI FIRST** - Transparency is Our Right. Accountability is Their Duty.
