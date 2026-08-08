 NetworkIQ

 Inventory Optimization & Placement Across the Fulfillment Network


Team ID: 037



# Project Overview

NetworkIQ is an AI-powered inventory optimization system that helps retailers maintain optimal stock levels across multiple warehouses.

The system identifies low-stock locations and recommends inventory transfers from warehouses with excess stock.



# Tech Stack

- Frontend: React (Planned)
- Backend: Spring Boot
- Database: MySQL
- AI Service: Python (Flask)



#Project Structure


NetworkIQ
│
├── frontend
├── backend
├── ai-service
├── database
├── docs
└── README.md




# Progress Completed #

##Backend

- Spring Boot project created
- MySQL connected
- Inventory Entity created
- Inventory Repository created
- Inventory Service created
- Inventory Controller created
- REST APIs developed

##Database

- MySQL database created
- Inventory table generated using JPA

## AI

- Python Flask service created
- AI server running successfully


## APIs

GET

POST


## Next Development

- Connect Spring Boot with Python AI
- Build AI Recommendation Engine
- Develop React Dashboard
- Display AI Recommendations
- Final Integration




## Current Status

Phase 1 Completed


  ....................ARCHITECTURE DIAGRAM ........................
                         +---------------------------+
                         |       React Frontend      |
                         |                           |
                         | • Dashboard               |
                         | • Inventory Management    |
                         | • AI Recommendation View  |
                         +------------+--------------+
                                      |
                           REST API (HTTP/JSON)
                                      |
                                      v
                  +----------------------------------+
                  |      Spring Boot Backend         |
                  |----------------------------------|
                  | • Inventory Controller           |
                  | • Inventory Service              |
                  | • JPA Repository                 |
                  | • Business Logic                 |
                  | • Calls Python AI Service        |
                  +---------------+------------------+
                                  |
                 +----------------+----------------+
                 |                                 |
                 |                                 |
                 v                                 v
      +----------------------+        HTTP REST API (JSON)
      |     PostgreSQL       |<------------------------------+
      |----------------------|                               |
      | Inventory            |                               |
      | Warehouses           |                               |
      | Products             |                               |
      | Demand               |                               |
      +----------------------+                               |
                                                            |
                                                            v
                                         +------------------------------+
                                         |      Python AI Service       |
                                         |------------------------------|
                                         | Flask API                    |
                                         | Recommendation Engine        |
                                         | Priority Score Calculation   |
                                         | Stock Analysis               |
                                         | Transfer Suggestions         |
                                         +--------------+---------------+
                                                        |
                                                        |
                                             Recommendation JSON
                                                        |
                                                        v
                                           Spring Boot → React UI
