export class User {
    id?: number;
    documento: string | null;
    nombre: string | null;
    apellido: string | null;
    telefono: string | null;
    email: string | null;
    contrasena: string | null;
    id_rol?: number | null;
    constructor (
        id:number,
        documento: string,
        nombre: string,
        apellido: string,
        telefono: string,
        email: string,
        contrasena: string,
        id_rol: number
    ){
        this.id = id;
        this.documento = documento;
        this.nombre = nombre;
        this.apellido =apellido;
        this.telefono = telefono;
        this.email = email;
        this.contrasena = contrasena;
        this.id_rol = id_rol;
    }
}