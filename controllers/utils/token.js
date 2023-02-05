import jwt from "jsonwebtoken";

// Function to create access token
export const createAccessToken = (user) => {
    const token = jwt.sign({
        data: user._id
    }, process.env.ACCESSTOKENKEY, { expiresIn: '1d' });
    return token;
}

// Function to verify access token
export const verifyAccessToken = (token) => {
    if(token) {
        const options = { expiresIn: '1d' }
        let tokenFlag;
        jwt.verify(token, process.env.ACCESSTOKENKEY, options, function(err, decoded) {
            // check for error
            if(err) {
                tokenFlag = false   
            }
            tokenFlag = decoded;
            console.log(tokenFlag)
        });
        return tokenFlag
    } else {
        return false
    }
}

// Function to create refresh token
export const createRefreshToken = (user) => {
    const token = jwt.sign({
        data: user._id
    }, process.env.REFRESHTOKENKEY, { expiresIn: '7d' });
    return token;
}

// Function to verify refresh token
export const verifyRefreshToken = (token) => {
    if(token) {

        const options = { expiresIn: '7d' }
        
        const tokenFlag = jwt.verify(token, process.env.REFRESHTOKENKEY, options);
        return tokenFlag;
    } else {
        return false
    }
}