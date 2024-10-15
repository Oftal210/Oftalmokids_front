export class User {
    id?: number;
    documento: string | null;
    nombre: string | null;
    apellido: string | null;
    telefono: string | null;
    email: string | null;
    contrasena: string | null;
    constructor (
        id:number,
        documento: string,
        nombre: string,
        apellido: string,
        telefono: string,
        email: string,
        contrasena: string,
    ){
        this.id = id;
        this.documento = documento;
        this.nombre = nombre;
        this.apellido =apellido;
        this.telefono = telefono;
        this.email = email;
        this.contrasena = contrasena;
    }
}