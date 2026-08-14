import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

interface RegisterInput {
    name: string
    email: string
    password: string
}

interface LoginInput {
    email: string
    password: string
}

interface AuthResult {
    user: {
        id: string
        name: string
        email: string
        avatar?: string
    }
    token: string
}

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in .env')
    }

    const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    }

    return jwt.sign({ userId }, secret, options);
}

const formatUser = (user: IUser) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar
});


export const registerUser = async(input:RegisterInput): Promise<AuthResult> =>{
    const existingUser = await User.findOne({email:input.email});

    if (existingUser){
       throw Error('Email already in use'); 
    }

    const hashedPassword = await bcrypt.hash(input.password,10);

    const user = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword
    });

    const token = generateToken(user._id.toString());

    return {
        user:formatUser(user),
        token
    }
}


export const loginUser= async (input:LoginInput):Promise<AuthResult> =>{
    const user = await User.findOne({email:input.email});

    if(!user){
        throw Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(input.password,user.password)

    if(!isMatch){
        throw Error('Invalid email or password')
    }

    const token = generateToken(user._id.toString());

    return {
        user : formatUser(user),
        token
    }
}