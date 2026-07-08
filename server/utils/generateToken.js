import jwt from 'jsonwebtoken';

// generujemy jwt i dajemy go w ciasteczku httpOnly, aby zwiększyć bezpieczeństwo aplikacji.
export const generateToken = (userId, res) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // dla większego bezpieczeństwa :)
    res.cookie("jwt", token,{
        httpOnly: true, // Zapobiega dostępowi do ciasteczka z poziomu JavaScript, co zwiększa bezpieczeństwo przed atakami XSS
        secure: process.env.NODE_ENV === "production", // Ustawia flagę Secure tylko w środowisku produkcyjnym, co oznacza, że ciasteczko będzie przesyłane tylko przez HTTPS
        sameSite: "strict", // Zapobiega wysyłaniu ciasteczka w żądaniach cross-site, co pomaga chronić przed atakami CSRF
        maxAge: 1000 * 60 * 60 * 24 * 7, // Czas życia ciasteczka (7 dni)
    })
    return token;
}