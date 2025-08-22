# Reviews Autopilot 🚀

An AI-powered review management platform that helps businesses automatically respond to customer reviews across multiple platforms like Google Business Profile and Facebook.

## ✨ Features

- **AI-Powered Responses**: Generate contextually appropriate replies using OpenAI, Anthropic, or Ollama
- **Multi-Platform Integration**: Connect Google Business Profile and Facebook Pages
- **Smart Policy Engine**: Automatic content moderation to ensure compliance
- **Template Management**: Create and manage response templates for different scenarios
- **Tone Profiles**: Customize the voice and style of your responses
- **Review Workflow**: Draft, review, and publish responses with team approval
- **Analytics Dashboard**: Track your review performance and response metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (for background jobs)
- Google Business Profile API access
- OpenAI/Anthropic API key (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reviewsautopilot
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# See Configuration section below
```

### 3. Database Setup

```bash
# Run the automated setup script
npm run setup

# Or manually:
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access your app.

## ⚙️ Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reviewsautopilot"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_OAUTH_SCOPES="https://www.googleapis.com/auth/business.manage"

# AI Models (at least one required)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
OLLAMA_BASE_URL="http://localhost:11434"

# Redis (for background jobs)
REDIS_URL="redis://localhost:6379"
```

### Optional Environment Variables

```bash
# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# Stripe (for billing)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PostHog Analytics
POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."

# Email
EMAIL_FROM="noreply@yourdomain.com"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run setup        # Setup database and dependencies
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API endpoints
│   ├── reviews/           # Review management pages
│   ├── setup/             # Organization setup
│   └── integrations/      # Platform integrations
├── components/             # React components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   └── ui/                # UI component library
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication setup
│   ├── db.ts              # Database connection
│   ├── drafting.ts        # AI response generation
│   ├── policy.ts          # Content moderation
│   └── providers/         # Platform integrations
└── types/                  # TypeScript type definitions
```

## 📱 Usage

### 1. Create Organization
- Sign in with your Google account
- Create your organization
- Set up your business locations

### 2. Connect Integrations
- Connect your Google Business Profile
- Authorize access to your business data
- Start syncing reviews automatically

### 3. Manage Reviews
- View all incoming reviews
- Generate AI-powered responses
- Customize tone and style
- Approve and publish replies

### 4. Templates & Settings
- Create response templates
- Configure tone profiles
- Set up escalation rules
- Manage team permissions

## 🔒 Security & Compliance

- **Content Moderation**: Automatic policy checking for compliance
- **PII Protection**: Detection and filtering of personal information
- **Review Gating Prevention**: Ensures authentic feedback collection
- **Team Permissions**: Role-based access control
- **Audit Logging**: Complete activity tracking

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t reviewsautopilot .
docker run -p 3000:3000 reviewsautopilot
```

### Environment Variables

Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

## 🔮 Roadmap

- [ ] Facebook integration
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced AI models and fine-tuning
