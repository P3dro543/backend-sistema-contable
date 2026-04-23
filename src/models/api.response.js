class ApiResponse {
    constructor(exito, statuscode, mensaje, data = null, error = null) {
        this.exito = exito;
        this.statuscode = statuscode;
        this.mensaje = mensaje;
        this.data = data;
        if (error) this.error = error;
    }

    static success(res, mensaje = "Operación exitosa", data = [], status = 200) {
        return res.status(status).json(new ApiResponse(true, status, mensaje, data));
    }

    static error(res, mensaje = "Error interno", status = 500, errorDetails = null) {
        return res.status(status).json(new ApiResponse(false, status, mensaje, null, errorDetails));
    }
}

module.exports = ApiResponse;