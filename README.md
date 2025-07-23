# Task Management Application

## Overview
The Task Management Application is a robust solution designed to streamline task tracking and user management. Built with a modern tech stack, it features a React-based frontend with Vite and TypeScript, paired with a Node.js backend. This application allows users to create, update, delete, and manage tasks, assign them to users, and upload associated files, all within an intuitive interface.

## Features
- **Authenticationa and Authorization**:User come and register itself and then login and secure storage of user data in MYSQL db and also the creation of the user seesion like token creation which tracks the user and also get permission to the authenticate person to specific resources.
- **Task Management**: Create, edit, delete, and categorize tasks (To-Do, In Progress, Done).
- **User Management**: View and filter users based on search terms.
- **File Uploads**: Attach files to tasks for enhanced collaboration. And for this feature i have use the File System
- **Responsive Design**: Optimized for desktop and mobile views using Tailwind CSS.
- **Real-Time Updates**: Leverage React Query for efficient data fetching and mutations.

## Technologies Used
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, React Query, Redux Toolkit
- **Backend**: Node.js, Express.js,
- **Version Control**: Git, GitHub
- **Other**: Axios for API calls, ESLint for code quality

## Challanges
- I have face some changes one of them was that the setup of the mysql db and its connectin to our project because i have a Macbook Pro 2012 version so it is a older version so it does not allow any server to install for the Mysql so i have researched how to handle it then i have install the Mysql Workbench then its setup it was a very messy work for the db setup and its connection but thanks god after some research and R&D i have completed this task
- And one more issue i have faced the versions conflits mostly libraries were confliting versions anyways i also resolve this issue too.


## Installation

### Frontend (client/)
1. Navigate to the `client/` directory: 
   cd client
   npm run dev


### Backen (server/)
1. Navigate to teh `server/` directary:
   cd server
   nodemon server.js