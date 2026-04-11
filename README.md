💻 Samaa Admin Dashboard (سماع)
Samaa is an AI-powered audio recognition platform—essentially "Shazam for the Quran." It allows users to upload or record an audio snippet of a Quranic recitation and instantly identifies the Qari (reciter) with high accuracy using a custom Machine Learning ensemble model.

This repository houses the Admin Dashboard, built with Next.js (App Router) and TypeScript. It acts as the central control room for the Samaa ecosystem.

🏗️ Architecture & Responsibilities
This web application operates as the primary management interface within our 4-part microservice architecture. Rather than serving the end-user directly, it empowers administrators to orchestrate the platform's data:

    Data Management (CRUD): Provides a secure, graphical interface to create, read, update, and delete Qari (reciter) profiles, biographies, and metadata.

    Asset Orchestration: Manages the upload and organization of reciter images and foundational audio tracks directly to the Express backend.

    Analytics & Monitoring: Tracks user discovery histories, AI prediction confidence scores, and trending reciters synced from the PostgreSQL database.

    Ecosystem Seeding: Populates the backend with the critical, structured data that the React Native mobile client and Python AI engine rely on to function seamlessly.

🛠️ Tech Stack

    Framework: Next.js 15 (App Router)

    Language: TypeScript

    Styling: Tailwind CSS

    UI Components: shadcn/ui & Radix UI Primitives

    Forms & Validation: React Hook Form & Zod

    Data Fetching: Axios
