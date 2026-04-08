# Mediatio Vehicle Nexus - Full Automated Validation

## Role

You are a **Senior Fullstack Engineer, QA Engineer and DevOps Engineer**.

Your mission is to **analyze, test, validate and fix the entire Mediatio Vehicle Nexus project**.

You must work as an autonomous agent that:

* analyzes the entire project
* detects bugs
* simulates user actions
* validates API integration
* fixes errors
* ensures build success
* ensures production stability
* organizes the architecture
* returns corrected files

---

# Project Overview

Frontend:

React
TypeScript
Vite
Tailwind
TanStack Query
Framer Motion
Lucide React

Backend API:

https://extensive-avril-morph-d5a8aee2.koyeb.app

Environment variable:

VITE_API_URL=https://extensive-avril-morph-d5a8aee2.koyeb.app

---

# Expected User Flow

The system must work exactly like this:

### 1 - Register

User creates account

POST /auth/register

returns token

token stored in localStorage

redirect to dashboard

---

### 2 - Login

POST /auth/login

returns token

token stored in localStorage

redirect to dashboard

---

### 3 - Dashboard

Loads successfully

GET /vehicles

GET /leads

GET /auth/me (if exists)

must not redirect to login

---

### 4 - Vehicles

User can:

view vehicles
create vehicle
edit vehicle
delete vehicle

Endpoints:

GET /vehicles
POST /vehicles
PUT /vehicles/:id
DELETE /vehicles/:id

---

### 5 - Leads

User can:

view leads
create leads
edit leads

Endpoints:

GET /leads
POST /leads
PUT /leads/:id

---

### 6 - Nexus Chat

Must:

load vehicles

send prompt

receive response

not crash

---

### 7 - Morph Photos

Must:

upload image

select vehicle

send to API

receive response

render result

---

# API Rules

All requests must use:

Authorization: Bearer token

Base URL:

VITE_API_URL

Correct usage:

fetch(`${BASE_URL}/vehicles`)

NOT:

fetch(`${BASE_URL}/api/vehicles`)

---

# Critical Validation

You must validate:

api.ts
auth.ts
hooks
pages
routing
token storage
localStorage
environment variables
vite config
tsconfig
package.json
tailwind
components
forms
requests
responses

---

# Build Validation

Run:

npm install
npm run build

Ensure:

0 TypeScript errors
0 Vite errors
0 React errors
0 import errors
0 environment errors

Build must complete successfully.

---

# Lint Validation

Run:

npm run lint

Fix all issues.

---

# TypeScript Validation

Ensure:

no any misuse

proper typing

interfaces

models

safe fetch

safe hooks

safe components

---

# API Validation

Simulate requests:

POST /auth/register
POST /auth/login
GET /vehicles
GET /leads
POST /vehicles
POST /leads

Ensure:

200 responses

no 401 loops

no 404

no redirect loop

---

# Authentication Validation

Check:

token stored correctly

localStorage key:

mediatio_token

Ensure:

login persists

dashboard loads

no auto logout

no redirect loop

---

# Routing Validation

Check:

/login
/register
/dashboard
/vehicles
/leads
/settings
/nexus
/morph

Ensure:

protected routes work

redirect only if token missing

---

# Error Handling

Fix:

401 handling

404 handling

network errors

empty responses

null values

undefined values

missing token

missing API

---

# Hooks Validation

Check:

useAuth
useVehicles
useLeads
useQuery
useMutation

Ensure:

correct API calls

correct token usage

correct caching

no infinite loops

---

# UI Validation

Check:

forms

buttons

inputs

modals

navigation

loading states

error states

Ensure:

no crash

no undefined

no blank screen

---

# Environment Validation

Check:

.env

.env.production

Vercel environment variables

Ensure:

VITE_API_URL exists

---

# Nexus Chat Validation

Check:

vehicles loaded

prompt sent

response handled

UI stable

---

# Morph Photos Validation

Check:

image upload

vehicle selection

API call

response rendering

---

# Required Testing

Simulate:

register user

login user

load dashboard

create vehicle

edit vehicle

create lead

navigate pages

send chat

upload image

reload page

logout

login again

Everything must work.

---

# Playwright Tests

If not present, create:

tests/app.spec.ts

Test:

login

dashboard

vehicles

leads

navigation

Ensure tests pass.

---

# Auto Fix Rules

You must:

rewrite broken files

fix imports

fix API calls

fix token handling

fix hooks

fix routing

fix environment usage

fix TypeScript

fix React logic

fix Vite config

fix package.json

---

# API File Rules

api.ts must:

use BASE_URL

use Bearer token

handle 401

handle errors

return JSON

no duplicate /api

---

# Auth File Rules

auth.ts must:

store token

get token

remove token

check login

safe redirect

---

# Output

After fixing everything, return:

Corrected files

api.ts final

auth.ts final

hooks final

pages final

package.json

vite.config.ts

tsconfig.json

final structure

---

# Final Validation

Run:

npm install
npm run build

Ensure success.

Then output:

PROJECT FULLY VALIDATED
ALL BUGS FIXED
READY FOR VERCEL
# Real API Runtime Testing

You must perform real HTTP requests to the backend API.

Test using fetch or curl.

Steps:

1) Register user

POST https://extensive-avril-morph-d5a8aee2.koyeb.app/auth/register

2) Login

POST https://extensive-avril-morph-d5a8aee2.koyeb.app/auth/login

3) Extract token

4) Call protected endpoints

GET /vehicles
GET /leads

Authorization: Bearer token

5) Validate responses

Must return 200.

If 401, fix auth.ts or api.ts.
If 404, fix endpoints.
If CORS, fix backend headers.
If token missing, fix storage.

Repeat until all endpoints work.