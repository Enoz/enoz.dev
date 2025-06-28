import { NavLink, Route, Routes } from 'react-router'
import Home from './pages/Home/Home'
import { AppShell, Avatar, Button, Flex, Group } from '@mantine/core'
import pfp from './assets/gh-small.png'

export default function App() {
  return (
    <AppShell header={{ height: 56, collapsed: true }}>
      <AppShell.Header >
        <Group justify="space-between">
          <NavLink to="/">
            <Flex>
              <Avatar src={pfp} size="md" style={{ margin: "8" }} />
            </Flex>
          </NavLink>
          <NavLink to="/chat"><Button>Chat</Button></NavLink>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<div>test</div>} />
        </Routes>
      </AppShell.Main>
    </AppShell >
  )
}
