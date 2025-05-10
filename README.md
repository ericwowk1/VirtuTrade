# VirtuTrade

A modern paper trading platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication with NextAuth.js
- Real-time paper trading simulation
- Portfolio management
- Trading tournaments
- Educational resources

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- NextAuth.js

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/virtutrade.git
cd virtutrade
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your configuration.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/virtutrade"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
