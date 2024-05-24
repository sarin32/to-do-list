import Joi from 'joi';

export function validateObject(schema, data) {
  const {
    error,
    value,
  } =
    schema.validate(data, {
      abortEarly: true,
      allowUnknown: true,
      errors: { escapeHtml: true },
    });

  return { value, error };
}

export function stringSchema({
  min,
  max,
  required = true,
  trim = true,
}) {
  let schema = Joi.string().trim(trim);
  if (min) schema = schema.min(min);
  if (max) schema = schema.max(max);
  if (required) schema = schema.required();
  return schema;
}

export function emailSchema() {
  return Joi.string().trim().email().required();
}

export function requiredNumberSchema() {
  return Joi.number().required();
}

export function numberSchema({ min, max, required = false } = {}) {
  let schema = Joi.number()
  if (required) schema = schema.required();
  if (min != undefined) schema = schema.min(min)
  if (max != undefined) schema = schema.max(max)
  return schema
}

export function booleanSchema(required = true) {
  let schema = Joi.boolean();
  if (required) schema = schema.required();
  return schema;
}

export function objectIdSchema(required = true) {
  let schema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
  if (required) schema = schema.required();
  return schema;
}

export function objectSchema({
  object,
  required = true,
}) {
  let schema = Joi.object(object);
  if (required) schema = schema.required();
  return schema;
}

export function arraySchema({
  object,
  required = true,
}) {
  let schema = Joi.array().items(object);
  if (required) schema = schema.required();
  return schema;
}

export function fixedStringSchema({ values, required = true }) {
  let schema = Joi.string().valid(...values);
  if (required) schema = schema.required();
  return schema;
}