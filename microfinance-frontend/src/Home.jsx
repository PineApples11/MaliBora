import { useNavigate } from 'react-router-dom';
function Home() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/choice')
    }
  return (
    <>
       <header>
  <section class="hero">
    <h1 class="hero-message">
      <div>Welcome To</div>
      <div>MaliBora</div>
    </h1>
    <p class="under-hero">The smart way to access microloans, manage savings, and build credit—right from your phone. Fast, secure, and designed for your growth.</p>
    <div class="button-list">
      <button class="primary" type='button' onClick={handleClick}>Get started</button>
    </div>
  </section>
  <picture class="promo-art">
    <img src="https://i.pinimg.com/originals/bc/33/f3/bc33f3bc72f43ca1045b7c4f98dc760d.gif" height="800" width="800" alt="a random doodle"/>
  </picture>
</header>
    </>
  )
}

export default Home
