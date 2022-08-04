import axios from 'axios'
import NoResults from './NoResults'
import VideoCard from '../components/VideoCard'
import {Video} from '../types'

interface IProps {
  videos : Video[]
}

const Home = ({videos} : IProps) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos?.length ? videos?.map((video : Video) => (<VideoCard bottomLine post={video} key={video._id}/>)) : (<NoResults className="text-xl font-semibold text-center" text={'Be the first Dan‘Tiker 🤩'}/>)}
    </div>
  )
}

export async function getServerSideProps({ query : {topic}} : {query: {topic ?: string} } ){
  const urlAppendix = topic ? `discover/${topic}` : 'post'
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/${urlAppendix}`
  const {data} = await axios.get(url);
  return {props: {videos: data}}
}

export default Home
