import type { NextFunction, Request, Response } from "express";

type CallbackFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;
const catchAsync =
  (fn: CallbackFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // This is a logic issue - it should either pass the error to next() or handle it directly
      // Currently it tries to do both conditionally, but in a confusing way
      next(err); // Pass all errors to the global error handler
    });
  };

export default catchAsync;
