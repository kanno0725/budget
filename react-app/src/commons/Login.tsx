
export const Login = (userId: number, username: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('userid_str', String(userId));
}

export const Logout = () => {
    localStorage.clear();
}

export default Login;