export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    return next(new Error(result.error.issues.map((issue) => issue.message).join(', ')));
  }

  req.validated = result.data;
  next();
};
