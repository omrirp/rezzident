import logo from '../../assets/logoicon2.svg'

/**
 * Static element for the app header
 */
const Header = () => {
  return (
    <div className='col-lg-12 header-container'>
        <div className='logo-container'>
            <img src={logo} className='logo' />
            <p className='logotext'>Rezzident <span style={{fontWeight:'200'}}>management</span></p>
        </div>
    </div>
  )
}

export default Header