import { useTypedSelector } from "../../../store"
import SignInButton from "./signInButton";
import SignOutButton from "./signOutButton";

function Greeting() {
    const { user, isLoggedIn } = useTypedSelector(state => state.auth)

    if (isLoggedIn && user) {
        const { displayName } = user;

        return (
            <p className="mb-1">Welcome {displayName} <SignOutButton /></p>
        )
    }

    return (
        <p className="mb-1">Welcome <SignInButton /></p>
    );
}

export default Greeting;
