# Ticket Seller Microservice

The Ticket Seller Microservice is an application that allows users to create tickets, and other users can purchase them. The application is built using a microservice architecture and utilizes the NATS Streaming Server as the message queue. The entire application is divided into five standalone services: Auth Service, Ticket Service, Order Service, Expiration Service, and Payment Service.

## Technologies Used

- MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript
- Next.js for server-side rendering
- NPM for package management
- Docker for containerization
- Kubernetes for orchestration
- Jest and Supertest for unit testing

## Installation

To install and set up the Ticket Seller Microservice, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/shone0106/ticket-seller-microservice.git
2. Navigate to the project's root directory:
   ```
   cd Ticket-seller-microservice
   
3. Install the required packages for each service using NPM.
4. Set up the required environment variables for each service.
5. Build and start the services using Docker.
6. Access the application by visiting the appropriate URL in your browser.

