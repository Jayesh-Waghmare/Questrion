import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'
import AiTools from '../components/AiTools'

const Home = () => {
  return (
    <>
      {/* Mount the components */}
      <Navbar />
      <Hero />
      <AiTools />
      <Testimonial />
      <Footer />
    </>
  )
}

export default Home
