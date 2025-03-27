import Joi from "joi";

export const updateProfileValidator = (data) => {
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

        birthDate: Joi.date().iso()
            .required()
            .messages({
                "any.required": "Tanggal lahir tidak boleh kosong!",
                "date.base": "Tanggal lahir harus berupa tanggal yang valid!",
                "date.format": "Format tanggal lahir tidak valid! Gunakan format YYYY-MM-DD.",
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
    });

    return schema.validate(data, { abortEarly: false });
};

export const requestRoleValidator = (data) => {
    const schema = Joi.object({
        roleRequested: Joi.string()
            .valid("JURNALIS", "EDITOR")
            .required()
            .empty("")
            .messages({
                "any.required": "Role tidak boleh kosong!",
                "any.only": "Role tidak valid! Harus JURNALIS atau EDITOR",
                "string.empty": "Role tidak boleh kosong!"
            }),
        portfolio: Joi.string()
            .required()
            .empty("")
            .messages({
                "any.required": "Portfolio tidak boleh kosong!",
                "string.empty": "Portfolio tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};