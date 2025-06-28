import './Home.css'
import pfp from '../../assets/gh-small.png'
import { Center, Flex } from '@mantine/core'

export default function Home() {
  return (
    <div id="home">
      <Center h="100%">
        <Flex direction="column">
          <Center>
            <img id="profile-picture" src={pfp} />
          </Center>
          <h1>
            Arek <i>Enoz</i> Dudek
          </h1>
        </Flex>
      </Center>
    </div>
  )
}
