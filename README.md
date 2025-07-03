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