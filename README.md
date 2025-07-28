<div align="center">
  <img src="./public/logo.png" alt="VirtuTrade Hero Image">
  <h1>VirtuTrade</h1>
  <p>A modern paper trading platform built with Next.js, TypeScript, and Tailwind CSS.</p>

  <div>
    <img src="https://img.shields.io/github/license/ericwowk1/VirtuTrade?style=for-the-badge" alt="License Badge"/>
    <img src="https://img.shields.io/github/stars/ericwowk1/VirtuTrade?style=for-the-badge&logo=github" alt="Stars Badge"/>
    <img src="https://img.shields.io/github/forks/ericwowk1/VirtuTrade?style=for-the-badge&logo=github" alt="Forks Badge"/>
    <img src="https://img.shields.io/github/issues/ericwowk1/VirtuTrade?style=for-the-badge&logo=github" alt="Issues Badge"/>
  </div>
</div>

---

## 📖 About The Project

> VirtuTrade is a sleek, real-time paper trading simulator designed for both beginners and enthusiasts. It provides a risk-free environment to learn the ropes of the stock market, manage a virtual portfolio, and even compete with friends in trading tournaments.

<br>

<div align="center">
  <a href="#"> <img src="logo.png" alt="Project Screenshot">
  </a>
</div>

---

## ✨ Key Features

-   🔐 **User Authentication:** Secure sign-up and login with NextAuth.js.
-   📈 **Real-Time Simulation:** Practice trading with up-to-date, real-world stock data.
-   💼 **Portfolio Management:** Track your assets, monitor performance, and review trade history.
-   🏆 **Trading Tournaments:** Create or join tournaments to compete against other users.
-   📚 **Educational Content:** Access resources to sharpen your trading knowledge.

---

## 🛠️ Built With

This project is built with the latest technologies to ensure a modern, fast, and scalable user experience.

| Tech                                                              | Description                              |
| ----------------------------------------------------------------- | ---------------------------------------- |
| <img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js" alt="Next.js">          | Full-Stack Web Framework                 |
| <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">    | Static Typing for JavaScript             |
| <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"> | Utility-First CSS Framework              |
| <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">                | Next-Gen ORM for Node.js & TypeScript    |
| <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL">      | Open Source Relational Database          |
| <img src="https://img.shields.io/badge/-NextAuth.js-000000?style=for-the-badge&logo=next-auth" alt="NextAuth.js">      | Authentication for Next.js               |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

<details>
<summary>Click to view Installation Steps</summary>

### Prerequisites

Make sure you have Node.js (v18+) and npm installed on your machine.

-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/ericwowk1/VirtuTrade.git](https://github.com/ericwowk1/VirtuTrade.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd VirtuTrade
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up your environment variables**
    Create a `.env.local` file in the root of the project and add the following:
    ```env
    # See [https://www.prisma.io/docs/reference/database-reference/connection-urls](https://www.prisma.io/docs/reference/database-reference/connection-urls)
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Generate a secret with `openssl rand -base64 32`
    NEXTAUTH_SECRET="YOUR_SECRET"
    NEXTAUTH_URL="http://localhost:3000"
    ```
5.  **Run the Prisma migrations** to sync your database schema:
    ```sh
    npx prisma migrate dev
    ```
6.  **Run the development server**
    ```sh
    npm run dev
    ```

You should now be able to access the application at [http://localhost:3000](http://localhost:3000).

</details>

---

## 🖼️ Screenshots

| Dashboard                               | Portfolio Page                          |
| --------------------------------------- | --------------------------------------- |
| <img src="https://via.placeholder.com/400x225.png?text=Dashboard+View" alt="Dashboard View"> | <img src="https://via.placeholder.com/400x225.png?text=Portfolio+View" alt="Portfolio View"> |

| Trading Interface                       | Tournaments Page                        |
| --------------------------------------- | --------------------------------------- |
| <img src="https://via.placeholder.com/400x225.png?text=Trading+UI" alt="Trading UI"> | <img src="https://via.placeholder.com/400x225.png?text=Tournaments+View" alt="Tournaments View"> |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 📬 Contact

Eric W. - [@ericwowk](https://github.com/ericwowk1)

Project Link: [https://github.com/ericwowk1/VirtuTrade](https://github.com/ericwowk1/VirtuTrade)
