const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const TOKEN_KEY = "x4TvnErxRETbvcqaLl5dqMI115eNlp5y";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(authHeader);
    if (token == null) return res.status(401).send("Token requerido");
    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if (err) return res.status(403).send("Token inválido");
        console.log(user);
        req.user = user;
        next();
    });
};

app.post("/usuario/login", (req, res) => {
    const usuario = req.body.usuario;
    const clave = req.body.Clave; // Change to req.body.Clave for consistency

    if (usuario === "fmendoza" && clave === "123456") {
        const datos = {
            id: "123",
            Nombre: "Felipe Mendoza",
            email: "fmendoza@mail.com", // Changed comma to dot in the email
            codigo: "ABDE456-LK"
        };
        const token = jwt.sign(
            { userId: datos.id, email: datos.email },
            TOKEN_KEY,
            { expiresIn: "2h" }
        );
        let ndatos = { ...datos, token };
        res.status(200).json(ndatos);
    } else {
        res.status(400).send("Credenciales incorrectas");
    }
});

app.get("/usuario/:id/ventas", verifyToken, (req, res) => {
    const datos = [
        { id: 1, cliente: "empresa A", total: 2500, fecha: "2022-01-15" }, // Corrected date format
        { id: 2, cliente: "empresa B", total: 2100, fecha: "2022-01-14" }, // Corrected company name
        { id: 3, cliente: "empresa C", total: 2400, fecha: "2022-01-12" }, // Corrected company name and date
    ];
    res.json(datos);
});

app.listen(3001, () => {
    console.log("Servidor iniciando en el puerto 3001");
});