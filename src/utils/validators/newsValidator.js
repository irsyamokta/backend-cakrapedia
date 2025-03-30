import Joi from "joi";

export const createNewsValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .empty("")
            .required()
            .messages({
                "string.min": "Judul minimal harus 3 karakter!",
                "string.max": "Judul maksimal 100 karakter!",
                "string.empty": "Judul tidak boleh kosong!",
                "any.required": "Judul tidak boleh kosong!"
            }),

        content: Joi.string()
            .min(3)
            .max(1000)
            .empty("")
            .required()
            .messages({
                "string.min": "Konten minimal harus 3 karakter!",
                "string.max": "Konten maksimal 1000 karakter!",
                "string.empty": "Konten tidak boleh kosong!",
                "any.required": "Konten tidak boleh kosong!"
            }),

        categoryId: Joi.string()
            .empty("")
            .required()
            .messages({
                "string.empty": "Kategori tidak boleh kosong!",
                "any.required": "Kategori tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};

export const updateNewsValidator = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                "string.min": "Judul minimal harus 3 karakter!",
                "string.max": "Judul maksimal 100 karakter!",
                "any.required": "Judul tidak boleh kosong!"
            }),

        content: Joi.string()
            .min(3)
            .max(1000)
            .required()
            .messages({
                "string.min": "Isi minimal harus 3 karakter!",
                "string.max": "Isi maksimal 1000 karakter!",
                "any.required": "Isi tidak boleh kosong!"
            }),

        categoryId: Joi.string()
            .empty("")
            .required()
            .messages({
                "string.empty": "Kategori tidak boleh kosong!",
                "any.required": "Kategori tidak boleh kosong!"
            })
    });

    return schema.validate(data, { abortEarly: false });
};