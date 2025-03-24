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
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
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
            .messages({
                "any.required": "Jenis kelamin tidak boleh kosong!"
            }),
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

export const changePasswordValidator = (data) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .min(8)
            .required()
            .messages({
                "any.required": "Password saat ini tidak boleh kosong!"
            }),

        newPassword: Joi.string()
            .min(8)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                "string.min": "Password minimal harus 8 karakter!",
                "string.pattern.base": "Password harus mengandung huruf, angka, dan karakter spesial!",
                "any.required": "Password tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};

export const forgotPasswordValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Format email tidak valid!",
                "any.required": "Email tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};

export const resetPasswordValidator = (data) => {
    const schema = Joi.object({
        token: Joi.string()
            .required()
            .messages({
                "any.required": "Token reset password diperlukan!"
            }),

        newPassword: Joi.string()
            .min(8)
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .required()
            .messages({
                "string.min": "Password minimal harus 8 karakter!",
                "string.pattern.base": "Password harus mengandung huruf, angka, dan karakter spesial!",
                "any.required": "Password tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};
