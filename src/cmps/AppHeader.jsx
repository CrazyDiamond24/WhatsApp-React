import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogoWithoutWord from '../assets/imgs/Logo-without-word.png';

export function AppHeader({ showProfile }) {
  const user = useSelector((storeState) => storeState.userModule.loggedInUser);

  return (
    <header className="app-header">
      <section className="user-header">
        {user ? ( 
          <div className="user-info-header">
            {user.img ? (
              <>
              <img  onClick={showProfile} src={user.img} alt={user.username} title="Profile"/>
              <img src={LogoWithoutWord} alt="logo" className="logo-without-word" />
              </>

            ) : (
              <img src={LogoWithoutWord} alt="logo" className="logo-without-word" />
            )}
            
          </div>
        ) : (
          <>
          <img src={LogoWithoutWord} alt="logo" className="logo-without-word" />
          <Link className="header-login" to="/login">
            Login
          </Link>
          </>
        )}
      </section>
    </header>
  );
}
