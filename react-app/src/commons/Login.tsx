
export const Login = (userId: number, username: string, userGroupId: number) => {
    localStorage.setItem('username', username);
    localStorage.setItem('userid_str', String(userId));
    localStorage.setItem('usergroupid_str', String(userGroupId));
    console.log(userGroupId)
}

export const Logout = () => {
    localStorage.clear();
}

export default Login;