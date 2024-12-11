// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAuthRedirect = (isLoggedIn: boolean, navigate: any) => {
    if (isLoggedIn) {
      navigate('/practice');
    } else {
      navigate('/auth');
    }
};