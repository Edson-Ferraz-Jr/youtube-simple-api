import { verify } from "jsonwebtoken";

const login = (req: any, res: any, next: any) => {
    try {
        const decode = verify(req.headers.authorization, process.env.SECRET as string);
        
        req.user = decode;

        next();
    } catch(error) {
        res.send("Erro na autenticação");
    }
};

export { login };
