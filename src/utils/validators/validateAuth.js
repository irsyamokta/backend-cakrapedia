import Joi from "joi";

export const registerValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.min": "Nama minimal harus 3 karakter!",
                "string.max": "Nama maksimal 50 karakter!",
                "any.required": "Nama tidak boleh kosong!"
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Format email tidak valid!",
                "any.required": "Email tidak boleh kosong!"
            }),

        password: Joi.string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .required()
            .messages({
                "string.min": "Password minimal harus 8 karakter!",
                "string.pattern.base": "Password harus mengandung huruf, angka, dan karakter spesial!",
                "any.required": "Password tidak boleh kosong!"
            }),

        birthDate: Joi.date().iso()
            .required()
            .messages({
                "any.required": "Tanggal lahir tidak boleh kosong!"
            }),

        gender: Joi.string()
            .valid("MALE", "FEMALE", "OTHER")
            .required()
            .empty("")
            .messages({
                "any.required": "Jenis kelamin tidak boleh kosong!",
                "any.only": "Jenis kelamin tidak valid! Harus MALE, FEMALE, atau OTHER.",
                "string.empty": "Jenis kelamin tidak boleh kosong!"
            }),

        passwordConfirmation: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.required": "Konfirmasi password tidak boleh kosong!",
                "any.only": "Konfirmasi password tidak sesuai!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};

export const loginValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Format email tidak valid!",
                "any.required": "Email tidak boleh kosong!"
            }),

        password: Joi.string()
            .min(8)
            .required()
            .messages({
                "any.required": "Password tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};