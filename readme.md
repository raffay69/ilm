# 📚 ilm – Knowledge, Visualized

**ilm** is a full-stack educational platform that transforms your prompts into clear explanations, animated videos, and voiceovers using advanced AI and visualization tools.

---

## 🗂 Project Structure

```
ilm/
├── backend/     # Express.js API (Dockerized, uses Manim for animation)
└── frontend/    # Next.js app using Clerk for authentication
```

---

## 🚀 Getting Started

### ✨ Frontend (Next.js + Clerk)

#### Prerequisites
- Node.js ≥ 18
- A [Clerk](https://clerk.dev/) account

#### Setup

```bash
cd frontend
npm install
```

#### Clerk Middleware Setup

1. Sign up at [Clerk.dev](https://clerk.dev/).
2. Configure Clerk in your `.env.local` (see environment variables below).
3. Middleware is already included in the repo.

#### Run Dev Server

```bash
npm run dev
```

Frontend will be running at: `http://localhost:3000`

---

### 🛠 Backend (Express + Manim + Docker)

#### Prerequisites
- Docker installed: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- Manim is included in the Docker image

#### Setup

1. Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLERK_PUBLIC_JWT=your_clerk_jwt_key
MONGO_URI=your_mongodb_uri
```

2. Build and run the Docker container:

```bash
cd backend
docker build -t ilm-backend .
docker run -p 4000:4000 --env-file .env ilm-backend
```

Backend will be available at: `http://localhost:4000`

---

## 📦 Tech Stack

- **Frontend**: Next.js, Clerk
- **Backend**: Express.js, Manim (Python), Gemini API
- **Auth**: Clerk.dev
- **Media Handling**: Cloudinary
- **Database**: MongoDB

---

## 🧪 Notes

- Docker container handles both Express server and Manim rendering.
- Ensure `.env` is set up properly in both frontend and backend.
- Make sure Docker is running before launching the backend.

---

## 🧑‍💻 Contributing

Feel free to fork, contribute, and open a pull request. For major changes, please open an issue first.

---

## 📄 License

MIT License
