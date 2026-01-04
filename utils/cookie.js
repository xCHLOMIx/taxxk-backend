export const setAuthCookie = (res, token) => {
    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'none',
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });
}