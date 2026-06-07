// src/middleware/validation.js
const Joi = require('joi');

const schemas = {
    shortenRequest: Joi.object({
        originalUrl: Joi.string().uri().required().messages({
            'string.uri': 'Please provide a valid URL',
            'any.required': 'originalUrl is required'
        }),
        customAlias: Joi.string().alphanum().optional()
    })
};

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
    firstName: Joi.string(),
    lastName: Joi.string()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(d => ({
                    field: d.path[0],
                    message: d.message
                }))
            });
        }

        req.body = value;
        next();
    };
};


const querySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sort: Joi.string().valid('createdAt', 'updatedAt', 'title', 'analytics.totalClicks'),
    order: Joi.string().valid('asc', 'desc'),
    status: Joi.string().valid('active', 'archived', 'deleted'),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
    tags: Joi.alternatives().try(Joi.string(), Joi.array()),
    search: Joi.string().max(100),
    format: Joi.string().valid('json', 'csv')
});



const validateQueryParams = (req, res, next) => {
    const { error } = querySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            errors: error.details
        });
    }

    next();
};



module.exports = {
    validateQueryParams,
    validateRegister: validate(registerSchema),
    validateLogin: validate(loginSchema),
    validateShortenRequest: validate(schemas.shortenRequest)
};