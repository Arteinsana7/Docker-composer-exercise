# La Synthèse ∿

Is a full-stack modern Blog application dedicated to modular synthesizers and sound synthesis. Built with React, TypeScript, Node.js, Express, and MongoDB, containerized with Docker.

> **This is a School Project for** - ECV Paris, Digital Program Master 1 : Tech Lead Front-end Developer, prepared in 2 years.

---

## 🎯 Overview

La Synthèse is a specialized blog platform for the modular synthesis community. Users can read articles about different synthesis modules (Oscillators, Envelopes, LFOs, Filters, VCAs, Sequencers), leave comments, and search through content. Admins can create and manage articles with draft/published states.

---

## ✨ Features

### 📝 Article Management

- Create, read, update, and delete articles (Admin only)
- Draft/Published toggle for article visibility
- Category system: Oscillator, Envelope, LFO, Filter, VCA, Sequencer
- Rich text content support
- Article preview cards on category pages

### 🔍 Search Functionality

- Live search with autocomplete suggestions
- Hero search component on homepage
- Search modal accessible from header (all pages)
- Mobile-friendly search via hamburger menu
- Search by title, category, or content

### 👤 User System

- JWT-based authentication
- Email verification with Resend
- User profiles with editable information
- Comment system on articles
- Role-based access control (Admin/User)

### 💬 Comments

- Add, edit, and delete comments on articles (all users)
- Author attribution
- Real-time updates after actions

### 🎨 UI/UX

- Fully responsive (Mobile, Tablet, Desktop)
- Custom dark theme with vibrant color palette
- Hamburger menu for mobile navigation
- Toast notifications for user feedback
- React Icons throughout
- Smooth animations and transitions
- FuzzyText effect on logo

---

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite 7** for fast development
- **React Router 7** for navigation
- **Tailwind CSS v4** for styling
- **React Hot Toast** for notifications
- **React Icons** (Feather Icons, CG Icons, Remix Icons)
- **Axios** for API communication

### Backend

- **Node.js 20** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Resend** for email verification
- **CORS** enabled

### DevOps

- **Docker** & **Docker Compose**
- Hot reload in development (nodemon)
- Containerized services ( Backend, Database)

---

## 🚀 Getting Started

### Prerequisites

- **Docker** & **Docker Compose** installed
- Or **Node.js v20.18+** for local development

### Quick Start with Docker (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/Arteinsana7/la-synthese.git

```

2. **Configure environment variables**

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/la-synthese
JWT_SECRET=your_super_secret_jwt_key_here
RESEND_API_KEY=re_your_resend_api_key_here
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

3. **Start all services**

```bash
docker-compose up
```

4. **Access the application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

🎉 **That's it! The app is running!**

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f mon-api-express

# Rebuild containers after code changes
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

---

## 🔧 Local Development (Without Docker)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (see above), then:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file (see above), then:

```bash
npm run dev
```

**Note**: You'll need MongoDB running locally on port 27017.

---

## 🎨 Design System

### Color Palette

```css
--color-yve-klein-blue: #0c1baa;
--color-deep-blue: #0a0f3d; /* Background */
--color-olive: #294f01;
--color-bordeaux: #4f2730;
--color-violette: #6a3698; /* Accents */
--color-lemon-green: #beff05; /* Primary */
--color-break-white: #dfd5cb; /* Text */
--color-pink: #eca5eb;
--color-orange: #ef6d31;
--color-green-minth: #6fec74;
```

### Typography

- **Body**: Aeonik (Regular, 400)
- **Headings**: ArminGrotesk (Bold, 700)

### Grid System

- **Mobile**: 6 columns
- **Desktop**: 12 columns
- **Gutter**: 20px (10px on mobile)

### Spacing Scale

- `--spacing-10`: 10px
- `--spacing-20`: 20px
- `--spacing-30`: 30px
- `--spacing-40`: 40px

---

## 📝 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint                     | Description          | Auth |
| ------ | ---------------------------- | -------------------- | ---- |
| POST   | `/users/register`            | Register new user    | No   |
| POST   | `/users/login`               | Login user           | No   |
| GET    | `/users/verify-email/:token` | Verify email address | No   |

### Article Endpoints

| Method | Endpoint                | Description                | Auth  |
| ------ | ----------------------- | -------------------------- | ----- |
| GET    | `/articles`             | Get all published articles | No    |
| GET    | `/articles/:id`         | Get single article         | No    |
| GET    | `/articles/my-articles` | Get user's articles        | Yes   |
| POST   | `/articles`             | Create new article         | Admin |
| PUT    | `/articles/:id`         | Update article             | Admin |
| DELETE | `/articles/:id`         | Delete article             | Admin |

### Comment Endpoints

| Method | Endpoint                       | Description              | Auth        |
| ------ | ------------------------------ | ------------------------ | ----------- |
| GET    | `/comments`                    | Get all comments         | No          |
| GET    | `/comments/article/:articleId` | Get comments for article | No          |
| POST   | `/comments`                    | Create comment           | Yes         |
| PUT    | `/comments/:id`                | Update comment           | Yes (owner) |
| DELETE | `/comments/:id`                | Delete comment           | Yes (owner) |

### User Endpoints

| Method | Endpoint         | Description      | Auth |
| ------ | ---------------- | ---------------- | ---- |
| GET    | `/users/profile` | Get user profile | Yes  |
| PUT    | `/users/profile` | Update profile   | Yes  |
| DELETE | `/users/account` | Delete account   | Yes  |

---

## 🔐 Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/la-synthese
JWT_SECRET=your_super_secret_jwt_key_here
RESEND_API_KEY=re_your_resend_api_key_here
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Features Roadmap

### Phase 1 (Completed ✅)

- [x] User authentication & authorization
- [x] Article CRUD operations
- [x] Comment system
- [x] Search functionality
- [x] Responsive design
- [x] Docker containerization

### Phase 2 (Future)

- [ ] Article tags system
- [ ] Pagination for articles list
- [ ] Article likes/favorites
- [ ] Comment replies (nested comments)
- [ ] Admin dashboard with analytics
- [ ] RSS feed
- [ ] Email newsletter system

### Phase 3 (Ideas)

- [ ] Social sharing buttons
- [ ] Dark/light theme toggle
- [ ] Advanced search filters
- [ ] User notifications
- [ ] Markdown editor for articles
- [ ] Code syntax highlighting

---

## 🤝 Contributing

This is a school project, but contributions and suggestions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Eliana Yepez**

- 🎓 Student at ECV Paris - Digital Program - Master's Degree I Front-End Lead
- 💼 Frontend Developer Apprentice at BETC FULLSIX
- 📧 Email: e.arteinsana@gmail.com
- 🔗 GitHub: [@Arteinsana](https://github.com/Arteinsana7)

---

## 🙏 Acknowledgments

- **ECV Paris** - Digital Program - Master's Degree I Front-End Lead
- **BETC** - Apprenticeship host company
- Modular synthesis community for inspiration
- Open source community for amazing tools

---

## 📸 Screenshots

### Homepage

![Homepage](./public/images/home.png)

### Article Page with Comments

![Article](./public/images/ArticleWithComments.png)

### Mobile Navigation

![Mobile Menu](./public/images/mobile-menu)

### Search Modal

![Search](./public/images/modale.png)

### User Profile

![Profile](./public/images/profile.png)

---

**Made with ❤️ and ∿ synthesis waves**

_A student project exploring the intersection of web development and passion for electronic music_
