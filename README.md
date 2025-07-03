# GitHub Punch Card Widget

A beautiful, customizable GitHub commit visualization widget that shows your coding patterns in a punch card format.

## 🎨 Features

- **Multiple Themes**: Choose from Default, Dark, and Aqua themes
- **Real-time Generation**: Fetches live data from GitHub API
- **Embed Ready**: Perfect for GitHub README files
- **Responsive Design**: Looks great on all devices
- **Detailed Analytics**: Shows peak hours, weekday vs weekend patterns

## 🚀 Usage

### Basic Usage
```markdown
![GitHub Punch Card](https://punchcardwidget.vercel.app/api/punchcard?user=YOUR_USERNAME)
```

### With Themes
```markdown
<!-- Default Theme -->
![GitHub Punch Card](https://punchcardwidget.vercel.app/api/punchcard?user=YOUR_USERNAME&theme=default)

<!-- Dark Theme -->
![GitHub Punch Card](https://punchcardwidget.vercel.app/api/punchcard?user=YOUR_USERNAME&theme=dark)

<!-- Aqua Theme -->
![GitHub Punch Card](https://punchcardwidget.vercel.app/api/punchcard?user=YOUR_USERNAME&theme=aqua)
```

## 🎨 Available Themes

| Theme | Description | Example |
|-------|-------------|---------|
| `default` | Light theme with blue accents | 🌟 Default styling |
| `dark` | Dark theme for dark mode lovers | 🌙 Perfect for dark README themes |
| `aqua` | Aqua/teal color scheme | 🌊 Fresh and modern look |

## 🔧 Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `user` | ✅ | GitHub username | - |
| `theme` | ❌ | Theme name (`default`, `dark`, `aqua`) | `default` |

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
