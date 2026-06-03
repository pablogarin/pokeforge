import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div className="">
            {isAuthenticated && (
                <>
                    <div className="">{user.name}</div>
                    <div className="">
                        <button onClick={() => { logout() }}>Logout</button>
                    </div>
                </>
            )}
        </div >
    );
}

export default Header;
