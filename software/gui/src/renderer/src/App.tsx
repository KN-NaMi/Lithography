import { Button } from '@renderer/components/ui/button'
import { ThemeProvider } from '@renderer/components/ui/theme-provider'

function App(): React.JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark">
      <h1 className="text-3xl font-bold underline">Hello World</h1>
      <Button variant="ghost">Click me</Button>
    </ThemeProvider>
  )
}

export default App
