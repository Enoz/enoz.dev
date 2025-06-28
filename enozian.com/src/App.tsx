import { NavLink, Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import { AppShell, Text, Avatar, Button, Flex, Group } from '@mantine/core'
import pfp from './assets/gh-small.png'

export default function App() {
  return (
    <AppShell>
      <AppShell.Header>

        <Group justify="space-between">
          <NavLink to="/">
            <Flex>
              <Avatar src={pfp} />
              <Text size="xl">Enozian</Text>
            </Flex>
          </NavLink>
          <NavLink to="/test"><Button>Test</Button></NavLink>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<div>test</div>} />
        </Routes>
      </AppShell.Main>
    </AppShell >
  )
}
