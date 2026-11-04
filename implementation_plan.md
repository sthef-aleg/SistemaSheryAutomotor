# Implementation Plan: Shery Automotores - Phase 1 (Public Catalog & Basic Admin)

## Overview & Core Concept

This plan outlines Phase 1 of developing a professional, premium automotive management platform for SHERY AUTOMOTORES. The goal is to establish the core data infrastructure and provide a functional public catalog for potential buyers alongside a secure, modern admin dashboard for inventory management.

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Visual Identity**: The site will use a dark, premium aesthetic (Black, Gold/Yellow, Electric Blue) to convey exclusivity.
> - **Data Persistence**: Firebase will be used for both the Public Catalog and the Admin Dashboard backend.
> - **Authentication**: Firebase Auth (Google) will be implemented for administrative access.
> - **Currency/Format**: All prices will be displayed in Gs. (e.g., Gs. 95.000.000).

## 1. Overview & Core Concept

- **What It Does**: A public-facing vehicle catalog and a private, secure administrative backend for inventory management.
- **Target Audience**: Automotive enthusiasts/buyers (Public) and Shery Automotores management/staff (Admin).
- **Key Value**: Real-time inventory management synced between public-facing site and internal admin tools.

## 2. User Experience & Visual Design

- **Key User Flows**:
    - **Public**: Homepage -> Search/Filter Catalog -> View Vehicle Details -> Contact via WhatsApp.
    - **Admin**: Secure Login -> View Dashboard -> Manage Inventory (CRUD).
- **Visual Identity & Theme**:
    - *Aesthetic*: Utilitarian, sleek, luxury automotive premium (Dark Mode default).
    - *Palette*: `--background: #0a0a0a` (Black), `--primary: #fbbf24` (Amber/Gold), `--accent: #3b82f6` (Electric Blue).
    - *Typography*: `Plus Jakarta Sans` (Display/Body) + `JetBrains Mono` (Data/Metrics).
- **Interactive Feedback**: Tailwind transitions, functional buttons, loading skeletons.

## 3. Key Product Decisions & Trade-Offs

- **State Management**: React state hooks for local UI; Firebase Firestore for backend persistence.
- **Data Model**: Centralized `inventory` collection in Firestore.

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                  Firebase (Firestore + Auth)                 │
└──────────┬──────────────────────────────────────────┬────────┘
           │                                          │
┌──────────▼──────────┐                     ┌─────────▼────────┐
│   Public Catalog    │                     │ Admin Dashboard  │
│ (React/TypeScript)  │                     │(React/TypeScript)│
└─────────────────────┘                     └──────────────────┘
```

- **Data Model**:
    - `inventory`: {id, vin, make, model, year, price, km, transmission, fuel, images[], status}
- **Interactive Component Mapping**:
    - `Catalog`: List & Filter component with state managed by Firestore snapshot.
    - `AdminPanel`: CRUD components for inventory, authenticated via Firebase Auth.
