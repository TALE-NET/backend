import { ResetTokenModel, userModel } from "../models/usermodel.js";
import { userSchema, loginValidator, forgotPasswordValidator, resetPasswordValidator, createUserValidator, updateUserValidator } from "../schema/userschema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        console.log('Received signup request:', req.body);
        // Validate the data provided by the user
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            console.error('Validation Error:', error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }

        const email = value.email;
        console.log('Validation successful. Checking if user exists with email:', email);

        const findIfUserExist = await userModel.findOne({ email });
        console.log('findIfUserExist result:', findIfUserExist);

        if (findIfUserExist) {
            console.log('User already exists:', findIfUserExist);
            return res.status(401).send("User has already signed up");
        }

        else {
            console.log('User does not exist, creating new user');

            // Password matching
            if (value.password !== value.confirmpassword)
                return res.status(400).json({ message: "Passwords do not match" });

            // Encrypt user password
            const hashedPassword = bcrypt.hashSync(value.password, 10);

            // Create user
            const newUser = await userModel.create({
                ...value,
                password: hashedPassword,
                confirmpassword: hashedPassword
            });
            console.log('New user created:', newUser);

            return res.status(201).json({ message: "Registration successful" });
        }
    } catch (error) {
        next(error);
    }
};



// Function for session log in
export const sessionLogin = async (req, res, next) => {
    try {
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            console.log('Validation Error:', error);
            return res.status(422).json(error);
        }

        // Log input for debugging
        console.log('Login attempt:', value);

        // Find a user using their username or email
        const user = await userModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });

        if (!user) {
            console.log('User not found for:', value.username || value.email);
            return res.status(401).json('User not found');
        }

        // Log user data fetched from DB
        console.log('User found:', user);

        // Verify their password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            console.log('Password mismatch for user:', user.username);
            return res.status(401).json('Invalid login credentials');
        }

        // Generate a session for the user
        req.session.user = { id: user.id };
        console.log('Login successful for user:', user.username);
        return res.status(200).json('Login successful');
    } catch (error) {
        next(error);
    }
}



// Function for token log in
export const tokenLogin = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user using their username or email
        const user = await userModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });
        if (!user) {
            return res.status(401).json('User not found');
        } else {
            // Verify their password
            const correctpassword = bcrypt.compareSync(value.password, user.password);
            if (!correctpassword) {
                return res.status(401).json('Invalid login credentials');
            } else {
                // Create a token for the user
                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_PRIVATE_KEY,
                    { expiresIn: '72h' }
                );
                // Return response
                return res.status(200).json({
                    message: 'User logged in',
                    accessToken: token,
                    // user: {
                    //     firstname: user.firstname,
                    //     lastname: user.lastname,
                    //     username: user.username
                    // }
                });
            }
        }
    } catch (error) {
        next(error)
    }
}



// Function to get everything about one user
export const getUser = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Get user details/Find user by id
        const getUserDetails = await userModel
            .findById(id)
            .select({ password: false })
        res.status(200).json({ user: getUserDetails })
    } catch (error) {
        next(error)
        console.log(error)
    }
}


// Function to get all users to cross-check if a username already exists
export const getUsers = async (req, res, next) => {
    try {
        // Extract email and username from query parameters to convert to lower case
        const email = req.query.email?.toLowerCase()
        const username = req.query.username?.toLowerCase();

        // Initialise the filter object
        const filter = {};
        if (email) {
            filter.email = email;
        }
        if (username) {
            filter.username = username;
        }
        // Find users based on the filter
        const user = await userModel
            .find(filter)
            .select({ password: false })
        // Return response
        return res.status(200).json({ user });
    } catch (error) {
        next(error)
    }
}



// Function to update a user account
export const updateUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = updateUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Update user by id
        await userModel.findByIdAndUpdate(req.params.id, value, { new: true });
        return res.status(200).json('User Information is Updated');
    } catch (error) {
        console.log(error)
        next(error)
    }
}



// Function to log out
export const logout = async (req, res, next) => {
    try {
        // Destroy user session
        await req.session.destroy();
        // Return response
        return res.status(200).json('Logout successful');
    } catch (error) {
        console.log(error)
        next(error)
    }
};


export const forgotPassword = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = forgotPasswordValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with provided email
        const user = await userModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json('User Not Found');
        }
        // Generate reset token
        const resetToken = await ResetTokenModel.create({ userId: user.id });
        // Send reset email
        await mailTransport.sendMail({
            to: value.email,
            subject: 'Reset Your Password',
            html: `
            <h1>Hello ${user.name}</h1>
            <h1>Please follow the link below to reset your password.</h1>
            <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken.id}">Click Here</a>
            `
        });
        // Return response
        res.status(200).json('Password Reset Mail Sent!');
    } catch (error) {
        next(error);
    }
}


export const verifyResetToken = async (req, res, next) => {
    try {
        // Find Reset Token by id
        const resetToken = await ResetTokenModel.findById(req.params.id);
        if (!resetToken) {
            return res.status(404).json('Reset Token Not Found');
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiresAt).valueOf())) {
            return res.status(409).json('Invalid Reset Token');
        }
        // Return response
        res.status(200).json('Reset Token is Valid!');
    } catch (error) {
        next(error);
    }
}


export const resetPassword = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = resetPasswordValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find Reset Token by id
        const resetToken = await ResetTokenModel.findById(value.resetToken);
        if (!resetToken) {
            return res.status(404).json('Reset Token Not Found');
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiresAt).valueOf())) {
            return res.status(409).json('Invalid Reset Token');
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Update user password
        await userModel.findByIdAndUpdate(resetToken.userId, { password: hashedPassword });
        // Expire reset token
        await ResetTokenModel.findByIdAndUpdate(value.resetToken, { expired: true });
        // Return response
        res.status(200).json('Password Reset Successful!');
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = createUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Create user
        await userModel.create({
            ...value,
            password: hashedPassword
        });
        // Send email to user
        await mailTransport.sendMail({
            to: value.email,
            subject: "User Account Created!",
            text: `Dear user,\n\nA user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
        });
        // Return response
        res.status(201).json('User Created');
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Ensure user is not deleting themselves
        if (id === req.params.id) {
            return res.status(409).json('Cannot Delete Self');
        }
        // Delete user
        await userModel.findByIdAndDelete(req.params.id);
        // Return response
        res.status(200).json('User Deleted');
    } catch (error) {
        next(error);
    }
}
