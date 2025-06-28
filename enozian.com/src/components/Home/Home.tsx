import './Home.css'
import { Button } from '@mantine/core'
import pfp from '../../assets/gh-small.png'

export default function Home() {
  return (
    <main id="home">
      <div id="content">
        <img id="profile-picture" src={pfp} />
        <h1>
          Arek <i>Enoz</i> Dudek
        </h1>
        <Button fullWidth>Test</Button>
      </div>
    </main>
  )
}
